import { Select } from "antd";
import classes from "./inputs.module.css";
import { useState } from "react";
// import Errortext from "../Commoncomponents/Errortext";
// import Required from "../Commoncomponents/Required";
interface Selectprops {
  value?: any;
  placeholder?: string;
  onChange?: (value: any, data?: any) => void;
  disabled?: boolean;
  styles?: any;
  options?: any;
  label?: string;
  name?: string;
  errormsg?: any;
  required?: boolean;
  mode?: any;
  labelstyle?: boolean;
  allowClear?: boolean;
  optionFilterProp?: string;
  onkeydown?: (value: any) => void;
  ismain?: boolean;
  fortable?: boolean;
  onBlur?: (value: any) => void;
  hasNext?: (val: any) => void;
}
export const CommonSelect = ({
  value,
  placeholder,
  onChange,
  disabled = false,
  styles,
  label,
  options,
  name,
  errormsg,
  required,
  mode = false,
  allowClear = false,
  labelstyle = false,
  ismain = false,
  fortable = false,
  optionFilterProp,
  onBlur,
  onkeydown,
  hasNext,
}: Selectprops) => {
  const [scrollElementTop, setscrollElementTop] = useState(0);
  return (
    <div className={classes.fieldcontainer}>
      {name && (
        <p
          className="label"
          // style={{ minHeight: labelstyle ? "45px" : "30px" }}
        >
          {name}&nbsp;
          <span className="required">{required ? "*" : ""}</span>
          {/* {required ? <Required /> : ""} */}
        </p>
      )}

      <Select
        mode={mode}
        size="large"
        onBlur={onBlur}
        onPopupScroll={(e) => {
          const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
          if (scrollTop + clientHeight === scrollHeight && hasNext) {
            // if (!disableScroll) {
            setscrollElementTop(scrollTop);
            hasNext(scrollTop);
            // }
          }
        }}
        allowClear={allowClear}
        showSearch={true}
        options={options}
        dropdownStyle={{ zIndex: 11000 }}
        placeholder={placeholder}
        value={value}
        maxTagCount={"responsive"}
        // onInputKeyDown={(e) => {
        //   if (onkeydown) {
        //     onkeydown(e);
        //   }
        // }}
        onClick={(e) => {
          if (onkeydown) {
            onkeydown(e);
          }
        }}
        // defaultValue={value}
        // onKeyDown={(e) => {
        //   if (onkeydown) {
        //     onkeydown(e);
        //   }
        // }}
        onChange={onChange}
        disabled={disabled}
        optionFilterProp={optionFilterProp || "label"}
        filterOption={(input, option) =>
          (option[optionFilterProp || "label"] ?? "")
            .toLocaleLowerCase()
            .includes(input.toLocaleLowerCase())
        }
        style={{
          ...styles,
          border: "none",
          background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
          // paddingLeft: "20px",
        }}
        className={classes.borderinput}
      />
      {errormsg && <p className={classes.errorText}>{errormsg}</p>}
    </div>
  );
};
