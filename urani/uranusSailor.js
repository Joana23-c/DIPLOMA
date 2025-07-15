
   console.log(faceapi);
   
   let canvas;
    let canvasWidth=750;
    let canvasHeight=250;
   let ctx;

   let sailor;

    const frameWidth = 100;
    const frameHeight = 100;
    const numFrames = 5;
    let currentFrame = 0;

    let framex = 50;
let framey = canvasHeight - 66;



let frame = {
    x: framex,
    y: framey,
    width: frameWidth,
    height: frameHeight
};

const groundY = canvasHeight - 66;

let frameTimer = 0;
const frameInterval = 150; // ms
let lastFrameTime = 0;

let currentAnimation = "Walking"; // or "Attack" or scroll
let playedAttackOnce = false;
let x = 0;


let pengesaArr = [];
let pengesa1width = 40;
let pengesa2width = 69;
let pengesa3width = 70;
let pengesaheight = 80;
let pengesax = 700;
let pengesay = canvasHeight - pengesaheight;

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

let alien1;
let alien1width = 40;
let ailen1height = 40;
let alien2;
let pengesa4;


let isPaused = false;

let jumpSound = new Audio("./sounds/jump1.ogg");
let coinSound = new Audio("./sounds/coinsong.wav");
let gameOverSound = new Audio("./sounds/gameover.wav");
let win = new Audio("./sounds/win.wav");

let replayBtn;
let replayVisible = false;



window.onload = function() {

    replayBtn = document.getElementById("hidden");
        hideReplayBtn(replayVisible);
    document.addEventListener("keydown", movesailor);

    replayBtn.addEventListener("click", LuajPerseri);

    document.getElementById("pauseBtn").addEventListener("click", togglePause);
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("shpjegimBtn").addEventListener("click", shpjegime);
    document.getElementById("closeInfo1").addEventListener("click", () => {
        document.getElementById("info1").style.display = "none";
        togglePlay();
    });

    run();
     setTimeout(() => {
    canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');


    sailor = new Image();
    
    sailor.src = './images/Walking_KG_2.png';
    
    pengesa1img = new Image();
    pengesa1img.src = "./images/ice_rock1.png";

    pengesa2img = new Image();
    pengesa2img.src = "./images/snowy_rock1.png";

    pengesa3img = new Image();
    pengesa3img.src = "./images/snowy_rock2.png";

    goldcoin = new Image();
    goldcoin.src = "./images/goldCoin.png"

    alien1 = new Image();
    alien1.src = "./images/greenAlien1.png"

     alien2 = new Image();
     alien2.src = "./images/greenAline2.png"

     pengesa4 = new Image();
     pengesa4.src = "./images/ice_rock5.png"

    requestAnimationFrame(update);
      setInterval(placepengesa, 1000);
     },5000);

}

function update(timestamp) { 
     requestAnimationFrame(update);

       if (gameover) {
        replayVisible = true;
        hideReplayBtn(replayVisible);
        return;
    }
     if (isPaused) return;

       if (x == 1 && currentAnimation !== "Attack") {
        sailor.src = './images/Attack_KG_2.png';
        currentAnimation = "Attack";
         playedAttackOnce = false;
        currentFrame = 0;
    }
       if (x == 2 && currentAnimation !== "Scroll") {
        sailor.src = './images/Rolling_KG_1.png';
        currentAnimation = "Scroll";
         playedAttackOnce = false;
        currentFrame = 0;
    }


     ctx.clearRect(0, 0, canvas.width, canvas.height);

      velocityy += gravity; 

    frame.y += velocityy;
if (frame.y > framey) {
    frame.y = framey;
    velocityy = 0;
}

      // Use timestamp for smoother animation
    if (!lastFrameTime) lastFrameTime = timestamp;
    let deltaTime = timestamp - lastFrameTime;
    frameTimer += deltaTime;

     if (frameTimer >= frameInterval) {
        currentFrame = (currentFrame + 1);

        if (currentFrame >= numFrames) {
            currentFrame = 0;
            if (currentAnimation === "Attack" || currentAnimation === "Scroll" ) {
                playedAttackOnce = true;
            }
        }

        frameTimer = 0;
    }
    // Pasi kemi luajtur një herë të plotë "Attack"
    if (playedAttackOnce && (currentAnimation === "Attack" ||  currentAnimation === "Scroll")) {
        x = 0;
        sailor.src = './images/Walking_KG_2.png';
        currentAnimation = "Walking";
    } 

     ctx.drawImage(
        sailor,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        frame.x, frame.y,
        frameWidth, frameHeight
    );
      lastFrameTime = timestamp; 

        for (let i = 0; i < pengesaArr.length; i++) {
        let pengesa = pengesaArr[i];
        pengesa.x += velocityx;
         
        ctx.drawImage(pengesa.img, pengesa.x, pengesa.y, pengesa.width, pengesa.height);

        if(detectCollision(frame,pengesa)){
                if (pengesa.img == pengesa4) {
        if (currentAnimation !== "Scroll") {
            gameover = true;
            gameOverSound.currentTime = 0; 
                gameOverSound.play();
                replayVisible = true;
                hideReplayBtn(replayVisible);
        }}
            else if(pengesa.img != goldcoin && 
                 pengesa.img != alien1 &&
                  pengesa.img != alien2
                ){
                gameover= true;
                gameOverSound.currentTime = 0; 
                gameOverSound.play();
                replayVisible = true;
                hideReplayBtn(replayVisible);
            }else if(pengesa.img == goldcoin){ 
               coinSound.currentTime = 0; 
                    coinSound.play();    
            coins+=10;
             pengesaArr.splice(i, 1);
               i--;
            }else if(pengesa.img == alien1 || pengesa.img == alien2 ){
                if(currentAnimation === "Attack"){
                    coinSound.currentTime = 0; 
                    coinSound.play();   
                    coins+=5;
                     pengesaArr.splice(i, 1);
                     i--;
                     }else
                     { 
                        gameover = true;
                        gameOverSound.currentTime = 0; 
                        gameOverSound.play();
                        replayVisible = true;
                    }
            } 

        }

    ctx.fillStyle = "white";
    ctx.font = "20px courier";
    score++;
    ctx.fillText(score, 5, 20);
    /*x = 5: the horizontal position (5 pixels from the left edge).
y = 20: the vertical position (20 pixels from the top). */

    ctx.fillStyle = "white";
    ctx.font = "20px courier";
    ctx.fillText(coins, 700, 20); 


 }

//  if(coins == 20  || coins == 25){
//     velocityx = -5;
//  }
//   if(coins==55 || coins == 60){
//    velocityx = -6;
//  }

 if(coins == 30){//300
    ctx.fillStyle = "navy";
    ctx.font = "25px courier";
    ctx.fillText("Ti fitove !", 300, 125); 
    win.currentTime = 0; 
    win.play();
    gameover=true;
    console.log({
    coins,
    score,
    happy: allhappyCount,
    sad: allsadCount,
    disgusted: alldisgustedCount,
    angry: allangryCount,
    neutral: allneutralCount,
    surprised: allsurprisedCount
});
     saveGame();

     happyCount = 0;
     sadCount = 0;
     allhappyCount = 0;
     allsadCount = 0;
     allangryCount = 0;
     allneutralCount = 0;
     alldisgustedCount = 0;
     allsurprisedCount = 0;
    
 }
      
}

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
         pengesaArr.push(pengesa);
    } else if (placepengesachance > 0.70) {
        pengesa.img = pengesa2img;
        pengesa.width = pengesa3width;
         pengesa.height = pengesaheight;
          pengesaArr.push(pengesa);
        
    }  else if (placepengesachance > 0.50) {
        pengesa.img = alien1;
        pengesa.width = alien1width;
         pengesa.height = ailen1height; 
         pengesa.y=canvasHeight - 50;
          pengesaArr.push(pengesa);
        
    }else if(placepengesachance > 0.40){
        pengesa.img = alien2;
        pengesa.width = alien1width;
         pengesa.height = ailen1height; 
         pengesa.y=canvasHeight - 150;
          pengesaArr.push(pengesa);
    }else if (placepengesachance > 0.30) {
        pengesa.img = pengesa1img;
        pengesa.width = pengesa1width;
         pengesa.height = pengesaheight;
          pengesaArr.push(pengesa);
        
    }else if(placepengesachance > 0.20){
        pengesa.img = goldcoin;
        pengesa.width = goldcoinwidht;
        pengesa.height = goldcoinheigh;
         pengesaArr.push(pengesa);   
    }else if(placepengesachance > 0.10){
        pengesa.img = pengesa4;
        pengesa.width = pengesa2width+10;
        pengesa.height = pengesaheight-60;
         pengesaArr.push(pengesa);   
    }
    
    

    if (pengesaArr.length > 7) {
        pengesaArr.shift();
    }
}

     function movesailor(e){
         if(gameover) return;
    
     if (e.code == "Space") {
        x = 1;
        // console.log(x);
    }
    if (e.code == "ArrowUp" && frame.y == groundY) {
        velocityy = -11;
         jumpSound.currentTime = 0; 
        jumpSound.play();
    }
    if (e.code == "ArrowDown") {
        x=2;
        // console.log("2");
    }
 }

 function detectCollision(a, b) {
    return a.x+40 < b.x + b.width && 
           a.x + a.width > b.x+40 &&   
           a.y< b.y + b.height  &&  
           a.y + a.height> b.y+40  ; 
}

function togglePause() {
    isPaused = true;
    // console.log("pause");
    pengesaArr.length = 0;
}
function togglePlay() {
    isPaused = false;
    //  console.log("play");
    pengesaArr.length = 0;
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
    happyCount=0;
     sadCount=0;
    replayVisible = false;
    hideReplayBtn(replayVisible);
    for(let i=0;i<5;i++){
        pengesaArr.pop();
    }
    gameover=false;
   }

   function shpjegime(){
   const info1 = document.getElementById("info1"); 
 document.getElementById("shpjegimBtn").onclick = () => {
    // console.log("x");
   togglePause(); 
  info1.style.display = "block";
   
}
   document.getElementById("closeInfo1").onclick = () => {info1.style.display = "none";
    togglePlay();
   }
};


let happyCount = 0;
let sadCount = 0;
let allhappyCount = 0;
let allsadCount = 0;
let allangryCount = 0;
let allneutralCount = 0;
let alldisgustedCount = 0;
let allsurprisedCount = 0;


const run = async()=>{


    
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false,

    });
    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.ageGenderNet.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('../face-api-js-starter-main/public/models')
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
                allhappyCount++
                happyCount++;
                break;
            case 'sad':
                allsadCount++;
                sadCount++;
                break;
            case 'disgusted':
                alldisgustedCount++;
                break;
                case 'angry':
                allangryCount++;
                break;
            case 'neutral':
                allneutralCount++;
                break;
            case 'surprised':
                allsurprisedCount++;
                break;
        } 

        if(happyCount==10){
           velocityx = -5; 
           console.log("ke be 10 happy");
        }
        else if(happyCount==30){
           velocityx = -6; 
           console.log("ke be 30 happy");
            happyCount=0;
        }
        else if(sadCount==5 && velocityx!=-4){
           velocityx = -4; 
           console.log("ke be 5 sad");
            sadCount=0;
            happyCount=0;
        }
        // else if(fearfulCount==10){
        //     window.alert("10 fearefull");
        // }
        emotionText += `Emocion: ${topEmotion}<br>`;
     })
    },1000)
} 
 
function saveGame() {
    fetch('save_game_uran.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            coins: coins,
            score: score,
            happy: allhappyCount,
            sad: allsadCount,
            disgusted: alldisgustedCount,
            angry: allangryCount,
            neutral: allneutralCount,
            surprised: allsurprisedCount
        })
    })
    .then(response => response.text())
    .then(data => console.log("Save status:", data))
    .catch(error => console.error("Error saving game:", error));
}
