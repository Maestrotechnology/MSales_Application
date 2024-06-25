import { useEffect, useRef, useState } from "react";
import classes from "./login.module.css";
import TextInput from "../../Components/InputComponents/TextInput";
import logo_image from "../../Asserts/Images/logo3.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../Services/Apiservices";
import key_icon from "../../Asserts/Icons/key.png";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCatchMsg } from "../../Shared/Methods";
import Loader from "../../SharedComponents/Loader/Loader";
import insecure_image from "../../Asserts/Icons/insecure.png";
import { Col, Row } from "antd";
import { Inputlengths } from "../../Shared/Constants";
export default function ChangePassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const inputRef1: any = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [loader, setloader] = useState(false);
  const validationSchema = Yup.object({
    new_password: Yup.string().trim().required("Password is required"),
    conform_password: Yup.string()
      .required("Please enter confirm password")
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .trim("Remove leading and trailing spaces")
      .strict(true),
  });
  const { handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      new_password: "",
      conform_password: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleresetPassword();
    },
  });
  const handleresetPassword = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("resetKey", state);
    formData.append("newPassword", values.conform_password);
    resetPassword(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/");
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => {
        setloader(false);
      });
  };

  useEffect(() => {
    const disableBackNavigation = (event: PopStateEvent) => {
      event.preventDefault();
      // setconfirmation(true);
      navigate("/forgotpassword");
    };

    window.history.pushState(null, "/");
    window.addEventListener("popstate", disableBackNavigation);

    return () => {
      window.removeEventListener("popstate", disableBackNavigation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      {loader ? <Loader /> : null}
      <div className={classes.loginoutline}>
        <img className={classes.logoImage} src={logo_image} alt="logoicon" />
        <h3 className={classes.loginheadmsg}>Change Password!</h3>
        <Row className="rowend">
          <Col sm={24} xs={24}>
            <TextInput
              label={"New Password"}
              TextLength={Inputlengths?.password}
              value={values?.new_password}
              insecure_image={showPassword ? key_icon : insecure_image}
              setShowPassword={setShowPassword}
              showpassword={showPassword}
              types={showPassword ? "text" : "password"}
              IconImage={"password"}
              onChangeText={(e) => {
                setFieldValue("new_password", e.trim().length > 0 ? e : "");
              }}
              errorText={
                touched.new_password && errors.new_password
                  ? errors.new_password
                  : ""
              }
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  inputRef1.current.focus();
                }
              }}
            />
          </Col>
          <Col sm={24} xs={24}>
            {" "}
            <TextInput
              label={"Confirm password"}
              types={showconfirmPassword ? "text" : "password"}
              TextLength={Inputlengths?.password}
              value={values?.conform_password}
              setShowPassword={setShowconfirmPassword}
              showpassword={showconfirmPassword}
              insecure_image={showconfirmPassword ? key_icon : insecure_image}
              focusref={inputRef1}
              IconImage={"password"}
              onChangeText={(e) => {
                setFieldValue("conform_password", e.trim().length > 0 ? e : "");
              }}
              errorText={
                touched.conform_password && errors.conform_password
                  ? errors.conform_password
                  : ""
              }
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSubmit();
                }
              }}
            />
          </Col>

          <Col xs={24} sm={24} className="mt-2">
            <button
              onClick={() => {
                handleSubmit();
              }}
              className={classes.loginButton}
            >
              Change Password
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
