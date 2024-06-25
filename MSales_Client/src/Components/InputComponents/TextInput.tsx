import React from "react";
import classes from "./inputs.module.css";
import TextField from "@mui/material/TextField";
import { Theme, makeStyles } from "@material-ui/core";
import { InputTextbox } from "./Types.d";
import user_icon from "../../Asserts/Icons/UserIcon.png";
import key_icon from "../../Asserts/Icons/key.png";
import { removeEmojis } from "../../Shared/Methods";
const useStyles = makeStyles((theme) => ({
  input: {
    "& .MuiTextField-root": {
      width: "100%",
      height: "50px",
      //   marginTop: "20px",
      marginBottom: "10px",
    },
    "& .MuiInputBase-input": {
      marginRight: "30px !important",
    },
  },
}));
export default function TextInput({
  label,
  onChangeText,
  errorText,
  types,
  IconImage,
  TextLength,
  insecure_image,
  showpassword,
  setShowPassword,
  focusref,
  onKeyDown,
  value,
  isemail = false,
}: InputTextbox) {
  const style = useStyles();
  return (
    <>
      <div className={style.input}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            inputRef={focusref}
            // focused={false}

            fullWidth
            id="outlined-required"
            inputProps={{ maxLength: TextLength, autocomplete: "new-password" }}
            onChange={(e) => {
              onChangeText(removeEmojis(e.target.value));
            }}
            onKeyDown={(e) => {
              if (onKeyDown) {
                onKeyDown(e);
              }
            }}
            label={label}
            type={types}
            value={value}
          />
          {IconImage === "user" ? (
            <div>
              <img
                className={isemail ? classes.keyicon : classes.inputIcons}
                src={isemail ? insecure_image : user_icon}
                alt="icon"
                style={{ zIndex: "1" }}
              />
            </div>
          ) : (
            <div
              style={{ zIndex: "1" }}
              onClick={() => {
                // @ts-ignore
                setShowPassword(!showpassword);
              }}
            >
              <img
                style={{ zIndex: "1" }}
                className={showpassword ? classes.unlockicon : classes.lockicon}
                src={insecure_image}
                alt="icon"
                // onClick={()=>{

                // }}
              />
            </div>
          )}
        </div>
        {errorText ? <p className={classes.errorTxt}>{errorText}</p> : null}
      </div>
    </>
  );
}
