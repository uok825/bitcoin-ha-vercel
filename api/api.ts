import { ethers } from "ethers";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { walletAbi, factoryAbi, betreaAbi, betreaConstAbi } from "./abi";
import { connectToRelay, sendMessage } from "./nostr";

dotenv.config();

const app = express();
const port = 9999;
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider("https://rpc.testnet.citrea.xyz");
const msigPrivate = process.env.MULTISIG_PRIVATE_KEY!;
const factoryAddress = "0x6b2892bA981c943D4B2a0e1a563850341dC32e22";
const betreaConstAddress = "0xC1875f004DCF4e61b0BfFEadA3121036cce16b0b";
const msigWallet = new ethers.Wallet(msigPrivate, provider);

app.get("/api/getBalance", async (req, res) => {
  const { address } = req.query;
  if (typeof address === "string") {
    const balance = await provider.getBalance(address);
    res.json({ balance: ethers.formatEther(balance) });
  } else {
    res.status(400).json({ error: "Invalid address" });
  }
});

app.post("/api/createWallet", async (req, res) => {
  const { owner } = req.body;
  if (typeof owner === "string") {
    const factory = new ethers.Contract(factoryAddress, factoryAbi, msigWallet);
    const wallet = await factory.createWallet([owner, msigWallet.address]);
    const walletTx = await wallet.wait();
    const decoder = new ethers.Interface(factoryAbi);
    const decoded: any = decoder.parseLog({
      topics: walletTx.logs[0].topics,
      data: walletTx.logs[0].data,
    });
    res.json({ wallet: decoded[0].args[1] });
  } else {
    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.post("/api/withdraw", async (req, res) => {
  const { msig, amount, to } = req.body;
  if (
    typeof msig === "string" &&
    typeof amount === "string" &&
    typeof to === "string"
  ) {
    console.log(msig, amount, to);
    const iface = new ethers.Interface(walletAbi);
    const wallet = new ethers.Contract(msig, walletAbi, msigWallet);
    const addTx = await wallet.addTransaction(
      to,
      ethers.parseEther(amount),
      "0x"
    );
    const receipt = await addTx.wait();
    const parsedAdd: any = iface.parseLog({
      topics: receipt.logs[0].topics,
      data: receipt.logs[0].data,
    });
    const txID = parsedAdd.args[1];
    const approveTx = await wallet.approveTransaction(txID);
    const approveReceipt = await approveTx.wait();
    const executeTx = await wallet.executeTransaction(txID);
    const executeReceipt = await executeTx.wait();
    if (executeReceipt.status === 1) {
      res.json(true);
    }
  } else {
    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.get("/api/bet", async (req, res) => {
  const { msig, amount, bet, to } = req.query;
  if (
    typeof msig === "string" &&
    typeof amount === "string" &&
    typeof bet === "string" &&
    typeof to === "string"
  ) {
    const wallet = new ethers.Contract(msig, walletAbi, msigWallet);
    const tx = await wallet.addTransaction(to, ethers.parseEther(amount), "0x");
    const receipt = tx.wait();
    res.json({ receipt });
  } else {
    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.get("/api/mockBet", async (req, res) => {
  const { msig, amount, bet, direction } = req.query;
  if (
    typeof msig === "string" &&
    typeof amount === "string" &&
    typeof direction === "string"
  ) {
    const betInterface = new ethers.Interface(betreaConstAbi);

    const data = betInterface.encodeFunctionData("placeAndSettleBetWithTrue", [
      parseInt(direction),
    ]);
    const wallet = new ethers.Contract(msig, walletAbi, msigWallet);
    const addTx = await wallet.addTransaction(
      betreaConstAddress,
      ethers.parseEther(amount),
      data
    );
    const receipt = await addTx.wait();
    const iface = new ethers.Interface(walletAbi);
    const parsedAdd: any = iface.parseLog({
      topics: receipt.logs[0].topics,
      data: receipt.logs[0].data,
    });
    const txID = parsedAdd.args[1];
    const approveTx = await wallet.approveTransaction(txID);
    const approveReceipt = await approveTx.wait();
    const executeTx = await wallet.executeTransaction(txID);
    const executeReceipt = await executeTx.wait();
    res.json({ executeReceipt });
  } else {
    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.get("/api/latest", async (req, res) => {
  const Contract = new ethers.Contract(
    "0x4AB36F66ca1867F3A47bC486514025Ef8d9Dc3A3",
    betreaAbi,
    provider
  );
  const tx = await Contract.getLatestPrice();
  const string = ethers.formatUnits(tx, 18);
  res.json({ string });
});

app.get("/api/messages", async (req, res) => {
  const relay = await connectToRelay();
  if (!relay) {
    res.status(500).json({ error: "Failed to connect to relay" });
    return;
  }

  let events: any = [];
  const maxEvents = 10; // Limit the number of events to collect
  const timeout = 5000; // Timeout in milliseconds (e.g., 5 seconds)

  const sub = relay.subscribe([{ kinds: [1] }], {
    onevent(event: any) {
      if (event.content.startsWith("betrea:")) {
        console.log("Event received:", event);
        events.push({
          Content: event.content,
          PubKey: event.pubkey,
          Id: event.id,
        });
        if (events.length >= maxEvents) {
          sub.close();
          res.json({ events });
        }
      }
    },
    oneose() {
      console.log("End of subscription");
      sub.close();
      res.json({ events });
    },
  });

  // Set a timeout to close the subscription and return collected events
  setTimeout(() => {
    sub.close();
    res.json({ events });
  }, timeout);
});

app.post("/api/sendMessage", async (req, res) => {
  const { message, secret } = req.body;

  if (typeof message === "string") {
    try {
      await sendMessage(secret, message);
      res.json({ message });
    } catch (error) {
      res.status(500).json({
        error: "Failed to send message",
        message: (error as any).message,
      });
    }
  } else {
    res.status(400).json({ error: "Invalid message or secret" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
