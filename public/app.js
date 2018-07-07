$(document).ready(function(){

    var app = new Vue({
        el: '#chatWindow',
        data : {
            msgs : [],
            numberOfUsers: 0,
        }
    });

    // Set focus to msg input
    $( "#msgInput" ).focus();

    // Audio notification
    var audioAlert = $('#msg-alert');

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
        let nMsg = [];
        nMsg['user']      = msg['user'];
        nMsg['type']      = msg['user'] == userId ? 'meMsg' : 'newMsg';
        nMsg['timestamp'] = msg['timestamp'];
        nMsg['msg']       = msg['msg'];
        app.msgs.push( nMsg );

        // Play audio on new msg
        if(  msg['user'] != userId ){
            audioAlert[0].play();
        }
    });

    socket.on('newConnection', function(user){
        console.log(user);
        let nMsg         = [];
        nMsg['user']     = user[0];
        nMsg['type']     = 'newUser';
        app.msgs.push( nMsg );
        app.numberOfUsers = user[1];
    });

    socket.on('closeConnection', function(user) {
        let nMsg = [];
        nMsg['user']      = user[0];
        nMsg['type']      = 'exitUser';
        app.msgs.push( nMsg );
        app.numberOfUsers = user[1];
    });

    socket.on('changeName', function(name){
        let nMsg = [];
        nMsg['old']      = name[0];
        nMsg['new']      = name[1];
        nMsg['type']      = 'changeUser';
        app.msgs.push( nMsg );
    });


});