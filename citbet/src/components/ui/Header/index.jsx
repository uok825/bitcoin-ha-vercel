import styles from "./Header.module.css";

import Betrea from "../../../assets/betrea.svg";

function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <div className={styles.logo_inner_container}>
          <img src={Betrea} alt="" className={styles.logo} />
        </div>
      </div>
      <div className={styles.cashier_container}>
        <div className={styles.cashier_inner_container}>
          <div>Balance</div>
          <div>Cashier</div>
        </div>
      </div>
      <div className={styles.connect_container}>
        <div>Login</div>
      </div>
    </div>
  );
}

export default Header;
