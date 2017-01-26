var express = require('express')
var router = express.Router();
var conf = require('config');
var r = require('../database/database').connect();
var bunyan = require('bunyan')
var log = bunyan.createLogger({name : 'oxfam-mainpagedata', src : true})
var moment = require('moment');
var cacheObject = require("../utils/cacheLayer")
var cache = new cacheObject();
var TeamStatusCacheKey = "oxfam-teamStatus";
var UserMessagesCacheKey = "oxfam-userMessages";
var sockets = require('../utils/sockets')
var TeamStatusData = require('../database/TeamStatusData.js').data
var usermessageData = require('../database/UserMessageData').data


router.get('/getTeamStatus', function(req,res,next){
	log.info("Inside get team status function");
	//read data from js file as rethinkdb & redis will be closed
	result = TeamStatusData;
	result = result.map(function(item){
					time = new Date(item.time);			
					item.time = moment(time).format('MMM Do YYYY, h:mm:ss a')
					return item;
				});

	return res.send(result);

	cache.get(TeamStatusCacheKey, function(err,value){
		if(err || !value){
			log.info("Data not found in cache. Getting from database");
			rQuery = r.table(conf.get('database.tables.TeamStatus'))
			rQuery = rQuery.orderBy(r.desc("time"))
			log.info({"Get Team Status" : rQuery.toString()})

			rQuery.run(function(err,result){
				if(err){
					log.error(err);
					return [];
				}

				result = result.map(function(item){
					time = new Date(item.time);			
					item.time = moment(time).format('MMM Do YYYY, h:mm:ss a')
					return item;
				})
				res.send(result)
				cache.set(TeamStatusCacheKey, JSON.stringify(result), function(err,reply){
					if(err)
						log.error("Error saving data in cache. "+err);
				})
							
			})
		}else{
			log.info("Got data from cache");
			result = JSON.parse(value);
			res.send(result);
		}
	})
	
})

router.get('/getUserMessages', function(req,res,next){
	log.info("Inside get user messages")
	//read data from js file as rethinkdb & redis will be closed
	result = usermessageData;
	result = result.map(function(item){
					time = new Date(item.time);			
					item.time = moment(time).format('MMM Do YYYY, h:mm:ss a')
					return item;
				});

	return res.send(result);

	cache.get(UserMessagesCacheKey, function(err,value){
		if(err || !value){
			rQuery = r.table(conf.get('database.tables.UserMessage'))
			rQuery = rQuery.orderBy(r.desc('time'))
			log.info({"Get User Message" : rQuery.toString()})

			rQuery.run(function(err,result){
				if(err){
					log.error(err);
					return [];
				}
				result = result.map(function(item){
					time = new Date(item.time);			
					item.time = moment(time).format('MMM Do YYYY, h:mm:ss a')
					return item;
				})
				res.send(result)
				//setting data in cache
				cache.set(UserMessagesCacheKey, JSON.stringify(result), function(err,reply){
					if(err)
						log.error("Error saving data in cache. "+ err)
				})
			})
		}else{
			log.info("Got data from cache");
			result = JSON.parse(value);
			res.send(result);
		}
	})
	
})

router.post('/addUserMessage',function(req,res,next){
	res.status(500).send("We have disabled add feature as database is not running");
	return;
	data = req.body;	
	log.info({"Add userMessage data" : data})
	data.time = getISTCurrentTime();

	rQuery = r.table(conf.get('database.tables.UserMessage'))
	rQuery = rQuery.insert(data)
	log.info({"Add userMessage" : rQuery.toString()})

	rQuery.run(function(err,result){
		if(err){
			log.error(err);
			res.send(500);			
			return;
		}
		cache.delete(UserMessagesCacheKey);
		res.sendStatus(200)
		sockets.emitWishesUpdates();
	})
})

router.post('/addTeamStatus',function(req,res,next){
	res.status(500).send("We have disabled add feature as database is not running");
	data = req.body;
	console.log(process.env.adminPassword);
	console.log(data.password);
	if(data.password != process.env.adminPassword){
		console.log("Not updating as user is not admin");
		res.send(500);
		return;
	}
	log.info({"Add Team Status data" : data})
	data.time = getISTCurrentTime();

	rQuery = r.table(conf.get('database.tables.TeamStatus'))
	rQuery = rQuery.insert(data)
	log.info({"Add teamStatus" : rQuery.toString()})

	rQuery.run(function(err,result){
		if(err){
			log.error(err)
			res.send(500)
			return;
		}
		cache.delete(TeamStatusCacheKey);
		res.sendStatus(200)
		sockets.emitTeamStatusUpdates()
	})
})

var getISTCurrentTime = function(){
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330;   // IST offset UTC +5:30 
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
	return(ISTTime);
}

module.exports = router;