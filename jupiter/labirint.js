console.log(faceapi);

let mazeMap = [];
let startCoord = null;
let endCoord = null;
let playerX = 0;
let playerY = 0;
let hasWon = false;
let moves = 0;
let cellSize;
let difficulty = 10;
let sprite = new Image();
sprite.src ="./images/key.png";
let endImg = new Image();
endImg.src = "./images/home.png";
// ctx = document.getElementById("mazeCanvas").getContext("2d")

window.onload = function() {
  run();
  // let view = document.getElementById("view");
  // let viewWidth = view.offsetWidth;
  // let viewHeight = view.offsetHeight;

  //   if (viewHeight < viewWidth) {
  //     ctx.canvas.width = viewHeight - viewHeight / 100;
  //     ctx.canvas.height = viewHeight - viewHeight / 100;
  //   } else {
  //     ctx.canvas.width = viewWidth - viewWidth / 100;
  //     ctx.canvas.height = viewWidth - viewWidth / 100;
  //   }
  makeMaze();      
};
  
function rand(max){ 
  return Math.floor(Math.random()*max); 
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function createMaze(width,height){
  mazeMap = new Array(height);
  for(let x=0;x<height;x++){
    mazeMap[x] = new Array(width);
    for(let y=0;y<width;y++){
      mazeMap[x][y] = {
         n:false,
         s:false,
         e:false,
         w:false,
         visited:false, 
         priorPos:null };
    }
  }
   switch (rand(4)) {
        case 0:
          startCoord = {
            x: 0,
            y: 0
          };
          endCoord = {
            x: height - 1,
            y: width - 1
          };
          break;
        case 1:
          startCoord = {
            x: 0,
            y: width - 1
          };
          endCoord = {
            x: height - 1,
            y: 0
          };
          break;
        case 2:
          startCoord = {
            x: height - 1,
            y: 0
          };
          endCoord = {
            x: 0,
            y: width - 1
          };
          break;
        case 3:
          startCoord = {
            x: height - 1,
            y: width - 1
          };
          endCoord = {
            x: 0,
            y: 0
          };
          break;
      }

  let dirs = ["n","s","e","w"];
  let modDir = {
    n:{x:0 , y:-1, o:"s"}, 
    s:{x:0, y:1, o:"n"},
    e:{x:1, y:0, o:"w"},
    w:{x:-1, y:0, o:"e"}
  };
  let pos = {
    x:0,
    y:0
  };
  let cellsVisited = 1;
  let numCells = width*height;
  let numLoops=0, maxLoops=0;
  let isComp=false;

  while(!isComp){
    mazeMap[pos.x][pos.y].visited=true;
    let move=false;
    if(numLoops>=maxLoops){
      shuffle(dirs);
      maxLoops=rand(height/8);
      numLoops=0;
    }
    numLoops++;
    for(let i=0;i<dirs.length;i++){
      let d=dirs[i];
      let nx=pos.x+modDir[d].x;
      let ny=pos.y+modDir[d].y;
      if(nx>=0 && ny>=0 && nx<width && ny<height && !mazeMap[nx][ny].visited){
        mazeMap[pos.x][pos.y][d]=true;
        mazeMap[nx][ny][modDir[d].o]=true;
        mazeMap[nx][ny].priorPos={
          x:pos.x,
          y:pos.y
        };
        pos={x:nx,y:ny};
        cellsVisited++;
        move=true;
        break;
      }
    }
    if(!move) pos=mazeMap[pos.x][pos.y].priorPos;
    if(cellsVisited===numCells) isComp=true;
  }
}


function drawMaze(ctx){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.lineWidth=cellSize/40;
  ctx.strokeStyle="lightgreen";
  for(let x=0;x<mazeMap.length;x++){
    for(let y=0;y<mazeMap[x].length;y++){
      let c=mazeMap[x][y];
      let px=x*cellSize, py=y*cellSize;
      if(!c.n){ 
        ctx.beginPath();
        ctx.moveTo(px,py);
        ctx.lineTo(px+cellSize,py); 
        ctx.stroke();
     }
      if(!c.s){ 
        ctx.beginPath();
         ctx.moveTo(px,py+cellSize); 
         ctx.lineTo(px+cellSize,py+cellSize); 
         ctx.stroke(); 
        }
      if(!c.e){ 
        ctx.beginPath();
        ctx.moveTo(px+cellSize,py); 
        ctx.lineTo(px+cellSize,py+cellSize); 
        ctx.stroke(); }
      if(!c.w){
        ctx.beginPath();
        ctx.moveTo(px,py); 
        ctx.lineTo(px,py+cellSize);
        ctx.stroke(); 
        }
    }
  }

if(endCoord){
    let offsetLeft = cellSize/50, offsetRight = cellSize/25;
    ctx.drawImage(
      endImg, 2,2,endImg.width,endImg.height,
      endCoord.x*cellSize + offsetLeft, // X
      endCoord.y*cellSize + offsetLeft, // Y
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
}


function drawPlayer(ctx){
  let offsetLeft=cellSize/7, 
  offsetRight=cellSize/4;
  ctx.drawImage(
    sprite,
    0,0,
    sprite.width,sprite.height,
    playerX*cellSize+offsetLeft, // X
    playerY*cellSize+offsetLeft, // Y
    cellSize-offsetRight,
    cellSize-offsetRight);
  
 if(endCoord && !hasWon && playerX === endCoord.x && playerY === endCoord.y){
    hasWon = true;
    winMsg(moves);
}
}

function removePlayer(ctx){
  let offsetLeft=cellSize/7, offsetRight=cellSize/4;
  ctx.clearRect(playerX*cellSize+offsetLeft, playerY*cellSize+offsetLeft, cellSize-offsetRight, cellSize-offsetRight);
}


function move(dx,dy){
  let cell = mazeMap[playerX][playerY];
  let canMove=false;
   let nx=playerX, ny=playerY; 
  if(dx===-1 && cell.w) { canMove=true; nx=playerX-1; }
  if(dx===1 && cell.e)  { canMove=true; nx=playerX+1; }
  if(dy===-1 && cell.n) { canMove=true; ny=playerY-1; }
  if(dy===1 && cell.s)  { canMove=true; ny=playerY+1; }


  if(canMove){
    let ctx = document.getElementById("mazeCanvas").getContext("2d");
    removePlayer(ctx);
    playerX=nx; 
    playerY=ny;
    moves++;
    drawPlayer(ctx);
  }
}

function winMsg(moves){
  document.getElementById("Message-Container").style.display="block";
  document.getElementById("moves").innerHTML="Ti ke bërë "+moves+" lëvizje.";
    console.log({
    levizje : moves,
    happy: allhappyCount,
    sad: allsadCount,
    disgusted: alldisgustedCount,
    angry: allangryCount,
    neutral: allneutralCount,
    surprised: allsurprisedCount
});
  saveGame();
}


function replay(){
  document.getElementById("Message-Container").style.display="none";
  if(happyCount>sadCount) 
    difficulty=15; 
  else 
    difficulty=10;
  moves=0;
  happyCount=0;
  sadCount=0;
  allhappyCount=0;
  allsadCount=0;
  allangryCount=0;
  allneutralCount=0;
  alldisgustedCount=0;
  allsurprisedCount=0;
  makeMaze();
}



function makeMaze(){
  createMaze(difficulty,difficulty);
  playerX=startCoord.x; playerY=startCoord.y; hasWon=false; moves=0;
  let ctx = document.getElementById("mazeCanvas").getContext("2d");
  cellSize=document.getElementById("mazeCanvas").width/difficulty;
  drawMaze(ctx);
  drawPlayer(ctx);
}
window.addEventListener("keydown", function(e) {
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)){
    e.preventDefault();
  }
});


window.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp") move(0,-1);
  if(e.key==="ArrowDown") move(0,1);
  if(e.key==="ArrowLeft") move(-1,0);
  if(e.key==="ArrowRight") move(1,0);
});


function resizeCanvas(){
  let canvas=document.getElementById("mazeCanvas");
  let size=Math.min(window.innerWidth,window.innerHeight)*0.9;
  canvas.width=size; canvas.height=size;
  cellSize=size/difficulty;
//   makeMaze();
  let ctx = canvas.getContext("2d");
  drawMaze(ctx);
  drawPlayer(ctx);
}
window.onresize=resizeCanvas;
resizeCanvas();

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
        let faceAIData = await faceapi.detectSingleFace(videoFeedEl)
    .withFaceLandmarks()
    .withFaceDescriptor()
    .withAgeAndGender()
    .withFaceExpressions();
     console.log(faceAIData)
     
     
     if (!faceAIData) {
      console.log("Nuk eshte dedektuar asnje fytyre");
      return;
    }
    
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
     faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);
     
      //  faceapi.draw.drawDetections(canvas, faceAIData);
      //  faceapi.draw.drawFaceLandmarks(canvas, faceAIData);
      //  faceapi.draw.drawFaceExpressions(canvas, faceAIData);
     const expressions = faceAIData.expressions;
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

        if(happyCount==40){
           console.log("ke be 40 happy");
        }
    },1000)
} 
function saveGame() {
  return fetch('save_game_jupiter.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      levizje: moves,
      difficulty: difficulty,
      happy: allhappyCount,
      sad: allsadCount,
      disgusted: alldisgustedCount,
      angry: allangryCount,
      neutral: allneutralCount,
      surprised: allsurprisedCount
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log("Save status:", data);
    return data;
  })
  .catch(error => console.error("Error saving game:", error));
}

