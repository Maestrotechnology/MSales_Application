import React, { useEffect, useState } from "react";
import {
  Inputlengths,
  LoginUserData,
  useToken,
} from "../../../Shared/Constants";
import {
  DistrictDropdown,
  EmployeeDropdown,
  cityDropdown,
  dailyBarchartReport,
  dailyPieChartreportService,
  leadchartreport,
  performanceReport,
  pieChartdataservices,
  stateDropdown,
  userTypedropdown,
} from "../../../Services/Apiservices";
import {
  GetreportDates,
  getCatchMsg,
  getDates,
  isFormDirty,
} from "../../../Shared/Methods";
import LineChart from "../../../Components/Chart/LineChart";
import classes from "../mainscreen.module.css";
import PageHeader from "../../../Components/PageHeader";
import { Col, Row } from "antd";
import { CommonDate } from "../../../Components/InputComponents/CommonDate";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { CommonSelect } from "../../../Components/InputComponents/CommonSelect";
import CommonButton from "../../../Components/CommonButton/CommonButton";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import PieChart from "../../../Components/Chart/PieChart";
import Loader from "../../../SharedComponents/Loader/Loader";
import IndividualBarChart from "../../../Components/Chart/IndividualPerformance";
import CommonPagination from "../../../Components/CommonPagination";
import DailyBarChart from "../../../Components/Chart/DailyBarChartReport";
import DailyPieChart from "../../../Components/Chart/DailyPiechart";
export default function DailyPerformanceReport() {
  const token = useToken();
  const [chartdata, setChartData] = useState([]);
  const [BarChartdata, setBarChartdata] = useState([]);
  const [ChartPagination, setChartPagination] = useState([]);
  const [filterdata, setfilterdata] = useState({
    from_date: "",
    to_date: "",
    employee_id: "",
    city_id: "",
    city: "",
    state_id: "",
    state: "",
    district: "",
  });
  const [loader, setloader] = useState(false);
  // const [showfilterOption, setShowFilterOption] = useState(false);
  const [EmployeeoList, setEmployeeList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [cityalert, setcityalert] = useState(false);
  const [districtDropdownList, setDistrictDropdownList] = useState([]);
  const [districtalert, setdistrictalert] = useState(false);
  const [employeeAlert, setEmployeeAlert] = useState(false);
  const [headingDate, setHeadingDate] = useState({
    from_date: GetreportDates().start_date,
    to_date: GetreportDates().end_date,
  });
  const loginUserData = LoginUserData();
  const [btnDisable, setBtnDisable] = useState(false);
  const {
    values,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setValues,
    setFieldValue,
    initialValues,
  } = useFormik({
    initialValues: {
      from_date: "",
      to_date: "",
      dealer_id: loginUserData?.userType === 3 ? loginUserData?.userId : "",
      employee_id: "",
      city_id: "",
      city: "",
      state_id: "",
      state: "",
      district: "",
    },
    onSubmit: () => {
      setHeadingDate({
        from_date: values.from_date,
        to_date: values.to_date,
      });
      if (initialValues) {
        setBtnDisable(false);
      }
      handlePieChart();
      handleReportData(1, 10, values);
    },
  });
  const handlePieChart = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);

    if (values.employee_id) {
      formData.append("employeeId", values.employee_id);
    }
    if (values.city_id) {
      formData.append("cityId", values.city_id);
    }
    if (values.from_date) {
      formData.append("fromDateTime", values.from_date);
    }
    if (values.to_date) {
      formData.append("toDatetime", values.to_date);
    }
    if (values.state_id) {
      formData.append("stateId", values.state_id);
    }
    // if (values.from_date && values.to_date) {
    //   formData.append("fromDatetime", values.from_date);
    //   formData.append("todatetime", values.to_date);
    // }
    dailyPieChartreportService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setChartData(res.data.data);
        }
      })
      .catch((err) => {})
      .finally(() => setloader(false));
  };
  const handleReportData = (page: number, size: number, value: any) => {
    let formData = new FormData();
    formData.append("token", token);
    if (values.from_date) {
      formData.append("fromDateTime", values.from_date);
    }
    if (values.to_date) {
      formData.append("toDatetime", values.to_date);
    }
    if (values.state_id) {
      formData.append("state", values.state_id);
    }
    if (values.district) {
      formData.append("district", values.district);
    }
    if (loginUserData?.userType === 3) {
      formData.append("dealerId", loginUserData?.userId);
    } else if (values.dealer_id) {
      formData.append("dealerId", values.dealer_id);
    }
    if (values.employee_id) {
      formData.append("employeeId", values.employee_id);
    }
    if (values.city_id) {
      formData.append("city", values.city_id);
    }
    dailyBarchartReport(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setChartPagination(res.data.data);
          setBarChartdata(res.data.data.items);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handelEmployeedropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    // formData.append("dealerId", ID);
    formData.append("is_report", 1);
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

  const handleTableSearchClear = () => {
    setEmployeeAlert(false);
    setcityalert(false);
    setdistrictalert(false);
    setDistrictDropdownList([]);
    setCityDropdownList([]);
    if (loginUserData?.userType !== 3) {
      setEmployeeList([]);
    }
    setBtnDisable(false);
    setValues({
      from_date: "",
      to_date: "",
      dealer_id: loginUserData?.userType === 3 ? loginUserData?.userId : "",
      employee_id: "",
      city_id: "",
      city: "",
      state_id: "",
      state: "",
      district: "",
    });
    handleSubmit();
    // handleUserList(selectpage, pageSize);
  };
  useEffect(() => {
    if (token) {
      handlePieChart();
      handleReportData(1, 10, values);
      // handleStateDropdown();
      setFieldValue(
        "dealer_id",
        loginUserData?.userType === 3 ? loginUserData?.userId : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  useEffect(() => {
    if (token) {
      handelEmployeedropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {loader ? <Loader /> : null}
      <PageHeader
        heading={`Daily Performance Report`}
        // btntitle={`Add ${getCurrentmaster()?.headername}`}
        // onFilterbutton={() => {
        //   setShowFilterOption((pre) => !pre);
        // }}
        filters={false}
        // onBtnPress={() => {
        //   setmodifydata((prev: any) => {
        //     return {
        //       ...prev,
        //       show: true,
        //       data: null,
        //       type: "add",
        //     };
        //   });
        // }}
      />
      {/* {showfilterOption ? ( */}
      <div className={classes.searchOption}>
        <Row className="rowTop">
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <CommonSelect
              allowClear={true}
              options={EmployeeoList}
              value={values.employee_id ? values.employee_id : null}
              placeholder="Select Employee"
              // disabled={values?.dealer_id ? false : true}
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
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              maxLength={Inputlengths.name}
              required={true}
              value={values.state_id ? values.state_id : null}
              placeholder="Enter State"
              errormsg={
                errors.state_id && touched.state_id ? errors.state_id : ""
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

          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              required={true}
              maxLength={Inputlengths.name}
              placeholder="Enter City"
              value={values.city_id ? values.city_id : null}
              errormsg={errors.city_id && touched.city_id ? errors.city_id : ""}
              onChange={(e) => {
                setFieldValue("city_id", e);
                if (e) {
                  setBtnDisable(false);
                } else {
                  setBtnDisable(true);
                }
              }}
              onKeyDown={handleEnterKeySearch}
            />
          </Col>
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <CommonDate
              allowClear={false}
              // disableDate={true}
              formate="YYYY-MM-DD"
              disabletime={false}
              // showTime={true}
              // isFuture={true}
              endDate={values?.to_date ? values?.to_date : null}
              placeholder="From Date"
              onChange={(e) => {
                if (e) {
                  setBtnDisable(false);
                } else {
                  setBtnDisable(true);
                }
                setFieldValue(
                  "from_date",
                  e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                );
              }}
              value={values.from_date}
            />
          </Col>
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <CommonDate
              allowClear={false}
              // disableDate={true}
              isFuture={true}
              disabletime={true}
              // showTime={true}
              startDate={values?.from_date}
              placeholder="To Date"
              onChange={(e) => {
                if (e) {
                  setBtnDisable(false);
                } else {
                  setBtnDisable(true);
                }
                setFieldValue(
                  "to_date",
                  e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                );
              }}
              value={values.to_date}
            />
          </Col>
          <div className={classes.btnactionblock}>
            <CommonButton
              onClick={() => handleSubmit()}
              name="search"
              Disabled={
                btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
              }
              color="#004c97"
            />
            <CommonButton
              onClick={handleTableSearchClear}
              name="Reset"
              color="#bf1c17"
              Disabled={
                btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
              }
            />
          </div>
        </Row>
      </div>
      {/* ) : null} */}

      <div className={classes.chartoutline}>
        <div className={classes.chartbackground}>
          <div className={classes.DailyReportChart}>
            <DailyBarChart
              labels={BarChartdata.map((ele: any) => ele.employee_name)}
              series={BarChartdata}
              values={values}
            />

            <DailyPieChart data={chartdata} />
          </div>
          {/* <LineChart
            labels={chartdata.map((ele: any) => ele.month)}
            // series={chartdata || []}
            series={chartdata || []}
          /> */}
          <CommonPagination
            dataList={ChartPagination}
            filters={filterdata}
            handleListapi={(page: number, size: number, data: any) => {
              handleReportData(page, size, data);
            }}
          />
        </div>
      </div>
    </>
  );
}
