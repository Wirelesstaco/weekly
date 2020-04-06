/*eslint-env es6*/
/* eslint-env browser */
const c = document.getElementById("pong");
const ctx = c.getContext("2d");


let p1 = {
    x : 10,
    y : c.height/2 - 50,
    width : 20,
    height : 100,
    color : "white"
    
}
let p2 = {
    x : c.width -30,
    y : c.height/2 - 50,
    width : 20,
    height : 100,
    color : "white"
    
}

let ball = {
    x:c.width/2,
    y:c.height/2,
    velocityX: 5,
    velocityY: 5,
    size:10,
    sa:0,
    ea: 2 * Math.PI
}

function getMousePos(evt){
 p1.y = evt.clientY - p1.height/2;
}


//Listen to the mouse
c.addEventListener("mousemove", getMousePos);


//Draw Rect
function drawRect(x,y,width,height,color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

}

//Draw Circle
function drawCircle(x,y,size,sA,eA){
    ctx.beginPath();
    ctx.arc(x,y,size,sA,eA);
    ctx.fill();
}

//Draw Net
function drawNet(){
    for(let i =0; i < 15; i++){
         //Draw p1 Paddle
        drawRect(c.width/2, i * 30, 5,10,"white");
    }
}


function update(){
    if(ball.x > c.width || ball.x < 0){
        ball.velocityX *= -1;
    }
    if(ball.y > c.height || ball.y < 0){
        ball.velocityY *= -1;
    }
    ball.x = ball.x + ball.velocityX;
    ball.y = ball.y + ball.velocityY;
    
    //AI paddle
    p2.y = ball.y -p2.height/2;
}

function render(){
    //DrawBackground
    drawRect(0,0,c.width,c.height,"black");
    
    //Draw net
    drawNet();
    
    //Draw p1 Paddle
    drawRect(p1.x, p1.y, p1.width,p1.height,p1.color);
    
     //Draw p2 Paddle
    drawRect(p2.x, p2.y, p2.width, p2.height, p2.color);
    
    
    //DrawCircle
    drawCircle(ball.x,ball.y, ball.size, ball.sa, ball.ea);
}

function gameLoop(){
    update();
    render();
}


let fps = 60;
setInterval(gameLoop,1000/fps);