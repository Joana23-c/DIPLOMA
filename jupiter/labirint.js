let moves = 0;
console.log(faceapi);
function rand(max) {
    return Math.floor(Math.random() * max);
  }
  
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
 
  function winMsg(moves) {
    moves=moves+1;
    console.log(moves);
    document.getElementById("moves").innerHTML = "Ti ke bërë " + moves + " lëvizje.";
    // toggleVisablity("Message-Container");  
    document.getElementById("Message-Container").style.visibility = "visible";
  }
  
  function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
      document.getElementById(id).style.visibility = "hidden";
    } else {
      document.getElementById(id).style.visibility = "visible";
    }
  }
  
  function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
    };
  
    this.map = function() {
      return mazeMap;
    };
    this.startCoord = function() {
      return startCoord;
    };
    this.endCoord = function() {
      return endCoord;
    };
  
    function genMap() {
      mazeMap = new Array(height);
      for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
          mazeMap[y][x] = {
            n: false,
            s: false,
            e: false,
            w: false,
            visited: false,
            priorPos: null
          };
        }
      }
    }
  
    function defineMaze() {
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = {
        x: 0,
        y: 0
      };
      var numCells = width * height;
      while (!isComp) {
        move = false;
        mazeMap[pos.x][pos.y].visited = true;
  
        if (numLoops >= maxLoops) {
          shuffle(dirs);
          maxLoops = Math.round(rand(height / 8));
          numLoops = 0;
        }
        numLoops++;
        for (index = 0; index < dirs.length; index++) {
          var direction = dirs[index];
          var nx = pos.x + modDir[direction].x;
          var ny = pos.y + modDir[direction].y;
  
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (!mazeMap[nx][ny].visited) {
              mazeMap[pos.x][pos.y][direction] = true;
              mazeMap[nx][ny][modDir[direction].o] = true;
              mazeMap[nx][ny].priorPos = pos;
              pos = {
                x: nx,
                y: ny
              };
              cellsVisited++;
              move = true;
              break;
            }
          }
        }
  
        if (!move) {
          pos = mazeMap[pos.x][pos.y].priorPos;
        }
        if (numCells == cellsVisited) {
          isComp = true;
        }
      }
    }
  
    function defineStartEnd() {
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
    }
  
    genMap();
    defineStartEnd();
    defineMaze();
  }
  
  function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;
  
    this.redrawMaze = function(size) {
      cellSize = size;
      ctx.lineWidth = cellSize / 50;
      drawMap();
      drawEndMethod();
    };
  
    function drawCell(xCord, yCord, cell) {
      var x = xCord * cellSize;
      var y = yCord * cellSize;
  
      if (cell.n == false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.s === false) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.e === false) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.w === false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
    }
  
    function drawMap() {
        ctx.strokeStyle = "lightgreen";
      for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
          drawCell(x, y, map[x][y]);
        }
      }
    }
  
    function drawEnd() {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      var coord = Maze.endCoord();
      ctx.drawImage(
        endSprite,
        2,
        2,
        endSprite.width,
        endSprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
    function clear() {
      var canvasSize = cellSize * map.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
  
    drawEndMethod = drawEnd;
    clear();
    drawMap();
    drawEndMethod();
  }
  
  function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    // var moves = 0;

    if (sprite != null) {
      drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
      x: maze.startCoord().x,
      y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;
  
    this.redrawPlayer = function(_cellsize) {
      cellSize = _cellsize;
      drawSpriteImg(cellCoords);
    };

    function drawSpriteImg(coord) {
      var offsetLeft = cellSize / 7;
      var offsetRight = cellSize / 4;
      ctx.drawImage(
        sprite,
        0,
        0,
        sprite.width,
        sprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
      if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
        onComplete(moves);
        player.unbindKeyDown();
      }
    }
  
    function removeSprite(coord) {
      var offsetLeft = cellSize / 7;
      var offsetRight = cellSize / 4;
      ctx.clearRect(
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
function check(e) {
  var cell = map[cellCoords.x][cellCoords.y];
  let canMove = false;
  let newCoords = { x: cellCoords.x, y: cellCoords.y };
  switch (e.keyCode) {
    case 37: // west
      if (cell.w == true) {
        canMove = true;
        newCoords = { x: cellCoords.x - 1, y: cellCoords.y };
      }
      break;
    case 38: // north
      if (cell.n == true) {
        canMove = true;
        newCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
      }
      break;
    case 39: // east
      if (cell.e == true) {
        canMove = true;
        newCoords = { x: cellCoords.x + 1, y: cellCoords.y };
      }
      break;
    case 40: // south
      if (cell.s == true) {
        canMove = true;
        newCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
      }
      break;
  }
  if (canMove) {
    removeSprite(cellCoords);
    cellCoords = newCoords;
    drawSprite(cellCoords);
    moves++;  // Rrit moves vetëm kur lëvizja bëhet
  }
}

  
    this.bindKeyDown = function() {
      window.addEventListener("keydown", check, false);
    };
  
let view = document.getElementById("view");

window.addEventListener("keydown", check, false);


this.unbindKeyDown = function() {
  window.removeEventListener("keydown", check, false);
};

  
    drawSprite(maze.startCoord());
  
    this.bindKeyDown();
  }
  
  var mazeCanvas = document.getElementById("mazeCanvas");
  var ctx = mazeCanvas.getContext("2d");
  var sprite;
  var endImg;
  var maze, draw, player;
  var cellSize;
  var difficulty=10;
  // sprite.src = 'media/sprite.png';
  
  window.onload = function() {
    run();
let view = document.getElementById("view");
let viewWidth = view.offsetWidth;
let viewHeight = view.offsetHeight;

    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
  
    //Load and edit sprites
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
      if(completeOne === true && completeTwo === true)
         {
          //  console.log("Runs");
           setTimeout(function(){
             makeMaze();
           }, 500);         
         }
    };
    sprite = new Image();
    sprite.src =
      "./images/key.png" +
      "?" +
      new Date().getTime();
    sprite.onload = function() {
      completeOne = true;
      // console.log(u plotesua 1);
      isComplete();
    };
  
    endImg = new Image();
    endImg.src = "./images/home.png"+
    "?" +
    new Date().getTime();
    endImg.onload = function() {
      completeTwo = true;
      // console.log(u plotesua 2);
      isComplete();
    };

    
  };
  
  window.onresize = function() {
  let view = document.getElementById("view");
let viewWidth = view.offsetWidth;
let viewHeight = view.offsetHeight;

    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null) {
      draw.redrawMaze(cellSize);
      player.redrawPlayer(cellSize);
    }
  };
  
  function makeMaze() {
    if (player != undefined) {
      player.unbindKeyDown();
      player = null;
    }
    var e = document.getElementById("diffSelect");
    // difficulty = 10;
    // difficulty = 15;
    // difficulty = 25;
    // difficulty = 35;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, endImg);
    player = new Player(maze, mazeCanvas, cellSize, winMsg, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
  }
//    function replay() {
//   document.getElementById("Message-Container").style.visibility = "hidden";
//   makeMaze();
// }
async function replay() {
  document.getElementById("Message-Container").style.visibility = "hidden";
  if(happyCount>sadCount){
    console.log(happyCount);
    console.log(sadCount);
        console.log({
    happy: allhappyCount,
    sad: allsadCount,
    disgusted: alldisgustedCount,
    angry: allangryCount,
    neutral: allneutralCount,
    surprised: allsurprisedCount
});
     saveGame();
      moves=0;
      difficulty=15
      
     happyCount = 0;
     sadCount = 0;
     allhappyCount = 0;
     allsadCount = 0;
     allangryCount = 0;
     allneutralCount = 0;
     alldisgustedCount = 0;
     allsurprisedCount = 0;
   
  }else{
     console.log(happyCount);
    console.log(sadCount);
     saveGame();
     moves=0;
     difficulty=10;

     happyCount = 0;
     sadCount = 0;
     allhappyCount = 0;
     allsadCount = 0;
     allangryCount = 0;
     allneutralCount = 0;
     alldisgustedCount = 0;
     allsurprisedCount = 0;
    

  }

  makeMaze();
}
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

        if(happyCount==40){
           console.log("ke be 40 happy");
        }
        emotionText += `Emocion: ${topEmotion}<br>`;
     })
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

