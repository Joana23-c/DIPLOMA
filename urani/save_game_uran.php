<?php
session_start();

$host = 'localhost';
$db = 'database';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];
$game_id = 2;
$data = date("Y-m-d H:i:s");

$coins = $_POST['coins'];
$score = $_POST['score'];
$happy = $_POST['happy'];
$sad = $_POST['sad'];
$disgusted = $_POST['disgusted'];
$angry = $_POST['angry'];
$neutral = $_POST['neutral'];
$surprised = $_POST['surprised'];

// Insert in games_history
$stmt1 = $conn->prepare("INSERT INTO games_history (game_id, user_id, data, coins, score, levizje) VALUES (?, ?, ?, ?, ?, NULL)");
$stmt1->bind_param("iisii", $game_id, $user_id, $data, $coins, $score);
$stmt1->execute();
$game_history_id = $stmt1->insert_id;
$stmt1->close();

// Insert in facial_expression_history
$stmt2 = $conn->prepare("INSERT INTO facial_expression_history (game_history_id, happy, sad, disgusted, angry, neutral, suprised) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt2->bind_param("iiiiiii", $game_history_id, $happy, $sad, $disgusted, $angry, $neutral, $surprised);
$stmt2->execute();
$stmt2->close();

$conn->close();
echo "Data saved successfully.";
?>
