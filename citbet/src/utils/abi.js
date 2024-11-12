const factoryAbi = [
  {
    type: "function",
    name: "createWallet",
    inputs: [{ name: "_users", type: "address[]", internalType: "address[]" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployedWallets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDeployedWallets",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "WalletCreated",
    inputs: [
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "walletAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];

export const walletAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_users", type: "address[]", internalType: "address[]" },
      {
        name: "_requiredApprovals",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "addTransaction",
    inputs: [
      { name: "_target", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_payload", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveTransaction",
    inputs: [{ name: "_txID", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "authorizedUsers",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "countTransactions",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "executeTransaction",
    inputs: [{ name: "_txID", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fetchTransaction",
    inputs: [{ name: "_txID", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "target", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "payload", type: "bytes", internalType: "bytes" },
      { name: "hasBeenExecuted", type: "bool", internalType: "bool" },
      {
        name: "approvalCount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasConfirmed",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAuthorized",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "listUsers",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingTransactions",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "target", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "payload", type: "bytes", internalType: "bytes" },
      { name: "hasBeenExecuted", type: "bool", internalType: "bool" },
      {
        name: "approvalCount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "requiredApprovals",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revokeConfirmation",
    inputs: [{ name: "_txID", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ConfirmationRevoked",
    inputs: [
      {
        name: "approver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "txID",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FundsDeposited",
    inputs: [
      {
        name: "depositor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newBalance",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionConfirmed",
    inputs: [
      {
        name: "approver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "txID",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionExecuted",
    inputs: [
      {
        name: "executor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "txID",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionSubmitted",
    inputs: [
      {
        name: "initiator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "txID",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "target",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "payload",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
];

export const betreaAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "betCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "player", type: "address", internalType: "address" },
      {
        name: "direction",
        type: "uint8",
        internalType: "enum Betrea.BetDirection",
      },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "targetPrice", type: "uint256", internalType: "uint256" },
      { name: "settled", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestPrice",
    inputs: [],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "placeBet",
    inputs: [
      {
        name: "_direction",
        type: "uint8",
        internalType: "enum Betrea.BetDirection",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "settleBet",
    inputs: [{ name: "_betId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BetPlaced",
    inputs: [
      {
        name: "betId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "direction",
        type: "uint8",
        indexed: false,
        internalType: "enum Betrea.BetDirection",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "targetPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BetSettled",
    inputs: [
      {
        name: "betId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "won",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "payout",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];

export const betreaConstAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "betCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "player", type: "address", internalType: "address" },
      {
        name: "direction",
        type: "uint8",
        internalType: "enum BetreaConst.BetDirection",
      },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      {
        name: "currentPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "roundId", type: "uint80", internalType: "uint80" },
      { name: "settled", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestPrice",
    inputs: [],
    outputs: [
      { name: "", type: "int256", internalType: "int256" },
      { name: "", type: "uint80", internalType: "uint80" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoundPrice",
    inputs: [{ name: "_roundId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "placeAndSettleBetWithTrue",
    inputs: [
      {
        name: "_direction",
        type: "uint8",
        internalType: "enum BetreaConst.BetDirection",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "placeBet",
    inputs: [
      {
        name: "_direction",
        type: "uint8",
        internalType: "enum BetreaConst.BetDirection",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "settleBet",
    inputs: [{ name: "_betId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BetPlaced",
    inputs: [
      {
        name: "betId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "direction",
        type: "uint8",
        indexed: false,
        internalType: "enum BetreaConst.BetDirection",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "targetPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "roundId",
        type: "uint80",
        indexed: false,
        internalType: "uint80",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BetSettled",
    inputs: [
      {
        name: "betId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "won",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "payout",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];

export { factoryAbi };
