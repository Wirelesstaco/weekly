/* Room Connection Code from https://repl.it/@MikeShi42/competitive-2048-demo-final */

//Express shorttens the server set up
var express = require('express');

var app = express();
//Start Server
//var server = app.listen(3000);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
var server = app.listen(port);




//Make a public directory (removes Cannot GET/ error)
app.use(express.static('public'));

console.log("server is running");

//socket io

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var playerStr = 'none';
const connections = [null, null];
let room = "room-1";

let userRooms = {
    "room-1": [null, null],
    "room-2": [null, null]

};

//console.log(userRooms[0].users);
var roomno = 1;



function newConnection(socket) {

    // Find an available player number
    let playerIndex = -1;

    // When I'm sent a message send it back
    socket.on('sndp1', sndp1);
    socket.on('sndp2', sndp2);
    socket.on('ballsnd', ballsnd);

    function sndp1(p1) {
        socket.to(p1.room).emit('sndp1', p1);
    }

    function sndp2(p2) {
        socket.to(p2.room).emit('sndp2', p2);
    }

    function ballsnd(ball) {
        socket.to(room).emit('ballsnd', ball);


    }


    socket.on('room', function (roomname) {
        room = roomname;

        //Check to see if room is in array
        if (!userRooms[room]) {
            console.log("no Room");

            userRooms[room] = [null, null];
        } else {
            console.log("room Exists");
        }


        socket.join(roomname);

        let roomConnect = userRooms[room];

        for (const i in roomConnect) {
            if (roomConnect[i] === null) {
                playerIndex = i;
            }
        }

        console.log("connected " + socket.id);
        console.log(`Player ${playerIndex} has connected`);
        // Ignore player 3
        if (playerIndex == -1) {
            socket.emit('roomFull', "The room is full, please join new room");
            return;
        } else {
            socket.emit('roomFull', "");
        }
        roomConnect[playerIndex] = socket;

        socket.emit('playerSoc', playerIndex);

    });


    ///Send player data
    socket.on('disconnect', function () {

        console.log(`Player ${playerIndex} in ${room} has  Disconnected`);
        if (playerIndex != -1) {
            userRooms[room][playerIndex] = null;
        }

    });


}
