import { Input } from "antd";
import classes from "./inputs.module.css";
import { Preventspace } from "../../Shared/Methods";
// import Errortext from "../Commoncomponents/Errortext";
// import Required from "../Commoncomponents/Required";

type Props = {
  value?: any;
  placeholder: string;
  onChange?: (value: any) => void;
  disabled?: boolean;
  styles?: any;
  maxLength?: number;
  numbervalue?: number;
  min?: string;
  isFuture?: boolean;
  name?: string;
  errormsg?: string;
  required?: boolean;
  labelstyle?: boolean;
  focus?: boolean;
  focusref?: any;
  onKeyDown?: (e: any) => void;
};

export const CommonPassword = ({
  value,
  placeholder,
  onChange,
  disabled = false,
  styles,
  maxLength,
  name = "",
  errormsg,
  required = false,
  focus = false,
  labelstyle = false,
  focusref,
  onKeyDown,
}: Props) => {
  return (
    <div className={classes.fieldcontainer}>
      {name && (
        <p className="label">
          {name ? name : "Name"}&nbsp;
          <span className="required">{required ? "*" : ""}</span>
        </p>
      )}
      <Input.Password
        // autoFocus={focus}
        ref={focusref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          Preventspace(e);
        }}
        disabled={disabled}
        style={{
          ...styles,
          background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
        }}
        maxLength={maxLength}
        className={classes.borderinput}
        // @ts-ignore
        autocomplete="new-password"
      />
      {errormsg && <p className={classes.errorText}>{errormsg}</p>}
      {/* {errormsg ? <Errortext msg={errormsg} /> : ""} */}
    </div>
  );
};
