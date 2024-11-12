import axios from "axios";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { ethers } from "ethers";

const url = "https://api.betrea.xyz/api";
const connection = new PriceServiceConnection("https://hermes.pyth.network");
const priceIds = [
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
];
const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
const msigPrivate =
  "eb1c43a476d855019709ba1781b0256e37653d1e15b6dd3c2dd7731ba3754fda";
const factoryAddress = "0x6b2892bA981c943D4B2a0e1a563850341dC32e22";
const msigWallet = new ethers.Wallet(msigPrivate, provider);

async function createAccount(owner) {
  const factory = new ethers.Contract(
    factoryAddress,
    [
      {
        type: "function",
        name: "createWallet",
        inputs: [
          { name: "_users", type: "address[]", internalType: "address[]" },
        ],
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
    ],
    msigWallet
  );
  const wallet = await factory.createWallet([owner, msigWallet.address]);
  const walletTx = await wallet.wait();
  console.log(walletTx);
  const decoder = new ethers.Interface([
    {
      type: "function",
      name: "createWallet",
      inputs: [
        { name: "_users", type: "address[]", internalType: "address[]" },
      ],
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
  ]);
  const decoded = decoder.parseLog({
    topics: walletTx.logs[0].topics,
    data: walletTx.logs[0].data,
  });
  console.log(decoded.args[1]);
  return decoded.args[1];
}

async function withdraw(msig, amount, to) {
  await axios
    .post(url + "/withdraw", {
      msig: msig,
      amount: amount,
      to: to,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function bet(msig, amount, to, direction) {
  await axios
    .post(url + "/bet", {
      msig: msig,
      amount: amount,
      to: to,
      direction: direction,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function mockBet(msig, amount, direction) {
  await axios
    .get(url + "/mockBet", {
      msig: msig,
      amount: amount,
      direction: direction,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getPrices() {
  const currentPrices = await connection.getLatestPriceFeeds(priceIds);
  const price0 = currentPrices[0].emaPrice.price;
  const bitcoinPrice = (price0 / 1e8).toFixed(4);
  const price1 = currentPrices[1].emaPrice.price;
  const etherPrice = (price1 / 1e8).toFixed(4);
  return { btc: bitcoinPrice, eth: etherPrice };
}

async function getMessages() {
  const messages = await axios.get(url + "/messages");
  return messages.data;
}

async function sendMessage(message, secret) {
  await axios
    .post(url + "/sendMessage", {
      message: message,
      secret: secret,
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getBalance(msig) {
  const balance = await axios.post("https://rpc.testnet.citrea.xyz", {
    method: "eth_getBalance",
    params: [msig, "latest"],
    id: 1,
    jsonrpc: "2.0",
  });
  return balance.data;
}

export {
  createAccount,
  withdraw,
  bet,
  mockBet,
  getPrices,
  getMessages,
  sendMessage,
  getBalance,
};

createAccount("0xADbda2B98d6A28d227964f0bF3f762777FaAAA63");
