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
$data = date("Y-m-d H:i:s");

$difficulty = intval($_POST['difficulty']);
$levizje = intval($_POST['levizje']);
$happy = intval($_POST['happy']);
$sad = intval($_POST['sad']);
$disgusted = intval($_POST['disgusted']);
$angry = intval($_POST['angry']);
$neutral = intval($_POST['neutral']);
$surprised = intval($_POST['surprised']);

// Vendos game_id bazuar në difficulty
if ($difficulty === 10) {
    $game_id = 3;
} else if ($difficulty === 15) {
    $game_id = 4;
} else {
    $game_id = 3; // default nëse nuk është 10 ose 15
}

// Këtu po ruajme coins dhe score si NULL, nëse ke vlera vendose ti në POST dhe trajto si duhet
$coins = NULL;
$score = NULL;

// Insert in games_history
$stmt1 = $conn->prepare("INSERT INTO games_history (game_id, user_id, data, coins, score, levizje) VALUES (?, ?, ?, ?, ?, ?)");
$stmt1->bind_param("iisiii", $game_id, $user_id, $data, $coins, $score, $levizje);
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
