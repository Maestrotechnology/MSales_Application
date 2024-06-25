import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classes from "../Header/header.module.css";
import logo_icon from "../../Asserts/Images/logo.png";
import menu_icon from "../../Asserts/Icons/Menubar.png";
import profile_icon from "../../Asserts/Icons/profile.png";
import user_management from "../../Asserts/Icons/usermanagement.png";
import dashboard_icon from "../../Asserts/Icons/dashboard.png";
import selectdashboard_icon from "../../Asserts/Icons/select_dashboard.png";
import select_user_management from "../../Asserts/Icons/selectusermanagement.png";
import report from "../../Asserts/Icons/report.png";
import select_report from "../../Asserts/Icons/select_report.png";
import list_lead from "../../Asserts/Icons/list_lead.png";
import select_list_lead from "../../Asserts/Icons/select_list_lead.png";
import logout_icon from "../../Asserts/Icons/logout.png";
import mobilelogout from "../../Asserts/Icons/mobileLogout.png";
import mobileChangePassword from "../../Asserts/Icons/mobileChangePasswod.png";
import { Alert, Grid } from "@mui/material";
import { Checkbox, Drawer, MenuProps } from "antd";
import { getCookie, setCookie } from "../../Store/Storage/Cookies";
import GlobalModal from "../../Components/GlobalModal";
import LogOutConfirmation from "../../Modals/LogoutModal";
import Commondropdown from "../../Components/InputComponents/Commondropdown";
import ChangePasswordmodal from "../../Modals/ChangePasswordmodal";
import changepassword_icon from "../../Asserts/Icons/changePassword_icon.png";
import { LoginUserData } from "../../Shared/Constants";
import { handleClearRedux } from "../../Store/Redux/Reducers/DashboardReducers";
import { useDispatch, useSelector } from "react-redux";
import { logoutapiService } from "../../Services/Apiservices";
import { toast } from "react-toastify";
import { getCatchMsg } from "../../Shared/Methods";
import manProfile from "../../Asserts/Icons/man.png";
import {
  addTaskservices,
  checkin,
  checkout,
  projectListservices,
} from "../../Services/ErpApiServices";
import CheckInModal from "../../Modals/CheckinCheckoutConfirmationmodal";
import moment from "moment";
import WorkReportModal from "../../Modals/WorkReportModal";
import { handleCheckIndata } from "../../Store/Redux/Reducers/AuthReducers";
export default function Header() {
  const navigate = useNavigate();
  const CheckIndata = getCookie("CheckIn");
  const CheckInTime = useSelector((state: any) => state.auth.checkindata);
  const loginUserData = LoginUserData();
  const [checkedIn, setCheckedIn] = useState(false);
  const [isShowConfirmation, setShowConfirmation] = useState(false);
  const [isShowCheckinConfirmation, setShowCheckinConfirmation] =
    useState(false);
  const [isShowChangePassword, setIsshowChangePassword] = useState({
    status: false,
    data: null,
  });
  const [workReportModal, setWorkReportModal] = useState({
    status: false,
    data: null,
  });
  const [latitudeLongitude, setLatitudeLongtitude] = useState({
    latitude: "",
    longitude: "",
  });
  const { pathname } = useLocation();
  const [mobilemenuopen, setmobilemenuOpen] = useState(false);
  const showDrawer = () => {
    setmobilemenuOpen(true);
  };

  const onClose = () => {
    setmobilemenuOpen(false);
  };

  const menu = [
    {
      name: "Dashboard",
      icon: dashboard_icon,
      selectIcon: selectdashboard_icon,
      pathname: "/dashboard",
    },
    {
      name: "User Management",
      icon: user_management,
      selectIcon: select_user_management,
      pathname: "/management",
      type: "usermanagement",
    },
    {
      name: "List Leads",
      icon: list_lead,
      selectIcon: select_list_lead,
      pathname: "/leads",
    },
    {
      name: "Masters",
      icon: list_lead,
      selectIcon: select_list_lead,
      pathname: "/masters",
      type: "masters",
    },
    {
      name: "Reports",
      icon: report,
      selectIcon: select_report,
      pathname: "/reports",
      type: "reports",
    },
  ];
  let dispatch = useDispatch();
  const Clearredux = () => {
    dispatch(handleClearRedux());
  };
  const logoutitems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => setIsshowChangePassword({ status: true, data: null })}
          className={classes.logout_display}
        >
          <img
            className={classes.passwordicon}
            src={changepassword_icon}
            alt="passwprd_icon"
          />
          <h6 className={classes.normallist}>Change Password</h6>
        </div>
      ),
      style: {
        display: loginUserData?.userType === 4 ? "none" : "",
      },
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => setShowConfirmation(true)}
          className={classes.logout_display}
        >
          <img
            className={classes.logouticon}
            src={logout_icon}
            alt="logout_icon"
          />
          <h6 className={classes.normallist}>Logout</h6>
        </div>
      ),
    },
  ];
  const handleApiservice = () => {
    let formData = new FormData();
    formData.append("token", loginUserData?.token);
    logoutapiService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleLogout = () => {
    handleApiservice();
    setCookie("logindata", null, null);
    navigate("/");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Category",
      onClick: () => {
        Clearredux();
        navigate("/masters/category");
      },
      className:
        pathname === "/masters/category"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "2",
      label: "Enquiry",
      onClick: () => {
        Clearredux();
        navigate("/masters/enquiry");
      },
      className:
        pathname === "/masters/enquiry" ? classes.listitem : classes.normallist,
    },
    {
      key: "3",
      label: "Requirements",
      onClick: () => {
        Clearredux();
        navigate("/masters/requirements");
      },
      className:
        pathname === "/masters/requirements"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "4",

      label: "Lead Status",
      onClick: () => {
        Clearredux();
        navigate("/masters/lead_status");
      },
      className:
        pathname === "/masters/lead_status"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "5",

      label: "Competitors",
      onClick: () => {
        Clearredux();
        navigate("/masters/competitors");
      },
      className:
        pathname === "/masters/competitors"
          ? classes.listitem
          : classes.normallist,
    },
  ];
  const Reportitems: MenuProps["items"] = [
    {
      key: "1",
      label: "Leads Report",
      onClick: () => {
        Clearredux();
        navigate("reports/totalreports");
      },
      className:
        pathname === "/reports/totalreports"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "2",
      label: "Employee Performance Report",
      onClick: () => {
        Clearredux();
        navigate("/reports/employeereport");
      },
      style: {
        display: loginUserData?.userType === 4 ? "none" : "",
      },
      className:
        pathname === "/reports/employeereport"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "3",
      label: "Individual Performance Report",
      style: {
        display:
          loginUserData?.userType === 3 || loginUserData?.userType === 4
            ? "none"
            : "",
      },
      onClick: () => {
        Clearredux();
        navigate("/reports/individualpersonreport");
      },
      className:
        pathname === "/reports/individualpersonreport"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "4",
      label: "Daily performance Report",
      onClick: () => {
        Clearredux();
        navigate("reports/dailyperformancereport");
      },
      style: {
        display:
          loginUserData?.userType === 3 || loginUserData?.userType === 4
            ? "none"
            : "",
      },
      className:
        pathname === "/reports/dailyperformancereport"
          ? classes.listitem
          : classes.normallist,
    },
  ];
  const UserManagement: MenuProps["items"] = [
    {
      key: "1",
      label: "Admin",
      style: {
        display:
          loginUserData?.userType === 3 || loginUserData?.userType === 2
            ? "none"
            : "",
      },
      onClick: () => {
        Clearredux();
        navigate("/management/adminmanagement");
      },
      className:
        pathname === "/management/adminmanagement"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "2",
      label: "Dealer",
      style: { display: loginUserData?.userType === 3 ? "none" : "" },
      onClick: () => {
        Clearredux();
        navigate("/management/dealermanagement");
      },
      className:
        pathname === "/management/dealermanagement"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "3",
      label: "Employee",
      onClick: () => {
        Clearredux();
        navigate("management/employeemanagement");
      },
      className:
        pathname === "/management/employeemanagement"
          ? classes.listitem
          : classes.normallist,
    },
    {
      key: "4",
      label: "Customer",
      style: { display: loginUserData?.userType === 3 ? "none" : "" },
      onClick: () => {
        Clearredux();
        navigate("/management/customermanagement");
      },
      className:
        pathname === "/management/customermanagement"
          ? classes.listitem
          : classes.normallist,
    },
  ];
  useEffect(() => {
    setmobilemenuOpen(false);
  }, [pathname]);
  const handleCheckin = () => {
    let formdata = new FormData();
    formdata.append("latitude", latitudeLongitude?.latitude);
    formdata.append("longitude", latitudeLongitude?.longitude);
    checkin(formdata)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setCookie("LoginTime", res.data.checkin_time);
          dispatch(handleCheckIndata(res.data.checkin_time));
          setCookie("CheckIn", true);
          setCheckedIn(true);
          setShowCheckinConfirmation(false);
        } else {
          setCookie("CheckIn", "true");
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        dispatch(handleCheckIndata("data"));
        getCatchMsg(err);
      });
  };

  const handleAddTask = () => {
    let formData = new FormData();
    formData.append("task", "sales and marketing");
    formData.append("project_id", "79");
    formData.append("expected_time", "08:00");
    formData.append(
      "expected_delivery_date",
      moment(new Date()).format("YYYY-MM-DD")
    );
    formData.append("priority", "3");
    addTaskservices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        handleCheckOut();
      });
  };
  const handleCheckOut = () => {
    let formdata = new FormData();
    formdata.append("latitude", latitudeLongitude?.latitude);
    formdata.append("longitude", latitudeLongitude?.longitude);
    checkout(formdata)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setCheckedIn(true);
          setShowCheckinConfirmation(false);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const fetchLocation = async () => {
    try {
      const response = await navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitudeLongtitude({
            //@ts-ignore
            latitude: position?.coords?.latitude,
            //@ts-ignores
            longitude: position?.coords?.longitude,
          });
        }
      );
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);

  const handleEditReport = () => {
    setShowCheckinConfirmation(false);
    setWorkReportModal({
      status: true,
      data: null,
    });
  };

  return (
    <div>
      <Grid className={classes.headerdisplay}>
        <GlobalModal
          size={500}
          title="Logout"
          OnClose={() => {
            setShowConfirmation(false);
          }}
          isVisible={isShowConfirmation}
          setIsVisible={() => {
            setShowConfirmation(true);
          }}
        >
          <LogOutConfirmation
            msg={"Confirm Logout"}
            close={() => {
              setShowConfirmation(false);
            }}
            handlefunction={handleLogout}
          />
        </GlobalModal>
        <GlobalModal
          size={700}
          title="Work Report"
          OnClose={() => {
            setWorkReportModal({
              status: false,
              data: null,
            });
          }}
          isVisible={workReportModal.status}
          setIsVisible={() => {
            setWorkReportModal({
              status: true,
              data: null,
            });
          }}
        >
          <WorkReportModal
            msg={"Confirm Logout"}
            close={() => {
              setWorkReportModal({
                status: false,
                data: null,
              });
            }}
            handlefunction={handleCheckOut}
          />
        </GlobalModal>
        <GlobalModal
          size={500}
          title={CheckInTime !== null ? "Confirm Checkout" : "Confirm Checkin"}
          OnClose={() => {
            setShowCheckinConfirmation(false);
          }}
          isVisible={isShowCheckinConfirmation}
          setIsVisible={() => {
            setShowCheckinConfirmation(true);
          }}
        >
          <CheckInModal
            msg={CheckInTime !== null ? "Confirm Checkout" : "Confirm Checkin"}
            editReport={handleEditReport}
            textmsg={
              CheckInTime !== null
                ? "Are you certain you want to proceed with the checkout today?"
                : "Are you certain you want to proceed with the checkin today?"
            }
            btnName={CheckInTime !== null ? "Check Out" : "CheckIn"}
            showWorkreportbtn={CheckInTime !== null ? true : false}
            close={() => {
              setShowCheckinConfirmation(false);
              setCheckedIn(false);
            }}
            handlefunction={() => {
              if (latitudeLongitude.latitude && latitudeLongitude.longitude) {
                if (CheckInTime && CheckInTime !== null) {
                  handleAddTask();
                } else {
                  handleCheckin();
                }
              } else {
                alert(
                  "Location permission is blocked. Please enable it in your browser settings"
                );

                // fetchLocation();
              }
              // handleAddTask();
            }}
          />
        </GlobalModal>
        <GlobalModal
          size={700}
          title="Change Password"
          OnClose={() => {
            setIsshowChangePassword({ status: false, data: null });
          }}
          isVisible={isShowChangePassword.status}
          setIsVisible={() => {
            setIsshowChangePassword({ status: true, data: null });
          }}
        >
          <ChangePasswordmodal
            oldpassword={true}
            close={() =>
              setIsshowChangePassword({
                status: false,
                data: null,
              })
            }
          />
        </GlobalModal>
        <img
          className={classes.logo_icon}
          src={logo_icon}
          alt="Logo"
          onClick={() => navigate("/dashboard")}
        />
        <Grid className={classes.optionsdisplay}>
          {menu.map((ele, index) => {
            if (ele?.type === "masters") {
              return loginUserData?.userType !== 3 &&
                loginUserData?.userType !== 4 ? (
                <Commondropdown items={items} key={index}>
                  <Grid
                    className={classes.menubardisplay}
                    style={{
                      backgroundColor: pathname.includes(ele.pathname)
                        ? "#FFFFFF"
                        : "transparent",
                    }}
                  >
                    <Grid
                      className={classes.menubarIconbox}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#FFFFFF",
                        border:
                          pathname === ele.pathname ? "none" : "1px solid gray",
                      }}
                    >
                      <img
                        alt="icon_image"
                        className={classes.menubaricon}
                        src={
                          pathname.includes(ele.pathname)
                            ? ele.selectIcon
                            : ele.icon
                        }
                      />
                    </Grid>
                    <h5
                      style={{
                        color: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#fff",
                      }}
                      className={classes.menubartext}
                    >
                      {ele.name}
                    </h5>
                  </Grid>
                </Commondropdown>
              ) : null;
            } else if (ele.type === "reports") {
              return (
                <Commondropdown items={Reportitems} key={index}>
                  <Grid
                    className={classes.menubardisplay}
                    style={{
                      backgroundColor: pathname.includes(ele.pathname)
                        ? "#FFFFFF"
                        : "transparent",
                    }}
                  >
                    <Grid
                      className={classes.menubarIconbox}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#FFFFFF",
                        border:
                          pathname === ele.pathname ? "none" : "1px solid gray",
                      }}
                    >
                      <img
                        alt="icon_image"
                        className={classes.menubaricon}
                        src={
                          pathname.includes(ele.pathname)
                            ? ele.selectIcon
                            : ele.icon
                        }
                      />
                    </Grid>
                    <h5
                      style={{
                        color: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#fff",
                      }}
                      className={classes.menubartext}
                    >
                      {ele.name}
                    </h5>
                  </Grid>
                </Commondropdown>
              );
            } else if (ele.type === "usermanagement") {
              return loginUserData?.userType !== 4 ? (
                <Commondropdown items={UserManagement} key={index}>
                  <Grid
                    className={classes.menubardisplay}
                    style={{
                      backgroundColor: pathname.includes(ele.pathname)
                        ? "#FFFFFF"
                        : "transparent",
                    }}
                  >
                    <Grid
                      className={classes.menubarIconbox}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#FFFFFF",
                        border:
                          pathname === ele.pathname ? "none" : "1px solid gray",
                      }}
                    >
                      <img
                        alt="icon_image"
                        className={classes.menubaricon}
                        src={
                          pathname.includes(ele.pathname)
                            ? ele.selectIcon
                            : ele.icon
                        }
                      />
                    </Grid>
                    <h5
                      style={{
                        color: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#fff",
                      }}
                      className={classes.menubartext}
                    >
                      {ele.name}
                    </h5>
                  </Grid>
                </Commondropdown>
              ) : null;
            } else {
              return (
                <Grid
                  className={classes.menubardisplay}
                  style={{
                    backgroundColor: pathname.includes(ele.pathname)
                      ? "#FFFFFF"
                      : "transparent",
                  }}
                  onClick={() => {
                    Clearredux();
                    navigate(ele?.pathname);
                  }}
                  key={index}
                >
                  <Grid
                    className={classes.menubarIconbox}
                    style={{
                      backgroundColor: pathname.includes(ele.pathname)
                        ? "#004c97"
                        : "#FFFFFF",
                      border:
                        pathname === ele.pathname ? "none" : "1px solid gray",
                    }}
                  >
                    <img
                      alt="icon_image"
                      className={classes.menubaricon}
                      src={
                        pathname.includes(ele.pathname)
                          ? ele.selectIcon
                          : ele.icon
                      }
                    />
                  </Grid>
                  <h5
                    style={{
                      color: pathname.includes(ele.pathname)
                        ? "#004c97"
                        : "#fff",
                    }}
                    className={classes.menubartext}
                  >
                    {ele.name}
                  </h5>
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid className={classes.profileboxdisplay}>
          {/* <Grid className={classes.profileIcon}>
            <img className={classes.notifictionicon} src={notication_icon} />
          </Grid> */}
          {loginUserData?.userType === 4 ? (
            <div className="CheckinCheckout">
              <Checkbox
                checked={CheckInTime !== null ? true : false}
                onChange={(e) => {
                  // if (CheckInTime && CheckInTime !== "null") {
                  //   setWorkReportModal({
                  //     status: true,
                  //     data: null,
                  //   });
                  // } else {
                  setShowCheckinConfirmation(true);
                  // }
                  fetchLocation();
                  // setCheckedIn(e.target.checked);
                }}
                // value={CheckInTime !== "null" ? true : false}
              >
                {`${
                  CheckInTime !== null
                    ? "Checkout for today"
                    : "Checkin for today"
                }`}
              </Checkbox>
            </div>
          ) : null}
          <Commondropdown items={logoutitems}>
            <Grid
              className={classes.usernameIcon}
              style={{ cursor: "pointer" }}
            >
              <img
                className={classes.profileIcon}
                src={manProfile}
                alt="profile"
              />
              <h5 className={classes.usernametext}>
                {loginUserData?.userName}
              </h5>
            </Grid>
          </Commondropdown>
        </Grid>
      </Grid>
      {/* mobileview */}
      <Grid className={classes.mobileview}>
        <img
          onClick={() => showDrawer()}
          className={classes.menuicon}
          src={menu_icon}
          alt="icon_image"
        />
        <img
          className={classes.mobileLogo}
          src={logo_icon}
          onClick={() => navigate("/dashboard")}
          alt="icon_image"
        />
        <Drawer
          title={
            <Grid
              className={classes.usernameIcon}
              style={{ cursor: "pointer" }}
            >
              <img
                className={classes.profileIcon}
                src={manProfile}
                alt="profile"
              />
              <h5 className={classes.mblusernametext}>
                {loginUserData?.userName}
              </h5>
            </Grid>
          }
          placement={"left"}
          closable={true}
          onClose={onClose}
          // @ts-ignore
          width={menu.map((ele) => (ele.name === "Dashboard" ? 40 : 70))}
          open={mobilemenuopen}
          // key={placement}
        >
          <Grid className={classes.optionsdisplay}>
            {menu.map((ele, index) => {
              if (ele?.type === "masters") {
                return loginUserData?.userType !== 3 &&
                  loginUserData?.userType !== 4 ? (
                  <Commondropdown items={items} key={index}>
                    <Grid
                      className={classes.menubardisplay}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#FFFFFF"
                          : "transparent",
                      }}
                    >
                      <Grid
                        className={classes.menubarIconbox}
                        style={{
                          backgroundColor: pathname.includes(ele.pathname)
                            ? "#004c97"
                            : "#FFFFFF",
                          border:
                            pathname === ele.pathname
                              ? "none"
                              : "1px solid gray",
                        }}
                      >
                        <img
                          className={classes.menubaricon}
                          src={
                            pathname.includes(ele.pathname)
                              ? ele.selectIcon
                              : ele.icon
                          }
                          alt="icon_image"
                        />
                      </Grid>
                      <h5
                        style={{
                          color: pathname.includes(ele.pathname)
                            ? "#004c97"
                            : "#fff",
                        }}
                        className={classes.menubartext}
                      >
                        {ele.name}
                      </h5>
                    </Grid>
                  </Commondropdown>
                ) : null;
              } else if (ele.type === "reports") {
                return (
                  <Commondropdown items={Reportitems} key={index}>
                    <Grid
                      className={classes.menubardisplay}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#FFFFFF"
                          : "transparent",
                      }}
                    >
                      <Grid
                        className={classes.menubarIconbox}
                        style={{
                          backgroundColor: pathname.includes(ele.pathname)
                            ? "#004c97"
                            : "#FFFFFF",
                          border:
                            pathname === ele.pathname
                              ? "none"
                              : "1px solid gray",
                        }}
                      >
                        <img
                          className={classes.menubaricon}
                          src={
                            pathname.includes(ele.pathname)
                              ? ele.selectIcon
                              : ele.icon
                          }
                          alt="icon_image"
                        />
                      </Grid>
                      <h5
                        style={{
                          color: pathname.includes(ele.pathname)
                            ? "#004c97"
                            : "#484751",
                        }}
                        className={classes.menubartext}
                      >
                        {ele.name}
                      </h5>
                    </Grid>
                  </Commondropdown>
                );
              } else if (ele.type === "usermanagement") {
                return (
                  loginUserData?.userType !== 4 && (
                    <Commondropdown items={UserManagement} key={index}>
                      <Grid
                        className={classes.menubardisplay}
                        style={{
                          backgroundColor: pathname.includes(ele.pathname)
                            ? "#FFFFFF"
                            : "transparent",
                        }}
                      >
                        <Grid
                          className={classes.menubarIconbox}
                          style={{
                            backgroundColor: pathname.includes(ele.pathname)
                              ? "#004c97"
                              : "#FFFFFF",
                            border:
                              pathname === ele.pathname
                                ? "none"
                                : "1px solid gray",
                          }}
                        >
                          <img
                            className={classes.menubaricon}
                            src={
                              pathname.includes(ele.pathname)
                                ? ele.selectIcon
                                : ele.icon
                            }
                            alt="icon_image"
                          />
                        </Grid>
                        <h5
                          style={{
                            color: pathname.includes(ele.pathname)
                              ? "#004c97"
                              : "#484751",
                          }}
                          className={classes.menubartext}
                        >
                          {ele.name}
                        </h5>
                      </Grid>
                    </Commondropdown>
                  )
                );
              } else
                return (
                  <Grid
                    className={classes.menubardisplay}
                    style={{
                      backgroundColor: pathname.includes(ele.pathname)
                        ? "#FFFFFF"
                        : "transparent",
                    }}
                    onClick={() => {
                      navigate(ele?.pathname);
                    }}
                    key={index}
                  >
                    <Grid
                      className={classes.menubarIconbox}
                      style={{
                        backgroundColor: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#FFFFFF",
                        border:
                          pathname === ele.pathname ? "none" : "1px solid gray",
                      }}
                    >
                      <img
                        className={classes.menubaricon}
                        src={
                          pathname.includes(ele.pathname)
                            ? ele.selectIcon
                            : ele.icon
                        }
                        alt="icon_image"
                      />
                    </Grid>
                    <h5
                      style={{
                        color: pathname.includes(ele.pathname)
                          ? "#004c97"
                          : "#484751",
                      }}
                      className={classes.menubartext}
                    >
                      {ele.name}
                    </h5>
                  </Grid>
                );
            })}
          </Grid>
          {loginUserData?.userType !== 4 ? (
            <div
              onClick={() =>
                setIsshowChangePassword({ status: true, data: null })
              }
              className={classes.logout_display}
            >
              <div className={classes.mobile_logout}>
                <img
                  className={classes.mobileLogout_icon}
                  src={mobileChangePassword}
                  alt="icon_image"
                />
              </div>
              <h6>Change Password</h6>
            </div>
          ) : null}
          {/* <h5
            onClick={() =>
              setIsshowChangePassword({ status: true, data: null })
            }
            style={{ color: "#484751" }}
            className={classes.menubartext}
          >
            Change Password
          </h5> */}
          <div
            onClick={() => setShowConfirmation(true)}
            className={classes.logout_display}
          >
            <div className={classes.mobile_logout}>
              <img
                className={classes.mobileLogout_icon}
                src={mobilelogout}
                alt="icon_image"
              />
            </div>
            <h6>Logout</h6>
          </div>
          {loginUserData?.userType === 4 ? (
            <div>
              <Checkbox
                checked={CheckInTime !== null ? true : false}
                onChange={(e) => {
                  // if (CheckInTime && CheckInTime !== "null") {
                  //   setWorkReportModal({
                  //     status: true,
                  //     data: null,
                  //   });
                  // } else {
                  setShowCheckinConfirmation(true);
                  // }
                  fetchLocation();
                  // setCheckedIn(e.target.checked);
                }}
                // value={CheckInTime !== "null" ? true : false}
              >
                {`${
                  CheckInTime && CheckInTime !== null
                    ? "Checkout for today"
                    : "Checkin for today"
                }`}
              </Checkbox>
            </div>
          ) : null}
          {/* <h5
            onClick={() => setShowConfirmation(true)}
            style={{ color: "#484751" }}
            className={classes.menubartext}
          >
            Log Out
          </h5> */}
          {/* <p>Some contents...</p> */}
        </Drawer>
      </Grid>
      <Outlet />
    </div>
  );
}
