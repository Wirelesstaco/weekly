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
let room = "room-1";

let userRooms = {
    "room-1": [null, null],
    "room-2": [null, null]

};

//console.log(userRooms[0].users);
var roomno = 1;



function newConnection(socket) {
    /* //Increase roomno 2 clients are present in a room.
    if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) roomno++;
    socket.join("room-" + roomno);

    //Send this event to everyone in the room.
    io.sockets.in("room-" + roomno).emit('connectToRoom', "You are in room no. " + roomno);


    let roomCount = 1;
    // if Room length 2 or Greater Check next room.
    if (io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {

    }
    // If room is undefined make new room and Join it.
    console.log(io.nsps['/'].adapter.rooms["room-6"]);
*/

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
        //console.log(ball.lastHit + "-----------");
        socket.to(room).emit('ballsnd', ball);


    }


    socket.on('room', function (roomname) {
        room = roomname;
        
       //Check to see if room is in array
        if(!userRooms[room] ){
            console.log("no Room");
           
             userRooms[room]= [null, null];
        }else{
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
            if (playerIndex == -1){
                console.log("Room is full, please join new room");
                socket.emit('roomFull',"The room is full, please join new room");
                return;
            } else{
                 socket.emit('roomFull',"");
            }
            roomConnect[playerIndex] = socket;
        

    socket.emit('playerSoc', playerIndex);
        

        /*socket.join(room, () => {
           /* let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]
            io.to(room).emit('a new user has joined the room'); // broadcast to everyone in the room
          });
   /*     
   io.in(room).clients((err, clients) => {
  console.log(clients); // an array containing socket ids in 'room3'
});*/
        /* socket.join(room, () => {
             io.clients((error, clients) => {
                 if (error) throw error;
                 console.log(clients);
                 if (clients.length > 2) {
                     console.log("Room full Join a new Room");
                   //  socket.emit('playerSoc', -1);
                 } else {
                     playerIndex = clients.length - 1;
                     socket.emit('playerSoc', playerIndex);
                 }
             });


         });*/
    });


    ///Send player data
    socket.on('disconnect', function () {
        
        console.log(`Player ${playerIndex} in ${room} has  Disconnected`);
        console.log(userRooms);
        if(playerIndex != -1){
            userRooms[room][playerIndex]= null;
        }

    });


}
