<?php
// --- Server-side Session Check ---
session_start();
// Redirect to login if not logged in as a 'user'
if (!isset($_SESSION['userLoggedIn']) || $_SESSION['userRole'] !== 'user') {
    header("Location: ../login.html"); // Adjust path if needed
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard - AgriChain Secure</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css"> <!-- Adjust path if needed -->
    <!-- Add dashboard-specific styles if needed -->
    <!-- <link rel="stylesheet" href="css/dashboard-styles.css"> -->
    <style>
        /* Simple styling for contract cards if not in styles.css */
        #contractsList {
            margin-top: 20px;
            display: grid; /* Optional: use grid for layout */
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Example grid */
            gap: 20px;
        }
        .contract-card { /* Style added for the simplified script's output */
            border: 1px solid #ccc;
            padding: 15px;
            margin-bottom: 10px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
         .contract-card h4 {
             margin-top: 0;
             margin-bottom: 10px;
             color: #007bff;
         }
         .contract-card p {
             margin: 5px 0;
             font-size: 0.95em;
             word-wrap: break-word; /* Prevent long strings from overflowing */
         }
         .contract-card button {
             margin-top: 10px;
             padding: 8px 12px;
             background-color: #28a745; /* Green for complete */
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
             font-size: 0.9em;
         }
         .contract-card button:hover {
              background-color: #218838;
         }
        .completed { /* Style for completed cards */
             background-color: #e0ffe0 !important; /* Light green background */
             border-left: 5px solid #28a745; /* Green left border */
        }
        /* Ensure hidden class works */
        .hidden { display: none; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container navbar-container">
            <a href="../index.html" class="logo">AgriChain Secure</a> <!-- Adjust path if needed -->
            <div class="navbar-right">
                <!-- Display PHP Session Username -->
                <span id="welcomeUser" class="welcome-message">Welcome, <?php echo htmlspecialchars($_SESSION['userName']); ?>!</span>
                <!-- Connection Status (will be updated by script.js) -->
                <!-- <span id="connectionStatus" class="connection-status">Status: Disconnected</span> -->
                <button id="connectWallet" class="btn btn-nav">Connect Wallet</button>
                <button id="logoutButton" class="btn btn-nav btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <main class="dashboard-main container">

        <!-- Wallet Address Display -->
         <div class="wallet-display-area" style="margin-top: 20px; text-align: center; font-weight: bold;">
            <p id="walletAddress">Wallet: Not Connected</p>
        </div>

        <!-- DApp Content Area -->
        <div id="dappContent" class="dapp-content" > <!-- Removed hidden class, script doesn't manage this -->
            <section id="createContractSection" class="dashboard-section card">
                <h2><i class="fas fa-plus-circle icon-green"></i> Create New Contract</h2>
                <!-- Ensure the form has the correct ID -->
                <form id="contractForm">
                    <div class="form-group">
                        <label for="cropDetails">Crop Details:</label>
                        <input type="text" id="cropDetails" placeholder="e.g., Organic Wheat, 10 tons" required>
                    </div>
                    <div class="form-group">
                        <label for="buyerAddress">Buyer's Ethereum Address:</label>
                        <input type="text" id="buyerAddress" placeholder="0x..." required pattern="^0x[a-fA-F0-9]{40}$" title="Enter a valid Ethereum address">
                    </div>
                     <div class="form-group">
                        <label for="amount">Payment Amount (ETH):</label>
                        <input type="number" id="amount" placeholder="e.g., 1.5" step="any" min="0.000001" required> <!-- Min value added -->
                    </div>
                    <!-- Removed spinner elements as simplified script doesn't use them -->
                    <button type="submit" id="createContractBtn" class="btn btn-primary">
                        Create Contract
                    </button>
                    <!-- Removed status paragraph as simplified script uses alert() -->
                    <!-- <p id="createStatus" class="status-message hidden"></p> -->
                </form>
            </section>

            <section id="existingContractsSection" class="dashboard-section">
                <h2><i class="fas fa-list-alt icon-green"></i> Existing Contracts</h2>
                 <!-- Ensure the list div has the correct ID -->
                <div id="contractsList" class="contracts-grid">
                    <!-- Contracts will be dynamically added here by script.js -->
                    <p>Connect your wallet to view contracts.</p> <!-- Initial message -->
                </div>
                 <!-- Removed loading/error messages as simplified script manages this differently -->
                 <!-- <div id="loadingContracts" ...></div> -->
                 <!-- <p id="noContractsMessage" ...></p> -->
                 <!-- <p id="loadErrorContracts" ...></p> -->
            </section>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
             <p>© <span id="currentYearDash"><?php echo date("Y"); ?></span> AgriChain Secure. All rights reserved.</p>
        </div>
    </footer>

    <!-- Removed Transaction Status Modal as simplified script uses alert() -->
    <!-- <div id="txStatusModal" ...> ... </div> -->

    <!-- JS Includes -->
    <script src="https://cdn.jsdelivr.net/npm/web3@1.8.2/dist/web3.min.js"></script>
    <!-- Make sure this points to the SIMPLE script.js -->
    <script src="../js/script.js"></script> <!-- Adjust path if needed -->
    <!-- Removed <script src="js/auth.js"></script> -->

    <!-- Inline script for Logout Button and Footer Year (if needed) -->
    <script>
        // Logout Button Listener
        const logoutBtn = document.getElementById('logoutButton');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Redirect to the PHP logout handler
                window.location.href = '../php/auth.php?logout=true'; // Adjust path if needed
            });
        } else {
            console.error("Logout button with ID 'logoutButton' not found.");
        }

        // Footer year (optional, PHP already handles it)
        // document.addEventListener('DOMContentLoaded', () => {
        //     const currentYearDash = document.getElementById('currentYearDash');
        //     if(currentYearDash) currentYearDash.textContent = new Date().getFullYear();
        // });

         // NOTE: The simplified script.js handles its own initialization and event listeners on window load.
         // No need for checkAuth() or setupEventListeners() here.
    </script>
</body>
</html>