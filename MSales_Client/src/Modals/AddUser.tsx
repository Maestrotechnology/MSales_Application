import { useEffect, useState } from "react";
import { Commoninput } from "../Components/InputComponents/CommonInput";
import { Col, Row } from "antd";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";
import CommonButton from "../Components/CommonButton/CommonButton";
import classes from "./modal.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  createuser,
  stateDropdown,
  updateuser,
  userTypedropdown,
} from "../Services/Apiservices";
import {
  Inputlengths,
  LoginUserData,
  REGEX,
  useToken,
} from "../Shared/Constants";
import { toast } from "react-toastify";
import {
  Number_Validation,
  getCatchMsg,
  isFormDirty,
  replaceText,
} from "../Shared/Methods";
import { CommonPassword } from "../Components/InputComponents/CommonPassword";
import Loader from "../SharedComponents/Loader/Loader";
export default function AddUser({
  listapicall,
  close,
  editData,
  viewStatus,
  type,
  filters,
  dataList,
}: any) {
  const token = useToken();
  const loginUserData = LoginUserData();
  const [cityalert, setcityalert] = useState(false);
  const [stateDropdownList, setStateDropdownList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [delarDropdownList, setDropdownList] = useState([]);
  const [loader, setLoder] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .min(3, "Please enter atleast three character")
      .required("* Name is required"),
    username: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .min(3, "Please enter atleast three character")
      .required("* User name is required"),
    phonenumber: Yup.string()
      .matches(REGEX.MOBILE_REGEX, "Please enter valid phone number")
      .required("* Phone number is required"),
    email: Yup.string()
      .email("Please enter valid email")
      .matches(REGEX.EMAIL, "Please enter valid email"),
    // .required("Email is required"),
    // state_id: Yup.string().required("State is required"),
    // city_id: Yup.string().required("City is required"),
    // userType_id: Yup.string(),
    // dealer_id: Yup.string().when(
    //   "userType_id",
    //   (userType_id: any, schema: any) => {
    //     if (type === 4) return schema.required("Dealer is required");
    //     return schema;
    //   }
    // ),
    // pincode: Yup.string()
    //   .length(6, "Please enter valid pincode")
    //   .required("Pincode is required"),
    // password: editData
    //   ? Yup.string()
    //   : Yup.string()
    //       .min(3, "Please enter atleast three character")
    //       .required("Password is required"),
  });
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setValues,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    initialValues,
  } = useFormik({
    initialValues: {
      name: editData?.name ? editData?.name : "",
      username: editData?.userName ? editData?.userName : "",
      phonenumber: editData?.phoneNumber ? editData?.phoneNumber : "",
      email: editData?.email ? editData?.email : "",
      state_name: editData?.stateName ? editData?.stateName : "",
      state_id: editData?.stateName ? editData?.stateName : "",
      city_name: editData?.cityName ? editData?.cityName : "",
      city_id: editData?.cityName ? editData?.cityName : "",
      password: "",
      pincode: editData?.pincode ? editData?.pincode : "",
      userType_id: editData?.userType ? editData?.userType : "",
      userType_name: editData?.userTypeName ? editData?.userTypeName : "",
      dealer_id: editData?.dealerId ? editData?.dealerId : null,
      dealer_name:
        loginUserData?.userType === 3
          ? loginUserData?.userId
          : editData?.dealerName
            ? editData?.dealerName
            : null,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (editData) {
        handleUpdateUser();
      } else {
        handleCreateUser();
      }
    },
  });

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
  const handleCityDropdown = (ID: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);

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

  //create user
  const handleCreateUser = () => {
    setLoder(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("name", values.name ? values.name?.trim() : "");
    formData.append("userName", values.username ? values.username.trim() : "");
    formData.append("phoneNumber", values.phonenumber);
    formData.append("email", values.email);
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    if (values.dealer_id) {
      formData.append("dealer_id", values.dealer_id);
    }

    formData.append("password", values.password);
    formData.append("pincode", values.pincode);
    formData.append("userType", type);
    createuser(formData)
      .then((res) => {
        if (res.data.status === 1) {
          listapicall(1, 10, filters);
          close();
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => setLoder(false));
  };
  //updateuser
  const handleUpdateUser = () => {
    setLoder(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("name", values.name ? values.name?.trim() : "");
    formData.append("userName", values.username ? values.username?.trim() : "");
    formData.append("phoneNumber", values.phonenumber);
    formData.append("email", values.email);
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    if (values.dealer_id) {
      formData.append("dealer_id", values.dealer_id);
    }
    formData.append("pincode", values.pincode);
    formData.append("userType", type);
    formData.append("userId", editData?.userId);
    updateuser(formData)
      .then((res) => {
        if (res.data.status === 1) {
          listapicall(dataList.page, dataList.size, filters);
          close();
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => setLoder(false));
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
              isActive: ele?.isActive,
            };
          });

          let defaultoption: any = options?.find((ele: any) => ele?.isActive);
          setValues((pre: any) => {
            return {
              ...pre,
              dealer_name: editData?.dealerName
                ? editData?.dealerName
                : defaultoption?.label
                  ? defaultoption.label
                  : values?.dealer_name,
              dealer_id: editData?.dealerId
                ? editData?.dealerId
                : defaultoption
                  ? defaultoption.value
                  : values?.dealer_id,
            };
          });
          setDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (token && type !== 2 && type !== 3) {
      // handleStateDropdown();
      // if (editData && editData?.stateId) {
      //   handleCityDropdown(editData?.stateId);
      // }

      handleDelardropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  //contact validation
  const handlechangeContact = (event: any) => {
    if (Number_Validation(event)) {
      setFieldValue("phonenumber", event);
    }
  };
  const handlechangePincode = (event: any) => {
    if (Number_Validation(event)) {
      setFieldValue("pincode", event);
    }
  };
  const RenderText = (key: string, value: string | number | undefined) => {
    return (
      <div className={classes.InsideListChilds}>
        <p>{key}</p>
        <strong>:</strong>
        <span>{value ?? "-"}</span>
      </div>
    );
  };

  return (
    <>
      {viewStatus ? (
        <div
          className={classes.ViewInsideListContainer}
          style={{
            borderBottom: "none",
          }}
        >
          {RenderText("Name", values?.name ? values?.name : "-")}
          {RenderText("User Name", values?.username ? values?.username : "-")}
          {RenderText(
            "Phone Number",
            values.phonenumber ? values.phonenumber : "-"
          )}
          {RenderText("Email", values.email ? values.email : "-")}
          {RenderText("State", values.state_name ? values.state_name : "-")}
          {RenderText("City", values.city_name ? values.city_name : "-")}
          {RenderText("Pincode", values.pincode ? values.pincode : "-")}
        </div>
      ) : (
        <>
          {loader ? <Loader /> : null}
          <Row
            // @ts-ignore
            autocomplete="off"
            className="rowend"
          >
            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                required={true}
                value={values.name}
                onChange={(e) => setFieldValue("name", replaceText(e))}
                name="Name"
                maxLength={Inputlengths.name}
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
                placeholder="Name"
                errormsg={errors.name && touched.name ? errors.name : ""}
              />
            </Col>
            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                name="User Name"
                required={true}
                value={values.username}
                maxLength={Inputlengths.name}
                onChange={(e) => {
                  setFieldValue("username", e);
                }}
                placeholder="User Name"
                onBlur={() => {
                  try {
                    validationSchema.validateSyncAt(
                      "username",
                      values.username
                    );
                  } catch (error) {
                    if (error instanceof Error) {
                      setFieldTouched("username", true);
                      setFieldError("username", error.message);
                    }
                  }
                }}
                errormsg={
                  errors.username && touched.username ? errors.username : ""
                }
              />
            </Col>
            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                required={true}
                onChange={(e) => handlechangeContact(e)}
                value={values.phonenumber}
                name="Phone Number"
                onBlur={() => {
                  try {
                    validationSchema.validateSyncAt(
                      "phonenumber",
                      values.phonenumber
                    );
                  } catch (error) {
                    if (error instanceof Error) {
                      setFieldTouched("phonenumber", true);
                      setFieldError("phonenumber", error.message);
                    }
                  }
                }}
                maxLength={Inputlengths.phonenumber}
                placeholder="Phone Number"
                errormsg={
                  errors.phonenumber && touched.phonenumber
                    ? errors.phonenumber
                    : ""
                }
              />
            </Col>
            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                value={values.email}
                onChange={handleChange("email")}
                name="Email"
                preventspace={true}
                maxLength={Inputlengths.email}
                // required={true}
                placeholder="Email"
                errormsg={errors.email && touched.email ? errors.email : ""}
              />
            </Col>

            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                maxLength={Inputlengths.name}
                // options={stateDropdownList}
                // required={true}
                name="State"
                value={values.state_id ? values.state_id : null}
                placeholder="Enter State"
                errormsg={
                  errors.state_id && touched.state_id ? errors.state_id : ""
                }
                onChange={(e) => {
                  setFieldValue("state_id", e);
                  // setcityalert(false);
                  // setValues({
                  //   ...values,
                  //   state_id: data?.value,
                  //   state_name: data?.label,
                  //   city_id: "",
                  //   city_name: "",
                  //   pincode: "",
                  // });

                  // handleCityDropdown(data?.value);
                }}
              />
            </Col>
            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                maxLength={Inputlengths.name}
                // required={true}
                // options={cityDropdownList}
                name="City"
                // disabled={values?.state_id ? false : true}
                // onkeydown={(e) => {
                //   if (!values?.state_id) {
                //     setcityalert(true);
                //   } else {
                //     setcityalert(false);
                //   }
                // }}
                placeholder="Enter City"
                value={values.city_id ? values.city_id : null}
                errormsg={
                  // cityalert
                  //   ? "Please select state before selecting city"
                  //   :
                  errors.city_id && touched.city_id ? errors.city_id : ""
                }
                onChange={(e) => {
                  setFieldValue("city_id", e);
                  // setValues({
                  //   ...values,
                  //   city_id: data?.value,
                  //   city_name: data?.label,
                  //   pincode: "",
                  // });
                }}
              />
            </Col>
            {loginUserData?.userType !== 3 && type !== 2 && type !== 3 && (
              <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
                <CommonSelect
                  options={delarDropdownList}
                  name="Dealer"
                  // required={true}
                  placeholder="Select Dealer"
                  value={values.dealer_name ? values.dealer_name : null}
                  errormsg={
                    errors.dealer_id && touched.dealer_id
                      ? errors.dealer_id
                      : ""
                  }
                  onChange={(e, data) => {
                    setFieldValue("dealer_name", data.label);
                    setFieldValue("dealer_id", data.value);
                  }}
                />
              </Col>
            )}

            <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
              <Commoninput
                onChange={(e) => handlechangePincode(e)}
                value={values.pincode}
                // required={true}
                name="Pincode"
                maxLength={6}
                placeholder="Pincode"
                errormsg={
                  errors.pincode && touched.pincode ? errors.pincode : ""
                }
              />
            </Col>
            {editData ? null : (
              <Col xxl={8} xl={8} md={8} sm={12} xs={24}>
                <CommonPassword
                  value={values.password}
                  name="Password"
                  // required={true}
                  maxLength={Inputlengths.password}
                  placeholder="Password"
                  onChange={handleChange("password")}
                  errormsg={
                    errors.password && touched.password ? errors.password : ""
                  }
                />
              </Col>
            )}
          </Row>
          <div className={classes.btnactionblock}>
            <CommonButton
              Disabled={!isFormDirty(initialValues, values)}
              name={editData ? "Update" : "Submit"}
              color="#004c97"
              onClick={handleSubmit}
            />
            <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
          </div>
        </>
      )}
    </>
  );
}
