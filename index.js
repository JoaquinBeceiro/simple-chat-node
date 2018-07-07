var express = require('express');
var app     = express();
var path    = require('path');
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var nUsers  = 0;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    

    nUsers++;
    var newUser = socket.handshake.query.loggeduser;
    console.log("new user => " + newUser);
    io.emit('newConnection', [newUser, nUsers]);

    socket.on('disconnect', function(data){
        nUsers--;
        var user = Array.isArray(newUser) ? newUser[ newUser.length-1 ] : newUser;
        io.emit('closeConnection',[ user,nUsers]);
    });

    // New MSG
    socket.on('chatMsg', function(msg){
        var d = new Date();
        var timestamp = d.toLocaleString();
        msg.timestamp = timestamp;
        console.log(msg);
        io.emit('chatMsg', msg);
    });

    // New User
    socket.on('newUser', function(user){
        console.log( user );
        io.emit('newUser', user);
    });

    // User change name
    socket.on('changeName', function(name){
        newUser = name;
        io.emit('changeName', name);
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(path.join(__dirname, "public")));