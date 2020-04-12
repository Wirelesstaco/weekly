/*eslint-env es6*/
/* eslint-env browser */
const c = document.getElementById("pong");
const ctx = c.getContext("2d");

let micMin =135;//Mic input defualt
let thrusting = false;

let p1 = {
    x : 10,
    y : c.height/2 - 50,
    width : 20,
    height : 200,
    color : "white",
    score :0,
    aiSpeed : 5,
    thrust :-.3,
    accel:0,
    gravity:.4
    
}
let p2 = {
    x : c.width -30,
    y : c.height/2 - 50,
    width : 20,
    height : 100,
    color : "white",
    score : 0,
    aiSpeed :5
    
}

let ball = {
    x:c.width/2,
    y:c.height/2,
    velocityX: 5,
    velocityY: 5,
    speed: 5,
    size:10,
    prevAng: Math.PI /4,
    sa:0, 
    ea: 2 * Math.PI
}
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
let maxPaddleSpeed = 10;// Enable later
function paddleControl(){
    p1.accel += p1.gravity;
    
    if(thrusting == true){
       
        p1.accel -=thrusting;
        if(p1.accel > 0){
            p1.accel *= .85
        }
        
    }else {
        if(p1.accel <= maxPaddleSpeed && p1.accel < 0){
            p1.accel *= .85
        }
    }
    p1.y += p1.accel;
  // p1.speed += p1.45;
    if(p1.y <=0){
        p1.y =1;
       p1.accel =0;
    }else if (p1.y +p1.height >= c.height){
        p1.y = c.height -p1.height -1;
       p1.accel =0;
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
    for(let i =0; i < 22; i++){
         //Draw p1 Paddle
        drawRect(c.width/2, i * 35, 5,10,"white");
    }
}

//Draw Score
function drawScore(){
    ctx.font = "120px Arial";
    ctx.fillStyle = '#ffeeee';
    ctx.textAlign = "center";
    ctx.fillText(p1.score, c.width/4, 100);
    ctx.fillText(p2.score, c.width/4 * 3, 100);
}

function resetBall(){
     let oppSide = (ball.x < c.width/2)? p2:p1;
     oppSide.score ++;
    
     ball.x = c.width/2,
     ball.y = c.height/2,
     ball.speed = 7;
    ball.velocityX =5;
    ball.velocityY = 5;
     ball.velocityX *= -1;
}

function collide(paddle,_ball){
               
    //Is colliding wih paddle.
    
    return paddle.y < _ball.y && paddle.y + paddle.height > _ball.y && paddle.x - paddle.width/2 < _ball.x - _ball.size/2 && paddle.x + paddle.width > _ball.x -_ball.size/2;
}



function update(){
    if(ball.x > c.width || ball.x < 0){
       resetBall();
    }
    if(ball.y > c.height || ball.y < 0){
        ball.velocityY *= -1;
    }
    ball.x = ball.x + ball.velocityX;
    ball.y = ball.y + ball.velocityY;
    
    //AI paddle
    //p2.y = ball.y -p2.height/2;
    let aiSpeed = p2.aiSpeed;
    let paddleDist = p2.y+ (p2.height/2) - ball.y; 
    let moveAmt= 0;
    if(Math.abs(paddleDist) > aiSpeed){
      moveAmt = aiSpeed * Math.sign(paddleDist) *-1;
    } else {
      moveAmt = paddleDist *-1;
    }
    paddleControl();
    
    p2.y += moveAmt;
    
    //Ball Collision///////////////
    
    
    // Which Paddle 
    let curPad = (ball.x < c.width/2)? p1:p2;
    if(collide(curPad,ball)){
        
        //Collision Point -- Gets mid point of paddle
        let collidePoint = ball.y - (curPad.y + curPad.height/2)
        //Normalize
        collidePoint = collidePoint / curPad.height;
       
     
        //Bounce Angle
        let bounceAng = Math.PI / 4 * collidePoint;
        
        // Direction
        let dir =  (ball.x < c.width/2)? 1:-1;
        //velocity x,y 
        ball.velocityX = dir * Math.cos(bounceAng) * ball.speed;
        ball.velocityY = Math.sin(bounceAng) * ball.speed;
        
        if(ball.speed <15){//Max speed
            ball.speed += 1;
        }
        
    }

}



function render(){
    //DrawBackground
    drawRect(0,0,c.width,c.height,"green");
    
    drawScore();
    
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