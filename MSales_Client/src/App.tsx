import { useEffect } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { routerpaths } from "./Routes/Index";
import { getCookie } from "./Store/Storage/Cookies";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAccessData,
  handleCheckIndata,
  handleStoreToken,
} from "./Store/Redux/Reducers/AuthReducers";
import { DecryptToken } from "./Shared/Methods";

const router = createHashRouter(routerpaths);

function App() {
  const dispatch = useDispatch();
  const { sessionmodal } = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    if (getCookie("logindata") && getCookie("logindata") !== "") {
      let cookie = getCookie("logindata");
      let checkIndata =
        getCookie("LoginTime") === "null" ? null : getCookie("LoginTime");
      if (cookie) {
        let data = JSON?.parse(DecryptToken(JSON.parse(cookie)));
        dispatch(handleStoreToken(data.token));
        dispatch(handleAccessData(data));
        dispatch(handleCheckIndata(checkIndata));
      }
    }
  }, [getCookie("logindata")]);

  return <RouterProvider router={router} />;
}

export default App;
