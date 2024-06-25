import MainScreenLayout from "../Layouts/MainScreenLayout";
import AddListLeads from "../Screens/MainScreens/AddListLeads";
import UserLogin from "../Screens/Authentications/UserLogin";
import Dashboard from "../Screens/MainScreens/Dashboard";
import ListLeads from "../Screens/MainScreens/ListLeads";
import Reports from "../Screens/MainScreens/Reports";
import UserManagement from "../Screens/MainScreens/UserManagement";
import LeadsHistory from "../Screens/MainScreens/LeadsHistory";
import Masterslayout from "../Screens/MainScreens/masters/MastersLayout";
import Category from "../Screens/MainScreens/masters/Category";
import Requirements from "../Screens/MainScreens/masters/Requirements";
import Leadstatus from "../Screens/MainScreens/masters/Leadstatus";
import Competitors from "../Screens/MainScreens/masters/Competitors";
import Enquiry from "../Screens/MainScreens/masters/Enquiry";
import ReportsLayout from "../Screens/MainScreens/report/ReportsLayout";
import EmployeeReport from "../Screens/MainScreens/report/EmployeeReport";
import LeadReport from "../Screens/MainScreens/report/LeadReport";
import NotificationData from "../Screens/MainScreens/NotificationData";
import UsermanagementLayouts from "../Screens/MainScreens/usermanagement/UsermanagementLayou";
import AdminManagement from "../Screens/MainScreens/usermanagement/AdminManagement";
import DealerManagement from "../Screens/MainScreens/usermanagement/DealerManagement";
import EmployeeManagement from "../Screens/MainScreens/usermanagement/EmployeeManagement";
import CustomerManagement from "../Screens/MainScreens/customers/CustomerManagement";
import AddCustomerList from "../Screens/MainScreens/customers/AddCustomer";
import { ProtectedRouter } from "./PrivateRoute";
import IndividualChart from "../Screens/MainScreens/report/Individualchart";
import Media from "../Screens/MainScreens/masters/Media";
import FolloUp from "../Screens/MainScreens/FolloUp";
import DailyPerformanceReport from "../Screens/MainScreens/report/DailyPerformanceReport";

export const DashboardRoute = [
  {
    element: <MainScreenLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // {
      //   path: "/userManagement",
      //   element: <UserManagement />,
      // },
      {
        path: "/leads",
        element: <ListLeads />,
      },
      {
        path: "leads/addListLeads",
        element: <AddListLeads />,
      },
      {
        path: "leads/history",
        element: <LeadsHistory />,
      },
      { path: "leads/notificationlist", element: <NotificationData /> },
      // {
      //   path: "/masters",
      //   element: < />,
      // },
      {
        path: "leads/folloup",
        element: <FolloUp />,
      },

      {
        path: "/reports",
        // element: <Reports />,
        element: <ReportsLayout />,
        children: [
          {
            path: "totalreports",
            element: <LeadReport />,
          },
          {
            path: "employeereport",
            element: <EmployeeReport />,
          },
          {
            path: "individualpersonreport",
            element: <IndividualChart />,
          },
          {
            path: "dailyperformancereport",
            element: <DailyPerformanceReport />,
          },
        ],
      },
      {
        path: "/management",
        element: <UsermanagementLayouts />,
        children: [
          {
            element: <ProtectedRouter userType={2} />,
            children: [
              {
                path: "adminmanagement",
                element: <AdminManagement />,
              },
            ],
          },
          {
            element: <ProtectedRouter userType={3} />,
            children: [
              {
                path: "adminmanagement",
                element: <AdminManagement />,
              },
              {
                path: "dealermanagement",
                element: <DealerManagement />,
              },
              {
                path: "customermanagement",
                element: <CustomerManagement />,
              },
              {
                path: "customermanagement/addcustomer",
                element: <AddCustomerList />,
              },
            ],
          },
          {
            path: "employeemanagement",
            element: <EmployeeManagement />,
          },
        ],
      },
      {
        // path: "/masters",
        element: <ProtectedRouter userType={3} />,
        children: [
          {
            path: "/masters",
            element: <Masterslayout />,
            children: [
              {
                path: "category",
                element: <Category />,
              },
              {
                path: "enquiry",
                element: <Enquiry />,
              },
              {
                path: "requirements",
                element: <Requirements />,
              },
              {
                path: "lead_status",
                element: <Leadstatus />,
              },
              {
                path: "media",
                element: <Media />,
              },
              { path: "competitors", element: <Competitors /> },
            ],
          },
        ],
      },
    ],
  },
];
