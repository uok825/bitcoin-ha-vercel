import { useState } from "react";
import ReactModal from "react-modal";

import styles from "./PaymentModal.module.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "19px",
    border: "none",
    backgroundColor: "rgba(247, 211, 194, 0.32)",
  },
};

ReactModal.setAppElement("#root");

// eslint-disable-next-line react/prop-types
function PaymentModal({ modalIsOpen, setIsOpen }) {
  const [isWithdraw, setIsWithdraw] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Modal"
      >
        <div className={styles.container}>
          <div className={styles.inner_container}>
            <div>
              <div className={styles.button_container}>
                <button
                  type="button"
                  className={styles.button_primary}
                  onClick={() => setIsWithdraw(false)}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  className={styles.button_secondary}
                  onClick={() => setIsWithdraw(true)}
                >
                  Withdraw
                </button>
              </div>
              <div className={styles.input_container}>
                <div>
                  <h5 className={styles.input_desc}>
                    Amount to withdraw Bitcoin
                  </h5>
                  <input
                    type="text"
                    placeholder="Amount"
                    className={styles.input}
                  />
                </div>
                {isWithdraw && (
                  <div>
                    <h5 className={styles.input_desc}>Your wallet address</h5>
                    <input
                      type="text"
                      placeholder="Address"
                      className={styles.input}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <button className={styles.cancel}>Cancel</button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default PaymentModal;
