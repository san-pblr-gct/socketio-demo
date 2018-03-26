var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var clients = 0;
var roomNo = 1;
io.of('/namespace').on('connection', function (socket) {

    clients++;
    socket.emit('newclientconnect', { description: 'Hey, welcome!' });
    //emit to all excluding  the one who causedit
    socket.broadcast.emit('newclientconnect', { description: clients + ' clients connected!' })
    //emit to all including the one who causedit
    io.emit('broadcast', { description: clients + ' clients connected!' });
    setTimeout(function () {
        socket.emit("testEventServer", { description: 'A custom event named testEventServer!' });
    }, 4000);
    //adding socket to a room using join 
    if (io.nsps['/namespace'].adapter.rooms["roomNo-" + roomNo] &&
        io.nsps['/namespace'].adapter.rooms["roomNo-" + roomNo].length > 1)
        roomNo++;
    socket.join("roomNo-" + roomNo);

    //sending message to a particular namespace and particular room
    io.of('/namespace').in("roomNo-" + roomNo).emit('connectToRoom', "You are in room no. " + roomNo);




    socket.on('testEventClient', function (data) {
        console.log(data.description);
    })

    socket.on('disconnect', function () {
        clients--;
        console.log('User disconnected');
        socket.leave("roomNo-" + roomNo); //leaving a room
        socket.broadcast.emit('newclientconnect', { description: clients + ' clients connected!' })
    })

    socket.on('connect_failed', function() {
        document.write("Sorry, there seems to be an issue with the connection!");
     })
})
http.listen(3000, function () {
    console.log('listening on *:3000');
});