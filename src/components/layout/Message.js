import { useEffect, useState } from "react";
import styles from "./Message.module.css";
import { useLocation } from "react-router-dom";

function Message({ type, msg }) {
  const [visible, steVisible] = useState(false);

  useEffect(() => {
    if (msg) {
      steVisible(true);
      setTimeout(() => {
        steVisible(false);
      }, 3000);
    }
  }, [msg]);

  return (
    <>
      {visible && (
        <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
      )}
    </>
  );
}

export default Message;
