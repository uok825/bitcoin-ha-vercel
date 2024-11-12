import styles from "./App.module.css";
import "./lib/firebase";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getUser } from "./lib/storage";

import { Chatbox, Header, Sidebar } from "./components";

import SVG from "./assets/sanat.svg";
import PaymentModal from "./components/ui/PaymentModal";

import TextTransition, { presets } from "react-text-transition";

const TEXTS = ["88,746.74", "88,746.74", "87,577,54", "88,265.54"];

function App() {
<<<<<<< HEAD
  const [paymentModalIsOpen, setIsPaymentOpen] = useState(true);
  const [index, setIndex] = useState(0);
=======
  const [paymentModalIsOpen, setIsPaymentOpen] = useState(false);
>>>>>>> a8c8cb4dc4837ce71f9a6ff5a1e721eca04edb49
  const account = useAccount();

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
      <Header setIsPaymentOpen={setIsPaymentOpen} />
      <div className={styles.container} id="container">
        <PaymentModal
          modalIsOpen={paymentModalIsOpen}
          setIsOpen={setIsPaymentOpen}
        />
        <img src={SVG} alt="" className={styles.sanat} />
        <div className={styles.inner_container}>
          <Sidebar />
          <div>
            <h1>
              <TextTransition springConfig={presets.wobbly}>
                {TEXTS[index % TEXTS.length]}
              </TextTransition>
            </h1>
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
