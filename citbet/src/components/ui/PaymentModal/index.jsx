import { useState, useRef } from "react";
import ReactModal from "react-modal";
import styles from "./PaymentModal.module.css";
import { withdraw } from "../../../utils/fetchFunctions";

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

function PaymentModal({ modalIsOpen, setIsOpen }) {
  const [isWithdraw, setIsWithdraw] = useState(false);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const textAreaRef = useRef(null);

  const withdrawBitcoin = async () => {
    const amount = document.querySelector(".input").value;
    const address = document.querySelector(".input").value;
    await withdraw(parsedUser.mSigWallet, amount, address);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const copyToClipboard = () => {
    textAreaRef.current.select();
    document.execCommand("copy");
  };

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
                  className={
                    isWithdraw ? styles.button_secondary : styles.button_primary
                  }
                  onClick={() => setIsWithdraw(false)}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  className={
                    isWithdraw ? styles.button_primary : styles.button_secondary
                  }
                  onClick={() => setIsWithdraw(true)}
                >
                  Withdraw
                </button>
              </div>
              {!isWithdraw && (
                <div className={styles.deposit_container}>
                  <h5 className={styles.input_desc}>Your Wallet Address</h5>
                  <div className={styles.textarea_container}>
                    <textarea
                      ref={textAreaRef}
                      className={styles.textarea}
                      value={parsedUser?.mSigWallet || ""}
                      readOnly
                    />
                    <button
                      onClick={copyToClipboard}
                      className={styles.copy_button}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.input_container}>
                {isWithdraw && (
                  <div>
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
                    <h5 className={styles.input_desc}>Your wallet address</h5>
                    <input
                      type="text"
                      placeholder="Address"
                      className={styles.input}
                    />
                    <button
                      className={styles.withdraw_button}
                      onClick={withdrawBitcoin}
                    >
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <button className={styles.cancel} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default PaymentModal;
