import { Alert, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";
import { useFormik } from "formik";
import { leadsReassign, userTypedropdown } from "../Services/Apiservices";
import { CheckischangedLead, getCatchMsg } from "../Shared/Methods";
import { Inputlengths, LoginUserData, useToken } from "../Shared/Constants";
import classes from "./modal.module.css";
import * as Yup from "yup";
import CommonButton from "../Components/CommonButton/CommonButton";
import { toast } from "react-toastify";
import { CommonTextArea } from "../Components/InputComponents/CommonTextarea";
import alerticon from "../Asserts/Icons/alerticon.png";
interface Props {
  editdata?: any;
  close?: any;
  listapicall?: any;
  filters?: any;
  pageSize: number;
  selectPage?: number;
  leadId?: number[];
  ismulti?: boolean;
  setTransferLeadList?: any;
  setshowmultitransfer?: any;
}
export default function LeadTransferModal({
  editdata,
  close,
  listapicall,
  filters,
  pageSize,
  selectPage,
  leadId,
  ismulti,
  setTransferLeadList,
  setshowmultitransfer,
}: Props) {
  const token = useToken();
  const LoginuserData = LoginUserData();
  const [dealerdropdownList, setDealerdropdown] = useState([]);
  const [employeeDropdownList, setEmployeeDropdownList] = useState([]);
  const validationSchema = Yup.object({
    // @ts-ignore
    dealer_name:
      LoginuserData.userType !== 3
        ? Yup.string().required("Dealer is required")
        : null,
    // emp_id: Yup.string().required("Employee is required"),
  });
  const {
    values,
    handleSubmit,
    errors,
    touched,
    setValues,
    setFieldValue,
    handleChange,
  } = useFormik({
    initialValues: {
      dealer_name: "",
      dealer_id: "",
      emp_id: "",
      emp_name: "",
      comment: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleTransfer();
    },
  });
  //dealerdropdown
  const handleDealerDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (values.dealer_id) {
      formData.append("dealerId", values.dealer_id);
    }

    if (!values.dealer_id) {
      formData.append("isDealer", "1");
    }
    userTypedropdown(formData).then((res) => {
      if (res.data.status === 1) {
        let options = res.data.data.map((ele: any) => {
          return {
            label: ele.userName,
            value: ele.userId,
          };
        });
        setDealerdropdown(options);
      }
    });
  };
  //employeedropdown
  const handleEmployeeDropdown = (ID: any) => {
    let formData = new FormData();
    formData.append("token", token);
    if (ID) {
      formData.append("dealerId", ID);
    }
    userTypedropdown(formData).then((res) => {
      if (res.data.status === 1) {
        let options = res.data.data.map((ele: any) => {
          return {
            label: ele.userName,
            value: ele.userId,
          };
        });
        setEmployeeDropdownList(options);
      }
    });
  };
  const handleTransfer = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    if (values.emp_id) {
      formData.append("employeeId", values.emp_id);
    }
    formData.append("dealerId", values?.dealer_id);
    if (ismulti) {
      formData.append("leadId", leadId?.toString());
    } else {
      formData.append("leadId", editdata?.leadId);
    }
    formData.append("comment", values.comment);
    formData.append("is_change", 1);
    leadsReassign(formData)
      .then((res) => {
        if (res.data.status === 1) {
          if (ismulti) {
            setTransferLeadList([]);
            setshowmultitransfer(false);
          }
          toast.success(res.data.msg);
          close();
          listapicall(selectPage, pageSize, filters);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };
  useEffect(() => {
    if (token) {
      handleDealerDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setValues({
      ...values,
      dealer_id: editdata?.dealerId ? editdata?.dealerId : "",
      dealer_name: editdata?.dealerName ? editdata?.dealerName : "",
      emp_id: editdata?.employee_id ? editdata?.employee_id : "",
      emp_name: editdata?.assignedTo ? editdata?.assignedTo : "",
      comment: editdata?.transferComment ? editdata?.transferComment : "",
    });
    if (editdata?.dealerId ? editdata?.dealerId : "") {
      handleEmployeeDropdown(editdata?.dealerId);
    }
    if (LoginuserData?.userType === 3) {
      handleEmployeeDropdown(LoginuserData?.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusMsg = (name: string, keyname: string, key: any) => {
    if (editdata[key] === -1) {
      return `The existing ${keyname} "${name}" has been removed.`;
    } else if (editdata[key] === 0) {
      return `The current ${keyname} "${name}" is inActive.`;
    } else {
      return "";
    }
  };

  return (
    <>
      <div className={classes.leadtransferdisplay}>
        <Row className="rowend">
          {(editdata?.dealerActiveStatus === 0 ||
            editdata?.dealerActiveStatus === -1) && (
            <Col sm={24}>
              <Alert
                showIcon
                className={classes.alertmsg}
                message={statusMsg(
                  editdata?.dealerName,
                  "dealer",
                  "dealerActiveStatus"
                )}
                type="error"
                // banner={true}
                icon={
                  <img
                    src={alerticon}
                    alt="alerticon"
                    className={classes.alerticon}
                  />
                }
              />{" "}
            </Col>
          )}

          {(editdata?.employeeActiveStatus === 0 ||
            editdata?.employeeActiveStatus === -1) && (
            <Col sm={24}>
              <Alert
                showIcon
                className={classes.alertmsg}
                message={statusMsg(
                  editdata?.assignedTo,
                  "employee",
                  "employeeActiveStatus"
                )}
                // banner={true}
                type="error"
                icon={
                  <img
                    src={alerticon}
                    alt="alerticon"
                    className={classes.alerticon}
                  />
                }
              />
            </Col>
          )}
          {LoginuserData.userType !== 3 &&LoginuserData.userType !== 4? (
            <Col xl={12} md={12} sm={12} xs={24}>
              <CommonSelect
                options={dealerdropdownList}
                name="Dealer"
                // disabled={LoginuserData?.userType === 1 ? true : false}
                value={values.dealer_name ? values.dealer_name : null}
                placeholder="Select Dealer"
                errormsg={
                  errors.dealer_name && touched.dealer_name
                    ? errors.dealer_name
                    : ""
                }
                required={true}
                onChange={(e, data) => {
                  handleEmployeeDropdown(e);
                  setValues({
                    ...values,
                    dealer_id: data.value,
                    dealer_name: data.label,
                    emp_id: "",
                    emp_name: "",
                  });

                  if (data?.value === editdata?.sdealerId) {
                    setFieldValue("comment", "");
                  }
                }}
              />
            </Col>
          ) : null}
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonSelect
              options={employeeDropdownList}
              // disabled={LoginuserData?.userType === 1 ? true : false}
              name="Employee"
              // required={true}
              value={values.emp_name ? values.emp_name : null}
              placeholder="Select Employee"
              errormsg={errors.emp_id && touched.emp_id ? errors.emp_id : ""}
              //   errormsg={errors.state_id && touched.state_id ? errors.state_id : ""}
              onChange={(e, data) => {
                setValues({
                  ...values,
                  emp_id: data.value,
                  emp_name: data.label,
                });

                if (data?.value === editdata?.employee_id) {
                  setFieldValue("comment", values?.comment);
                }
              }}
            />
          </Col>
          {/* {CheckischangedLead(editdata, values) && ( */}
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonTextArea
              name="Reason"
              // disabled={LoginuserData?.userType === 1 ? true : false}
              value={values.comment}
              maxLength={Inputlengths.comments}
              onChange={handleChange("comment")}
              placeholder="Enter Reason"
              errormsg={errors.comment && touched.comment ? errors.comment : ""}
            />
          </Col>
          {/* )} */}
        </Row>
      </div>
      <div className={classes.btnactionblock}>
        {CheckischangedLead(editdata, values) && (
          <CommonButton color="#004c97" name="Submit" onClick={handleSubmit} />
        )}
        <CommonButton color="#bf1c17" name="Cancel" onClick={close} />
      </div>
    </>
  );
}
