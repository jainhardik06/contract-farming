<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// filepath: php/auth.php
session_start();
require 'db.php';

// Handle Signup
if (isset($_POST['signup'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $role = $_POST['role'];

    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password, $role]);
        $_SESSION['userLoggedIn'] = true;
        $_SESSION['userRole'] = $role;
        $_SESSION['userName'] = $name;
        header("Location: ../login.html");
        exit();
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}

// Handle Login
if (isset($_POST['login'])) {
    $email = $_POST['email']; // Get email from the form
    $password = $_POST['password']; // Get password from the form

    try {
        // Check if the email exists in the database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Login successful
            $_SESSION['userLoggedIn'] = true;
            $_SESSION['userRole'] = $user['role'];
            $_SESSION['userName'] = $user['name'];
            header("Location: ../" . ($user['role'] === 'admin' ? 'php/admin-dashboard.php' : 'php/user-dashboard.php'));
            exit();
        } else {
            // Invalid email or password
            echo "Invalid email or password.";
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: ../login.html");
    exit();
}
?>