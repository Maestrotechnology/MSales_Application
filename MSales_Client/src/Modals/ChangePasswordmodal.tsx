import { Col, Row } from "antd";
import React, { useState } from "react";
import { Commoninput } from "../Components/InputComponents/CommonInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CommonPassword } from "../Components/InputComponents/CommonPassword";
import CommonButton from "../Components/CommonButton/CommonButton";
import { changePassword } from "../Services/Apiservices";
import { toast } from "react-toastify";
import { getCatchMsg, isFormDirty } from "../Shared/Methods";
import { Inputlengths, useToken } from "../Shared/Constants";
import classes from "./modal.module.css";
interface Props {
  listapicall?: any;
  editData?: any;
  //   close?: () => void | undefined;
  close?: any;
  oldpassword?: boolean;
}
export default function ChangePasswordmodal({
  listapicall,
  editData,
  close,
  oldpassword = false,
}: Props) {
  const token = useToken();
  const [btnDisable, setBtnDisable] = useState(false);
  const validationSchema = Yup.object({
    // @ts-ignore
    old_password: oldpassword
      ? Yup.string()
          .required("Old password is required")
          .min(3, "Please enter atleast three character")
      : null,
    password: Yup.string()
      .required("Please enter new password")
      .min(3, "Please enter atleast three character"),

    conform_password: Yup.string()
      .required("Please enter confirm password")
      .min(3, "Please enter atleast three character")
      .oneOf([Yup.ref("password")], "Passwords must match")
      .trim()
      .strict(true),
  });
  const {
    values,
    initialValues,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    setFieldError,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      old_password: "",
      password: "",
      conform_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleChangePassword();
      if (initialValues) {
        setBtnDisable(false);
      }
    },
  });

  const handleChangePassword = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (editData?.userId) {
      formData.append("userId", editData?.userId);
    }
    if (values.old_password) {
      formData.append("old_password", values.old_password);
    }
    formData.append("new_password", values.password);
    changePassword(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          // listapicall(1, 10);
          close();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };

  return (
    <div>
      {" "}
      <Row className="rowend">
        {oldpassword ? (
          <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
            <CommonPassword
              required={true}
              maxLength={Inputlengths.password}
              value={values.old_password}
              onChange={(e) => {
                if (e) {
                  setBtnDisable(false);
                } else {
                  setBtnDisable(true);
                }
                setFieldValue(
                  "old_password",
                  e.target?.value.trim().length > 0 ? e.target?.value : ""
                );
              }}
              name="Old Password"
              placeholder="Enter Old Password"
              errormsg={
                errors.old_password && touched.old_password
                  ? errors.old_password
                  : ""
              }
            />
          </Col>
        ) : null}
        <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
          <CommonPassword
            value={values.password}
            onChange={(e) => {
              if (e) {
                setBtnDisable(false);
              } else {
                setBtnDisable(true);
              }
              setFieldValue(
                "password",
                e.target?.value.trim().length > 0 ? e.target?.value : ""
              );
            }}
            name="New Password"
            maxLength={Inputlengths.password}
            required={true}
            placeholder="Enter New Password"
            errormsg={
              errors.password && touched.password ? errors.password : ""
            }
          />
        </Col>

        <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
          <CommonPassword
            required={true}
            value={values.conform_password}
            onChange={(e) => {
              if (e) {
                setBtnDisable(false);
              } else {
                setBtnDisable(true);
              }
              setFieldValue(
                "conform_password",
                e.target?.value.trim().length > 0 ? e.target?.value : ""
              );
            }}
            name="Confirm Password"
            maxLength={Inputlengths.password}
            placeholder="Enter Confirm Password"
            errormsg={
              errors.conform_password && touched.conform_password
                ? errors.conform_password
                : ""
            }
          />
        </Col>

        {/* <Col xl={6} md={18} sm={24}>
          <Commoninput
            name="User Name"
            value={values.password}
            maxLength={20}
            onChange={handleChange("username")}
            placeholder="User Name"
            errormsg={
              errors.username && touched.username ? errors.username : ""
            }
          />
        </Col> */}
      </Row>
      <div className={classes.btnactionblock}>
        <CommonButton
          onClick={handleSubmit}
          name="Submit"
          color="#004c97"
          Disabled={!isFormDirty(initialValues, values)}
        />
        <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
      </div>
    </div>
  );
}
