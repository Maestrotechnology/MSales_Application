import { ConfigProvider } from "antd";
import classes from "./inputs.module.css";
import TextArea from "antd/es/input/TextArea";
import { Preventspace, removeEmojis } from "../../Shared/Methods";

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
  errormsg?: string | any;
  required?: boolean;
  labelstyle?: boolean;
  preventspace?: boolean;
  onKeyDown?: (e: any) => void;
  removeemoji?: boolean;
  onBlur?: (value: any) => void;
};
export const CommonTextArea = ({
  value,
  placeholder,
  onChange,
  disabled = false,
  styles,
  maxLength,
  name,
  errormsg,
  required = false,
  labelstyle = false,
  preventspace,
  onKeyDown,
  removeemoji = true,
  onBlur,
}: Props) => {
  return (
    <div className={classes.fieldcontainer}>
      {name && (
        <p
          className="label"
          //   style={{ minHeight: labelstyle ? "45px" : "30px" }}
        >
          {name ? name : "Name"}&nbsp;
          <span className="required">{required ? "*" : ""}</span>
        </p>
      )}
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
        <TextArea
          placeholder={placeholder}
          value={value}
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
          rows={5}
          style={{
            ...styles,
            background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
            height: "20px",
          }}
          autoSize={{ minRows: 4, maxRows: 4 }}
          maxLength={maxLength}
          className={classes.borderinput}
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
        />
      </ConfigProvider>
      {errormsg && <p className={classes.errorText}>{errormsg}</p>}
    </div>
  );
};
