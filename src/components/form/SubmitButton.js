import React from "react";
import styles from "./SubmitButton.module.css";

function SubmittButton({ text }) {
  return (
    <div>
      <button className={styles.btn}>{text}</button>
    </div>
  );
}

export default SubmittButton;
