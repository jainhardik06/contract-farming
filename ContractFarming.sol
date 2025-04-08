// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContractFarming {
    struct Contract {
        address farmer;
        address buyer;
        string cropDetails;
        uint256 amount;
        bool isCompleted;
    }

    Contract[] public contracts;

    // Create a new farming contract
    function createContract(address _buyer, string memory _cropDetails, uint256 _amount) public {
        contracts.push(Contract(msg.sender, _buyer, _cropDetails, _amount, false));
    }

    // Mark a contract as completed
    function completeContract(uint256 _index) public {
        require(msg.sender == contracts[_index].buyer, "Only buyer can complete the contract");
        contracts[_index].isCompleted = true;
    }

    // Retrieve all contracts
    function getContracts() public view returns (Contract[] memory) {
        return contracts;
    }
}
