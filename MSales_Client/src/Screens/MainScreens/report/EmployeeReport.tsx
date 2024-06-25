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
  leadchartreport,
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
export default function EmployeeReport() {
  const token = useToken();
  const [chartdata, setChartdata] = useState([]);
  // const [showfilterOption, setShowFilterOption] = useState(false);
  const [DealerList, setDealerList] = useState([]);
  const [EmployeeoList, setEmployeeList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [stateDropdownList, setStateDropdownList] = useState([]);
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
      from_date: GetreportDates().start_date,
      to_date: GetreportDates().end_date,
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
      handleReportData();
    },
  });
  const handleReportData = () => {
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
    leadchartreport(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setChartdata(res.data.data);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleDealardropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("isDealer", 1);
    formData.append("is_report", 1);
    userTypedropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setDealerList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handelEmployeedropdown = (ID: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("dealerId", ID);
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
  const handleCityDropdown = (ID: any, district: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    if (district) {
      formData.append("district", district);
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
  const handleDistrictDropdown = (ID: any, district: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    if (district) {
      formData.append("district", district);
    }
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
    setDistrictDropdownList([]);
    setCityDropdownList([]);
    if (loginUserData?.userType !== 3) {
      setEmployeeList([]);
    }
    setBtnDisable(false);
    setValues({
      from_date: GetreportDates().start_date,
      to_date: GetreportDates().end_date,
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
      handleReportData();
      handleDealardropdown();
      // handleStateDropdown();
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

  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <PageHeader
        heading={`Employee Report (${getDates(
          values?.from_date,
          values?.to_date
        )})`}
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
          {loginUserData?.userType !== 3 && (
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <CommonSelect
                allowClear={true}
                options={DealerList}
                value={values.dealer_id ? values.dealer_id : null}
                placeholder="Select Dealer"
                errormsg={
                  errors.dealer_id && touched.dealer_id ? errors.dealer_id : ""
                }
                onChange={(e, data) => {
                  if (e) {
                    setBtnDisable(false);
                    handelEmployeedropdown(e);
                    // setFieldValue("dealer_id", e);
                    setValues({
                      ...values,
                      dealer_id: e,
                      employee_id: "",
                    });
                  } else {
                    setBtnDisable(true);
                    setEmployeeList([]);
                    setValues({
                      ...values,
                      dealer_id: "",
                      employee_id: "",
                    });
                    // setFieldValue("dealer_id", null);
                  }
                }}
              />
            </Col>
          )}
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
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
                if (!values?.dealer_id) {
                  setEmployeeAlert(true);
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
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              // allowClear={true}
              // options={stateDropdownList}
              // name="State"
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
                // if (e) {
                //   setValues({
                //     ...values,
                //     state_id: data.value,
                //     city_id: "",
                //     district: "",
                //   });
                //   setcityalert(false);
                //   setdistrictalert(false);
                //   handleDistrictDropdown(e, null);
                //   // setFieldValue("state", data.label);
                //   handleCityDropdown(e, null);
                // } else {
                //   setCityDropdownList([]);
                //   setDistrictDropdownList([]);
                //   setValues({
                //     ...values,
                //     state_id: "",
                //     state: "",
                //     city_id: "",
                //     district: "",
                //   });
                // }
              }}
              onKeyDown={handleEnterKeySearch}
            />
          </Col>
          {/* <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              // allowClear={true}
              // options={districtDropdownList}
              required={true}
              maxLength={Inputlengths.name}
              // disabled={values?.state_id ? false : true}
              placeholder="Enter District"
              value={values.district ? values.district : null}
              errormsg={
                // districtalert
                //   ? "Please select state before selecting district"
                //   :
                errors.district && touched.district ? errors.district : ""
              }
              // onkeydown={(e) => {
              //   if (!values?.state_id) {
              //     setdistrictalert(true);
              //   } else {
              //     setdistrictalert(false);
              //   }
              // }}
              onChange={(e) => {
                if (e) {
                  setBtnDisable(false);
                } else {
                  setBtnDisable(true);
                }
                setFieldValue("district", e);
                // if (e) {
                //   setValues({
                //     ...values,
                //     district: data.value,
                //     city_id: "",
                //     city: "",
                //   });

                //   handleCityDropdown(values?.state_id, data.value);
                //   // setFieldValue("city", data.label);
                // } else {
                //   setValues({
                //     ...values,
                //     district: "",
                //     city_id: "",
                //     city: "",
                //   });
                //   handleCityDropdown(values?.state_id, null);
                // }
              }}
            />
          </Col> */}
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              // allowClear={true}
              // options={cityDropdownList}
              required={true}
              maxLength={Inputlengths.name}
              // disabled={values?.state_id ? false : true}
              placeholder="Enter City"
              value={values.city_id ? values.city_id : null}
              errormsg={
                // cityalert
                //   ? "Please select state before selecting city"
                //   :
                errors.city_id && touched.city_id ? errors.city_id : ""
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
                //   // setFieldValue("city", data.label);
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
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <CommonDate
              // name="From Date"
              allowClear={false}
              disableDate={true}
              showTime={true}
              formate="YYYY-MM-DD"
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
                  e ? dayjs(e).format("YYYY-MM-DD 00:00:00") : null
                );
              }}
              value={values.from_date}
            />
          </Col>
          <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
            <CommonDate
              // name="To Date"
              allowClear={false}
              disableDate={true}
              isFuture={true}
              showTime={true}
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
                  e ? dayjs(e).format("YYYY-MM-DD 23:59:59") : null
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
          <LineChart
            labels={chartdata.map((ele: any) => ele.month)}
            // series={chartdata || []}
            series={chartdata || []}
          />
        </div>
      </div>
    </>
  );
}
