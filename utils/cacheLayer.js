var redis = require('redis');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name : "oxfam-cache", src : true})

var instance;
var client = function(){
	if(!instance){
		log.info(process.env.REDISCLOUD_URL);
		this._clientInstance = redis.createClient(process.env.REDISCLOUD_URL, {
										no_ready_check : true,
									    retry_strategy: function (options) {
									        if (options.error && options.error.code === 'ECONNREFUSED') {
									            // End reconnecting on a specific error and flush all commands with a individual error
									            return new Error('The server refused the connection');
									        }
									        if (options.total_retry_time > 1000 * 60 * 60) {
									            // End reconnecting after a specific timeout and flush all commands with a individual error
									            return new Error('Retry time exhausted');
									        }
									        if (options.times_connected > 10) {
									            // End reconnecting with built in error
									            return undefined;
									        }
									        // reconnect after
									        return Math.min(options.attempt * 100, 3000);
									    }
									});
		instance = this._clientInstance;
		this._clientInstance.on("error",function(err){
			log.error("error : "+ err);
		})
	}else{
		this._clientInstance = instance;	
	}
	this._defaultExpiry = 3600; //1 hour	
}

client.prototype.get = function(key,callback){
	this._clientInstance.get(key,function(err,reply){
		if(reply){
			reply = reply.toString();
		}
		callback(err,reply);
	})
}

client.prototype.set = function(key,value,callback,expiryTime){
	if(expiryTime == undefined){
		expiryTime = this._defaultExpiry;
	}
	var that = this;
	this._clientInstance.set(key,value,function(err,reply){
		if(err){
			log.error(err)
		}else{
			that._clientInstance.expire(key,expiryTime)
		}
		if(callback){
			callback(err,reply);
		}
	});
}

client.prototype.delete = function(key){
	this._clientInstance.del(key);
}

module.exports = client;