var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = [];

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    socket.on('adduser', function (user) {
        io.emit('connection message', user + ' connected');
        socket.user = user;
        users.push(user);
        updateClients();
    });

    socket.on('disconnect', function (user) {
        io.emit('connection message', socket.user + ' disconnected');
        for(var i=0; i<users.length; i++) {
            if(users[i] == socket.user) {
                users.splice(i,1);
            }
        }
        updateClients(); 
    });

    function updateClients() {
        io.sockets.emit('update', users);
    }

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});