$(document).ready(function(){

    // New user
    var userId = Math.round(new Date().getTime() + (Math.random() * 100));
    $('#userId').val(userId);
    var socket = io.connect(window.location.origin,{query:'loggeduser='+userId});

    $('form').submit(function(){
        // User change name
        if( userId != $('#userId').val() ){
            socket.emit('changeName', [userId ,$('#userId').val()] );
        }

        userId = $('#userId').val();
        socket.emit('chatMsg', { 'user':userId, 'msg': $('#msgInput').val() } );
        $('#msgInput').val('');
        return false;
    });

    socket.on('chatMsg', function(msg){
        console.log(msg);
        var userSpan = $('<span></span>');
        userSpan.text(msg['user']);
        var userMsg = $('<li></li>');
        userMsg.text('('+msg['timestamp']+') ');
        userMsg.append(userSpan);
        userMsg.append(' > '+msg['msg']);
        $('#msgContent').append(userMsg);
    });

    socket.on('newConnection', function(user){
        var userMsg = $('<li></li>');
        userMsg.append('New user online : '+user[0]);
        $('#msgContent').append(userMsg);
        $('#numberOfUsers').text( user[1] );
    });

    socket.on('closeConnection', function(user) {
        console.log(user);
        var userClose   = $('<span></span>');
        userClose.text( user[0] );
        var userMsg     = $('<li></li>');
        userMsg.append(' - The user ');
        userMsg.append(userClose);
        userMsg.append(' left the chat');

        $('#msgContent').append(userMsg);
        $("#numberOfUsers").text( user[1] );
    });

    socket.on('changeName', function(name){
        var userMsg = $('<li></li>');
        var oldUser = $('<span>'+name[0]+'</span>');
        var newUser = $('<span>'+name[1]+'</span>');
        userMsg.append(' - The user ');
        userMsg.append(oldUser);
        userMsg.append(' change name to ');
        userMsg.append(newUser);
        $('#msgContent').append(userMsg);
    });


});