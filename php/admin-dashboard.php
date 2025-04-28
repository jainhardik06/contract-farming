<?php
// filepath: php/admin-dashboard.php
session_start();
if (!isset($_SESSION['userLoggedIn']) || $_SESSION['userRole'] !== 'admin') {
    header("Location: ../login.html");
    exit();
}
?>
<h1>Welcome, Admin <?php echo $_SESSION['userName']; ?>!</h1>
<a href="auth.php?logout=true">Logout</a>