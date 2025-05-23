<?php
session_start();
if (!isset($_SESSION['userLoggedIn']) || $_SESSION['userRole'] !== 'admin') {
    header("Location: ../login.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AgriChain Secure</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/admin-styles.css"> <!-- New stylesheet for admin -->
</head>
<body>
    <nav class="navbar">
        <div class="container navbar-container">
            <a href="../index.html" class="logo">AgriChain Secure - Admin</a>
            <div class="navbar-right">
                 <span id="welcomeUser" class="welcome-message">Welcome, Admin!</span>
                 <button id="logoutButton" class="btn btn-nav btn-logout">
                     <i class="fas fa-sign-out-alt"></i> Logout
                 </button>
            </div>
        </div>
    </nav>

    <main class="admin-main container">
        <h1 class="admin-title animate-fade-in-up">Admin Control Panel</h1>

        <!-- Stats Cards -->
        <section class="admin-stats-grid animate-fade-in-up delay-1">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-value">150</div> <!-- Placeholder -->
                <div class="stat-label">Total Users</div>
            </div>
             <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-file-signature"></i></div>
                <div class="stat-value">320</div> <!-- Placeholder -->
                <div class="stat-label">Active Contracts</div>
            </div>
             <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-check-double"></i></div>
                <div class="stat-value">185</div> <!-- Placeholder -->
                <div class="stat-label">Completed Contracts</div>
            </div>
            <div class="stat-card">
                 <div class="stat-icon"><i class="fas fa-user-shield"></i></div>
                <div class="stat-value">5</div> <!-- Placeholder -->
                <div class="stat-label">Admin Accounts</div>
            </div>
        </section>

        <!-- User Management Table (Simulated) -->
        <section class="admin-section animate-fade-in-up delay-2">
            <h2 class="admin-section-title"><i class="fas fa-tasks"></i> Manage Users</h2>
            <div class="admin-table-container">
                <table class="admin-user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userList">
                        <!-- Simulated User Data - Replace with dynamic data -->
                        <tr>
                            <td>Hardik Jain</td>
                            <td>hardik@example.com</td>
                            <td><span class="role-badge role-admin">Admin</span></td>
                            <td>2023-10-01</td>
                            <td>
                                <button class="btn-action btn-edit"><i class="fas fa-edit"></i></button>
                                <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                         <tr>
                            <td>Alice Farmer</td>
                            <td>alice@farm.co</td>
                             <td><span class="role-badge role-user">User</span></td>
                            <td>2023-10-15</td>
                             <td>
                                <button class="btn-action btn-edit"><i class="fas fa-edit"></i></button>
                                <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                         <tr>
                            <td>Bob Buyer</td>
                            <td>bob@buyer.inc</td>
                             <td><span class="role-badge role-user">User</span></td>
                            <td>2023-11-01</td>
                             <td>
                                <button class="btn-action btn-edit"><i class="fas fa-edit"></i></button>
                                <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <!-- Add more rows as needed -->
                    </tbody>
                </table>
            </div>
             <p class="admin-note">Note: User management actions are currently disabled (frontend simulation).</p>
        </section>

        <!-- Link to Mongo Express -->
         <section class="admin-section animate-fade-in-up delay-3">
             <h2 class="admin-section-title"><i class="fas fa-database"></i> Database Management</h2>
             <p>For direct data management, use the Mongo-Express interface.</p>
             <a href="http://localhost:8081" target="_blank" class="btn btn-secondary">
                 <i class="fas fa-external-link-alt"></i> Open Mongo-Express
             </a>
             <p class="admin-note">(Ensure Mongo-Express is running and accessible)</p>
         </section>


    </main>

    <footer class="site-footer">
        <div class="container">
             <p>© <span id="currentYearAdmin"></span> AgriChain Secure. All rights reserved.</p>
        </div>
    </footer>

    <!-- <script src="js/auth.js"></script> -->
     scrip
     <script>
        const logoutBtn = document.getElementById('logoutButton');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Redirect to the PHP logout handler
                window.location.href = '../php/auth.php?logout=true'; // Adjust path if needed
            });
        } else {
            console.error("Logout button with ID 'logoutButton' not found.");
        }

        document.addEventListener('DOMContentLoaded', () => {
            checkAuth('admin'); // Check if user is logged in, requires 'admin' role

            const currentYearAdmin = document.getElementById('currentYearAdmin');
            if(currentYearAdmin) currentYearAdmin.textContent = new Date().getFullYear();

            // Add dummy event listeners for action buttons to show they are disabled
             document.querySelectorAll('.btn-action').forEach(button => {
                 button.addEventListener('click', (e) => {
                     e.preventDefault();
                     alert('User management actions are disabled in this frontend simulation.');
                 });
             });
        });
    </script>
</body>
</html>
