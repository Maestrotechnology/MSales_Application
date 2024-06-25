import { useRef, useState } from "react";
import classes from "./login.module.css";
import TextInput from "../../Components/InputComponents/TextInput";
import logo_image from "../../Asserts/Images/logo3.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loginservice } from "../../Services/Apiservices";
import { saltKey } from "../../Services/ServiceConstants";
import { setCookie } from "../../Store/Storage/Cookies";
import { useDispatch } from "react-redux";
import {
  handleAccessData,
  handleCheckIndata,
  handleStoreToken,
  handleUserType,
} from "../../Store/Redux/Reducers/AuthReducers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EncryptData, getCatchMsg } from "../../Shared/Methods";
import insecure_image from "../../Asserts/Icons/insecure.png";
import key_icon from "../../Asserts/Icons/key.png";
import { Col, Row } from "antd";
import { Inputlengths } from "../../Shared/Constants";
import Loader from "../../SharedComponents/Loader/Loader";
import { loginAccess } from "../../Services/ErpApiServices";

export default function UserLogin() {
  var sha1 = require("sha1");
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();
  const inputRef1: any = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    user_name: Yup.string().trim().required("User name is required"),
    password: Yup.string().trim().required("Password is required"),
    // captcha: Yup.string()
    //   .required("Captcha is required")
    //   .trim("Remove leading and trailing spaces")
    //   .strict(true),
  });
  const { handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLoginData();
    },
  });

  const handleErpLogin = () => {
    let formData = new FormData();
    formData.append("authcode", sha1(saltKey + values.user_name.trim()));
    formData.append("username", values.user_name.trim());
    formData.append("password", values.password.trim());
    // formData.append("device_type", "3");
    loginAccess(formData)
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(handleCheckIndata(res?.data?.checkin_time));
          setCookie("erpLoginData", EncryptData(JSON.stringify(res.data)));
          setCookie("LoginTime", res?.data?.checkin_time);
        } else {
          toast.error(res.data.msg);
          setCookie("LoginTime", null);
          // setCookie("LoginTime", res?.data?.checkin_time);
        }
      })
      .catch((err) => {
        setCookie("LoginTime", null);
        getCatchMsg(err);
      });
  };
  const handleLoginData = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("authcode", sha1(saltKey + values.user_name.trim()));
    formData.append("userName", values.user_name.trim());
    formData.append("password", values.password.trim());
    formData.append("device_type", "3");
    Loginservice(formData)
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.userType === 4) {
            handleErpLogin();
          }
          setCookie("logindata", EncryptData(JSON.stringify(res.data)));
          dispatch(handleAccessData(res.data));
          dispatch(handleUserType(res.data.userType));
          dispatch(handleStoreToken(res.data.token));
          navigate("/dashboard");
          // toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => setloader(false));
  };

  return (
    <div className={classes.container}>
      {loader && <Loader />}
      <div className={classes.loginoutline}>
        <img className={classes.logoImage} src={logo_image} alt="logo_icon" />
        <h3 className={classes.loginheadmsg}>Welcome Back!</h3>
        <Row className="rowend">
          <Col sm={24} xs={24} className="colwidth">
            <TextInput
              name="user_name"
              label={"User Name"}
              types="text"
              TextLength={Inputlengths.name}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  inputRef1.current.focus();
                }
              }}
              value={values?.user_name}
              IconImage={"user"}
              onChangeText={(e) => {
                setFieldValue("user_name", e.trim().length > 0 ? e : "");
              }}
              errorText={
                touched.user_name && errors.user_name ? errors.user_name : ""
              }
            />
          </Col>
          <Col sm={24} xs={24} className="colwidth">
            <TextInput
              label={"Password"}
              types={showPassword ? "text" : "password"}
              TextLength={Inputlengths.password}
              focusref={inputRef1}
              value={values?.password}
              IconImage={"password"}
              setShowPassword={setShowPassword}
              showpassword={showPassword}
              insecure_image={showPassword ? key_icon : insecure_image}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSubmit();
                }
              }}
              onChangeText={(e) => {
                setFieldValue("password", e.trim().length > 0 ? e : "");
              }}
              errorText={
                touched.password && errors.password ? errors.password : ""
              }
            />
          </Col>
          <Col sm={24} xs={24} className="colwidth">
            <div className={classes.forgotpassword}>
              <p onClick={() => navigate("forgotpassword")}>
                Forgot Password ?
              </p>
            </div>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className={classes.loginButton}
            >
              Login
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
