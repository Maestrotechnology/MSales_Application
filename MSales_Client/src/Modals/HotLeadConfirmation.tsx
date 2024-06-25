import classes from "./modal.module.css";
import warnigicon from "../Asserts/Icons/bookmarkActive.svg";
import CommonButton from "../Components/CommonButton/CommonButton";
// import CommonButton from "../../Components/Commoncomponents/Commonbtn";

interface modalProps {
  msg?: string;
  handlefunction?: () => void;
  close?: () => void;
  btnTitle?: string;
}

export default function HotLeadConfirmation({
  msg,
  handlefunction,
  close,
  btnTitle,
}: modalProps) {
  return (
    <>
      <div className={classes.modalmsgblock}>
        <img
          src={warnigicon}
          alt="warning"
          className={classes.deletemodalwarningicon}
        />
        <div className={classes.deletemodaltext}>
          <p className={classes.confirmation_head}>{msg}</p>
          {/* <p className={classes.confirmation_msg}>
            This action will permanently delete the selected data. Confirm?
          </p> */}
        </div>
      </div>
      <div className={classes.btnactionblock} style={{ marginTop: "0px" }}>
        <CommonButton
          color="#004c97"
          onClick={handlefunction}
          name={btnTitle}
        />
        <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
      </div>
    </>
  );
}
