//next two line load express
var express= require('express'); 
var app= express(); 
//set the static folder 
app.use(express.static(__dirname + "/static")); 
//set the server 
var server = app.listen(8000); 
//requier the socket.io library, excute the listen funciton and pass in server
var io = require('socket.io').listen(server);
var users= []; 
var connections= []; 

app.get ('/', function(req, res){
	res.send('index')
});
//open a connection with socket io
io.sockets.on('connection', function(socket){
	//all events that we want to omit here
	connections.push(socket); 
	//disconnect
	socket.on ('disconnect', function(data){
		 
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1)

	}); 
	//send message 
	socket.on ('send message', function(data){
		io.sockets.emit('new message', {msg: data, user:socket.username});
	})
	//new user
	socket.on('new user', function(data, callback){
		callback(true); 
		socket.username = data; 
		users.push(socket.username)
		updateUsernames(); 
	})
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
	
}); 


