import { Button, Col, Row, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";
import { Inputlengths, useToken } from "../Shared/Constants";
import {
  competitorDropdown,
  dropdownLead,
  changeStatus,
  enquiryDropdown,
} from "../Services/Apiservices";
import { useFormik } from "formik";
import { CommonTextArea } from "../Components/InputComponents/CommonTextarea";
import classes from "./modal.module.css";
import CommonButton from "../Components/CommonButton/CommonButton";
import { toast } from "react-toastify";
import {
  CheckisChangedData,
  getCatchMsg,
  replaceText,
} from "../Shared/Methods";
import { Commoninput } from "../Components/InputComponents/CommonInput";
import Loader from "../SharedComponents/Loader/Loader";
import { CommonDate } from "../Components/InputComponents/CommonDate";
import dayjs from "dayjs";
import * as Yup from "yup";
import moment from "moment";
interface Props {
  editdata?: any;
  close?: any;
  listapicall?: any;
  pageSize?: number;
  selectPage?: number;
  filters?: any;
  hasFollowup?: boolean;
  leadlistapicall?: any;
}
interface FormData {
  lead: number;
  scheduledate?: Date | null;
}
export default function ChangeStatusModal({
  editdata,
  close,
  selectPage,
  pageSize,
  listapicall,
  filters,
  hasFollowup,
  leadlistapicall,
}: Props) {
  const validationSchema = Yup.object({
    scheduleDate: Yup.string().when("lead_id", {
      is: 5,
      then: () => Yup.string().required("* Followup Date is required"),
    }),
    enquiry_type_id: Yup.string().when("lead_id", {
      is: 5,
      then: () => Yup.string().required("* Enquiry Type is required"),
    }),
    comment: Yup.string().when("lead_id", {
      is: 7,
      then: () => Yup.string().required("* Please enter the reason"),
    }),
    // scheduleDate: Yup.date().when(["lead_id"], (lead_id, schema) => {
    //   // @ts-ignore
    //   return lead_id === 5
    //     ? schema.required("Schedule date is required")
    //     : schema.nullable().notRequired();
    // }),
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
  } = useFormik({
    initialValues: {
      lead_name: "",
      lead_id: null,
      comment: "",
      scheduleDate: "",
      competitor_id: null,
      competitor_name: "",
      competitor_Othername: "",
      choosefile: [],
      demo_date: "",
      poc_date: "",
      enquiry_type_id: "",
      enquiry_type_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLeadReassign(values);
    },
  });
  const token = useToken();
  const [DropdownLead, setDropdownLead] = useState([]);
  const [enquiryDropdownList, setEnquiryDropdownList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [CompetitorData, setCompetitorData] = useState([]);
  const handleLeadDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("isDealer", "1");
    dropdownLead(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.leadStatusName,
              value: ele.leadStatusId,
            };
          });
          setDropdownLead(options);
        }
      })
      .catch((err) => {});
  };
  const handleCompetitorDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    competitorDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.competitorName,
              value: ele.competitorId,
            };
          });
          setCompetitorData(options);
        }
      })
      .catch((err) => {});
  };

  const handleLeadReassign = (values: any) => {
    setLoader(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("leadId", editdata?.leadId);
    formData.append("leadStatus", values.lead_id);
    if (values?.lead_id === 7) {
      formData.append("competitor_id", values.competitor_id);
    }
    if (values?.competitor_id === 1 && values?.lead_id === 7) {
      formData.append("competitor", values.competitor_Othername);
    }
    if (values.lead_id === 7) {
      formData.append("dropReason", values.comment);
    }
    if (values.lead_id !== 7) {
      formData.append("comment", values.comment);
    }
    if (values.scheduleDate) {
      formData.append(
        "follow_up_date",
        moment(values.scheduleDate).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (values.demo_date) {
      formData.append("demo_date", values.demo_date);
    }
    if (values.poc_date) {
      formData.append("poc_date", values.poc_date);
    }
    if (values.choosefile) {
      values.choosefile.map((ele: any) => formData.append("upload_file", ele));
    }
    if (values.enquiry_type_id) {
      formData.append("enquiry_type", values.enquiry_type_id);
    }
    // formData.append("dealerId", values.lead_id);
    formData.append("is_changed", 1);
    changeStatus(formData)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(
            hasFollowup ? "Followup date updated successfully" : res.data.msg
          );
          if (listapicall) {
            listapicall(selectPage, pageSize, filters);
            close();
          }
          leadlistapicall(selectPage, pageSize, filters);
          close();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoader(false);
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
  useEffect(() => {
    setValues({
      ...values,
      lead_id: editdata?.leadStatusId ? editdata?.leadStatusId : "",
      lead_name: editdata?.leadStatusName ? editdata?.leadStatusName : "",
      competitor_id: editdata?.competitor_id ? editdata?.competitor_id : "",
      // competitor_name: editdata?.competitorName ? editdata?.competitorName : "",
      // comment: editdata?.leadComment ? editdata?.leadComment : "",
      competitor_Othername: editdata?.competitorName
        ? editdata?.competitorName
        : "",
      scheduleDate: editdata?.schedule_date ? editdata?.schedule_date : "",
      demo_date: editdata?.demo_date ? editdata?.demo_date : "",
      poc_date: editdata?.poc_date ? editdata?.poc_date : "",
    });
  }, [editdata]);
  useEffect(() => {
    if (token) {
      handleLeadDropdown();
      handleCompetitorDropdown();
      handleEnquiryDropdown();
    }
  }, [token]);
  return (
    <>
      {loader ? <Loader /> : null}
      <Row className="rowend">
        {!hasFollowup && (
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonSelect
              options={DropdownLead}
              name="Lead Status"
              value={values.lead_name ? values.lead_name : null}
              placeholder="Select Lead Status"
              //   errormsg={errors.state_id && touched.state_id ? errors.state_id : ""}
              onChange={(e, data) => {
                setFieldValue("lead_id", data.value);
                setFieldValue("lead_name", data.label);
              }}
            />
          </Col>
        )}
        {values?.lead_id === 7 && (
          <>
            <Col xl={12} md={12} sm={12} xs={24}>
              <CommonSelect
                options={CompetitorData}
                name="Competitor"
                value={values.competitor_id ? values.competitor_id : null}
                placeholder="Select Competitor"
                //   errormsg={errors.state_id && touched.state_id ? errors.state_id : ""}
                onChange={(e, data) => {
                  setFieldValue("competitor_id", data.value);
                  setFieldValue("competitor_name", data.label);
                  if (data.value === 1) {
                    setFieldValue("competitor_Othername", "");
                  }
                }}
              />
            </Col>

            {values.competitor_id === 1 && (
              <Col xl={12} md={12} sm={12} xs={24}>
                <Commoninput
                  name="Competitor Name"
                  value={values.competitor_Othername}
                  maxLength={Inputlengths.name}
                  onChange={(e) =>
                    setFieldValue("competitor_Othername", replaceText(e))
                  }
                  placeholder="Competitor Name"
                  errormsg={
                    errors.competitor_Othername && touched.competitor_Othername
                      ? errors.competitor_Othername
                      : ""
                  }
                />
              </Col>
            )}
          </>
        )}
        {values.lead_name === "Follow up" || values.lead_id === 5 ? (
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonSelect
              // disabled={setfieldsDisable()}
              allowClear={true}
              options={enquiryDropdownList}
              value={values.enquiry_type_name ? values.enquiry_type_name : null}
              name="Enquiry Type"
              onBlur={() => {
                try {
                  validationSchema.validateSyncAt(
                    "enquiry_type_id",
                    values.enquiry_type_id
                  );
                } catch (error) {
                  if (error instanceof Error) {
                    setFieldTouched("enquiry_type_id", true);
                    setFieldError("enquiry_type_id", error.message);
                  }
                }
              }}
              required={true}
              placeholder="Select Enquiry Type"
              errormsg={
                errors.enquiry_type_id && touched.enquiry_type_id
                  ? errors.enquiry_type_id
                  : ""
              }
              onChange={(e, data) => {
                if (e) {
                  setValues({
                    ...values,
                    enquiry_type_id: data.value,
                    enquiry_type_name: data.label,
                  });
                  // setFieldValue("enquiry_type_id", data.value);
                  // setFieldValue("enquiry_type_name", data.label);
                } else {
                  setValues({
                    ...values,
                    enquiry_type_id: "",
                    enquiry_type_name: "",
                  });
                }
              }}
            />
          </Col>
        ) : null}
        {values.lead_name === "Follow up" ? (
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonDate
              name="Followup Date"
              // isFuture={true}
              isPast={true}
              disableDate={true}
              disablePastTime
              formate="YYYY-MM-DD HH:mm"
              // showTime={true}
              placeholder="Followup Date"
              onChange={(e) =>
                setFieldValue(
                  "scheduleDate",
                  e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                )
              }
              value={values.scheduleDate}
              errormsg={
                errors.scheduleDate && touched.scheduleDate
                  ? errors.scheduleDate
                  : ""
              }
            />
          </Col>
        ) : null}
        {values.lead_name === "Demo / Site visit" || values.lead_id === 3 ? (
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonDate
              name={"Demo/ Site visit date"}
              // isFuture={true}
              isPast={true}
              disableDate={true}
              disablePastTime
              formate="YYYY-MM-DD HH:mm"
              // showTime={true}
              placeholder={"Demo/ Site visit date"}
              onChange={(e) =>
                setFieldValue(
                  "demo_date",
                  e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                )
              }
              value={values.demo_date}
              errormsg={
                errors.demo_date && touched.demo_date ? errors.demo_date : ""
              }
            />
          </Col>
        ) : null}
        {values.lead_name === "POC Installed" || values.lead_id === 24 ? (
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonDate
              name={"POC installed date"}
              // isFuture={true}
              isPast={true}
              disableDate={true}
              disablePastTime
              formate="YYYY-MM-DD HH:mm"
              // showTime={true}
              placeholder={"POC installed date"}
              onChange={(e) =>
                setFieldValue(
                  "poc_date",
                  e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                )
              }
              value={values.poc_date}
              errormsg={
                errors.poc_date && touched.poc_date ? errors.poc_date : ""
              }
            />
          </Col>
        ) : null}
        <Col xl={12} md={12} sm={12} xs={24}>
          <CommonTextArea
            name={values.lead_id === 7 ? "Drop Reason" : "Comment"}
            value={values.comment}
            required={values.lead_id === 7 ? true : false}
            maxLength={Inputlengths.comments}
            onChange={handleChange("comment")}
            placeholder={values.lead_id === 7 ? "Drop Reason" : "Comment"}
            errormsg={errors.comment && touched.comment ? errors.comment : ""}
          />
        </Col>
        {values.lead_name === "Follow up" ? (
          <>
            <Upload
              // accept=".xlsx,.xls,.csv,.ods"
              multiple
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                }
                if (info.file.status === "done") {
                  // toast.success(`${info.file.name} file uploaded successfully`);
                  // setFieldValue("uploadFile", info.file.originFileObj);
                  setFieldValue(
                    "choosefile",
                    info.fileList.map((file) => file.originFileObj)
                  );
                } else if (info.file.status === "error") {
                  toast.error(`${info.file.name} file upload failed.`);
                }
              }}
              // defaultFileList={[...fileList]}
            >
              <Button>Upload</Button>
              {errors.choosefile && touched.choosefile ? (
                <p className={classes.errorText}>{errors.choosefile}</p>
              ) : null}
            </Upload>
          </>
        ) : null}
      </Row>
      <div className={classes.btnactionblock}>
        {/* {CheckisChangedData(editdata, values) && ( */}
        <CommonButton
          // Disabled={!CheckisChangedData(editdata, values)}
          onClick={handleSubmit}
          name="Submit"
          color="#004c97"
        />
        {/* )} */}
        <CommonButton name="Cancel" color="#CD2027" onClick={close} />
      </div>
    </>
  );
}
