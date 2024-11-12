import styles from "./App.module.css";
import "./lib/firebase";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { getUser } from "./lib/storage";

import { Header, Sidebar } from "./components";

import SVG from "./assets/sanat.svg";

function App() {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      const user = getUser(account.address);
      console.log(user);
    }
  }, [account]);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <img src={SVG} alt="" className={styles.sanat} />
        <Sidebar />
      </div>
      {/* <p onClick={() => signInWithGoogle()}>selam</p>
      <p onClick={() => console.log(auth?.currentUser)}>auth</p>
      <p onClick={() => signOut()}>sign out</p> */}
    </div>
  );
}

export default App;
