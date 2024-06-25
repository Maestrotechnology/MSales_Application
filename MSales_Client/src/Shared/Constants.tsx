import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../Store/Storage/Cookies";
import { handleSessionModal } from "../Store/Redux/Reducers/DashboardReducers";

// REGEX
export const REGEX = {
  NAME_REGEX: /^[A-Za-z_ ]+$/,
  NUMBER_REGEX: /^[0-9]*$/,
  OTP: /^[0-9]{6}/,
  SPECIAL_CHARACTER_REGEX: /^[A-Za-z0-9 ]+$/,
  MOBILE_REGEX: /^[6-9]\d{9}$/,
  PASSWORD_REGEX: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  AMOUNT: /^[0-9][0-9]*[.]?[0-9]{0,2}$/,
  SIGN_AMOUNT: /^[-+|0-9]{1}[0-9]*[.]?[0-9]{0,2}$/,
  PASSWORD: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  SPECIAL_NAME_REXEX: /([^A-Za-z-/ ])/,
  Mobile_Phone: /^\+?(91)?-?0?([0-9]\d{9})$/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};
// Cookie Value
export const encript_KEY = "dummy_encrypt_key"; // a random sting for encrypt and decrypt
export const AuthToken = getCookie("logindata");

export const useToken = () => {
  return useSelector((state: any) => state.auth.token);
};
export const UserDataType = () => {
  return useSelector((state: any) => state.auth.Usertype);
};
export const LoginUserData = () => {
  return useSelector((state: any) => state.auth.LoginaccessData);
};
export const DispatchData = () => {
  let dispatch = useDispatch();
  return dispatch(handleSessionModal(true));
};

export const Inputlengths = {
  address: 500,
  Area: 200,
  Companyname: 250,
  descriptions: 3000,
  notes: 200,
  comments: 3000,
  common: 100,
  email: 100,
  name: 100,
  password: 20,
  fileName: 50,
  phonenumber: 20,
  remark: 1000,
};

// Items per page array
export const Data_SIZE = [
  { value: 10, label: "10 / page" },
  { value: 25, label: "25 / page" },
  { value: 50, label: "50 / page" },
  { value: 100, label: "100 / page" },
];
export const Dealerstatus = [
  {
    label: "Unassigned",
    value: 1,
  },
  {
    label: "Assigned",
    value: 2,
  },
  {
    label: "Demo",
    value: 3,
  },
  {
    label: "Quotation",
    value: 4,
  },
  {
    label: "Follow up",
    value: 5,
  },
  {
    label: "Order",
    value: 6,
  },
  {
    label: "Cancel",
    value: 7,
  },
];

export const FollowUpStatus = [
  { label: "Followup", value: 1 },
  { label: "Completed", value: 2 },
  {
    label: "Cancelled",
    value: 3,
  },
];
