import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Inputlengths, REGEX, useToken } from "../../../Shared/Constants";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckisChangedData,
  Number_Validation,
  getCatchMsg,
  isFormDirty,
  isNumericString,
  isValidNumber,
  removeNonNumericCharacters,
  replaceText,
} from "../../../Shared/Methods";
import dayjs from "dayjs";
import {
  DistrictDropdown,
  EmployeeDropdown,
  cityDropdown,
  countryCodeDropdown,
  createCustomerServices,
  createLeads,
  customerDetailsDropdown,
  enquiryDropdown,
  getcutomerDetails,
  requirementDropdown,
  stateDropdown,
  updateCustomerServices,
  updateLeads,
  userTypedropdown,
} from "../../../Services/Apiservices";
import { toast } from "react-toastify";
import PageHeader from "../../../Components/PageHeader";
import { CommonSelect } from "../../../Components/InputComponents/CommonSelect";
import { Col, Row } from "antd";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import { CommonCheckBox } from "../../../Components/InputComponents/Commoncheckbox";
import { CommonDate } from "../../../Components/InputComponents/CommonDate";
import { CommonTextArea } from "../../../Components/InputComponents/CommonTextarea";
import CommonButton from "../../../Components/CommonButton/CommonButton";
import classes from "../mainscreen.module.css";
import { useDispatch } from "react-redux";
import { handleCustomerFilters } from "../../../Store/Redux/Reducers/DashboardReducers";
import parsePhoneNumber from "libphonenumber-js";
import Loader from "../../../SharedComponents/Loader/Loader";
import { CountryDropdownDataProps } from "../../../types/dropdown";
interface getExistcustomerprops {
  name?: string;
  company_name: string;
  contact_person: string;
  address: string;
  area: string;
  phone: number;
}
export default function AddCustomer() {
  const token = useToken();
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { state } = useLocation();
  const [whatsapp_no, setwhatsapp_no] = useState(false);
  const [stateDropdownList, setStateDropdownList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [districtDropdownList, setDistrictDropdownList] = useState([]);
  const [districtalert, setdistrictalert] = useState(false);
  const [requirementsList, setRequirementList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [DealerList, setDealerList] = useState([]);
  const [AssignedtoList, setAssignedtoList] = useState([]);
  const [cityalert, setcityalert] = useState(false);
  const [customerType, setCustomertype] = useState(1);
  const [getexistcustomer, setGetexisCustomer] = useState<any>();
  const [enquiryDropdownList, setEnquiryDropdownList] = useState([]);
  const [countryDropdownlist, setCountryDropdownlist] = useState<
    CountryDropdownDataProps[]
  >([]);
  const [phoneNumberString, setPhoneNumberString] = useState("");
  const [parsedPhoneNumber, setParsedPhoneNumber] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("* Name is required"),
    // company_name: Yup.string()
    //   .trim("Please remove leading and trailing spaces")
    //   .strict(true)
    //   .required("Company name is required"),
    contact_person: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("* Contact person is required"),
    phone: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .required("* Phone Number Required")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { country_code } = this.parent;
        if (
          country_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (!isValidNumber(value, getPhoneNumberLength(country_code))) {
          return false;
        }
        return true;
      }),
    alternative_no: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { alternative_code } = this.parent;
        if (
          alternative_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (
          !isValidNumber(value, getPhoneNumberLength(alternative_code))
        ) {
          return false;
        }
        return true;
      }),

    whatsapp_no: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { whatsappCountry_code } = this.parent;
        if (
          whatsappCountry_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (
          !isValidNumber(value, getPhoneNumberLength(whatsappCountry_code))
        ) {
          return false;
        }
        return true;
      }),
    email: Yup.string()
      .nullable()
      .email("Please enter valid email")
      .matches(REGEX.EMAIL, "Please enter valid email"),
    // .required("* Email is required"),
    state_id: Yup.string().required("* State is required"),
    city_id: Yup.string().required("* City is required"),
    // district: Yup.string().required("District is required"),
    address: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("* Address is required"),
    area: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("* Area is required"),
    pincode: Yup.string()
      .length(6, "Please enter valid pincode")
      .required("* Pincode is required"),
  });
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    setFieldError,
    setValues,
    setFieldValue,
    resetForm,
    initialValues,
  } = useFormik({
    initialValues: {
      name: "",
      contact_person: null,
      phone: "",
      alternative_no: "",
      whatsapp_no: "",
      address: "",
      area: "",
      email: "",
      company_name: null,
      pincode: "",
      state: "",
      state_id: "",
      city: "",
      city_id: "",
      district: "",
      country_code: "+91",
      whatsappCountry_code: "+91",
      alternative_code: "+91",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (state?.data) {
        handleUpdateCustomer();
      } else {
        handleCreateCustomer();
      }
      // if (editData) {
      //   handleUpdateUser();
      // } else {
      //   handleCreateUser();
      // }
    },
  });

  const handleChangeNUmber = (event: any, name: string) => {
    if (Number_Validation(event)) {
      setFieldValue(name, event);
      if (name === "phone" && whatsapp_no) {
        setFieldValue("whatsapp_no", event);
      }
    }
  };
  const handleCreateCustomer = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("name", values.name);
    if (values?.company_name) {
      formData.append("company_name", values.company_name);
    }
    if (values?.contact_person) {
      formData.append("contact_person", values.contact_person);
    }
    // formData.append("district", values.district);
    formData.append("pincode", values.pincode);
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    formData.append("address", values.address);
    formData.append("area", values.area);
    formData.append("phone", values.phone);
    if (values?.email) {
      formData.append("email", values.email);
    }
    if (values?.alternative_no) {
      formData.append("alternative_no", values.alternative_no);
    }
    if (values?.whatsapp_no) {
      formData.append("whatsapp_no", values.whatsapp_no);
    }
    if (values.country_code) {
      formData.append("phone_country_code", values.country_code);
    }
    if (values.alternative_code) {
      formData.append("alter_country_code", values.alternative_code);
    }
    if (values.whatsappCountry_code) {
      formData.append("whatsapp_country_code", values.whatsappCountry_code);
    }
    createCustomerServices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/management/customermanagement");
          resetForm();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };
  //updateLeads
  const handleUpdateCustomer = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("CustomerId", state?.data?.customerId);
    formData.append("name", values.name);
    if (values?.company_name) {
      formData.append("companyName", values.company_name);
    }
    if (values?.contact_person) {
      formData.append("contact_person", values.contact_person);
    }
    formData.append("pincode", values.pincode);
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    // formData.append("district", values.district);
    formData.append("address", values.address);
    formData.append("area", values.area);
    formData.append("phone", values.phone);
    if (values?.email) {
      formData.append("email", values.email);
    }
    if (values?.alternative_no) {
      formData.append("alternative_no", values.alternative_no);
    }
    if (values?.whatsapp_no) {
      formData.append("whatsapp_no", values.whatsapp_no);
    }
    if (values.country_code) {
      formData.append("phone_country_code", values.country_code);
    }
    if (values.alternative_code) {
      formData.append("alter_country_code", values.alternative_code);
    }
    if (values.whatsappCountry_code) {
      formData.append("whatsapp_country_code", values.whatsappCountry_code);
    }
    updateCustomerServices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/management/customermanagement");
          resetForm();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
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
  const handleCityDropdown = (ID: any, district?: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    if (district) {
      formData.append("district_id", district);
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
  const handleRequirementDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    requirementDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.RequirementsName,
              value: ele.RequirementsId,
            };
          });
          setRequirementList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleEnquiryDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    enquiryDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.enquiryName,
              value: ele.enquiryId,
            };
          });
          setEnquiryDropdownList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleCountrycodeDropdown = () => {
    setLoader(true);
    let formData = new FormData();
    formData.append("token", token);
    countryCodeDropdown(formData)
      .then((res) => {
        if (res.data.status) {
          let options = res.data.data.map((ele: any) => {
            return {
              ...ele,
              label: `${ele?.country_name} (${ele?.country_code})`,
              value: ele?.country_code,
            };
          });
          setCountryDropdownlist(options);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleCustomersDetailsdropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    customerDetailsDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setCustomerDetails(options);
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
  const handlePhoneNumberChange = (event: any, name: any, code: any) => {
    const value = event;
    setPhoneNumberString(value);
    if (value && value?.includes("+")) {
      const phoneNumber = parsePhoneNumber(value);
      // @ts-ignore
      setParsedPhoneNumber(phoneNumber);
      if (phoneNumber) {
        const countryCode = `+${phoneNumber?.countryCallingCode}`; // Extract the country code
        const nationalNumber = phoneNumber?.nationalNumber; // Extract the national number
        setFieldValue(name, nationalNumber);
        setFieldValue(code, countryCode);
      }
    } else if (isNumericString(value)) {
      setFieldValue(name, removeNonNumericCharacters(value));
    }
  };

  const getPhoneNumberLength = (code?: string) => {
    if (code && countryDropdownlist?.length > 0) {
      const fndObj = [...countryDropdownlist]?.find(
        (ele) => ele?.value === code
      );
      return (fndObj?.number_length || "20")
        ?.split(",")
        ?.map((ele) => parseInt(ele));
    }
    return [20];
  };
  useEffect(() => {
    if (token) {
      handleSetvalues(state?.data);
      handleCountrycodeDropdown();
      // handleStateDropdown();
      // if (state?.data?.states_id) {
      //   // handleDistrictDropdown(state?.data?.states_id);

      //   handleCityDropdown(state?.data?.states_id);
      // }

      // handleCityDropdown();
      handleRequirementDropdown();
      handleEnquiryDropdown();
      handleCustomersDetailsdropdown();
      // handleDealardropdown();
      dispatch(
        handleCustomerFilters({
          page: state?.page,
          size: state?.size,
          filters: state?.filters,
        })
      );
    }
  }, [token]);

  const handleSetvalues = (datas: any) => {
    setValues({
      ...values,

      name: datas?.name ? datas?.name : "",
      company_name: datas?.companyName ? datas?.companyName : "",
      contact_person: datas?.contactPerson ? datas?.contactPerson : "",
      address: datas?.address ? datas?.address : "",
      area: datas?.area ? datas?.area : "",
      phone: datas?.phone ? datas?.phone : "",
      email: datas?.email ? datas?.email : "",
      alternative_no: datas?.alternative_number
        ? datas?.alternative_number
        : "",
      whatsapp_no: datas?.whatsapp_no ? datas?.whatsapp_no : "",

      state: datas?.stateName ? datas?.stateName : "",
      state_id: datas?.stateName ? datas?.stateName : "",
      city: datas?.cityName ? datas?.cityName : "",
      city_id: datas?.cityName ? datas?.cityName : "",
      pincode: datas?.pincode ? datas?.pincode : "",
      country_code: datas?.phone_country_code
        ? datas?.phone_country_code
        : values.country_code,
      whatsappCountry_code: datas?.whatsapp_country_code
        ? datas?.whatsapp_country_code
        : values.whatsappCountry_code,
      alternative_code: datas?.alter_country_code
        ? datas?.alter_country_code
        : values.alternative_code,
      // district: datas?.district_id ? datas?.district_id : "",
    });
  };

  const handleclearValues = () => {
    resetForm();
  };
  const handleValues = (val: any) => {
    return val === "" ? null : val;
  };
  const handleDisableBtn = () => {
    if (
      handleValues(values.name) !== state?.data?.name ||
      handleValues(values.company_name) !== state?.data?.companyName ||
      handleValues(values.contact_person) !== state?.data?.contactPerson ||
      handleValues(values.phone) !== state?.data?.phone ||
      handleValues(values.alternative_no) !== state?.data?.alternative_number ||
      handleValues(values.whatsapp_no) !== state?.data?.whatsapp_no ||
      handleValues(values.email) !== state?.data?.email ||
      handleValues(values.state_id) !== state?.data?.stateName ||
      handleValues(values.city_id) !== state?.data?.cityName ||
      handleValues(values.address) !== state?.data?.address ||
      handleValues(values.area) !== state?.data?.area ||
      handleValues(values.pincode) !== state?.data?.pincode ||
      handleValues(values.country_code) !== state?.data?.phone_country_code ||
      handleValues(values.alternative_code) !==
        state?.data?.alter_country_code ||
      handleValues(values.whatsappCountry_code) !==
        state?.data?.whatsapp_country_code
    ) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        heading={state?.data ? "Update Customer" : "Add Customer"}
        btntitle={"Back To Customer List"}
        filters={false}
        // onFilterbutton={() => {
        //   setShowFilterOption((pre) => !pre);
        // }}
        onBtnPress={() => {
          navigate("/management/customermanagement");
        }}
      />
      <div className={classes.contentbackground}>
        <Row className="rowend">
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              value={values.name}
              required={true}
              onChange={(e) => setFieldValue("name", replaceText(e))}
              name="Name"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("name", values.name);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("name", true);
                    setFieldError("name", error.message);
                  }
                }
              }}
              // onBlur={() => {
              //   try {
              //     validationSchema.validateAt("name", values.name);
              //   } catch (error) {
              //     if (error instanceof Error) {
              //       setFieldTouched("name", true);
              //       setFieldError("name", error.message);
              //     }
              //   }
              // }}
              maxLength={Inputlengths.common}
              placeholder="Name"
              errormsg={errors.name && touched.name ? errors.name : ""}
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              name="Company Name"
              // required={true}
              value={values.company_name}
              maxLength={Inputlengths.Companyname}
              onChange={(e) => setFieldValue("company_name", e ? e : null)}
              placeholder="Company Name"
              errormsg={
                errors.company_name && touched.company_name
                  ? errors.company_name
                  : ""
              }
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              value={values.contact_person}
              required={true}
              onChange={(e) => setFieldValue("contact_person", replaceText(e))}
              name="Contact Person"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt(
                    "contact_person",
                    values.contact_person
                  );
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("contact_person", true);
                    setFieldError("contact_person", error.message);
                  }
                }
              }}
              maxLength={Inputlengths.common}
              placeholder="Contact Person"
              errormsg={
                errors.contact_person && touched.contact_person
                  ? errors.contact_person
                  : ""
              }
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              onChange={(e) => {
                handlePhoneNumberChange(e, "phone", "country_code");
                handleChangeNUmber(e, "phone");
              }}
              onchangeCountryCode={(event: any) => {
                setFieldValue("country_code", event);
              }}
              countryDropdownlist={countryDropdownlist}
              countrycodevalue={values.country_code}
              isCountryCode={true}
              value={values.phone}
              required={true}
              name="Phone Number"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("phone", values.phone);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("phone", true);
                    setFieldError("phone", error.message);
                  }
                }
              }}
              maxLength={20}
              placeholder="Phone Number"
              errormsg={errors.phone && touched.phone ? errors.phone : ""}
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              onchangeCountryCode={(event: any) => {
                setFieldValue("alternative_code", event);
              }}
              onChange={(e) => {
                handlePhoneNumberChange(
                  e,
                  "alternative_no",
                  "alternative_code"
                );
                handleChangeNUmber(e, "alternative_no");
              }}
              onBlur={() => {
                setFieldTouched("alternative_no", true);
                // setFieldError("alternative_no", error.message);
                // try {
                //   console.log(values, "values");

                //   validationSchema.validateSyncAt(
                //     "alternative_no",
                //     values.alternative_no
                //   );
                // } catch (error) {
                //   console.log(error, "error");

                //   if (error instanceof Error) {
                //     setFieldTouched("alternative_no", true);
                //     setFieldError("alternative_no", error.message);
                //   }
                // }
              }}
              value={values.alternative_no}
              countryDropdownlist={countryDropdownlist}
              countrycodevalue={values.alternative_code}
              isCountryCode={true}
              maxLength={20}
              name="Alternative Number"
              placeholder="Alternative Phone Number"
              errormsg={
                errors.alternative_no && touched.alternative_no
                  ? errors.alternative_no
                  : ""
              }
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              onchangeCountryCode={(event: any) => {
                setFieldValue("whatsappCountry_code", event);
              }}
              onChange={(e) => {
                handlePhoneNumberChange(
                  e,
                  "whatsapp_no",
                  "whatsappCountry_code"
                );
                handleChangeNUmber(e, "whatsapp_no");
              }}
              onBlur={() => {
                setFieldTouched("whatsapp_no", true);
              }}
              value={values.whatsapp_no}
              countryDropdownlist={countryDropdownlist}
              countrycodevalue={values.whatsappCountry_code}
              isCountryCode={true}
              name="Whatsapp Number"
              maxLength={20}
              disabled={whatsapp_no}
              disableCountryCode={whatsapp_no}
              placeholder="Whatsapp Number"
              errormsg={
                errors.whatsapp_no && touched.whatsapp_no
                  ? errors.whatsapp_no
                  : ""
              }
            />
            <CommonCheckBox
              name="Same as Phone Number"
              checked={whatsapp_no}
              onClick={() => {
                if (whatsapp_no) {
                  setFieldValue("whatsapp_no", "");
                  setFieldValue("whatsappCountry_code", "+91");
                } else {
                  setFieldValue("whatsapp_no", values?.phone);
                  setFieldValue("whatsappCountry_code", values?.country_code);
                }
                setwhatsapp_no(!whatsapp_no);
              }}
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              value={values.email}
              onBlur={() => {
                setFieldTouched("email", true);
              }}
              onChange={handleChange("email")}
              name="Email"
              preventspace={true}
              // required={true}
              maxLength={Inputlengths.email}
              placeholder="Email"
              errormsg={errors.email && touched.email ? errors.email : ""}
            />
          </Col>
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              // allowClear={true}
              // options={stateDropdownList}
              name="State"
              required={true}
              value={values.state_id ? values.state_id : null}
              placeholder="Enter State"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("state_id", values.state_id);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("state_id", true);
                    setFieldError("state_id", error.message);
                  }
                }
              }}
              maxLength={Inputlengths.name}
              errormsg={
                errors.state_id && touched.state_id ? errors.state_id : ""
              }
              onChange={(e) => {
                setFieldValue("state_id", e ? e : null);
                // if (e) {
                //   setcityalert(false);
                //   setdistrictalert(false);
                //   setValues({
                //     ...values,
                //     state_id: data.value,
                //     city_id: "",
                //     district: "",
                //   });
                //   handleDistrictDropdown(e);
                //   // setFieldValue("state", data.label);
                //   // handleCityDropdown(e, null);
                // } else {
                //   setCityDropdownList([]);
                //   setDistrictDropdownList([]);
                //   setValues({
                //     ...values,
                //     state_id: "",
                //     state: "",
                //     district: "",
                //     city_id: "",
                //   });
                // }
              }}
            />
          </Col>
          {/* <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <CommonSelect
              allowClear={true}
              options={districtDropdownList}
              required={true}
              name="District"
              // disabled={values?.state_id ? false : true}
              placeholder="Select District"
              value={values.district ? values.district : null}
              errormsg={
                districtalert
                  ? "Please select state before selecting district"
                  : errors.district && touched.district
                  ? errors.district
                  : ""
              }
              onkeydown={(e) => {
                if (!values?.state_id) {
                  setdistrictalert(true);
                } else {
                  setdistrictalert(false);
                }
              }}
              onChange={(e, data) => {
                if (e) {
                  setValues({
                    ...values,
                    district: data.value,
                    city_id: "",
                    city: "",
                  });

                  handleCityDropdown(values?.state_id, data.value);
                  // setFieldValue("city", data.label);
                } else {
                  setValues({
                    ...values,
                    district: "",
                    city_id: "",
                    city: "",
                  });
                  handleCityDropdown(values?.state_id, null);
                }
              }}
            />
          </Col> */}
          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              // maxLength={Inputlengths.name}
              //   allowClear={true}
              //   options={cityDropdownList}
              name="City"
              required={true}
              maxLength={Inputlengths.name}
              placeholder="Enter City"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("city_id", values.city_id);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("city_id", true);
                    setFieldError("city_id", error.message);
                  }
                }
              }}
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
                setFieldValue("city_id", e ? e : null);
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
            />
          </Col>

          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              name="Pincode"
              required={true}
              value={values.pincode}
              maxLength={6}
              onChange={(e) => handleChangeNUmber(e, "pincode")}
              placeholder="Pincode"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("pincode", values.pincode);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("pincode", true);
                    setFieldError("pincode", error.message);
                  }
                }
              }}
              errormsg={errors.pincode && touched.pincode ? errors.pincode : ""}
            />
          </Col>

          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <Commoninput
              name="Area"
              required={true}
              value={values.area}
              maxLength={Inputlengths?.Area}
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("area", values.area);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("area", true);
                    setFieldError("area", error.message);
                  }
                }
              }}
              onChange={(e) => setFieldValue("area", replaceText(e))}
              placeholder="Area"
              errormsg={errors.area && touched.area ? errors.area : ""}
            />
          </Col>

          <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
            <CommonTextArea
              required={true}
              name="Address"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt("address", values.area);
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("address", true);
                    setFieldError("address", error.message);
                  }
                }
              }}
              value={values.address}
              maxLength={Inputlengths.address}
              // maxLength={20}
              onChange={handleChange("address")}
              placeholder="Address"
              errormsg={errors.address && touched.address ? errors.address : ""}
            />
          </Col>
        </Row>

        <div className={classes.btnactionblock}>
          <CommonButton
            name={state?.data?.customerId ? "Update" : "Submit"}
            Disabled={handleDisableBtn()}
            color="#004c97"
            style={{ margin: "10px 0px" }}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
