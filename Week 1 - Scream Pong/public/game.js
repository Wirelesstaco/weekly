/*eslint-env es6*/
/* eslint-env browser */
const c = document.getElementById("pong");
const ctx = c.getContext("2d");

let micMin = 135; //Mic input defualt
let thrusting = false;


let player = 'none'

let playerNum; // Value sent from socket-  p1 = 1 , p2 = 0
var p1 = {
    x: 10,
    y: c.height / 2 - 50,
    width: 20,
    height: 200,
    color: "white",
    score: 0,
    aiSpeed: 5,
    thrust: -.3,
    accel: 0,
    gravity: .4

}
var p2 = {
    x: c.width - 30,
    y: c.height / 2 - 50,
    width: 20,
    height: 200,
    color: "white",
    score: 0,
    aiSpeed: 5,
    thrust: -.3,
    accel: 0,
    gravity: .4

}

let ball = {
    x: c.width / 2,
    y: c.height / 2,
    velocityX: 5,
    velocityY: 5,
    speed: 5,
    size: 10,
    prevAng: Math.PI / 4,
    sa: 0,
    ea: 2 * Math.PI
}

var socket;
//socket = io.connect('http://localhost:3000');
socket = io();

/*
socket.on('p2Pos', function(yPos) {
    p2.y = yPos;
});
*/
socket.on('playerSoc', function (playerIndex) {
    var playerStr;

    if (playerIndex == 1) {

        playerStr = 'p1';
    } else if (playerIndex == 0) {


        playerStr = 'p2';
    }

    playerNum = playerIndex;
    player = window[playerStr];
    console.log(playerStr);
});
/*
document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
    if(event.keyCode == "32"){
            console.log("booper");
        thrusting =true;
    }
});

document.addEventListener("keyup", event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
    if(event.keyCode == "32"){
            console.log("up");
        thrusting =false;
    }
});*/
let maxPaddleSpeed = 10; // Enable later
function paddleControl() {

    if (player == p1 || player == p2) {
        player.accel += player.gravity;

        if (thrusting == true) {

            player.accel -= thrusting;
            if (player.accel > 0) {
                player.accel *= .85;
            }

        } else {
            if (player.accel <= maxPaddleSpeed && player.accel < 0) {
                player.accel *= .85;
            }
        }
        player.y += player.accel;
        // player.speed += player.45;
        if (player.y <= 0) {
            player.y = 1;
            player.accel = 0;
        } else if (player.y + player.height >= c.height) {
            player.y = c.height - player.height - 1;
            player.accel = 0;
        }

    }

}


/*
function getMousePos(evt){
 p1.y = evt.clientY - p1.height/2;
}


//Listen to the mouse
c.addEventListener("mousemove", getMousePos);
*/

//Draw Rect
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

}

//Draw Circle
function drawCircle(x, y, size, sA, eA) {
    ctx.beginPath();
    ctx.arc(x, y, size, sA, eA);
    ctx.fill();
}

//Draw Net
function drawNet() {
    for (let i = 0; i < 22; i++) {
        //Draw p1 Paddle
        drawRect(c.width / 2, i * 35, 5, 10, "white");
    }
}

//Draw Score
function drawScore() {
    ctx.font = "120px Arial";
    ctx.fillStyle = '#ffeeee';
    ctx.textAlign = "center";
    ctx.fillText(p1.score, c.width / 4, 100);
    ctx.fillText(p2.score, c.width / 4 * 3, 100);
}

function resetBall() {
    let oppSide = (ball.x < c.width / 2) ? p2 : p1;
    oppSide.score++;

    ball.x = c.width / 2,
        ball.y = c.height / 2,
        ball.speed = 7;
    ball.velocityX = 5 * -Math.sign(ball.velocityX);
    ball.velocityY = 5;

}

function collide(paddle, _ball) {

    //Is colliding wih paddle.

    return paddle.y < _ball.y && paddle.y + paddle.height > _ball.y && paddle.x - paddle.width / 2 < _ball.x - _ball.size / 2 && paddle.x + paddle.width > _ball.x - _ball.size / 2;
}


function aiPaddle() {
    //AI paddle
    //p2.y = ball.y -p2.height/2;
    let aiSpeed = p2.aiSpeed;
    let paddleDist = p2.y + (p2.height / 2) - ball.y;
    let moveAmt = 0;
    if (Math.abs(paddleDist) > aiSpeed) {
        moveAmt = aiSpeed * Math.sign(paddleDist) * -1;
    } else {
        moveAmt = paddleDist * -1;
    }
    p2.y += moveAmt;
}

function update() {
    if (playerNum == 1) {
        socket.emit('sndp1', p1); // Send data to server
        socket.emit('ballsnd', ball); // Send data to server
        
        socket.on('sndp2', function (p2data) {
            p2 = p2data;
        });
    }
    if (playerNum == 0) { //If p2
        socket.emit('sndp2', p2); // Send data to server

        //Recieve p1
        socket.on('sndp1', function (p1data) {
            
            p1 = p1data;
          
        });
        
         socket.on('ballsnd', function (theBall) {
             
               ball = theBall;
         });
    }

    if (ball.x > c.width || ball.x < 0) {
        resetBall();
    }
    if (ball.y > c.height || ball.y < 0) {
        ball.velocityY *= -1;
    }
    ball.x = ball.x + ball.velocityX;
    ball.y = ball.y + ball.velocityY;


    //aiPaddle();


    paddleControl();


    //Ball Collision///////////////


    // Which Paddle 
    let curPad = (ball.x < c.width / 2) ? p1 : p2;
    if (collide(curPad, ball)) {

        //Collision Point -- Gets mid point of paddle
        let collidePoint = ball.y - (curPad.y + curPad.height / 2)
        //Normalize
        collidePoint = collidePoint / curPad.height;


        //Bounce Angle
        let bounceAng = Math.PI / 4 * collidePoint;

        // Direction
        let dir = (ball.x < c.width / 2) ? 1 : -1;
        //velocity x,y 
        ball.velocityX = dir * Math.cos(bounceAng) * ball.speed;
        ball.velocityY = Math.sin(bounceAng) * ball.speed;

        if (ball.speed < 15) { //Max speed
            ball.speed += 1;
        }

    }

}



function render() {
    //DrawBackground
    drawRect(0, 0, c.width, c.height, "green");

    drawScore();

    //Draw net
    drawNet();

    //Draw p1 Paddle
    drawRect(p1.x, p1.y, p1.width, p1.height, p1.color);

    //Draw p2 Paddle
    drawRect(p2.x, p2.y, p2.width, p2.height, p2.color);


    //DrawCircle
    drawCircle(ball.x, ball.y, ball.size, ball.sa, ball.ea);
}

function gameLoop() {
    update();
    render();
}


let fps = 60;
setInterval(gameLoop, 1000 / fps);
