# Contract Farming DApp on Ethereum 🚜

A decentralized application (DApp) built on the Ethereum blockchain (Sepolia Testnet) to facilitate transparent, secure, and efficient contract farming agreements between farmers and buyers using smart contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional: Choose your license -->

---

## Table of Contents

*   [Overview](#overview)
*   [Screenshots](#screenshots)
*   [Key Features](#key-features-✨)
*   [Technology Stack](#technology-stack-⚙️)
*   [Prerequisites](#prerequisites-📋)
*   [Getting Started](#getting-started-🚀)
    *   [Installation](#installation)
    *   [Running the DApp Locally](#running-the-dapp-locally)
*   [Usage Guide](#usage-guide-📖)
*   [Smart Contract Details](#smart-contract-details-📄)
*   [Future Enhancements](#future-enhancements-💡)
*   [Contributing](#contributing-🤝)
*   [License](#license-⚖️)
*   [Contact](#contact-📧)

---

## Overview

This project aims to revolutionize traditional contract farming by leveraging the power of blockchain technology. By using smart contracts deployed on the Ethereum network (specifically the Sepolia testnet for this version), we create a trustless environment where agreements between farmers and buyers are recorded immutably and transparently.

The DApp allows farmers to propose contracts detailing the crop, payment amount, and the intended buyer. Buyers can then view these contracts and, upon fulfillment of the agreement (e.g., delivery of produce), mark the contract as complete directly on the blockchain. This eliminates intermediaries, reduces potential disputes, and increases efficiency in the agricultural supply chain.

---

## Screenshots

<!-- Add screenshots of your DApp here! -->
<!-- Replace these lines with actual image links or embedded images -->

*   **Homepage:**
    `[Screenshot of the Landing Page/Homepage]`

*   **Dashboard (Connect Prompt):**
    `[Screenshot of the Dashboard before connecting MetaMask]`

*   **Dashboard (Connected & Contract Creation):**
    `[Screenshot of the Dashboard after connecting, showing the create form]`

*   **Dashboard (Existing Contracts):**
    `[Screenshot showing the list/grid of existing contract cards]`

*   **Transaction Confirmation (MetaMask):**
    `[Optional: Screenshot of a MetaMask transaction confirmation popup]`

*   **Completed Contract View:**
    `[Screenshot showing how a completed contract looks in the list]`

---

## Key Features ✨

*   **Smart Contract Backend:** Core logic and data storage managed by a Solidity smart contract deployed on the Sepolia Testnet.
*   **Decentralized Contract Creation:** Farmers can initiate new farming agreements by specifying crop details, payment amount (in ETH), and the buyer's Ethereum address.
*   **Transparent Contract Viewing:** All users can view the details of existing contracts (farmer, buyer, crop, amount, completion status) fetched directly from the blockchain.
*   **Contract Completion:** Buyers associated with a contract can mark it as completed, updating its status on the blockchain (requires a transaction).
*   **MetaMask Integration:** Seamless connection to MetaMask for wallet authentication, account management, and signing blockchain transactions.
*   **Sepolia Testnet Focus:** Designed for interaction with the Sepolia test network, allowing for testing and demonstration without real funds.
*   **User-Friendly Interface:** A clean web interface (`index.html`, `dashboard.html`) for easy interaction with the smart contract functionalities.

---

## Technology Stack ⚙️

*   **Blockchain:** Ethereum
*   **Smart Contract Language:** Solidity
*   **Test Network:** Sepolia Testnet
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
*   **Web3 Library:** Web3.js (v1.8.x or similar)
*   **Wallet Integration:** MetaMask
*   **Development Node/Provider (Optional):** Ganache, Hardhat (for local development/testing), Infura/Alchemy (as potential fallback provider)
*   **Code Editor:** VS Code (or your preferred editor)
*   **Version Control:** Git & GitHub

---

## Prerequisites 📋

Before you begin, ensure you have the following installed and set up:

1.  **Node.js and npm:** Required for running a local server. Download from [nodejs.org](https://nodejs.org/).
2.  **MetaMask:** A web browser extension for interacting with the Ethereum blockchain. Download from [metamask.io](https://metamask.io/).
3.  **Sepolia Testnet Account:** Configure MetaMask to use the Sepolia Testnet and obtain some free Sepolia ETH from a faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com/), [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)). You'll need this for transaction fees (gas).
4.  **Git:** For cloning the repository.

---

## Getting Started 🚀

Follow these steps to set up and run the project locally.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[Your-GitHub-Username]/[Your-Repo-Name].git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd [Your-Repo-Name]
    ```
3.  **(Optional but Recommended) Install a simple HTTP server:** If you don't have one, `http-server` is a good choice.
    ```bash
    npm install --global http-server
    ```

### Running the DApp Locally

1.  **Start the local server** from the project's root directory:
    ```bash
    http-server .
    ```
    Or use Python's built-in server (Python 3):
    ```bash
    python -m http.server
    ```
2.  **Open your web browser** and navigate to the local address provided by the server (usually `http://localhost:8080` or `http://127.0.0.1:8080`).

---

## Usage Guide 📖

1.  **Ensure MetaMask is Ready:** Make sure your MetaMask extension is installed, unlocked, and set to the **Sepolia Testnet**.
2.  **Connect Wallet:**
    *   Navigate to the DApp homepage (`index.html`) and click "Get Started" or go directly to `dashboard.html`.
    *   Click the "Connect Wallet" button.
    *   Approve the connection request in the MetaMask popup.
    *   The dashboard should now display your connected wallet address and show the main DApp content.
3.  **Create a New Contract (as Farmer):**
    *   Fill in the "Create New Contract" form:
        *   **Crop Details:** Describe the product (e.g., "10 Tons Organic Wheat").
        *   **Buyer's Ethereum Address:** Enter the valid Ethereum address of the intended buyer (e.g., `0x...`).
        *   **Payment Amount (ETH):** Enter the agreed amount in Ether (e.g., `1.5`).
    *   Click "Create Contract".
    *   Confirm the transaction in the MetaMask popup (this will cost a small amount of Sepolia ETH for gas).
    *   Wait for the transaction to be confirmed. You should see a success message, and the new contract will appear in the "Existing Contracts" list.
4.  **View Existing Contracts:**
    *   The "Existing Contracts" section automatically lists all contracts retrieved from the smart contract. Details like Farmer, Buyer, Crop, Amount, and Status are displayed.
5.  **Complete a Contract (as Buyer):**
    *   Find the contract you wish to complete in the "Existing Contracts" list.
    *   If you are the designated buyer for that contract and it's not already completed, a "Mark as Complete" button will be visible on the contract card.
    *   Click the "Mark as Complete" button.
    *   Confirm the transaction in the MetaMask popup (this also costs gas).
    *   Once confirmed, the contract's status will update to "Completed" in the list.

---

## Smart Contract Details 📄

*   **Network:** Sepolia Testnet
*   **Contract Address:** `[Your Contract Address on Sepolia]` <!-- IMPORTANT: Replace with your actual address -->
*   **ABI:** The Application Binary Interface (ABI) is included directly within the frontend JavaScript file: `js/script.js`.
*   **Etherscan Link:** You can view the deployed contract and its transactions on Sepolia Etherscan:
    `[Link to Your Contract on Sepolia Etherscan]` <!-- IMPORTANT: Replace with your Etherscan link -->
    Example: `https://sepolia.etherscan.io/address/[Your Contract Address on Sepolia]`

---

## Future Enhancements 💡

*   **Payment Integration:** Implement an escrow mechanism where the buyer deposits ETH into the contract upon creation, automatically released to the farmer upon completion.
*   **Dispute Resolution:** Add a basic mechanism for flagging disputes or requiring multi-sig confirmation for completion.
*   **User Roles/Profiles:** Differentiate UI/UX based on whether the connected user is primarily a farmer or buyer.
*   **Off-Chain Data Storage:** Use solutions like IPFS for storing larger contract documents or images linked to the on-chain contract ID.
*   **Event Notifications:** Implement frontend notifications based on smart contract events (e.g., "New contract created involving you", "Your contract was marked complete").
*   **Enhanced UI/UX:** Further refine the user interface, add sorting/filtering for contracts, and improve mobile responsiveness.
*   **Mainnet Deployment Strategy:** Plan and document steps required for potential deployment to the Ethereum mainnet or a Layer 2 solution.
*   **Contract Upgradeability:** Implement patterns (like Proxies) to allow for future upgrades to the smart contract logic.

---

## Contributing 🤝

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.

Please ensure your code adheres to standard practices and includes relevant updates to documentation.

---
