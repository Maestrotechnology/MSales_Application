import classes from "./modal.module.css";
import logout_image from "../Asserts/Images/logoutImage.png";
import CommonButton from "../Components/CommonButton/CommonButton";
// import CommonButton from "../../Components/Commoncomponents/Commonbtn";

interface modalProps {
  msg?: string;
  handlefunction?: () => void;
  close?: () => void;
}

export default function LogOutConfirmation({
  msg,
  handlefunction,
  close,
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
            {"Are you sure want to logout?"}
          </p>
          <p className={classes.confirmation_msg}>
            Logging out will take you to the main login screen. Proceed?"
          </p>
        </div>
      </div>
      <div className={classes.btnactionblock} style={{ marginTop: "0px" }}>
        <CommonButton color="#004c97" onClick={handlefunction} name="Logout" />
        <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
      </div>
    </>
  );
}
