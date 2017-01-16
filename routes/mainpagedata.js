var express = require('express')
var router = express.Router();
var conf = require('config');
var r = require('../database/database').connect();
var bunyan = require('bunyan')
var log = bunyan.createLogger({name : 'oxfam-mainpagedata', src : true})
var moment = require('moment');

router.get('/getTeamStatus', function(req,res,next){
	log.info("Inside get team status function");
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
	})

})

router.get('/getUserMessages', function(req,res,next){
	log.info("Inside get user messages")
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
	})
})

router.post('/addUserMessage',function(req,res,next){
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
		res.send(200)
	})
})

router.post('/addTeamStatus',function(req,res,next){
	data = req.body;	
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
		res.send(200)
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