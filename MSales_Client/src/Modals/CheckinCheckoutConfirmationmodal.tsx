import classes from "./modal.module.css";
import logout_image from "../Asserts/Icons/checkout.png";
import CommonButton from "../Components/CommonButton/CommonButton";
// import CommonButton from "../../Components/Commoncomponents/Commonbtn";

interface modalProps {
  msg?: string;
  handlefunction?: () => void;
  close?: () => void;
  btnName?: string;
  textmsg?: string;
  showWorkreportbtn?: boolean;
  editReport?: () => void;
}

export default function CheckInModal({
  msg,
  handlefunction,
  close,
  btnName,
  textmsg,
  editReport,
  showWorkreportbtn,
}: modalProps) {
  return (
    <>
      <div className={classes.modalmsgblock}>
        <img
          src={logout_image}
          alt="warning"
          className={classes.deletemodalwarningicon}
        />
        <div className={classes.deletemodaltext}>
          <p className={classes.confirmation_head}>
            {" "}
            {`Are you sure want to ${msg}`}
          </p>
          <p className={classes.confirmation_msg}>{textmsg}</p>
        </div>
      </div>

      <div className={classes.btnactionblock} style={{ marginTop: "0px" }}>
        <CommonButton color="#004c97" onClick={handlefunction} name={btnName} />
        {showWorkreportbtn ? (
          <CommonButton
            color="#2AB97A"
            onClick={editReport}
            name="Work Report"
          />
        ) : null}
        <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
      </div>
    </>
  );
}
