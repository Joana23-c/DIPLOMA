<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../../login.html");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jupiteri</title>
  <link rel="icon" type="image/x-icon" href="./images/jupiter.png">
  <link rel="stylesheet" href="./labirint.css">
</head>
<body>
    <a href="jupiterHyrje.php" id="quitBtn"><img src="./images/cross.png" ></a>

     <div id="view">
        <canvas id="mazeCanvas" class="border" height="1100" width="1100"></canvas>
    </div>

      <div id="Message-Container">
        <div id="message">
            <h1>Ti fitove!</h1>
            <p id="moves"></p>
            <button id="okBtn" onclick="replay()">Luaj Përsëri!</button>
            <a href="./jupiterHyrje.php">
                <button id="quitBtn">Ktheu!</button>
            </a>
        </div>
    </div>
    <canvas id="canvasface"></canvas>
    <div id="contanierface">
        <video id ="video-feed" height="560" width="720" autoplay></video>
    </div>
     <script src="../face-api-js-starter-main/public/face-api.min.js"></script>
  <script src="./labirint.js"></script>
</body>
</html>