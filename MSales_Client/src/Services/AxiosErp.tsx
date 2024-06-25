import axios from "axios";
import { erpBaseUrl } from "./ServiceConstants";
import { getCookie, setCookie } from "../Store/Storage/Cookies";
import { DecryptToken, EncryptData, getCatchMsg } from "../Shared/Methods";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: erpBaseUrl,
});

instance.interceptors.request.use(
  (request) => {
    const userlog = getCookie("erpLoginData")
      ? JSON?.parse(DecryptToken(JSON.parse(getCookie("erpLoginData"))))
      : null;

    if (userlog) {
      request.headers["Authorization"] = `Bearer ${userlog.access_token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response: any) => {
    if (response?.data?.status === -1) {
      setCookie("logindata", null, null);
      window.location.href = "/maestro_sales";
      toast.error("Your login session expires.Please login later.");
    } else {
      return response;
    }
  },
  function (error) {
    getCatchMsg(error);
  }
);

instance.interceptors.response.use((response) => {
  if (response.data.token) {
    setCookie("logindata", EncryptData(JSON.stringify(response.data)));
  }
  return response;
});

export default instance;
