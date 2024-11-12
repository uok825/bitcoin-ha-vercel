import styles from "./App.module.css";
import "./lib/firebase";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import toast, { Toaster } from "react-hot-toast";

import { getUser } from "./lib/storage";

import { Chatbox, Header, Sidebar } from "./components";

import SVG from "./assets/sanat.svg";
import BTCBig from "./assets/BTCBig.svg";
import PaymentModal from "./components/ui/PaymentModal";

import TextTransition, { presets } from "react-text-transition";
import { mockBet } from "./utils/fetchFunctions";

const TEXTS = ["88,746.74", "88,746.74", "87,577,54", "88,265.54"];

function App() {
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const [paymentModalIsOpen, setIsPaymentOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isBetUp, setIsBetUp] = useState(false);
  const [isBetDown, setIsBetDown] = useState(false);
  const account = useAccount();
  const amountRef = useRef(null);

  const handleBetUp = async () => {
    isBetUp(false);
    await mockBet(parsedUser.mSigAddress, amountRef.current.value, "Up");
    isBetUp(true);
  };
  const handleBetDown = async () => {
    await mockBet(parsedUser.mSigAddress, amountRef.current.value, "Down");
  };

  useEffect(() => {
    if (account?.address) {
      const user = getUser(account.address);
      console.log(user);
    }
  }, [account]);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div>
      <Toaster />
      <Header setIsPaymentOpen={setIsPaymentOpen} />
      <div className={styles.container} id="container">
        <PaymentModal
          modalIsOpen={paymentModalIsOpen}
          setIsOpen={setIsPaymentOpen}
        />
        <img src={SVG} alt="" className={styles.sanat} />
        <div className={styles.inner_container}>
          <Sidebar />
          <div className={styles.bet_card_container}>
            <div className={styles.bet_card_inner_container}>
              <div className={styles.bet_card_title_container}>
                <img src={BTCBig} alt="" />
                <h1>BTC Price Prediction</h1>
              </div>
              <h1>
                <TextTransition springConfig={presets.wobbly}>
                  {TEXTS[index % TEXTS.length]}
                </TextTransition>
              </h1>
              <div className={styles.amount_container}>
                <p className={styles.amount_desc}>Amount of bet</p>
                <input
                  type="text"
                  className={styles.amount_input}
                  ref={amountRef}
                />
              </div>
              <div className={styles.bet_buttons_container}>
                <button
                  className={styles.bet_button_up}
                  id="up"
                  onClick={() => {
                    handleBetUp();
                    toast.success("Bet Up Successful");
                  }}
                >
                  Bet Up
                </button>
                <button
                  className={styles.bet_button_down}
                  id="down"
                  onClick={() => {
                    handleBetDown();
                    toast.success("Bet Down Successful");
                  }}
                >
                  Bet Down
                </button>
              </div>
            </div>
          </div>
          <Chatbox />
        </div>
      </div>
      {/* <p onClick={() => signInWithGoogle()}>selam</p>
      <p onClick={() => console.log(auth?.currentUser)}>auth</p>
      <p onClick={() => signOut()}>sign out</p> */}
    </div>
  );
}

export default App;
