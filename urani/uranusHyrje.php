<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Planeti Uran</title>
  <link rel="icon" href="./images/uranus.png">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  
  <style>
    @media (min-width: 910px) {
      body, html {
        overflow: hidden;
      }
    }
    body{
      width: 100vw; 
      height: 100vh;
      background-image: url("./images/Blue_Nebula_08-1024x1024.png");
      font-family:'press Start 2P', Courier, monospace;
      color: #32CD32;
    }
    h1{
      text-align:center;
      font-size:30px;
      text-shadow:5px 5px 10px rgba(44, 162, 33, 0.975);
      margin-top: 40px;
    }
    
    #sailordiv {
      margin-top: 20px;
      margin-left: 5%;
      margin-right: 5%;
      height: 70vh;
      width: 35%;
      background-image: url("./images/image.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      display: flex;
      justify-content: center;  
      align-items: center;      
      transform : scale(1.7);
      float: left;
    }
    
    #sailor {
      padding-right: 11%;  
    } 
    
    @media (max-width: 880px) {
      #sailor {
        transform: scale(0.5);
        padding-right: 20%;  
      }
    }
    
    #mission p{
      display: flex;
      margin-top:80px;
      margin-left:10%;
      margin-right:3%;
      background-color: rgba(19, 18, 18, 0.811);
      font-size:13px;
      line-height: 1.7;
      padding: 15px;
      box-shadow: 0 4px 6px rgb(0, 0, 0);
     }
      
     #mission button{
      display: block;
      margin: 20px auto 0 auto;
      text-align: center;
      color: #32CD32;
      background-color: rgb(19, 18, 18);
      font-family: "press Start 2P";
      font-style: normal;
      border:none;
      box-shadow: 5px 5px 15px #32CD32; 
      cursor: pointer;
      overflow: hidden;
      transform: scale(1.2);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1.2);}
      50% {transform: scale(1.5);}
      100% {transform: scale(1.2);}
    }
  </style>
</head>
<body>
    <h1>Mirë se erdhët në planetin Uran !</h1>
    <div id="sailordiv">
        <canvas id="sailor"width="64" height="64"></canvas>
    </div>
    <div id="mission">
        <p>Misioni i planetit të akullt !<br><br> Misioni i Sailor Girl  për të shpëtuar Sistemin Diellor nga alienet e galaktikës  M33  që duan të shkatërrojnë njerëzimin vazhdon.<br><br> Tashmë ajo gjendet në planetin Uran me synimin për te eliminuar alienët që kanë zbarkuar këtu, dhe me qëllimin për të mbledhur thesarin  300 coins për të pasur mundësi të plotësojë misionin e saj heroik.<br><br>Këshillohet që para se të niset në mision Silor Girl duhet të ketë të gjitha njohuritë e nevojshme për terrenin dhe mjedisin që do të përballet.</p>
        <button onclick="location.href='uranusSailor.php'">Luaj</button>
        <button onclick="location.href='uranusInfo1.html'">Zbulo terrenin</button>
        <button onclick="location.href='../SISTEMI DIELLOR/INDEX.php'">Kthehu</button>
    </div>
</body>
<script>
  const canvas = document.getElementById('sailor');
  const ctx = canvas.getContext('2d');

  const sailor = new Image();
  sailor.src = "./images/Power_Up_KG_1.png"; 

  const frameWidth = 100;
  const frameHeight = 100;
  const numFrames = 6;
  let currentFrame = 0;

  sailor.onload = function () {
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        sailor,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        0, 0,
        frameWidth, frameHeight
      );

      currentFrame = (currentFrame + 1) % numFrames;
    }, 150);
  };
</script>
</html>