<?php
// filepath: php/user-dashboard.php
session_start();
if (!isset($_SESSION['userLoggedIn']) || $_SESSION['userRole'] !== 'user') {
    header("Location: ../login.html");
    exit();
}
?>
<h1>Welcome, <?php echo $_SESSION['userName']; ?>!</h1>
<a href="auth.php?logout=true">Logout</a>