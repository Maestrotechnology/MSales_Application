import { RouteObject } from "react-router-dom";
import Notfound from "../Components/ErrorElement/NotFound";
import { AuthRoutes } from "./AuthRoute";
import { DashboardRoute } from "./DashboardRoute";
import { AuthPrivateRoute, DashboardPrivateRoute } from "./PrivateRoute";
export const routerpaths: RouteObject[] = [
  {
    element: <AuthPrivateRoute />,
    children: [AuthRoutes],
    errorElement: <Notfound />,
  },
  {
    element: <DashboardPrivateRoute />,
    children: [...DashboardRoute],
    errorElement: <Notfound />,
  },
];
