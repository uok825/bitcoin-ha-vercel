import axios from "axios";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";

const url = "https://bitrea-api.vercel.app/api";
const connection = new PriceServiceConnection("https://hermes.pyth.network");
const priceIds = [
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
];

async function createAccount(owner) {
  axios
    .post(url + "/createAccount", {
      owner: owner,
    })
    .then((response) => {
      console.log("Response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function withdraw(msig, amount, to) {
  axios
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
  axios
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
  axios
    .post(url + "/mockBet", {
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
  axios
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

export {
  createAccount,
  withdraw,
  bet,
  mockBet,
  getPrices,
  getMessages,
  sendMessage,
};
