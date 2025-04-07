// --- Configuration ---
const contractAddress = "0xE7Ed5d13A21ba4B201ca563F9778fF059ed4C565"; // Your Deployed contract address on Sepolia
const sepoliaNetworkId = 11155111; // Sepolia Network ID
const etherscanBaseUrl = "https://sepolia.etherscan.io"; // Sepolia Etherscan URL
const abi = [
    // ... (Keep your ABI definition here) ...
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_index",
					"type": "uint256"
				}
			],
			"name": "completeContract",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "contracts",
			"outputs": [
				{
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "buyer",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "cropDetails",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "isCompleted",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_buyer",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_cropDetails",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "createContract",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getContracts",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "farmer",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "buyer",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "cropDetails",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						},
						{
							"internalType": "bool",
							"name": "isCompleted",
							"type": "bool"
						}
					],
					"internalType": "struct ContractFarming.Contract[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
];

// --- Global Variables ---
let web3;
let contract;
let userAccount;

// --- DOM Elements ---
// Note: It's often good practice to grab frequently used elements once
const connectWalletBtn = document.getElementById("connectWallet");
const connectWalletPromptBtn = document.getElementById("connectWalletPromptBtn");
const connectionStatusSpan = document.getElementById("connectionStatus");
const walletAddressSpan = document.getElementById("walletAddress");
const connectPromptDiv = document.getElementById("connectPrompt");
const dappContentDiv = document.getElementById("dappContent");
const contractForm = document.getElementById("contractForm");
const createContractBtn = document.getElementById("createContractBtn");
const createStatusP = document.getElementById("createStatus");
const contractsListDiv = document.getElementById("contractsList");
const loadingContractsDiv = document.getElementById("loadingContracts");
const noContractsMessageP = document.getElementById("noContractsMessage");
const loadErrorContractsP = document.getElementById("loadErrorContracts");
// Modal Elements
const modal = document.getElementById('txStatusModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalLoader = document.getElementById('modalLoader');
const modalTxLink = document.getElementById('modalTxLink');

// --- Initialization ---
window.addEventListener("load", async () => {
    // Check if MetaMask is already connected (e.g., page refresh)
    if (window.ethereum && window.ethereum.selectedAddress) {
        console.log("MetaMask already potentially connected.");
        await connectWallet();
    } else {
        console.log("MetaMask not connected or not installed.");
        showConnectPrompt(); // Show the prompt to connect
    }
    setupEventListeners();
});

function setupEventListeners() {
    // Connect Button Listeners
    if (connectWalletBtn) connectWalletBtn.addEventListener("click", connectWallet);
    if (connectWalletPromptBtn) connectWalletPromptBtn.addEventListener("click", connectWallet);

    // Form Submission
    if (contractForm) {
        contractForm.addEventListener("submit", handleCreateContractSubmit);
    }

    // MetaMask Event Listeners
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

// --- Wallet Connection ---
async function connectWallet() {
    console.log("Attempting to connect wallet...");
    if (typeof window.ethereum === "undefined") {
        updateConnectionStatus("MetaMask not detected!", true);
        alert("MetaMask is not installed. Please install it to use this DApp.");
        showConnectPrompt();
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
             updateConnectionStatus("Connection denied.", true);
             alert("Wallet connection was denied.");
             showConnectPrompt();
             return;
        }
        userAccount = accounts[0];
        console.log("User account:", userAccount);

        // Initialize Web3
        web3 = new Web3(window.ethereum);

        // Check Network ID
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        if (networkId !== sepoliaNetworkId) {
            updateConnectionStatus("Wrong Network", true);
             alert(`Please switch MetaMask to the Sepolia Testnet (Network ID: ${sepoliaNetworkId})`);
             // Optionally try to switch network automatically (use with caution)
             // await switchNetwork();
             showConnectPrompt(); // Keep prompt visible until correct network
            return;
        }

        // Initialize Contract
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Contract initialized:", contractAddress);

        updateConnectionStatus("Connected", false);
        updateUIOnConnect();

        // Load contracts after successful connection
        await loadContracts();

    } catch (error) {
        console.error("Error connecting wallet:", error);
        let message = "Error connecting wallet.";
        if (error.code === 4001) { // User rejected request
            message = "Connection request denied.";
        }
        updateConnectionStatus(message, true);
        alert(message + " Please try again.");
        showConnectPrompt();
    }
}

// --- UI Update Functions ---

function updateConnectionStatus(message, isError = false) {
    if (!connectionStatusSpan) return;
    connectionStatusSpan.textContent = `Status: ${message}`;
    connectionStatusSpan.className = 'connection-status'; // Reset classes
    if (isError) {
        connectionStatusSpan.classList.add('error');
    } else if (message === "Connected") {
        connectionStatusSpan.classList.add('connected');
    }
}

function updateWalletAddressDisplay() {
     if (!walletAddressSpan) return;
     if (userAccount) {
         const truncatedAddress = `${userAccount.substring(0, 6)}...${userAccount.substring(userAccount.length - 4)}`;
         walletAddressSpan.innerHTML = `Wallet: <span title="${userAccount}">${truncatedAddress}</span>`; // Use innerHTML to allow styling
     } else {
          walletAddressSpan.textContent = "Wallet: Not Connected";
     }
}

function showConnectPrompt() {
    if(connectPromptDiv) connectPromptDiv.classList.remove('hidden');
    if(dappContentDiv) dappContentDiv.classList.add('hidden');
    updateWalletAddressDisplay(); // Ensure address shows "Not Connected"
}

function showDappContent() {
    if(connectPromptDiv) connectPromptDiv.classList.add('hidden');
    if(dappContentDiv) dappContentDiv.classList.remove('hidden');
    updateWalletAddressDisplay(); // Update with connected address
}

function updateUIOnConnect() {
    showDappContent();
    if (connectWalletBtn) connectWalletBtn.textContent = "Wallet Connected"; // Optional: Change button text/state
    if (connectWalletBtn) connectWalletBtn.disabled = true; // Optional: Disable connect button
}

function updateUIOnDisconnect() {
     showConnectPrompt();
     updateConnectionStatus("Disconnected");
     if (connectWalletBtn) connectWalletBtn.textContent = "Connect Wallet";
     if (connectWalletBtn) connectWalletBtn.disabled = false;
     userAccount = null;
     contract = null;
     web3 = null;
     // Clear contract list on disconnect
     if (contractsListDiv) contractsListDiv.innerHTML = '';
     if (noContractsMessageP) noContractsMessageP.classList.add('hidden');
     if (loadErrorContractsP) loadErrorContractsP.classList.add('hidden');
}

// --- Contract Interaction ---

async function loadContracts() {
    if (!contract || !web3) {
        console.error("Contract or Web3 not initialized for loading.");
        if(loadErrorContractsP) loadErrorContractsP.classList.remove('hidden');
        if(loadingContractsDiv) loadingContractsDiv.classList.add('hidden');
        return;
    }

    console.log("Loading contracts...");
    if(loadingContractsDiv) loadingContractsDiv.classList.remove('hidden');
    if(contractsListDiv) contractsListDiv.innerHTML = ''; // Clear previous list
    if(noContractsMessageP) noContractsMessageP.classList.add('hidden');
    if(loadErrorContractsP) loadErrorContractsP.classList.add('hidden');


    try {
        const contractsData = await contract.methods.getContracts().call();
        console.log("Contracts data received:", contractsData);

        if(loadingContractsDiv) loadingContractsDiv.classList.add('hidden');

        if (!contractsData || contractsData.length === 0) {
            if(noContractsMessageP) noContractsMessageP.classList.remove('hidden');
            return;
        }

        contractsData.forEach((c, index) => {
            displayContract(c, index);
        });

    } catch (error) {
        console.error("Error loading contracts:", error);
         if(loadingContractsDiv) loadingContractsDiv.classList.add('hidden');
         if(loadErrorContractsP) loadErrorContractsP.classList.remove('hidden');
         loadErrorContractsP.textContent = `Error loading contracts: ${error.message}`;
    }
}

function displayContract(contractData, index) {
    if (!contractsListDiv || !web3) return;

    const card = document.createElement("div");
    card.classList.add("contract-card");
    if (contractData.isCompleted) {
        card.classList.add("completed");
    }
    card.id = `contract-${index}`; // Add ID for potential updates

    const amountInEth = web3.utils.fromWei(contractData.amount, "ether");

    // Basic contract info
    let cardHTML = `
        <p><strong>Index:</strong> ${index}</p>
        <p><strong>Farmer:</strong> <span title="${contractData.farmer}">${truncateAddress(contractData.farmer)}</span></p>
        <p><strong>Buyer:</strong> <span title="${contractData.buyer}">${truncateAddress(contractData.buyer)}</span></p>
        <p><strong>Crop:</strong> ${escapeHTML(contractData.cropDetails)}</p>
        <p><strong>Amount:</strong> ${amountInEth} ETH</p>
        <p><strong>Status:</strong>
           <span class="contract-status ${contractData.isCompleted ? 'status-completed' : 'status-pending'}">
             ${contractData.isCompleted ? 'Completed' : 'Pending'}
           </span>
        </p>
    `;

    // Add 'Complete' button if applicable
    if (!contractData.isCompleted && userAccount && contractData.buyer.toLowerCase() === userAccount.toLowerCase()) {
        cardHTML += `
            <button class="btn btn-complete" onclick="handleCompleteContract(${index})">
                <span class="btn-text">Mark as Complete</span>
                <span class="spinner hidden"><i class="fas fa-spinner fa-spin"></i></span>
            </button>
            <p id="completeStatus-${index}" class="status-message"></p>
        `;
    }

    card.innerHTML = cardHTML;
    contractsListDiv.appendChild(card);
}


async function handleCreateContractSubmit(event) {
    event.preventDefault();
    if (!contract || !web3 || !userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    const cropDetailsInput = document.getElementById("cropDetails");
    const buyerAddressInput = document.getElementById("buyerAddress");
    const amountInput = document.getElementById("amount");

    const cropDetails = cropDetailsInput.value.trim();
    const buyerAddress = buyerAddressInput.value.trim();
    const amount = amountInput.value; // Keep as string for Wei conversion

    if (!cropDetails || !buyerAddress || !amount) {
         showStatusMessage(createStatusP, "Please fill in all fields.", true);
        return;
    }
    if (!web3.utils.isAddress(buyerAddress)) {
        showStatusMessage(createStatusP, "Invalid buyer Ethereum address.", true);
        return;
    }
     if (parseFloat(amount) <= 0) {
        showStatusMessage(createStatusP, "Amount must be greater than 0.", true);
        return;
    }


    const amountInWei = web3.utils.toWei(amount, "ether");

    setButtonLoading(createContractBtn, true);
    showStatusMessage(createStatusP, "Preparing transaction...", false);
    showTxModal("Creating Contract", "Please confirm the transaction in MetaMask...");

    try {
        console.log(`Creating contract: Buyer=${buyerAddress}, Crop=${cropDetails}, Amount=${amountInWei}`);
        const tx = await contract.methods.createContract(buyerAddress, cropDetails, amountInWei)
            .send({ from: userAccount });

        console.log("Transaction successful:", tx);
        updateTxModal("Success!", `Contract created successfully.`, `${etherscanBaseUrl}/tx/${tx.transactionHash}`);
        showStatusMessage(createStatusP, "Contract created successfully!", false, true); // Persist success briefly
        contractForm.reset(); // Clear the form

        // Refresh the contract list
        await loadContracts();

    } catch (error) {
        console.error("Error creating contract:", error);
         let message = "Failed to create contract.";
         if (error.code === 4001) { // User denied transaction signature
             message = "Transaction cancelled by user.";
             updateTxModal("Cancelled", message, null, true);
         } else if (error.message.includes("insufficient funds")) {
             message = "Insufficient funds for transaction.";
              updateTxModal("Error", message, null, true);
         } else {
             // Extract revert reason if available
             const revertReason = extractRevertReason(error);
             message = revertReason ? `Transaction failed: ${revertReason}` : message;
             updateTxModal("Error", message, null, true);
         }
        showStatusMessage(createStatusP, message, true);
    } finally {
        setButtonLoading(createContractBtn, false);
         // Keep modal open on error/cancel, hide after short delay on success
        if (!modal.querySelector('.error')) { // If not an error message in modal
            setTimeout(() => { hideTxModal(); }, 4000);
        }
    }
}

async function handleCompleteContract(index) {
    const completeButton = document.querySelector(`#contract-${index} .btn-complete`);
    const statusElement = document.getElementById(`completeStatus-${index}`);

    if (!contract || !web3 || !userAccount || !completeButton) {
        alert("Cannot complete contract. Ensure wallet is connected and contract exists.");
        return;
    }

    setButtonLoading(completeButton, true);
    showStatusMessage(statusElement, "Preparing transaction...", false);
     showTxModal("Completing Contract", `Attempting to complete contract index: ${index}. Please confirm in MetaMask...`);

    try {
        console.log(`Attempting to complete contract index: ${index}`);
        const tx = await contract.methods.completeContract(index).send({ from: userAccount });

        console.log("Transaction successful:", tx);
        updateTxModal("Success!", `Contract ${index} marked as complete!`, `${etherscanBaseUrl}/tx/${tx.transactionHash}`);
        showStatusMessage(statusElement, "Contract completed successfully!", false, true);

        // Refresh the specific card or the whole list
        // Option 1: Refresh just the card (more complex state mgmt)
         // updateContractCardUI(index, true);
        // Option 2: Reload all contracts (simpler)
        await loadContracts();


    } catch (error) {
        console.error(`Error completing contract ${index}:`, error);
        let message = `Failed to complete contract ${index}.`;
        if (error.code === 4001) {
            message = "Transaction cancelled by user.";
             updateTxModal("Cancelled", message, null, true);
        } else {
             const revertReason = extractRevertReason(error);
             message = revertReason ? `Transaction failed: ${revertReason}` : message;
             updateTxModal("Error", message, null, true);
        }
        showStatusMessage(statusElement, message, true);
    } finally {
        // Re-enable button *only if* the card still exists and isn't marked complete
        const updatedCard = document.getElementById(`contract-${index}`);
        if (updatedCard && !updatedCard.classList.contains('completed')) {
             const btn = updatedCard.querySelector('.btn-complete');
             if (btn) setButtonLoading(btn, false);
        }
         // Keep modal open on error/cancel, hide after short delay on success
         if (!modal.querySelector('.error')) {
            setTimeout(() => { hideTxModal(); }, 4000);
        }
    }
}


// --- MetaMask Event Handlers ---

function handleAccountsChanged(accounts) {
    console.log("Accounts changed:", accounts);
    if (accounts.length === 0) {
        // MetaMask is locked or user disconnected all accounts
        console.log("User disconnected.");
        updateUIOnDisconnect();
    } else {
        // User switched account, re-connect logic
        userAccount = accounts[0];
        console.log("Switched to account:", userAccount);
        // Re-initialize or update UI as needed
        connectWallet(); // Re-run connection logic to ensure contract instance uses new account
    }
}

function handleChainChanged(chainId) {
    console.log("Network changed to:", chainId);
    // Convert chainId (hex) to decimal number
    const networkId = parseInt(chainId, 16);
    console.log("Network ID (decimal):", networkId);

    if (networkId !== sepoliaNetworkId) {
        updateConnectionStatus("Wrong Network", true);
        alert(`Network changed. Please switch back to Sepolia Testnet (ID: ${sepoliaNetworkId}).`);
        // Force disconnect state in UI until user switches back
        updateUIOnDisconnect();
        // Optionally, prompt user to switch network automatically
        // switchNetwork();
    } else {
         // If they switched *back* to Sepolia, reconnect
         console.log("Switched back to Sepolia.");
         connectWallet();
    }

}

// --- Utility Functions ---

function setButtonLoading(buttonElement, isLoading) {
    if (!buttonElement) return;
    const textSpan = buttonElement.querySelector('.btn-text');
    const spinnerSpan = buttonElement.querySelector('.spinner');

    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.classList.add('loading');
        if(textSpan) textSpan.style.visibility = 'hidden';
        if(spinnerSpan) spinnerSpan.classList.remove('hidden');
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove('loading');
        if(textSpan) textSpan.style.visibility = 'visible';
        if(spinnerSpan) spinnerSpan.classList.add('hidden');
    }
}

function showStatusMessage(element, message, isError = false, autoClear = false) {
    if (!element) return;
    element.textContent = message;
    element.className = 'status-message'; // Reset class
    if (isError) {
        element.classList.add('error');
    } else {
         element.classList.add('success'); // Assuming non-error is success contextually
    }
    element.classList.remove('hidden');

    // Clear message after a delay if requested (useful for success messages)
    if (autoClear) {
        setTimeout(() => {
            element.classList.add('hidden');
            element.textContent = '';
            element.className = 'status-message hidden'; // Reset completely
        }, 4000); // 4 seconds delay
    }
}

function truncateAddress(address) {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

// Function to attempt extracting revert reason (may not always work)
function extractRevertReason(error) {
    if (error.message) {
        // Check for common patterns
        const match = error.message.match(/revert(?:ed)?(?::|\s)(.*)/i);
         if (match && match[1]) {
             // Clean up potential extra quotes or prefixes
             let reason = match[1].trim();
             if (reason.startsWith("'") && reason.endsWith("'")) {
                 reason = reason.substring(1, reason.length - 1);
             }
             return reason;
         }
        // Check for JSON RPC error structure which might contain data
        if (error.data && typeof error.data === 'string' && error.data.startsWith('0x')) {
            // Complex: would need to decode the revert data string
            // For simplicity, we won't decode here, but indicate data exists
             return "Transaction reverted (reason in error data)";
        }
    }
     // Check specifically for Ganache/Hardhat Network revert structure
    if (error.data && error.data.message) {
         const match = error.data.message.match(/revert (.*)/);
         if (match && match[1]) {
            return match[1];
         }
    }

    return null; // No specific reason found
}


// --- Transaction Modal Functions ---
function showTxModal(title, message) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalMessage.classList.remove('error'); // Reset error state
    modalLoader.classList.remove('hidden');
    modalTxLink.classList.add('hidden');
    modalTxLink.href = '#';
    modal.style.display = "block";
}

function updateTxModal(title, message, txHashUrl = null, isError = false) {
     if (!modal) return;
     modalTitle.textContent = title;
     modalMessage.textContent = message;
     modalLoader.classList.add('hidden'); // Hide loader once updated

     if (isError) {
          modalMessage.classList.add('error');
     } else {
          modalMessage.classList.remove('error');
     }

     if (txHashUrl) {
         modalTxLink.href = txHashUrl;
         modalTxLink.classList.remove('hidden');
     } else {
         modalTxLink.classList.add('hidden');
     }
}

function hideTxModal() {
     if (!modal) return;
    modal.style.display = "none";
}

// Optional: Function to attempt switching network (use carefully)
// async function switchNetwork() {
//     try {
//         await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: web3.utils.toHex(sepoliaNetworkId) }], // chainId must be in hexadecimal format
//         });
//         // Re-run connection logic after successful switch
//         await connectWallet();
//     } catch (switchError) {
//         // This error code indicates that the chain has not been added to MetaMask.
//         if (switchError.code === 4902) {
//             alert(`Sepolia network is not added to your MetaMask. Please add it manually.`);
//             // You could try adding the network here using 'wallet_addEthereumChain'
//         } else {
//             console.error("Could not switch network:", switchError);
//             alert("Failed to switch network. Please do it manually in MetaMask.");
//         }
//     }
// }