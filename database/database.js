var conf = require('config');

var r;

var connect = function(database){
	if(r){
		return r;
	} else{
		database = database || conf.get('database.name');
		r = require('rethinkdbdash')({
			servers : conf.get('database.servers'),
			db : database
		});
		return r;
	}
}

var close = function(){
	if(r){
		r.getPoolMaster().drain();
	}
}

module.exports = {
	connect : connect,
	close : close
}