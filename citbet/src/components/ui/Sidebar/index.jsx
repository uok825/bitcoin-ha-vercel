import styles from "./Sidebar.module.css";

import BTC from "../../../assets/btc.svg";
import ETH from "../../../assets/ETH.svg";

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.list_container}>
        <div className={styles.list_item_container}>
          <div className={styles.list_item_name_container}>
            <img src={BTC} alt="" />
            <h3 className={styles.list_item_name}>BTC Prize Prediction</h3>
          </div>
          <div className={styles.list_border} />
        </div>
        <div className={styles.list_item_container}>
          <div className={styles.list_item_name_container}>
            <img src={ETH} alt="" />
            <h3 className={styles.list_item_name}>ETH Prize Prediction</h3>
          </div>
          <div className={styles.list_border} />
        </div>
        <div className={styles.list_item_container}>
          <div className={styles.list_item_name_container}>
            <div style={{ width: 24, height: 24 }} />
            <h3 className={styles.list_item_name}>Esadoshi Prize Prediction</h3>
          </div>
          <div className={styles.list_border} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
