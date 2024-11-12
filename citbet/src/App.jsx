import styles from "./App.module.css";
import "./lib/firebase";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getUser } from "./lib/storage";

import { Chatbox, Header, Sidebar } from "./components";

import SVG from "./assets/sanat.svg";
import PaymentModal from "./components/ui/PaymentModal";

function App() {
  const [paymentModalIsOpen, setIsPaymentOpen] = useState(true);
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      const user = getUser(account.address);
      console.log(user);
    }
  }, [account]);

  return (
    <div>
      <Header setIsPaymentOpen={setIsPaymentOpen} />
      <div className={styles.container} id="container">
        <PaymentModal
          modalIsOpen={paymentModalIsOpen}
          setIsOpen={setIsPaymentOpen}
        />
        <img src={SVG} alt="" className={styles.sanat} />
        <Sidebar />
        <Chatbox />
      </div>
      {/* <p onClick={() => signInWithGoogle()}>selam</p>
      <p onClick={() => console.log(auth?.currentUser)}>auth</p>
      <p onClick={() => signOut()}>sign out</p> */}
    </div>
  );
}

export default App;
