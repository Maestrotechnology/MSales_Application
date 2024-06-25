import { DatePicker } from "antd";
import dayjs from "dayjs";
import classes from "./inputs.module.css";
import moment from "moment";
// import Errortext from "../Commoncomponents/Errortext";
// import Required from "../Commoncomponents/Required";

type Props = {
  value?: any;
  placeholder?: string;
  onChange?: (date: any, dateString: any) => void;
  disabled?: boolean;
  styles?: any;
  maxLength?: number;
  numbervalue?: number;
  min?: string;
  isFuture?: boolean;
  name?: string;
  errormsg?: string | any;
  required?: boolean;
  formate?: string;
  showTime?: boolean;
  endDate?: any;
  startDate?: any;
  picker?: any;
  size?: any;
  disablefuture?: boolean;
  labelstyle?: boolean;
  disabletime?: boolean;
  disableDate?: boolean;
  allowClear?: boolean;
  isPast?: boolean;
  disablePastTime?: boolean;
};
export const CommonDate = ({
  value,
  placeholder,
  onChange,
  disabled = false,
  styles,
  isFuture = true,
  name,
  errormsg,
  required,
  formate = "YYYY-MM-DD",
  endDate,
  startDate,
  showTime = false,
  picker = "date",
  disablefuture = false,
  size,
  disabletime = false,
  labelstyle = false,
  disableDate = false,
  allowClear = true,
  isPast = false,
  disablePastTime = false,
}: Props) => {
  // const disableFutureDt = (date: any) => {
  //   if (isFuture && endDate) {
  //     return date.isAfter(new Date(endDate)) && date.isAfter(new Date());
  //   } else if (isFuture && startDate) {
  //     return date.isBefore(new Date(startDate)) && date.isBefore(new Date());
  //   } else if (isFuture) {
  //     return date.isAfter(new Date());
  //   }
  // };
  const disableFutureDt = (date: any) => {
    if (isFuture) {
      if (startDate || endDate) {
        let startCheck = true;
        let endCheck = true;
        if (startDate) {
          startCheck =
            (date && date < dayjs(startDate, "YYYY-MM-DD")) ||
            date > dayjs(new Date());
        }
        if (endDate) {
          endCheck = date && date > dayjs(endDate, "YYYY-MM-DD");
        }
        return (startCheck && startDate) || (endCheck && endDate);
      } else {
        return date.isBefore(moment(new Date()).format("YYYY-MM-DD"));
      }
    }
    // else if (isPast) {
    //   return date.isAfter(new Date());
    // }
  };
  const disabledHourMinutes = (type: "hour" | "minute"): number[] => {
    const current = type === "hour" ? moment().hour() : moment().minute() + 1;
    const disabledArray = [];
    for (let i = current - 1; i >= 0; i--) {
      disabledArray.push(i);
    }
    return disabledArray || [];
  };

  return (
    <div className={classes.fieldcontainer}>
      {name && (
        <p
          className="label"
          //   style={{ minHeight: labelstyle ? "45px" : "30px" }}
        >
          {name}
          {/* {required ? <Required /> : ""} */}
          <span className="required">{required ? "*" : ""}</span>
        </p>
      )}
      <DatePicker
        allowClear={allowClear}
        showTime={
          showTime
            ? false
            : {
                disabledTime: (date) => {
                  return {
                    disabledHours: () =>
                      disablePastTime &&
                      dayjs(date)?.format("YYYY-MM-DD") ===
                        dayjs()?.format("YYYY-MM-DD")
                        ? disabledHourMinutes("hour")
                        : [],
                    disabledMinutes: () =>
                      disablePastTime &&
                      dayjs(date)?.format("YYYY-MM-DD") ===
                        dayjs()?.format("YYYY-MM-DD")
                        ? disabledHourMinutes("minute")
                        : [],
                  };
                },
              }
        }
        format={formate}
        popupStyle={{ zIndex: 11000 }}
        placeholder={placeholder}
        value={value ? dayjs(value) : null}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...styles,
          background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
        }}
        className={classes.borderinput}
        disabledDate={(date) => (disableDate ? disableFutureDt(date) : null)}
        // disabledTime={(date: Dayjs) => disableFutureTime(date)}
        picker={picker}
        size={size}
      />
      {errormsg ? <p className={classes.errorText}>{errormsg}</p> : ""}
    </div>
  );
};
