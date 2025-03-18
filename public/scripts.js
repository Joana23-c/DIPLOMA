
console.log(faceapi)
let video = document.getElementById("video-feed");
let parag = document.getElementById("paragraf");

// if (video.style.display === "none") {
//     parag.style.marginTop = "800px";
// };

    let expressionsArray = [];
    let happy =0;
    let sad =0;
    let neutral = 0;
    let disgusted = 0;
    let angry =0;
const run = async()=>{
    
    //loading the models is going to use await
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false,

    });
    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream
    //we need to load our models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]);

    // const canvas = document.getElementById('canvas')
    // canvas.style.left = videoFeedEl.offsetLeft
    // canvas.style.right = videoFeedEl.offsetRight
    // canvas.style.top = videoFeedEl.offsetTop
    // canvas.height = videoFeedEl.videoHeight
    // canvas.width = videoFeedEl.videoWidth
    const canvas = document.getElementById('canvas');
    const updateCanvasDimensions = () => {
        canvas.style.left = `${videoFeedEl.offsetLeft}px`;
        canvas.style.top = `${videoFeedEl.offsetTop}px`;
        canvas.height = videoFeedEl.videoHeight;
        canvas.width = videoFeedEl.videoWidth;
    };

    // Initial canvas dimensions setup
    updateCanvasDimensions();

    // Update canvas dimensions on window resize
    window.addEventListener('resize', updateCanvasDimensions);
    

    //facial detection with points
    setInterval(async()=>{
        //get the vioeo feed and it to detectAllFaces method
        let faceAIData = await faceapi.detectAllFaces(videoFeedEl)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();
        console.log(faceAIData)


        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);
        faceapi.draw.drawDetections(canvas,faceAIData)
        // faceapi.draw.drawFaceLandmarks(canvas,faceAIData)
        faceapi.draw.drawFaceExpressions(canvas,faceAIData)


// Loop through faceAIData and extract expressions
faceAIData.forEach((detection) => {
    const expressions = detection.expressions;  // Contains expressions like "happy", "sad"
    
    // Find the expression with the highest score (emotion with the most confidence)
    let dominantExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
    
    // Store the dominant expression in the array
    expressionsArray.push(dominantExpression);

    switch (dominantExpression){
        case "happy" :  
                       happy++;
                        break;
        case "sad" :
                       sad++;
                       break;
        case "angry": 
                       angry++;
                       break;
        case "disgusted":
            disgusted++;
            break;
        case "neutral":
            neutral++;
            break;
        default:
            console.log("ndjenja nuk dihet");
                    
    }
});

if(neutral == 15)
    window.alert("jan be 15 neutral");


         faceAIData.forEach(face => {
             const{age, gender, genderProbability} = face
             const genderText = `${gender} - ${Math.round(genderProbability*100)/100*100}`
         const ageText =`${Math.round(age)} vjec`
        const textField = new faceapi.draw.DrawTextField(
            [genderText, ageText],  // Text to display
             face.detection.box.topRight // Position
         )
         textField.draw(canvas)
     })
     let para = document.getElementById("paragraf")
para.textContent =  expressionsArray.join(" , ");

    },200)

}

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ];
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let scoreX = 0; // Pikët e lojtarit X
    let scoreO = 0; // Pikët e lojtarit O
    const maxScore = 3; // Pikët maksimale për të fituar lojën
    const lojtare2 = confirm("A dëshironi të luani me një lojtar tjetër?\nKlikoni OK për lojtar tjetër ose Cancel për të luajtur me kompjuterin.");
    let player1 = "X";
    let player2 = "O";
    if (lojtare2) {
    alert("Keni zgjedhur të luani me një lojtar tjetër!");
    player1 = window.prompt("Vendosni emrin e Player 1", "Player 1") ||
    "Player 1";
    player2 = window.prompt("Vendosni emrin e Player 2", "Player 2") ||
    "Player 2";
    document.getElementById("state1").textContent = `${player1}: 0`;
    document.getElementById("state2").textContent = `${player2}: 0`;
    } else {
    alert("Keni zgjedhur të luani me kompjuterin!");
    
    document.getElementById("state1").textContent = `${player1}: 0`;
    document.getElementById("state2").textContent = `Kompjuteri: 0`;
    }
    run();
    document.getElementById("reset").addEventListener("click", fullReset);
    document.querySelectorAll(".cell").forEach(cell =>
    cell.addEventListener("click", handleCellClick));

    function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute("data-index");
    if (board[index] !== "" || !gameActive) return;
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "blue" : "red";
    if (checkWin()) {
    if (currentPlayer === "X") {
    scoreX++;
    document.getElementById("state1").textContent = `${player1}:
    ${scoreX}`;
    } else {
    scoreO++;
    document.getElementById("state2").textContent = `${player2}:
    ${scoreO}`;
    }
    document.getElementById("status").textContent = `Lojtari
    ${currentPlayer === "X" ? player1 : player2} fitoi lojën!`;
    if (scoreX === maxScore || scoreO === maxScore) {
    endGame();
    } else {
    setTimeout(resetBoard, 1000);
    }
    return;
    }
    if (board.every(cell => cell !== "")) {
    document.getElementById("status").textContent = "Barazim!";
    setTimeout(resetBoard, 1000);
    return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").textContent = lojtare2
    ? `Rradha e lojtarit: ${currentPlayer === "X" ? player1 : player2}`
    : `Rradha e lojtarit: ${currentPlayer}`;
    if (!lojtare2 && currentPlayer === "O") {
    setTimeout(makeComputerMove, 500);
    }
    }
    function checkWin() {
    return winConditions.some(condition =>
    condition.every(index => board[index] === currentPlayer)
    );
    }
    function makeComputerMove() {
    if (!gameActive) return;
    let available = board.map((cell, idx) => cell === "" ? idx :
    null).filter(idx => idx !== null);
    let randomIndex = available[Math.floor(Math.random() * available.length)];
    board[randomIndex] = "O";
    document.querySelector(`[data-index="${randomIndex}"]`).textContent = "O";
    document.querySelector(`[data-index="${randomIndex}"]`).style.color =
    "red";
    if (checkWin()) {
    scoreO++;
    document.getElementById("state2").textContent = `Kompjuteri:
    ${scoreO}`;
    document.getElementById("status").textContent = "Kompjuteri fitoi lojën!";
    if (scoreO === maxScore) {
    endGame();
    } else {
    setTimeout(resetBoard, 1000);
    }
    return;
    }
    if (board.every(cell => cell !== "")) {
    document.getElementById("status").textContent = "Barazim!";
    setTimeout(resetBoard, 1000);
    return;
    }
    currentPlayer = "X";
    document.getElementById("status").textContent = lojtare2
    ? `Rradha e lojtarit: ${player1}`
    : `Rradha e lojtarit: ${currentPlayer}`;
    }
    function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.style.color = "black";
    });
    document.getElementById("status").textContent = lojtare2
    ? `Rradha e lojtarit: ${player1}`
    : `Rradha e lojtarit: ${currentPlayer}`;
    }
    function endGame() {
    gameActive = false;
    document.getElementById("status").textContent = `Lojtari ${scoreX ===
    maxScore ? player1 : (lojtare2 ? player2 : "Kompjuteri")} fitoi lojen!Deshiron
    te luash perseri?`;
    document.getElementById("reset").disabled = false; // Butoni bëhet i
    aksesueshëm
    }
    function fullReset() {
    resetBoard();
    scoreX = 0;
    scoreO = 0;
    document.getElementById("reset").disabled = true;
    document.getElementById("state1").textContent = lojtare2
    ? `${player1}: ${scoreX}`
    : `${player1}: ${scoreX}`;
    document.getElementById("state2").textContent = lojtare2
    ? `${player2}: ${scoreO}`
    : `Kompjuteri: ${scoreO}`;
    document.getElementById("status").textContent = lojtare2
    ? `Rradha e lojtarit: ${player1}`
    : `Rradha e lojtarit: ${currentPlayer}`;
    }
    
//run()


