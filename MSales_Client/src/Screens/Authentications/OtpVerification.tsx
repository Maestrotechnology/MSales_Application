import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import classes from "./login.module.css";
import logo_image from "../../Asserts/Images/logo3.png";
import { resetotp, verifyotp } from "../../Services/Apiservices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Number_Validation, getCatchMsg } from "../../Shared/Methods";
import Loader from "../../SharedComponents/Loader/Loader";
import { REGEX } from "../../Shared/Constants";
export default function OtpVerification() {
  const { state } = useLocation();
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(REGEX.OTP, "Please enter valid otp")
      .required("OTP is required"),
  });
  const { handleSubmit, values, errors, setFieldValue } = useFormik({
    initialValues: {
      otp: "",
      resetKey: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleverifyotp();
    },
  });

  const [timeRemaining, setTimeRemaining] = useState(Number(120));
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const handleverifyotp = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("otp", values.otp);
    formData.append("resetKey", values?.resetKey ? values?.resetKey : state);
    verifyotp(formData)
      .then((res) => {
        if (res.data.status === 1) {
          navigate("/changepassword", { state: res.data.reset_key });
          toast.success(res.data.msg);
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
  const handleResendOtp = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("resetKey", values?.resetKey ? values?.resetKey : state);
    resetotp(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setFieldValue("resetKey", res?.data?.reset_key);
          toast.success(res.data.msg);
          setTimeRemaining(120);
          navigate("/otpverification", { state: res?.data?.reset_key });

          // navigate("/otpverification", { state: res?.data?.data?.reset_key });
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
  const handleChangeNumber = (event: any) => {
    if (Number_Validation(event)) {
      setFieldValue("otp", event);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);
    if (timeRemaining === 0) {
      clearTimeout(timer);
      // Handle timeout action here
    }

    return () => {
      clearTimeout(timer);
    };
  }, [timeRemaining]);

  const Otpkeydown = (e: any, index: any) => {
    if (index === 5 && e.keyCode === 13) {
      handleSubmit();
    } else if (
      !REGEX.NUMBER_REGEX.test(e.key) &&
      e.keyCode !== 46 &&
      e.keyCode !== 8
    ) {
      e.preventDefault();
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileQuery = window.matchMedia("(max-width: 350px)");
      setIsMobile(isMobileQuery.matches);
    };

    // Initial check on mount
    handleResize();

    // Add event listener to update on resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.container}>
      {loader ? <Loader /> : null}
      <div className={classes.loginoutline}>
        <img className={classes.logoImage} src={logo_image} alt="logo_icon" />
        <h3 className={classes.loginheadmsg}>Enter Your 6-Digit OTP</h3>
        <div className={classes.otpfield}>
          <OTPInput
            inputStyle={{ textAlign: "center" }}
            containerStyle={{ gap: isMobile ? "5px" : "15px" }}
            skipDefaultStyles
            value={values.otp}
            onChange={(e) => handleChangeNumber(e)}
            numInputs={6}
            renderInput={(props, ind) => (
              <input
                {...props}
                onKeyDown={(e) => {
                  Otpkeydown(e, ind);
                }}
              />
            )}
          />
        </div>
        <div className={classes.otpblock}></div>
        {errors.otp ? <p className={classes.errorTxt}>{errors.otp}</p> : null}

        <div className={classes.otpdesc}>
          {!timeRemaining ? (
            <p className={classes.opttext}>
              Don’t receive a code?&nbsp;
              <p
                onClick={() => {
                  handleResendOtp();
                }}
                className={classes.resendotp}
              >
                Resend Otp
              </p>
            </p>
          ) : (
            <p className={classes.opttext}>
              Don’t receive a code?&nbsp;Resend In
              <span className={classes.resendotp}>
                &nbsp;: 0{minutes}:{seconds < 10 ? "0" : ""}
                {seconds}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className={`${classes.loginButton} mt-2`}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
