let board;
let boardwidth = 750;
let boardheight = 250;
let context;



const frameWidth = 100;
const frameHeight = 64;
const numFrames = 5;
let framex = 0;
let framey = boardheight - frameHeight;
let sprite;

let frame = {
    x: framex,
    y: framey,
    width: frameWidth,
    height: frameHeight
};

const groundY = boardheight - frameHeight;

let currentFrame = 0;
let frameTimer = 0;
const frameInterval = 150; // ms per frame

let cactusArray = [];
let cactus1width = 40;
let cactus2width = 69;
let cactus3width = 70;
let cactusheight = 80;
let cactusx = 700;
let cactusy = boardheight - cactusheight;

let cactus1img;
let cactus2img;
let cactus3img;
let velocityx = -4;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;
let score = 0;
let coins=0;
let goldcoin;
let goldcoinwidht = 30;
let goldcoinheigh = 30;
let silvercoin;


let isPaused = false;

let jumpSound = new Audio("jump1.ogg");
let coinSound = new Audio("coinsong.wav");
let gameOverSound = new Audio("gameover.wav");


window.onload = function() {
    board = document.getElementById("canvas");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    sprite = new Image();
    sprite.src = 'Walking_KG_2.png';

    cactus1img = new Image();
    cactus1img.src = "canyon_rock1.png";

    cactus2img = new Image();
    cactus2img.src = "canyon_rock1.png";

    cactus3img = new Image();
    cactus3img.src = "canyon_rock2.png";

    goldcoin = new Image();
    goldcoin.src = "goldCoin.png"

    silvercoin = new Image();
    silvercoin.src = "silverCoin.png"

    requestAnimationFrame(update);
    setInterval(placecactus, 1000);

    document.addEventListener("keydown", movesailor); 
    document.getElementById("pauseBtn").addEventListener("click", togglePause);
    document.getElementById("playBtn").addEventListener("click", togglePlay);


};

function update(timestamp) {
    requestAnimationFrame(update);

    if (gameover) {
        return;
    }
    if (isPaused) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityy += gravity; 

    frame.y += velocityy;
if (frame.y > framey) {
    frame.y = framey;
    velocityy = 0;
}
    // --- Draw sailor animation ---
    // Use timestamp for smoother animation
    if (!lastFrameTime) lastFrameTime = timestamp;
    let deltaTime = timestamp - lastFrameTime;
    frameTimer += deltaTime;

    if (frameTimer >= frameInterval) {
        currentFrame = (currentFrame + 1) % numFrames;
        frameTimer = 0;
    }

    
    context.drawImage(
        sprite,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        0, frame.y,
        frameWidth, frameHeight
    );

    lastFrameTime = timestamp;

    // --- Draw cactuses ---
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityx;
         
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(frame,cactus)){
            if(cactus.img != goldcoin && cactus.img != silvercoin){
                gameover= true;
                        gameOverSound.currentTime = 0; 
                        gameOverSound.play();
            }else if(cactus.img == goldcoin){
                    coinSound.currentTime = 0; 
                    coinSound.play();      
            coins+=10;
             cactusArray.splice(i, 1);
               i--;
            }else if(cactus.img == silvercoin){
                coinSound.currentTime = 0; 
                    coinSound.play(); 
            coins+=5;
             cactusArray.splice(i, 1);
               i--;
            }

        }
/*
         if (detectCollision(frame,cactus) && cactus.img != goldcoin && cactus.img != silvercoin ) {
            gameover = true;
        }
        else if(detectCollision(frame,cactus) && cactus.img == goldcoin){
            gameover = false;
            coins+=10;
             cactusArray.splice(i, 1);
               i--;*/
               /* vendos i-- sepse you remove the current cactus at index i. But right after that, your for loop automatically moves to the next index (i++ in the loop). This causes the loop to skip the next cactus.*/
    /*    }   else if(detectCollision(frame,cactus) && cactus.img == silvercoin){
            gameover = false;
            coins+=5;
             cactusArray.splice(i, 1);
               i--;
        }  
*/

    // --- Draw score ---
    context.fillStyle = "white";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
    /*x = 5: the horizontal position (5 pixels from the left edge).
y = 20: the vertical position (20 pixels from the top). */

    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText(coins, 700, 20);
 }

 if(coins == 20  || coins == 25){
    velocityx = -5;
 }
  if(coins==55 || coins == 60){
   velocityx = -6;
 }
}

let lastFrameTime = 0;

function placecactus() {
    if (gameover) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusx,
        y: cactusy,
        width: null,
        height: null
    };

    let placecactuschance = Math.random();
    if (placecactuschance > 0.80) {
        cactus.img = cactus3img;
        cactus.width = cactus3width;
        cactus.height = cactusheight;
        cactusArray.push(cactus);
    } else if (placecactuschance > 0.60) {
        cactus.img = cactus2img;
        cactus.width = cactus2width;
         cactus.height = cactusheight;
        cactusArray.push(cactus);
    } else if (placecactuschance > 0.30) {
        cactus.img = cactus1img;
        cactus.width = cactus1width;
         cactus.height = cactusheight;
        cactusArray.push(cactus);
    }else if(placecactuschance > 0.20){
        cactus.img = goldcoin;
        cactus.width = goldcoinwidht;
        cactus.height = goldcoinheigh;
        cactusArray.push(cactus);
    }else if(placecactuschance > 0.10){
        cactus.img = silvercoin;
        cactus.width = goldcoinwidht;
        cactus.height = goldcoinheigh;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

//funksioni per jump
function movesailor(e){
    //nese eshte gameover true dmth ti ke humb nuk mund te hidhesh me 
    if(gameover){
        return;
    }
    //nese eshte klipuar space ose arrowup dhe pozicioni vertikal i dino eshte ne pozicionin default (pra toke) mund te bej jump
    if((e.code == "Space" || e.code == "ArrowUp") && frame.y==groundY ){
        //jump
        velocityy = -11; //dmth e bej te ngjitet 10 njesi lart dhe vizatoj dizaurin 
        jumpSound.currentTime = 0; // rewind if still playing
        jumpSound.play();
    }
}

//perplasje, mbivendosje
function detectCollision(a, b) {
    return a.x+40 < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner This creates a tolerance or buffer zone of 40 pixels. a can be up to 40 pixels into b (from the right side) and still not be considered a collision.
           a.x + a.width > b.x+30 &&   //a's top right corner passes b's top left corner
           a.y< b.y + b.height  &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y ;    //a's bottom left corner passes b's top left corner
           //Nëse të gjitha janë true, ka përplasje!
}

function togglePause() {
    isPaused = true;
    console.log("pause");
}
function togglePlay() {
    isPaused = false;
     console.log("play");}
