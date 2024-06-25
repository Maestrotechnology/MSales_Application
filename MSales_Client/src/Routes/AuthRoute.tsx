import AuthLayout from "../Layouts/AuthLayout";
import ChangePassword from "../Screens/Authentications/ChangePassword";
import Forgotpassword from "../Screens/Authentications/Forgotpassword";
import OtpVerification from "../Screens/Authentications/OtpVerification";
import UserLogin from "../Screens/Authentications/UserLogin";

export const AuthRoutes = {
  element: <AuthLayout />,
  path: "/",
  children: [
    {
      index: true,
      path: "/login?",
      element: <UserLogin />,
    },
    {
      path: "/forgotpassword",
      element: <Forgotpassword />,
    },

    {
      path: "/otpverification",
      element: <OtpVerification />,
    },
    {
      path: "/changepassword",
      element: <ChangePassword />,
    },
  ],
};
