import "./App.css";
import "./lib/firebase";
import { useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import { auth, signInWithGoogle, signOut } from "./lib/auth";
import { getUser } from "./lib/storage";

import { Header } from "./components";

function App() {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      const user = getUser(account.address);
      console.log(user);
    }
  }, [account]);

  return (
    <>
      <Header />
      <ConnectKitButton />
      <p onClick={() => signInWithGoogle()}>selam</p>
      <p onClick={() => console.log(auth?.currentUser)}>auth</p>
      <p onClick={() => signOut()}>sign out</p>
    </>
  );
}

export default App;
