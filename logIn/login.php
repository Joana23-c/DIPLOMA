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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];

    $stmt = $conn->prepare("SELECT id FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($user_id);
        $stmt->fetch();

        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
            header("Location: ../SISTEMI DIELLOR/INDEX.php");
        exit(); 
    } else {
        echo "User not found.";
    }

    $stmt->close();
}
$conn->close();
?>
