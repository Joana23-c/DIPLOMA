console.log(faceapi)
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

let pengesaArray = [];
let pengesa1width = 40;
let pengesa2width = 69;
let pengesa3width = 70;
let pengesaheight = 80;
let pengesax = 700;
let pengesay = boardheight - pengesaheight;

let pengesa1img;
let pengesa2img;
let pengesa3img;
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

let jumpSound = new Audio("./sounds/jump1.ogg");
let coinSound = new Audio("./sounds/coinsong.wav");
let gameOverSound = new Audio("./sounds/gameover.wav");
let win = new Audio("./sounds/win.wav");

let replayBtn;
let replayVisible = false;


window.onload = function () {
    // Fillo me Face API menjëherë
    run();

    // Prit 5 sekonda përpara se të nisë loja
    setTimeout(() => {
        board = document.getElementById("canvas");
        board.height = boardheight;
        board.width = boardwidth;
        context = board.getContext("2d");
        replayBtn = document.getElementById("hidden");
        hideReplayBtn(replayVisible);

        sprite = new Image();
        sprite.src = './images/Walking_KG_2.png';

        pengesa1img = new Image();
        pengesa1img.src = "./images/canyon_rock1.png";

        pengesa2img = new Image();
        pengesa2img.src = "./images/canyon_rock1.png";

        pengesa3img = new Image();
        pengesa3img.src = "./images/canyon_rock2.png";

        goldcoin = new Image();
        goldcoin.src = "./images/goldCoin.png";

        silvercoin = new Image();
        silvercoin.src = "./images/silverCoin.png";

        requestAnimationFrame(update);
        setInterval(placepengesa, 1000);

        document.addEventListener("keydown", movesailor);
        document.getElementById("pauseBtn").addEventListener("click", togglePause);
        document.getElementById("playBtn").addEventListener("click", togglePlay);
        document.getElementById("shpjegimBtn").addEventListener("click", shpjegime);
        replayBtn.addEventListener("click", LuajPerseri);
    }, 2500); // 5 sekonda (5000ms)
};

 
function update(timestamp) {
    requestAnimationFrame(update);

    if (gameover) {
        replayVisible = true;
        hideReplayBtn(replayVisible);
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

    // --- Draw pengesaes ---
    for (let i = 0; i < pengesaArray.length; i++) {
        let pengesa = pengesaArray[i];
        pengesa.x += velocityx;
         
        context.drawImage(pengesa.img, pengesa.x, pengesa.y, pengesa.width, pengesa.height);

        if(detectCollision(frame,pengesa)){
            if(pengesa.img != goldcoin && pengesa.img != silvercoin){
                gameover= true;
                gameOverSound.currentTime = 0; 
                gameOverSound.play();
                replayVisible = true;
                hideReplayBtn(replayVisible);
            }else if(pengesa.img == goldcoin){
                    coinSound.currentTime = 0; 
                    coinSound.play();      
            coins+=10;
             pengesaArray.splice(i, 1);
               i--;
            }else if(pengesa.img == silvercoin){
                coinSound.currentTime = 0; 
                    coinSound.play(); 
            coins+=5;
             pengesaArray.splice(i, 1);
               i--;
            }

        }
/*
         if (detectCollision(frame,pengesa) && pengesa.img != goldcoin && pengesa.img != silvercoin ) {
            gameover = true;
        }
        else if(detectCollision(frame,pengesa) && pengesa.img == goldcoin){
            gameover = false;
            coins+=10;
             pengesaArray.splice(i, 1);
               i--;*/
               /* vendos i-- sepse you remove the current pengesa at index i. But right after that, your for loop automatically moves to the next index (i++ in the loop). This causes the loop to skip the next pengesa.*/
    /*    }   else if(detectCollision(frame,pengesa) && pengesa.img == silvercoin){
            gameover = false;
            coins+=5;
             pengesaArray.splice(i, 1);
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
 
 if(coins >= 150){
    context.fillStyle = "red";
    context.font = "25px courier";
    context.fillText("Ti fitove !", 300, 125);
    win.currentTime = 0; 
    win.play();
    gameover=true;
 }
}

let lastFrameTime = 0;

function placepengesa() {
    if (gameover) {
          replayVisible = true;
        hideReplayBtn(replayVisible);
        return;
    }

    let pengesa = {
        img: null,
        x: pengesax,
        y: pengesay,
        width: null,
        height: null
    };

    let placepengesachance = Math.random();
    if (placepengesachance > 0.80) {
        pengesa.img = pengesa3img;
        pengesa.width = pengesa3width;
        pengesa.height = pengesaheight;
        pengesaArray.push(pengesa);
    } else if (placepengesachance > 0.60) {
        pengesa.img = pengesa2img;
        pengesa.width = pengesa2width;
         pengesa.height = pengesaheight;
        pengesaArray.push(pengesa);
    } else if (placepengesachance > 0.40) {
        pengesa.img = pengesa1img;
        pengesa.width = pengesa1width;
         pengesa.height = pengesaheight;
        pengesaArray.push(pengesa);
    }else if(placepengesachance > 0.30){
        pengesa.img = goldcoin;
        pengesa.width = goldcoinwidht;
        pengesa.height = goldcoinheigh;
        pengesaArray.push(pengesa);
    }else if(placepengesachance > 0.10){
        pengesa.img = silvercoin;
        pengesa.width = goldcoinwidht;
        pengesa.height = goldcoinheigh;
        pengesaArray.push(pengesa);
    }

    if (pengesaArray.length > 5) {
        pengesaArray.shift();
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
           a.y + a.height > b.y+30 ;    //a's bottom left corner passes b's top left corner
           //Nëse të gjitha janë true, ka përplasje!
}

function togglePause() {
    isPaused = true;
    // console.log("pause");
    pengesaArray.length = 0;
}
function togglePlay() {
    isPaused = false;
    //  console.log("play");
    pengesaArray.length = 0;
    }
function shpjegime(){
   const info1 = document.getElementById("info1"); 
 document.getElementById("shpjegimBtn").onclick = () => {
    console.log("x");
   togglePause(); 
  info1.style.display = "block";
   
};
   document.getElementById("closeInfo1").onclick = () => {info1.style.display = "none";
    togglePlay();
   }
}

     function hideReplayBtn( visible) {
        if (!visible) {
            replayBtn.style.display = 'none'; // fsheh section-in
        } else {
            replayBtn.style.display = 'block'; // Shfaq section-in
        }
    }

   function LuajPerseri(){
    score=0;
    coins=0;
     velocityx = -4;
    replayVisible = false;
    hideReplayBtn(replayVisible);
    for(let i=0;i<5;i++){
        pengesaArray.pop();
    }
    gameover=false;
   }



const run = async()=>{
    let happyCount = 0;
let sadCount = 0;
let angryCount = 0;
let neutralCount = 0;
let fearfulCount = 0;
let disgustedCount = 0;
let surprisedCount = 0;
    
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false,

    });
    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/face-api-js-starter-main/public/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/face-api-js-starter-main/public/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/face-api-js-starter-main/public/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/face-api-js-starter-main/public/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/face-api-js-starter-main/public/models')
    ]);

    const canvas = document.getElementById('canvasface');
    const updateCanvasDimensions = () => {
        canvas.style.left = `${videoFeedEl.offsetLeft}px`;
        canvas.style.top = `${videoFeedEl.offsetTop}px`;
        canvas.height = videoFeedEl.videoHeight;
        canvas.width = videoFeedEl.videoWidth;
    };

    updateCanvasDimensions();

    window.addEventListener('resize', updateCanvasDimensions);
    

    setInterval(async()=>{
        let faceAIData = await faceapi.detectAllFaces(videoFeedEl)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();
        console.log(faceAIData)

        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);

    let emotionText = "";

         faceAIData.forEach(face => {
             const{age, gender, genderProbability} = face
             const genderText = `${gender} - ${Math.round(genderProbability*100)/100*100}`
         const ageText =`${Math.round(age)} vjec`
        const textField = new faceapi.draw.DrawTextField(
            [genderText, ageText],  // Text to display
             face.detection.box.topRight // Position
         )
        const expressions = face.expressions;
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const topEmotion = sorted[0][0];

        switch (topEmotion) {
            case 'happy':
                happyCount++;
                break;
            case 'sad':
                sadCount++;
                break;
            case 'angry':
                angryCount++;
                break;
            case 'neutral':
                neutralCount++;
                break;
            case 'fearful':
                fearfulCount++;
                break;
            case 'disgusted':
                disgustedCount++;
                break;
            case 'surprised':
                surprisedCount++;
                break;
        } 
        if(happyCount==10){
            window.alert("ke be 10 happy");
            happyCount=0;
        }
        emotionText += `Emocion: ${topEmotion}<br>`;
     })
    },1000)
} 
 