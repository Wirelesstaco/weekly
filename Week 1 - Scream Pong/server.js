/* Room Connection Code from https://repl.it/@MikeShi42/competitive-2048-demo-final */

//Express shorttens the server set up
var express = require('express');

var app = express();
//Start Server
var server = app.listen(3000);

//Make a public directory (removes Cannot GET/ error)
app.use(express.static('public'));

console.log("server is running");

//socket io

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var playerStr = 'none';
const connections = [null, null];
let room = "test";



function newConnection(socket) {
    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {

        if (connections[i] === null) {
            playerIndex = i;
        }
    }
    console.log("connected " + socket.id);
    console.log(`Player ${playerIndex} has connected`);
    // Ignore player 3
    if (playerIndex == -1) return;

    connections[playerIndex] = socket;

    socket.emit('playerSoc', playerIndex);


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
        //console.log(ball.lastHit + "-----------");
        socket.to(room).emit('ballsnd', ball);


    }


    socket.on('room', function (roomname) {
        room = roomname;
        socket.join(roomname);

        io.clients((error, clients) => {
            if (error) throw error;
             console.log(clients);
            if (clients.length > 2) {
              console.log("Room full Join a new Room");
            }
        });


    });


    ///Send player data
    socket.on('disconnect', function () {
        console.log(`Player ${playerIndex} Disconnected`);
        connections[playerIndex] = null;

    });


}
