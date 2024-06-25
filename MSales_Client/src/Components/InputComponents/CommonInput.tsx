import { ConfigProvider, Input, Select } from "antd";
import classes from "./inputs.module.css";
import { Preventspace, removeEmojis } from "../../Shared/Methods";
import { useId } from "react";
// import Required from "../Commoncomponents/Required";
// import Errortext from "../Commoncomponents/Errortext";

type Props = {
  value?: any;
  placeholder?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  disabled?: boolean;
  styles?: any;
  maxLength?: number;
  numbervalue?: number;
  min?: string;
  isFuture?: boolean;
  name?: string;
  errormsg?: any;
  required?: boolean;
  file?: boolean;
  labelstyle?: boolean;
  onKeyDown?: (e: any) => void;
  onPressEnter?: (e: any) => void;
  ref?: any;
  preventspace?: boolean;
  removeemoji?: boolean;
  isCountryCode?: boolean;
  onchangeCountryCode?: (e: any, option: any) => void;
  countryDropdownlist?: any;
  countrycodevalue?: any;
  quotaionstyle?: boolean;
  quotationfieldstyle?: any;
  optionFilterProp?: string;
  align?: "stretch" | "center" | "flex-start" | "flex-end" | "baseline";
  disableCountryCode?: boolean;
  fullWidth?: boolean;
  allowClear?: boolean;
  id?: string;
};
export const Commoninput = ({
  value,
  placeholder,
  onChange,
  disabled = false,
  styles,
  maxLength,
  name,
  errormsg,
  required = false,
  file,
  labelstyle = false,
  ref,
  isCountryCode = false,
  onKeyDown,
  onPressEnter,
  preventspace = false,
  onBlur,
  removeemoji = true,
  align,
  countryDropdownlist,
  countrycodevalue,
  onchangeCountryCode,
  quotaionstyle = false,
  quotationfieldstyle,
  optionFilterProp,
  disableCountryCode,
  fullWidth,
  allowClear = false,
  id = "input",
}: Props) => {
  return (
    <div
      style={{
        alignItems: align,
      }}
      className={classes.fieldcontainer}
    >
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorPrimary: "red",
              algorithm: true, // Enable algorithm
            },
          },
        }}
      >
        {name && (
          <p
            className="label"
            // style={{ minHeight: labelstyle ? "45px" : "30px" }}
          >
            {name ? name : "Name"}&nbsp;
            <span className="required">{required ? "*" : ""}</span>
          </p>
        )}
        <div
          style={{
            width: fullWidth ? "100%" : "",
          }}
          className={
            isCountryCode
              ? quotaionstyle
                ? quotationfieldstyle
                : classes.nameInputblock
              : ""
          }
        >
          {isCountryCode && (
            <div className={classes.countrybox}>
              <Select
                style={{
                  height: "40px",
                  width: "90px",
                }}
                showSearch={true}
                options={countryDropdownlist}
                className={"selectdropdown"}
                value={countrycodevalue}
                onChange={onchangeCountryCode}
                dropdownStyle={{
                  width: "200px", // Adjust the width as needed
                }}
                optionLabelProp={countrycodevalue}
                optionFilterProp={optionFilterProp || "label"}
                filterOption={(input, option: any) =>
                  (option[optionFilterProp || "label"] ?? "")
                    .toLocaleLowerCase()
                    .includes(input.toLocaleLowerCase())
                }
                disabled={disableCountryCode}
              />
            </div>
          )}
          <Input
            placeholder={placeholder}
            value={value}
            ref={ref}
            // id={id}
            onPressEnter={(e) => {
              if (onPressEnter) {
                onPressEnter(e);
              }
            }}
            onChange={(e) => {
              if (onChange) {
                if (removeemoji) {
                  onChange(removeEmojis(e.target.value));
                } else {
                  onChange(e.target.value);
                }
              }
            }}
            onBlur={onBlur}
            disabled={disabled}
            style={{
              ...styles,
              background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
              marginRight: isCountryCode ? "5px" : "0px",
            }}
            maxLength={maxLength}
            className={`input ${classes.borderinput}`}
            onKeyDown={(e) => {
              if (onKeyDown) {
                if (preventspace) {
                  onKeyDown(Preventspace(e));
                } else {
                  onKeyDown(e);
                }
              } else {
                if (preventspace) {
                  Preventspace(e);
                }
              }
            }}
            allowClear={allowClear}
          />
        </div>
        {errormsg && <p className={classes.errorText}>{errormsg}</p>}
      </ConfigProvider>
    </div>
  );
};
