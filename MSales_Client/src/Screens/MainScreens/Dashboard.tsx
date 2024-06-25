import { useEffect, useState } from "react";
import classes from "./mainscreen.module.css";
import box_background from "../../Asserts/Images/dashboardbox.png";
import {
  DashboardData,
  DealerwisereportService,
  DistrictDropdown,
  EmployeeDropdown,
  cityDropdown,
  pieChartdataservices,
  stateDropdown,
  userTypedropdown,
} from "../../Services/Apiservices";
import Loader from "../../SharedComponents/Loader/Loader";
import { Inputlengths, LoginUserData, useToken } from "../../Shared/Constants";
import dashboard_icon1 from "../../Asserts/Icons/dashboardIcon1.png";
import dashboard_icon2 from "../../Asserts/Icons/Dashboardicon2.png";
import dashboard_icon3 from "../../Asserts/Icons/dashboardicon3.png";
import dashboard_icon4 from "../../Asserts/Icons/dashboardicon4.png";
import dashboard_icon5 from "../../Asserts/Icons/dashboardicon5.png";
import dashboard_icon6 from "../../Asserts/Icons/dashboardicon6.png";
import close_icon from "../../Asserts/Icons/close.svg";
import PageHeader from "../../Components/PageHeader";
import { useNavigate } from "react-router-dom";
import PieChart from "../../Components/Chart/PieChart";
import DashboardBarChart from "../../Components/Chart/Dashboardbarchart";
import filterIcon from "../../Asserts/Icons/filter.png";
import { Col, Row } from "antd";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { useFormik } from "formik";
import CommonButton from "../../Components/CommonButton/CommonButton";
import {
  JSONtoformdata,
  getCatchMsg,
  getTableSNO,
  isFormDirty,
} from "../../Shared/Methods";
import moment from "moment";
import DealerwiseReport from "./DealerwiseReport";
import { Space, Table, Tag } from "antd";
import CommonPagination from "../../Components/CommonPagination";
import { Commoninput } from "../../Components/InputComponents/CommonInput";

const { Column, ColumnGroup } = Table;
interface DataType {
  key: React.Key;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
  dealername?: string;
}

type filters = {
  dealerId?: number | null;
};
export default function Dashboard() {
  const token = useToken();
  const loginUserData = LoginUserData();
  const navigate = useNavigate();
  const [dashboardData, setDashboard] = useState([]);
  const [cityalert, setcityalert] = useState(false);
  const [districtDropdownList, setDistrictDropdownList] = useState([]);
  const [districtalert, setdistrictalert] = useState(false);
  const [employeeAlert, setEmployeeAlert] = useState(false);
  const [dashboardchartFilter, setDashboardchartFilter] = useState(false);
  const [delarDropdownList, setDropdownList] = useState([]);
  const [EmployeeoList, setEmployeeList] = useState([]);
  const [dashboarddealerTable, setdashboardDealerTable] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [dealerList, setdealerList] = useState({
    items: [],
    page: 1,
    size: 10,
    total_count: 0,
  });
  const DaysFilter = [
    {
      label: "Past 7 Days",
      value: 6,
    },
    {
      label: "Past 15 Days",
      value: 14,
    },
  ];
  const data: DataType[] = [
    {
      key: "1",
      firstName: "John",
      lastName: "Brown",
      dealername: "ghghghg",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    // {
    //   key: "1",
    //   firstName: "John",
    //   lastName: "Brown",
    //   age: 32,
    //   address: "New York No. 1 Lake Park",
    //   tags: ["nice", "developer"],
    // },
    // {
    //   key: "2",
    //   firstName: "Jim",
    //   lastName: "Green",
    //   age: 42,
    //   address: "London No. 1 Lake Park",
    //   tags: ["loser"],
    // },
    // {
    //   key: "3",
    //   firstName: "Joe",
    //   lastName: "Black",
    //   age: 32,
    //   address: "Sydney No. 1 Lake Park",
    //   tags: ["cool", "teacher"],
    // },
  ];
  const [chartdata, setChartData] = useState([]);
  const [loader, setloader] = useState(false);
  const [stateDropdownList, setStateDropdownList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  let icons = [
    dashboard_icon1,
    dashboard_icon2,
    dashboard_icon3,
    dashboard_icon4,
    dashboard_icon5,
    dashboard_icon6,
    dashboard_icon1,
  ];
  const [filterdata, setfilterdata] = useState({
    name: "",
    phonenumber: "",
    dealer_name: "",
    dealer_id: "",
    employee_id: "",
    city_id: "",
    city: "",
    districtId: "",
    state_id: "",
    state: "",
    from_date: "",
    to_date: "",
    pastdate: "",
    dealerId: null,
  });
  const {
    values,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setFieldValue,
    setValues,
    initialValues,
  } = useFormik({
    initialValues: {
      name: "",
      phonenumber: "",
      dealer_name: "",
      dealer_id: "",
      employee_id: "",
      city_id: "",
      city: "",
      districtId: "",
      state_id: "",
      state: "",
      from_date: "",
      to_date: "",
      pastdate: "",
      dealerId: null,
    },
    onSubmit: () => {
      setfilterdata(values);
      handlePieChart();
      getDealerwiseReport(1, 10, values);
      if (initialValues) {
        setBtnDisable(false);
      }
    },
  });
  const handleDashboardData = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    DashboardData(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDashboard(res.data.data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setloader(false);
      });
  };
  //delar Dropdown
  const handleDelardropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("isDealer", "1");
    userTypedropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setDropdownList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handelEmployeedropdown = (ID: any) => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("dealerId", ID);

    EmployeeDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setEmployeeList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  //chartdataapi
  const handlePieChart = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    if (values.dealer_id) {
      formData.append("dealerId", values.dealer_id);
    }
    if (values.employee_id) {
      formData.append("employeeId", values.employee_id);
    }
    if (values.city_id) {
      formData.append("cityId", values.city_id);
    }
    if (values.districtId) {
      formData.append("districtId", values.districtId);
    }
    if (values.state_id) {
      formData.append("stateId", values.state_id);
    }
    if (values.from_date && values.to_date) {
      formData.append("fromDatetime", values.from_date);
      formData.append("todatetime", values.to_date);
    }
    pieChartdataservices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setChartData(res.data.data);
        }
      })
      .catch((err) => {})
      .finally(() => setloader(false));
  };
  //StateDropdown
  const handleStateDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    stateDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.stateName,
              value: ele.stateId,
            };
          });
          setStateDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleCityDropdown = (ID: any, districtId: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    if (districtId) {
      formData.append("district_id", districtId);
    }
    cityDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.cityName,
              value: ele.cityId,
            };
          });
          setCityDropdownList(options);
        }
      })
      .catch((err) => {});
  };

  const getDealerwiseReport = (
    page: number,
    size: number,
    values?: filters
  ) => {
    let finalObj = { ...values, token: token };
    DealerwisereportService(page, size, JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );
          setdealerList({ ...res?.data?.data, items: setkeyData });
        }
        // if (res?.data?.status === 1) {
        //   setdealerList({ ...res?.data.data });
        // }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const handleDistrictDropdown = (ID: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    DistrictDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.districtName,
              value: ele.districtId,
              key: ind,
            };
          });
          setDistrictDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleTableSearchClear = () => {
    setEmployeeAlert(false);
    setcityalert(false);
    setdistrictalert(false);
    resetForm();
    setCityDropdownList([]);
    setDistrictDropdownList([]);
    handleSubmit();
    setBtnDisable(false);
    // handleUserList(selectpage, pageSize);
  };
  useEffect(() => {
    if (token) {
      handleDashboardData();
      // handleStateDropdown();
      handlePieChart();
      handleDelardropdown();
      getDealerwiseReport(1, 10, values);
      // handleCityDropdown();
      setFieldValue(
        "dealer_id",
        loginUserData?.userType === 3 ? loginUserData?.userId : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  useEffect(() => {
    if (token && loginUserData?.userType === 3) {
      handelEmployeedropdown(loginUserData?.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  useEffect(() => {
    if (token) {
      handlePieChart();
    }
  }, [values.from_date]);

  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        heading="Dashboard"
        filters={false}
        btntitle={"Add Leads"}
        onBtnPress={() => {
          navigate("/leads/addListLeads", {
            state: {
              // filters: filters,
              // page: LeadsList.page,
              // size: LeadsList.size,
              name: "lead",
              type: "add",
            },
          });
        }}
      />
      <div className={classes.dashboardboxdisplay}>
        {dashboardData?.map((ele: any, index: number) => {
          return (
            <div className={classes.cardbody} key={index}>
              <div className={classes.cardheadblock}>
                <div className={classes.countblock}>
                  <div
                    style={{
                      backgroundColor: ele.colorCode,
                    }}
                    className={classes.cardicon}
                  >
                    <img
                      src={icons[index]}
                      alt="cardicon"
                      className={classes.iconcard}
                    />
                  </div>
                  <h6 className={classes.cardhead}>{ele?.displayName}</h6>
                </div>

                <h2
                  className={classes.cardcount}
                  style={{ color: ele.colorCode }}
                >
                  {ele?.value}
                  {/* <Statistic
                    // value={ele?.value + 50}
                    // style={{ color: ele.colorCode }}
                    formatter={(val: any) => formatter(val, ele.colorCode)}
                  /> */}
                </h2>
              </div>
              <div className={classes.cartcountblock}>
                <div
                  className="d-flex align-items-center flex-column"
                  onClick={() => {
                    ele?.displayName === "Total Leads"
                      ? navigate("/leads")
                      : navigate("/leads", { state: { filters: ele } });
                  }}
                >
                  <h3
                    className={classes.cardlistcount}
                    style={{ color: "rgb(3 125 3)" }}
                  >
                    {ele?.leads?.value}
                  </h3>
                  <p
                    className={classes.cardlistname}
                    // style={{ color: "#196819" }}
                  >
                    {ele?.leads?.displayName}
                  </p>
                </div>
                <div
                  onClick={() =>
                    ele?.displayName === "Total Leads"
                      ? navigate("/leads/notificationlist")
                      : navigate("/leads/notificationlist", {
                          state: { filters: ele },
                        })
                  }
                  className="d-flex align-items-center flex-column"
                >
                  <h3
                    className={classes.cardlistcount}
                    style={{ color: "#ff4500" }}
                  >
                    {ele?.over_due?.value}
                  </h3>
                  <p
                    className={classes.cardlistname}
                    // style={{ color: "#dc460e" }}
                  >
                    {ele?.over_due?.displayName}
                  </p>
                </div>
              </div>
              {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    backgroundColor: ele.colorCode,
                    margin: "20px",
                    display: "flex",
                    width: "50px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                  }}
                >
                  <img src={icons[index]} />
                </div>

                <div className={classes.dashboardvalue}>
                  <h2>{ele?.value}</h2>
                </div>
              </div> */}

              <img
                className={classes.dashboardbackground}
                src={box_background}
                alt="box_icon"
              />
            </div>
          );
        })}
      </div>
      {loginUserData?.userType !== 4 && (
        <div className={classes.dashboardchartutline}>
          <div className={classes.chartdisplay}>
            <div className={classes.dashreportHead}>
              <h5 className={classes.reportheader}>
                {values.from_date && values.to_date
                  ? `(${moment(values.from_date).format(
                      "DD-MM-YYYY"
                    )})-(${moment(values.to_date).format("DD-MM-YYYY")})
                  `
                  : `${moment().format("MMMM")} Month Report`}
              </h5>
            </div>
            <div
              onClick={() => setDashboardchartFilter(!dashboardchartFilter)}
              className={classes.filterdisply}
            >
              {!dashboardchartFilter ? (
                <>
                  <h6>Filters</h6>
                  <img
                    className={classes.filter_icon}
                    src={filterIcon}
                    alt="filter_icon"
                  />
                </>
              ) : (
                <img
                  className={classes.filter_icon}
                  src={close_icon}
                  alt="filter_icon"
                  style={{
                    height: 18,
                  }}
                />
              )}
            </div>
          </div>
          {
            <div style={{ marginBottom: "10px" }}>
              <Row className="rowTop">
                <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                  <CommonSelect
                    // styles={{ width: "200px" }}
                    allowClear={true}
                    options={DaysFilter}
                    value={values.pastdate ? values.pastdate : null}
                    placeholder="Select Days"
                    // disabled={values?.dealer_id ? false : true}

                    // onkeydown={(e) => {
                    //   if (e) {
                    //     setFieldValue(
                    //       "from_date",
                    //       moment().subtract(e, "days").format("YYYY-MM-DD ")
                    //     );
                    //     setFieldValue("to_date", moment().format("YYYY-MM-DD"));
                    //   }
                    // }}
                    onChange={(e, data) => {
                      if (e) {
                        setBtnDisable(false);

                        setFieldValue(
                          "from_date",
                          moment()
                            .subtract(e, "days")
                            .format("YYYY-MM-DD 00:00:00")
                        );
                        setFieldValue(
                          "to_date",
                          moment().format("YYYY-MM-DD 00:00:00")
                        );

                        setFieldValue("pastdate", data.value);
                      } else {
                        setBtnDisable(true);
                        setFieldValue("from_date", null);
                        setFieldValue("to_date", null);
                        setFieldValue("pastdate", null);
                      }
                      // if (e) {
                      //   setFieldValue("employee_id", e);
                      // } else {
                      //   // handelAssignedTodropdown(null);
                      //   setFieldValue("employee_id", null);
                      // }
                    }}
                  />
                </Col>
                {dashboardchartFilter ? (
                  <>
                    {loginUserData?.userType !== 3 &&
                    loginUserData?.userType !== 4 ? (
                      <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                        <CommonSelect
                          allowClear={true}
                          options={delarDropdownList}
                          value={values.dealer_id ? values.dealer_id : null}
                          placeholder="Select Dealer"
                          errormsg={
                            errors.dealer_id && touched.dealer_id
                              ? errors.dealer_id
                              : ""
                          }
                          onChange={(e, data) => {
                            if (e) {
                              setBtnDisable(false);
                              handelEmployeedropdown(e);
                              // setFieldValue("dealer_id", e);
                              setValues({
                                ...values,
                                employee_id: "",
                                dealer_id: e,
                              });
                            } else {
                              setBtnDisable(true);
                              // setFieldValue("dealer_id", null);
                              setValues({
                                ...values,
                                employee_id: "",
                                dealer_id: "",
                              });
                            }
                          }}
                        />
                      </Col>
                    ) : null}
                    {loginUserData?.userType !== 4 ? (
                      <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                        <CommonSelect
                          allowClear={true}
                          options={EmployeeoList}
                          value={values.employee_id ? values.employee_id : null}
                          placeholder="Select Employee"
                          disabled={values?.dealer_id ? false : true}
                          errormsg={
                            employeeAlert
                              ? "Please select dealer before selecting employee"
                              : errors.employee_id && touched.employee_id
                                ? errors.employee_id
                                : ""
                          }
                          onkeydown={(e) => {
                            if (
                              !values?.dealer_id &&
                              loginUserData?.userType !== 3
                            ) {
                              setEmployeeAlert(true);
                              setEmployeeList([]);
                            } else {
                              setEmployeeAlert(false);
                            }
                          }}
                          onChange={(e, data) => {
                            if (e) {
                              setBtnDisable(false);
                              setFieldValue("employee_id", e);
                            } else {
                              setBtnDisable(true);
                              // handelAssignedTodropdown(null);
                              setFieldValue("employee_id", null);
                            }
                          }}
                        />
                      </Col>
                    ) : null}
                    <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                      <Commoninput
                        // allowClear={true}
                        // options={stateDropdownList}
                        maxLength={Inputlengths.name}
                        required={true}
                        value={values.state_id ? values.state_id : null}
                        placeholder="Enter State"
                        errormsg={
                          errors.state_id && touched.state_id
                            ? errors.state_id
                            : ""
                        }
                        onChange={(e) => {
                          if (e) {
                            setBtnDisable(false);
                          } else {
                            setBtnDisable(true);
                          }
                          setFieldValue("state_id", e);
                        }}
                        onKeyDown={handleEnterKeySearch}
                      />
                    </Col>

                    <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                      <Commoninput
                        // allowClear={true}
                        // options={cityDropdownList}
                        required={true}
                        maxLength={Inputlengths.name}
                        placeholder="Enter City"
                        value={values.city_id ? values.city_id : null}
                        errormsg={
                          // cityalert
                          //   ? "Please select state before selecting city"
                          //   :
                          errors.city_id && touched.city_id
                            ? errors.city_id
                            : ""
                        }
                        // onkeydown={(e) => {
                        //   if (!values?.state_id) {
                        //     setcityalert(true);
                        //   } else {
                        //     setcityalert(false);
                        //   }
                        // }}
                        onChange={(e) => {
                          setFieldValue("city_id", e);
                          if (e) {
                            setBtnDisable(false);
                          } else {
                            setBtnDisable(true);
                          }
                          // if (e) {
                          //   setFieldValue("city_id", data.value);
                          // } else {
                          //   setValues({
                          //     ...values,
                          //     city_id: "",
                          //     city: "",
                          //   });
                          // }
                        }}
                        onKeyDown={handleEnterKeySearch}
                      />
                    </Col>
                    <div className={classes.btnactionblock}>
                      <CommonButton
                        onClick={() => handleSubmit()}
                        name="search"
                        color="#004c97"
                        Disabled={
                          btnDisable
                            ? !btnDisable
                            : !isFormDirty(initialValues, {
                                ...values,
                                from_date: values?.from_date
                                  ? values?.from_date
                                  : "",
                                to_date: values?.to_date ? values?.to_date : "",
                                pastdate: values?.pastdate
                                  ? values?.pastdate
                                  : "",
                              })
                        }
                      />
                      <CommonButton
                        onClick={handleTableSearchClear}
                        name="Reset"
                        color="#bf1c17"
                        Disabled={
                          btnDisable
                            ? !btnDisable
                            : !isFormDirty(initialValues, {
                                ...values,
                                from_date: values?.from_date
                                  ? values?.from_date
                                  : "",
                                to_date: values?.to_date ? values?.to_date : "",
                                pastdate: values?.pastdate
                                  ? values?.pastdate
                                  : "",
                              })
                        }
                      />
                    </div>
                  </>
                ) : null}
              </Row>
            </div>
          }

          <div className={classes.dashboardmap}>
            <PieChart data={chartdata} />
            <DashboardBarChart data={chartdata} />
            {/* <BarChart
            labels={chartdata.map((ele: any) => ele.month)}
            series={chartdata}
          /> */}
          </div>
        </div>
      )}
      {/* {(loginUserData?.userType === 1 || loginUserData?.userType === 2) && (
        <DealerwiseReport delarDropdownList={delarDropdownList} />
      )} */}
      {/* {loginUserData?.userType !== 3 ? (
        <div className={classes.dashboardchartutline}>
          <div className={classes.chartdisplay}>
            <Col
              xxl={12}
              xl={5}
              md={7}
              sm={12}
              xs={24}
              style={{ display: "flex", marginLeft: "10px" }}
            >
              <h5>Dealer Report</h5>
            </Col>
            <div
              onClick={() => setdashboardDealerTable(!dashboarddealerTable)}
              className={classes.filterdisply}
            >
              <h6>Filters</h6>
              <img
                className={classes.filter_icon}
                src={filterIcon}
                alt="filter_icon"
              />
            </div>
          </div>
          {dashboarddealerTable ? (
            <div className={classes.searchOption}>
              <Row className={`rowTop`}>
                {loginUserData?.userType !== 3 ? (
                  <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                    <CommonSelect
                      allowClear={true}
                      options={delarDropdownList}
                      value={values.dealerId ? values.dealerId : null}
                      placeholder="Select Dealer"
                      errormsg={
                        errors.dealerId && touched.dealerId
                          ? errors.dealerId
                          : ""
                      }
                      onChange={(e, data) => {
                        if (e) {
                          setFieldValue("dealerId", e);
                        } else {
                          setFieldValue("dealerId", null);
                        }
                      }}
                    />
                  </Col>
                ) : null}
                <div className={classes.btnactionblock}>
                  <CommonButton
                    onClick={() => getDealerwiseReport(1, 10, values)}
                    name="search"
                    color="#004c97"
                  />
                  <CommonButton
                    onClick={() => {
                      resetForm();
                      handleSubmit();
                    }}
                    name="Reset"
                    color="#bf1c17"
                  />
                </div>
              </Row>
            </div>
          ) : null}
          <div className={classes.tableBoxsize}>
            <Table dataSource={dealerList?.items} pagination={false}>
              <Column
                className={classes.textalign}
                title="S.No"
                dataIndex="Sno"
                key="name"
              />
              <Column
                // className={classes.textalign}
                title="Dealer  Name"
                dataIndex="Dealer"
                key="Dealer"
                className={classes.namecell}
              />
              <Column
                className={classes.textalign}
                title="Total"
                dataIndex="totalLead"
                key="totalLead"
              />
              <Column
                className={classes.textalign}
                title="Follow Up"
                dataIndex="active_followUp"
                key="active_followUp"
              />
              <Column
                className={classes.textalign}
                title="Closed"
                dataIndex="active_close"
                key="active_close"
              />
            </Table>
            <CommonPagination
              dataList={dealerList}
              filters={filterdata}
              handleListapi={(page: number, size: number, data: any) => {
                getDealerwiseReport(page, size, data);
              }}
            />
          </div>
        </div>
      ) : null} */}
    </div>
  );
}
