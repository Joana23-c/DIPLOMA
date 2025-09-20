<?php
$host = 'localhost';
$db = 'database';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Lidhja deshtoi:" . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username']);
    $gjinia = $_POST['gender'];
    $mosha = (int)$_POST['age'];

    $check = $conn->prepare("SELECT id FROM user WHERE username = ?");
    $check->bind_param("s", $username);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "Username ekziston. Ju lutem zgjidhni nje username tjeter.";
    } else {
        $stmt = $conn->prepare("INSERT INTO user (username, mosha, gjinia) VALUES (?, ?, ?)");
        $stmt->bind_param("sis", $username, $mosha, $gjinia);

        if ($stmt->execute()) {
            echo "Regjistimi u krye me sukses. <a href='login.html'>Login here</a>";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }

    $check->close();
}

$conn->close();
?>
