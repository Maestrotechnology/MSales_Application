import { useState } from "react";
import classes from "./login.module.css";
import TextInput from "../../Components/InputComponents/TextInput";
import logo_image from "../../Asserts/Images/logo3.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotpassword } from "../../Services/Apiservices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Preventspace, getCatchMsg } from "../../Shared/Methods";
import Loader from "../../SharedComponents/Loader/Loader";
import { Col, Row } from "antd";
import { Inputlengths, REGEX } from "../../Shared/Constants";
import email_icon from "../../Asserts/Icons/email.png";
export default function Forgotpassword() {
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter valid email")
      .matches(REGEX.EMAIL, "Please enter valid email")
      .required("Email is required"),
  });
  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleForgotpassword();
    },
  });
  const handleForgotpassword = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("email", values.email.trim());
    forgotpassword(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/otpverification", { state: res?.data?.reset_key });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setloader(false);
      });
  };

  // useEffect(() => {
  //   const disableBackNavigation = (event: PopStateEvent) => {
  //     event.preventDefault();
  //     setconfirmation(true);
  //   };

  //   window.history.pushState(null, "/");
  //   window.addEventListener("popstate", disableBackNavigation);

  //   return () => {
  //     window.removeEventListener("popstate", disableBackNavigation);
  //   };
  // }, []);

  return (
    <div className={classes.container}>
      {/* <GlobalModal size={500} isVisible={confirmation} closeIcon={false}>
        <Confirmation
          close={() => setconfirmation(false)}
          handlefunction={() => {
            navigate("/");
          }}
        />
      </GlobalModal> */}
      {loader ? <Loader /> : null}
      <div className={classes.loginoutline}>
        <img className={classes.logoImage} src={logo_image} alt="logo_icon" />
        <h3 className={classes.loginheadmsg}>Enter Your Email!</h3>
        <Row className="rowend">
          <Col sm={24} xs={24}>
            <TextInput
              name="email"
              label={"Email"}
              types="text"
              TextLength={Inputlengths.email}
              IconImage={"user"}
              isemail={true}
              insecure_image={email_icon}
              onKeyDown={(e) => {
                Preventspace(e);
                if (e.keyCode === 13) {
                  handleSubmit();
                }
              }}
              onChangeText={handleChange("email")}
              errorText={touched.email && errors.email ? errors.email : ""}
            />
          </Col>
          <Col sm={24} xs={24} className="mt-2">
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
