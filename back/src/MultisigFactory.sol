// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MultiSig.sol";

contract MultiSigFactory {
    event WalletCreated(address indexed creator, address walletAddress);

    address[] public deployedWallets;

    function createWallet(address[] memory _users) public {
        MultiSig newWallet = new MultiSig(_users, 1);
        deployedWallets.push(address(newWallet));

        emit WalletCreated(msg.sender, address(newWallet));
    }

    function getDeployedWallets() public view returns (address[] memory) {
        return deployedWallets;
    }
}
