var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var clients=0;

io.on('connection', function (socket) {
   
    clients++;
    socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
    //emit to all excluding  the one who causedit
    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
    //emit to all including the one who causedit
    io.emit('broadcast',{description: clients + ' clients connected!'}); 
    setTimeout(function () {
        socket.emit("testEventServer", { description: 'A custom event named testEventServer!'});
    }, 4000);


    socket.on('testEventClient', function (data) {
        console.log(data.description);
    })

    socket.on('disconnect', function () {
        clients--;
        console.log('User disconnected');
        socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
    })
})
http.listen(3000, function () {
    console.log('listening on *:3000');
});