import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Wallet } from "ethers";
import { genSecret } from "../utils/nostr";
import { createAccount } from "../utils/fetchFunctions";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const signInWithGoogle = () =>
  signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      const usersRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(usersRef);

      const wallet = Wallet.createRandom();
      const keys = await genSecret();

      const multisigAddress = await createAccount(wallet.address);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          pubKey: wallet.address,
          privKey: wallet.privateKey,
          mSigWallet: multisigAddress.wallet,
          nostrPub: keys.public,
          nostrSk: keys.secretHex,
        });
      }

      console.log(docSnap.data() && docSnap.data());
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

const signOut = () => {
  auth?.signOut().then(() => {
    window.location.reload();
  });
};

export { signInWithGoogle, signOut, auth };
