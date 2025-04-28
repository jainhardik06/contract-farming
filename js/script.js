// --- Configuration ---
const contractAddress = "0x7d459891380D8c7c554edefEf13796fC3A678f9C"; // YOUR Deployed Contract Address
const sepoliaNetworkId = 11155111; // Sepolia Network ID (Decimal)
const abi = [ // YOUR ABI
    { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "completeContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_buyer", "type": "address" }, { "internalType": "string", "name": "_cropDetails", "type": "string" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "createContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "contracts", "outputs": [{ "internalType": "address", "name": "farmer", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "string", "name": "cropDetails", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "isCompleted", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getContracts", "outputs": [{ "components": [{ "internalType": "address", "name": "farmer", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "string", "name": "cropDetails", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "isCompleted", "type": "bool" }], "internalType": "struct ContractFarming.Contract[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }
];

// --- Global Variables ---
let web3;
let contract;
let userAccount = null;

// --- DOM Elements (Make sure these IDs exist in your HTML) ---
const connectWalletBtn = document.getElementById("connectWallet");
const walletAddressSpan = document.getElementById("walletAddress");
const contractForm = document.getElementById("contractForm");
const contractsListDiv = document.getElementById("contractsList");

// --- Initialization ---
window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        web3 = new Web3(window.ethereum); // Initialize web3 instance

        // Check if already connected (on page load/refresh)
         try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                console.log('Wallet already connected');
                await connectWallet(); // Reuse connection logic
            } else {
                 console.log('Wallet not connected yet.');
                 walletAddressSpan.textContent = 'Wallet: Not Connected';
            }
         } catch (err) {
            console.error("Error checking existing connection:", err);
             walletAddressSpan.textContent = 'Wallet: Error checking connection';
         }

    } else {
        console.log('MetaMask is not installed. Please install it to use this DApp.');
        alert('MetaMask is not installed. Please install it!');
        walletAddressSpan.textContent = 'Wallet: MetaMask Required';
    }

    // Setup Button Listeners
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener("click", connectWallet);
    }
    if (contractForm) {
        contractForm.addEventListener("submit", handleCreateContractSubmit);
    }

    // Listen for account changes
     if (window.ethereum) {
         window.ethereum.on('accountsChanged', (accounts) => {
            console.log('Account changed:', accounts);
             if (accounts.length > 0) {
                 // Reconnect or update UI with new account
                 connectWallet();
             } else {
                 // Handle disconnection
                 userAccount = null;
                 contract = null;
                 walletAddressSpan.textContent = 'Wallet: Disconnected';
                 contractsListDiv.innerHTML = ''; // Clear contracts
                 alert('Wallet disconnected.');
             }
         });

         window.ethereum.on('chainChanged', (chainId) => {
            console.log('Network changed:', chainId);
             // Simple handling: reload or ask user to reconnect/refresh
             alert('Network changed. Please ensure you are on Sepolia and reconnect if needed.');
             window.location.reload(); // Simplest way to handle network change
         });
     }
});

// --- Wallet Connection ---
async function connectWallet() {
    if (!web3) {
        alert("Web3 not initialized. Is MetaMask installed?");
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
            alert("Please connect to MetaMask.");
            return;
        }
        userAccount = accounts[0];
        console.log("User account:", userAccount);
        walletAddressSpan.textContent = `Wallet: ${userAccount.substring(0, 6)}...${userAccount.substring(userAccount.length - 4)}`;

        // Check Network ID
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        if (networkId !== sepoliaNetworkId) {
            alert(`Please switch MetaMask to the Sepolia Testnet (Network ID: ${sepoliaNetworkId}). You are on network ID ${networkId}.`);
            // Clear state if wrong network
            userAccount = null;
            contract = null;
            walletAddressSpan.textContent = 'Wallet: Wrong Network';
            contractsListDiv.innerHTML = '';
            return;
        }

        // Initialize Contract
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Contract initialized:", contractAddress);

        // Load existing contracts
        await loadContracts();

    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert(`Error connecting wallet: ${error.message}`);
        walletAddressSpan.textContent = 'Wallet: Connection Failed';
    }
}

// --- Contract Interaction ---

// Load and display contracts
async function loadContracts() {
    if (!contract) {
        console.error("Contract not initialized.");
        contractsListDiv.innerHTML = '<p>Connect wallet to load contracts.</p>';
        return;
    }
    if (!userAccount) {
         console.error("User account not available.");
         contractsListDiv.innerHTML = '<p>Connect wallet to load contracts.</p>';
         return;
    }


    console.log("Loading contracts...");
    contractsListDiv.innerHTML = '<p>Loading contracts...</p>'; // Loading indicator

    try {
        // Call the getContracts function from the smart contract
        const contractsData = await contract.methods.getContracts().call({ from: userAccount }); // Specify 'from' for context if needed, though 'call' usually doesn't require it
        console.log("Contracts data:", contractsData);

        contractsListDiv.innerHTML = ''; // Clear loading message

        if (!contractsData || contractsData.length === 0) {
            contractsListDiv.innerHTML = "<p>No contracts found.</p>";
            return;
        }

        // Display each contract
        contractsData.forEach((c, index) => {
            displayContract(c, index);
        });

    } catch (error) {
        console.error("Error loading contracts:", error);
        contractsListDiv.innerHTML = `<p style="color: red;">Error loading contracts: ${error.message}</p>`;
    }
}

// Display a single contract card
function displayContract(contractData, index) {
    if (!contractsListDiv || !web3) return;

    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "15px";
    card.style.marginBottom = "10px";
    card.style.backgroundColor = contractData.isCompleted ? "#e0ffe0" : "#fff"; // Highlight completed

    const amountInEth = web3.utils.fromWei(contractData.amount.toString(), "ether");

    // Basic contract info (sanitize cropDetails)
    const cropDetailsClean = contractData.cropDetails.replace(/</g, "<").replace(/>/g, ">"); // Basic sanitization
    let cardHTML = `
        <h4>Contract #${index}</h4>
        <p><strong>Farmer:</strong> ${contractData.farmer}</p>
        <p><strong>Buyer:</strong> ${contractData.buyer}</p>
        <p><strong>Crop:</strong> ${cropDetailsClean}</p>
        <p><strong>Amount:</strong> ${amountInEth} ETH</p>
        <p><strong>Status:</strong> ${contractData.isCompleted ? 'Completed' : 'Pending'}</p>
    `;

    // Add 'Complete' button if:
    // 1. Contract is not completed
    // 2. A user is connected
    // 3. The connected user IS the buyer for this contract
    if (!contractData.isCompleted && userAccount && contractData.buyer.toLowerCase() === userAccount.toLowerCase()) {
        // Use inline onclick for simplicity in this version
        cardHTML += `<button onclick="handleCompleteContract(${index})">Mark as Complete</button>`;
    }

    card.innerHTML = cardHTML;
    contractsListDiv.appendChild(card);
}

// Handle the "Create Contract" form submission
async function handleCreateContractSubmit(event) {
    event.preventDefault(); // Prevent page reload
    if (!contract || !userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    // Get form values
    const cropDetailsInput = document.getElementById("cropDetails");
    const buyerAddressInput = document.getElementById("buyerAddress");
    const amountInput = document.getElementById("amount");

    const cropDetails = cropDetailsInput.value.trim();
    const buyerAddress = buyerAddressInput.value.trim();
    const amount = amountInput.value; // Keep as string for Wei conversion

    // Basic validation
    if (!cropDetails || !buyerAddress || !amount) {
        alert("Please fill in all fields.");
        return;
    }
    if (!web3.utils.isAddress(buyerAddress)) {
        alert("Invalid buyer Ethereum address.");
        return;
    }
    let amountInWei;
    try {
         amountInWei = web3.utils.toWei(amount, "ether");
         if (web3.utils.toBN(amountInWei).isNeg() || web3.utils.toBN(amountInWei).isZero()) {
              throw new Error();
         }
    } catch (e) {
         alert("Invalid or non-positive payment amount.");
         return;
    }


    console.log(`Attempting to create contract: Buyer=${buyerAddress}, Amount=${amountInWei}`);
    alert("Please confirm the transaction in MetaMask..."); // User feedback

    try {
        // Send the transaction to the createContract function
        const receipt = await contract.methods.createContract(buyerAddress, cropDetails, amountInWei)
            .send({ from: userAccount });

        console.log("Transaction Receipt:", receipt);
        alert("Contract created successfully!");
        contractForm.reset(); // Clear the form

        // Refresh the contract list
        await loadContracts();

    } catch (error) {
        console.error("Error creating contract:", error);
        alert(`Failed to create contract: ${error.message}`);
    }
}

// Handle the "Mark as Complete" button click (called from inline onclick)
// Make this function globally accessible
async function handleCompleteContract(index) {
     // Ensure index is a number
     index = parseInt(index);
     if (isNaN(index)) {
         console.error("Invalid index passed to handleCompleteContract");
         alert("Invalid contract index.");
         return;
     }

    if (!contract || !userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    console.log(`Attempting to complete contract index: ${index}`);
    alert(`Please confirm the transaction in MetaMask to complete contract #${index}...`);

    try {
        // Send the transaction to the completeContract function
        const receipt = await contract.methods.completeContract(index)
            .send({ from: userAccount });

        console.log("Transaction Receipt:", receipt);
        alert(`Contract #${index} marked as completed!`);

        // Refresh the contract list
        await loadContracts();

    } catch (error) {
        console.error(`Error completing contract ${index}:`, error);
        // Check for common revert reason (buyer check)
        if (error.message.includes("Only buyer can complete")) {
             alert("Failed to complete contract: Only the designated buyer can mark it as complete.");
        } else {
             alert(`Failed to complete contract #${index}: ${error.message}`);
        }
    }
}