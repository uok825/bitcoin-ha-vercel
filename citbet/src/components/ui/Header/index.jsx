import styles from "./Header.module.css";
import { ConnectKitButton } from "connectkit";

import Betrea from "../../../assets/betrea.svg";
import BTC from "../../../assets/btc.svg";

// eslint-disable-next-line react/prop-types
function Header({ setIsPaymentOpen }) {
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
              <p className={styles.balance_text}>0,001</p>
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
