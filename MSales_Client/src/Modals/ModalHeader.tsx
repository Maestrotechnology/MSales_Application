import React from "react";
import classes from "./modal.module.css";
export default function ModalHeader() {
  return (
    <div className={classes.popup}>
      <div className={classes.popup_head}>
        <div className={classes.popup_head_left}>
          <div className={classes.line}></div>
          <div>
            <h1 className={classes.Heading}>heading</h1>
          </div>
        </div>
      </div>
      {/* <img className={classes.close} src={close} alt="" onClick={onClose} /> */}
    </div>
  );
}
