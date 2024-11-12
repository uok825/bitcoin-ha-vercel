import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

import {
  where,
  query,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { genSecret } from "../utils/nostr";
import { createAccount } from "../utils/fetchFunctions";

const getUser = async (address) => {
  if (!address) {
    return undefined;
  }

  const userRef = collection(db, "users");
  const q = query(userRef, where("pubKey", "==", address));

  const querySnapshot = await getDocs(q);

  console.log("çalıştı");

  let temp = undefined;

  querySnapshot.forEach((doc) => {
    temp = doc.data();
  });

  const multisigAddress = await createAccount(address);
  const keys = await genSecret();

  if (!temp) {
    await setDoc(doc(db, "users", uuidv4()), {
      pubKey: address,
      privKey: null,
      mSigWallet: multisigAddress.wallet,
      nostrPub: keys.public,
      nostrSk: keys.secretHex,
    });
  }

  return temp;
};

export { getUser };
