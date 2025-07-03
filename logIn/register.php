<?php
$host = 'localhost';
$db = 'diploma_prove';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $gjinia = $_POST['gender'];
    $mosha = (int)$_POST['age'];

    // Kontrollo nëse username ekziston më parë
    $check = $conn->prepare("SELECT id FROM user WHERE username = ?");
    $check->bind_param("s", $username);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "Username already taken. Please choose another.";
    } else {
        // Fut të dhënat vetëm nëse username është unik
        $stmt = $conn->prepare("INSERT INTO user (username, mosha, gjinia) VALUES (?, ?, ?)");
        $stmt->bind_param("sis", $username, $mosha, $gjinia);

        if ($stmt->execute()) {
            echo "Registration successful. <a href='login.html'>Login here</a>";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }

    $check->close();
}

$conn->close();
?>
