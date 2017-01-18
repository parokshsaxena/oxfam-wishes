var socketio = require('socket.io');

var io = null;

var listen = function(server){
	io = socketio.listen(server);
	io.on("connection", function(socket){
		console.log("listening")
		io.emit("startEvent");
		socket.on("err", function(){
			console.log("error")
		})
		socket.on("wishes-updated", function(){
			console.log("ho ho");
		})
	})
	return io;
}

var emitWishesUpdates = function(){
	console.log("Sending wishes update event");
	io.emit("wishes-updated");
}

var emitTeamStatusUpdates = function(){
	io.emit("teamstatus-updated");
}

module.exports = {
	listen : listen,
	emitWishesUpdates : emitWishesUpdates,
	emitTeamStatusUpdates : emitTeamStatusUpdates
}