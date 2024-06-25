import classes from "./modal.module.css";
import warnigicon from "../Asserts/Images/warningimage.jpg";
import CommonButton from "../Components/CommonButton/CommonButton";
import { customerDetailsDropdown } from "../Services/Apiservices";
import { useEffect, useState } from "react";
import { getCatchMsg } from "../Shared/Methods";
import { useToken } from "../Shared/Constants";
import { Col } from "antd";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
// import CommonButton from "../../Components/Commoncomponents/Commonbtn";

interface modalProps {
  msg?: string;
  handlefunction?: () => void;
  close?: () => void;
}
export default function LeadsNeworExistsModal({
  msg,
  handlefunction,
  close,
}: modalProps) {
  const token = useToken();
  const [customerList, setCustomerList] = useState([]);
  const [UserTypeselect, setUserTypeselect] = useState(false);
  //   const validationSchema = Yup.object({

  //     customer_name: Yup.string().required("* Customer Name is required"),
  //   });
  const { values, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      customer_name: "",
      customer_id: "",
    },
    onSubmit: () => {},
  });
  const handleCusomerDropdown = () => {
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
          setCustomerList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  useEffect(() => {
    if (token) {
      handleCusomerDropdown();
    }
  }, [token]);
  return (
    <>
      {/* <div className={classes.modalmsgblock}>
        <img
          src={warnigicon}
          alt="warning"
          className={classes.deletemodalwarningicon}
        />
        <div className={classes.deletemodaltext}>
          <p className={classes.confirmation_msg}>{msg}</p>
          <p className={classes.confirmation_sub_msg}>
            Please Select New User Or Already Exists
          </p>
        </div>
      </div> */}
      {!UserTypeselect ? (
        <>
          <h6 className={classes.newusertypemodalhead}>
            Please Select User Type
          </h6>
          <div className={classes.usertypemodaldisplay}>
            <h5 className={classes.newusertypebtn}>New User</h5>
            <h5
              onClick={() => {
                setUserTypeselect(true);
              }}
              className={classes.existusertypebtn}
            >
              Exists User
            </h5>
          </div>
        </>
      ) : (
        <>
          <Col xl={12} md={18} sm={24}>
            <CommonSelect
              options={customerList}
              name="Select Customer"
              value={values.customer_name ? values.customer_name : null}
              placeholder="select state"
              errormsg={
                errors.customer_name && touched.customer_name
                  ? errors.customer_name
                  : ""
              }
              onChange={(e, data) => {
                setFieldValue("customer_id", data.value);
                setFieldValue("customer_name", data.label);
              }}
            />
          </Col>
          <div className={classes.btnactionblock}>
            <CommonButton
              color="#004c97"
              onClick={handlefunction}
              name="Submit"
            />
            <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
          </div>
        </>
      )}
      {/* <div className={classes.btnactionblock}>
        <CommonButton color="#004c97" onClick={handlefunction} name="Delete" />
        <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
      </div> */}
    </>
  );
}
