<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    // Nuk lejohet hyrja pa login
    header("Location: ../login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Solar System</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="sun">
      <a href="#"><img src="./images/sun.png" alt="Sun"></a>
    </div>
<div class="mercury">
  <a href="#">
    <img src="./images/mercury.png" alt="Mercury">
  </a>
</div>
    <div class="venus">
      <a href="#"><img src="./images/venus.png" alt="Venus"></a>
    </div>
    <div class="earth">
      <a href="#"><img src="./images/earth.png" alt="Earth"></a>
      <div class="moon">
        <a href="#"><img src="./images/moon.png" alt="Moon"></a>
      </div>
    </div>
    <div class="mars" >
      <a href="../mars/MarsSailorGirl.php"><img src="./images/marsx.png" alt="Mars"></a>
    </div>
    <div class="jupiter">
      <a href="../jupiter/jupiterHyrje.php"><img src="./images/jupiter.png" alt="Jupiter"></a>
    </div>
    <div class="saturn">
      <a href="#"><img src="./images/saturn.png" alt="Saturn"></a>
    </div>
    <div class="uranus">
      <a href="../urani/uranusHyrje.php"><img src="./images/uranus.png" alt="Uranus"></a>
    </div>
    <div class="neptune">
      <a href="#"><img src="./images/neptune.png" alt="Neptune"></a>
    </div>
    <div class="pluto">
      <a href="#"><img src="./images/pluto.png" alt="Pluto"></a>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
