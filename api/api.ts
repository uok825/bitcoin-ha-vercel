import { ethers } from "ethers";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { walletAbi, factoryAbi, betreaAbi, betreaConstAbi } from "./abi";
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

app.get("/getBalance", async (req, res) => {
  const { address } = req.query;
  if (typeof address === "string") {
    const balance = await provider.getBalance(address);
    res.json({ balance: ethers.formatEther(balance) });
  } else {
    res.status(400).json({ error: "Invalid address" });
  }
});

app.post("/createWallet", async (req, res) => {
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

app.post("/withdraw", async (req, res) => {
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

app.get("/bet", async (req, res) => {
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

app.get("/mockBet", async (req, res) => {
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

app.get("/latest", async (req, res) => {
  const Contract = new ethers.Contract(
    "0x4AB36F66ca1867F3A47bC486514025Ef8d9Dc3A3",
    betreaAbi,
    provider
  );
  const tx = await Contract.getLatestPrice();
  const string = ethers.formatUnits(tx, 18);
  res.json({ string });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
