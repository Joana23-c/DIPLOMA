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
let currentFrame = 0;
let frameTimer = 0;
const frameInterval = 150; // ms per frame

let cactusArray = [];
let cactus1width = 34;
let cactus2width = 69;
let cactus3width = 102;
let cactusheight = 70;
let cactusx = 700;
let cactusy = boardheight - cactusheight;

let cactus1img;
let cactus2img;
let cactus3img;
let velocityx = -8;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("canvas");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    sprite = new Image();
    sprite.src = 'Walking_KG_2.png';

    cactus1img = new Image();
    cactus1img.src = "cactus1.png";

    cactus2img = new Image();
    cactus2img.src = "cactus2.png";

    cactus3img = new Image();
    cactus3img.src = "cactus3.png";

    requestAnimationFrame(update);
    setInterval(placecactus, 1000);
};

function update(timestamp) {
    requestAnimationFrame(update);

    if (gameover) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

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
        0, framey,
        frameWidth, frameHeight
    );

    lastFrameTime = timestamp;

    // --- Draw cactuses ---
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityx;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
    }

    // --- Draw score ---
    context.fillStyle = "white";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
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
        height: cactusheight
    };

    let placecactuschance = Math.random();
    if (placecactuschance > 0.90) {
        cactus.img = cactus3img;
        cactus.width = cactus3width;
        cactusArray.push(cactus);
    } else if (placecactuschance > 0.70) {
        cactus.img = cactus2img;
        cactus.width = cactus2width;
        cactusArray.push(cactus);
    } else if (placecactuschance > 0.50) {
        cactus.img = cactus1img;
        cactus.width = cactus1width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}
