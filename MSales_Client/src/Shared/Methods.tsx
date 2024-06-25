import { getCatchMsgType } from "./Types.d";
import { toast } from "react-toastify";
import { REGEX, encript_KEY } from "./Constants";
import { getCookie, setCookie } from "../Store/Storage/Cookies";
import dayjs from "dayjs";

// export default function Methods() {
//   return <div>Methods</div>;
// }
export function getCatchMsg(error: getCatchMsgType) {
  if (error?.message === "canceled") {
    return;
  }
  if (error?.response?.data?.detail) {
    return Array.isArray(error?.response?.data?.detail)
      ? toast.error(error?.response?.data?.detail?.[0]?.msg)
      : toast.error(error?.response?.data?.detail?.msg);
  } else if (error.response) {
    if (error.response.status === 404) {
      toast.error("The requested resource does not exist or has been deleted");
    } else if (error.response.status === 401) {
      toast.error("Please login to access this resource!");
    } else if (error.response.status === 500) {
      toast.error("Internal Server Error !");
    } else {
      toast.error("An error occurred");
    }
  } else if (error.request) {
    toast.error("Unable to connect to the server !");
  } else {
    return "Something went wrong!";
  }
}

export const getTableSNO = (page: number, size?: any, index?: any) => {
  return (page - 1) * size + (index + 1);
};

export const Number_Validation = (value?: any) => {
  if (value.match(REGEX.NUMBER_REGEX) || value === "") {
    return true;
  } else {
    return false;
  }
  // return !isNaN(value)  value === "" ? true : false;
};

// decrypt data
export const handelLogout = () => {
  setCookie("logindata", null, null);
  window.location.reload();
};

export const DecryptToken = (encriptText: string) => {
  var CryptoJS = require("crypto-js");
  var bytes = CryptoJS.AES.decrypt(encriptText, encript_KEY);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

// Encrypt Data

export const EncryptData = (token: string) => {
  var CryptoJS = require("crypto-js");
  var EncryptData = CryptoJS.AES.encrypt(token, encript_KEY).toString();
  return EncryptData;
};

// convert json to formData

export const JSONtoformdata = (object: any) => {
  const formData = new FormData();
  for (const key in object) {
    if (object[key] !== "" && object[key] !== null) {
      formData.append(
        key,
        typeof object[key] === "string" ? object[key].trim() : object[key]
      );
    }
  }
  return formData;
};

export const replaceText = (val: string, preventspace = false) => {
  if (preventspace) {
    return val.replace(/[^a-zA-Z-/]+/g, "");
  } else {
    return val.replace(/[^a-zA-Z-/ ]+/g, "");
  }
};

//prevent special char

export const checkSpecialChar = (e: any) => {
  if (!/[0-9a-zA-Z]/.test(e.key)) {
    e.preventDefault();
  }
};
// export const

export const Addressvalidation = (e: any) => {
  if (!/[0-9 a-zA-Z,/]/.test(e.key)) {
    e.preventDefault();
  }
};

export const Preventspace = (event: any) => {
  if (event.keyCode === 32) {
    return event.preventDefault();
  }
};

export const removeEmojis = (string: any) => {
  var regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, "");
};

// check if object values is available

export const CheckValueAvailable = (Obj: any) => {
  return Object.values(Obj).find(
    (ele) => ele !== "" && ele !== undefined && ele !== null
  );
};

export const SeriesMethods = (array: any[]) => {
  if (array.length < 3) {
    return "10%";
  } else {
    return "55%";
  }
};

export const CheckisChangedData = (state: any, values: any) => {
  if (
    (values?.lead_id && state?.leadStatusId !== values?.lead_id) ||
    (values?.competitor_id &&
      state?.leadStatusId === 7 &&
      values?.competitor_id !== state?.competitor_id) ||
    (state?.competitor_id === 1 &&
      values?.competitor_Othername &&
      state?.competitorName !== values?.competitor_Othername) ||
    (values?.comment && values?.comment !== state?.leadComment)
  ) {
    return true;
  } else {
    return false;
  }
};

export const CheckischangedLead = (state: any, values: any) => {
  let dealer_id = state?.dealerId ? state?.dealerId : null;
  let dealer = values?.dealer_id ? values?.dealer_id : null;
  let employee_id = state?.employee_id ? state?.employee_id : null;
  let employee = values?.emp_id ? values?.emp_id : null;
  let comment = values?.comment ? values?.comment : null;
  let statecomment = state?.transferComment ? state?.transferComment : null;

  if (
    dealer_id !== dealer ||
    employee_id !== employee ||
    comment !== statecomment
  ) {
    return true;
  } else {
    return false;
  }
};

export const getvalidData = (data: any) => {
  let fildValue = data?.find((item: any) => item?.value !== 0);
  return fildValue ? true : false;
};

export const Cookieget = () => {
  return getCookie("logindata");
};

export const GetreportDates = () => {
  const currentYear = new Date().getFullYear(); //start date of the year
  const start_date = dayjs(new Date(currentYear, 0, 1)).format(
    "YYYY-MM-DD 00:00:00"
  );
  const end_date = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
  return { start_date: start_date, end_date: end_date };
};

export const getDates = (start: any, end: any) => {
  if (new Date(start).getFullYear() === new Date(end).getFullYear()) {
    return dayjs(start).format("YYYY");
  } else {
    return `${dayjs(start).format("YYYY")} - ${dayjs(end).format("YYYY")}`;
  }
};

export const isImage = (url: any) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg|tiff|heif|bmp|ico)$/.test(url);
};

export const isFormDirty = (initialValues: any, values: any) => {
  return !Object.keys(initialValues).every(
    // @ts-ignore
    (key: string) =>
      JSON.stringify(initialValues[key]) === JSON.stringify(values[key])
  );
};

export const cancelApi = (controller: AbortController | null) => {
  if (controller) {
    controller.abort("cancelled");
  }
};

// export const isValidNumber = (phone?: string, code?: string) => {
//   if (phone && code) {
//     const parsedNumber = parsePhoneNumberFromString(phone, {
//       defaultCallingCode: code?.replace("+", ""),
//     });
//     return parsedNumber?.isValid() ? true : false;
//   }
//   return true;
// };

export const isValidNumber = (phone?: string, length?: number[]) => {
  if (phone && length) {
    return length?.includes(phone?.length);
  }
  return true;
};

export function isNumericString(input: string) {
  const regex = /^[0-9]+$/;

  return regex.test(input);
}

export function removeNonNumericCharacters(input: string) {
  const numericOnly = input.replace(/[^0-9]/g, "");
  return numericOnly;
}

export const JSONtoformdataWithSameKey = (
  object: any,
  arrObj?: {
    key: string;
    value: any[];
  }
) => {
  const formData = new FormData();
  for (const key in object) {
    if (object[key] !== "") {
      formData.append(
        key,
        typeof object[key] === "string" ? object[key]?.trim() : object[key]
      );
    }
  }
  if (arrObj && arrObj?.value?.length > 0) {
    arrObj?.value?.map((item) => {
      return formData.append(arrObj.key, item);
    });
  }

  return formData;
};
