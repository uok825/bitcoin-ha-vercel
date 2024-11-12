import styles from "./Header.module.css";
import { ConnectKitButton } from "connectkit";
import { getBalance } from "../../../utils/fetchFunctions";
import { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import Betrea from "../../../assets/betrea.svg";
import BTC from "../../../assets/btc.svg";

// eslint-disable-next-line react/prop-types
function Header({ setIsPaymentOpen }) {
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!parsedUser) return;

    const fetchBalance = async () => {
      const fetchedBalance = await getBalance(parsedUser.mSigWallet);
      const stringNumber =
        BigNumber.from(fetchedBalance.result).toString() / 1e18;

      setBalance(stringNumber);
    };

    fetchBalance();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <div className={styles.logo_inner_container}>
          <img src={Betrea} alt="" className={styles.logo} />
        </div>
      </div>
      <div className={styles.cashier_container}>
        <div className={styles.cashier_inner_container}>
          <div className={styles.balance_container}>
            <div className={styles.balance_image_container}>
              <img src={BTC} alt="" className={styles.btc_image} />
            </div>
            <div className={styles.balance_text_container}>
              <p className={styles.balance_text}>{balance}</p>
            </div>
          </div>
          <div
            className={styles.cashier_button_container}
            onClick={() => setIsPaymentOpen(true)}
          >
            <h1 className={styles.cashier_text}>Cashier</h1>
          </div>
        </div>
      </div>
      <div className={styles.connect_container}>
        <div className={styles.connect}>
          <ConnectKitButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
