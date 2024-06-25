import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCookie } from "../Store/Storage/Cookies";
import { DecryptToken } from "../Shared/Methods";
import { LoginUserData } from "../Shared/Constants";

export const AuthPrivateRoute = () => {
  return getCookie("logindata") ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const DashboardPrivateRoute = () => {
  if (!getCookie("logindata")) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};
export const DealerPrivateRoute = () => {
  const loginUserData = LoginUserData();

  return loginUserData && loginUserData?.userType !== 3 ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
};
export const AdminPrivateRoute = () => {
  const loginUserData = LoginUserData();
  return loginUserData && loginUserData?.userType === 2 ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
};
export const SuperAdminPrivateRoute = () => {
  const loginUserData = LoginUserData();
  return loginUserData && loginUserData?.userType === 1 ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
};
export const ProtectedRouter = ({ userType }: { userType: number }) => {
  const loginUserData = LoginUserData();

  return loginUserData && loginUserData?.userType === userType ? (
    <Navigate to={"/dashboard"} />
  ) : (
    <Outlet />
  );
};
export const OtpRouter = () => {
  let { state } = useLocation();

  return !state ? <Navigate to={"/"} /> : <Outlet />;
};
