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
import {
  addTaskservices,
  developersListservices,
  projectListservices,
} from "../Services/ErpApiServices";
import { CommonDate } from "../Components/InputComponents/CommonDate";
import dayjs from "dayjs";
import { CommonTextArea } from "../Components/InputComponents/CommonTextarea";
import moment from "moment";
export default function WorkReportModal({ close, handlefunction }: any) {
  const token = useToken();
  const loginUserData = LoginUserData();
  const [priorityList, setPriorityList] = useState([
    { label: "Low", id: 1 },
    { label: "Medium", id: 2 },
    { label: "High", id: 3 },
  ]);
  const [projectList, setProjectList] = useState([]);
  const [totalProjectCount, setTotalProjectCount] = useState(15);
  const [totaldeveloperCount, setTotalDevelopersCount] = useState(15);
  const [developersList, setDevelopersList] = useState([]);
  const [loader, setLoder] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const validationSchema = Yup.object({
    task: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .min(3, "Please enter atleast three character")
      .required("* Task is required"),
    project_name: Yup.string().required("* Please select project"),
    expected_Date: Yup.string().required(
      "* please enter expected delivery date"
    ),
    expected_time: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("* Please enter expected time"),
    priority_name: Yup.string().required("* plese select priority"),
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
      task: "Sales and Marketing",
      project_name: "Other Works",
      project_id: 79,
      assigned_name: "",
      assigned_id: "",
      expected_Date: moment(new Date()).format("YYYY-MM-DD"),
      priority_id: "3",
      priority_name: "High",
      expected_time: "08",
      description: "",
      expected_min: "00",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleAddTask();
      //   if (editData) {
      //     handleUpdateUser();
      //   } else {
      //     handleCreateUser();
      //   }
    },
  });
  const handleProjectDropdown = (page: number, pageSize: number) => {
    projectListservices(page, pageSize)
      .then((res) => {
        if (res.data.status === 1) {
          let options =
            res.data.data.items.map((ele: any) => {
              return {
                label: ele.project_name,
                value: ele.project_id,
              };
            }) || [];
          setPage(res?.data?.data?.page || 1);
          setTotalProjectCount(res?.data?.data?.total);
          //   @ts-ignore
          setProjectList((pre) => [...pre, ...options]);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleDeveloperDropdown = (page: number, pageSize: number) => {
    developersListservices(page, pageSize)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.items.map((ele: any) => {
            return {
              label: ele.developer_name,
              value: ele.developer_id,
            };
          });
          setPage(res?.data?.data?.page || 1);
          setTotalDevelopersCount(res?.data?.data?.total);
          //   @ts-ignore
          setDevelopersList((pre) => [...pre, ...options]);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleAddTask = () => {
    let formData = new FormData();
    formData.append("task", values.task);
    formData.append("project_id", values.priority_id);
    formData.append(
      "expected_time",
      `${values.expected_time}:${values.expected_min}`
    );
    formData.append("expected_delivery_date", values.expected_Date);
    formData.append("priority", values.priority_id);
    formData.append("description", values.description);
    if (values.assigned_id) {
      formData.append("assigned_to", values.assigned_id);
    }
    addTaskservices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          close();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        handlefunction();
      });
  };
  useEffect(() => {
    if (token) {
      handleProjectDropdown(1, 10);
      handleDeveloperDropdown(page, pageSize);
    }
  }, [token]);
  const handleExpectedTime = (event: any, fieldname: string) => {
    if (Number_Validation(event)) {
      setFieldValue(fieldname, event);
    }
  };

  return (
    <>
      {loader ? <Loader /> : null}
      <Row
        // @ts-ignore
        autocomplete="off"
        className="rowend"
      >
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <CommonSelect
            options={projectList}
            hasNext={() => {
              if (totalProjectCount >= page * pageSize) {
                handleProjectDropdown(page + 1, pageSize);
              }
            }}
            name="Project"
            required={true}
            placeholder="Select Project"
            value={values.project_name ? values.project_name : null}
            errormsg={
              errors.project_name && touched.project_name
                ? errors.project_name
                : ""
            }
            onChange={(e, data) => {
              setFieldValue("project_name", data.label);
              setFieldValue("project_id", data.value);
            }}
          />
        </Col>
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <Commoninput
            required={true}
            value={values.task}
            onChange={(e) => setFieldValue("task", replaceText(e))}
            name="Task"
            maxLength={Inputlengths.name}
            onBlur={() => {
              try {
                validationSchema.validateSyncAt("task", values.task);
              } catch (error) {
                if (error instanceof Error) {
                  setFieldTouched("task", true);
                  setFieldError("task", error.message);
                }
              }
            }}
            placeholder="Task"
            errormsg={errors.task && touched.task ? errors.task : ""}
          />
        </Col>
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <CommonSelect
            options={developersList}
            name="AssignedTo"
            // required={true}
            placeholder="AssignedTo"
            hasNext={() => {
              if (totaldeveloperCount >= page * pageSize) {
                handleDeveloperDropdown(page + 1, pageSize);
              }
            }}
            value={values.assigned_name ? values.assigned_name : null}
            errormsg={
              errors.assigned_name && touched.assigned_name
                ? errors.assigned_name
                : ""
            }
            onChange={(e, data) => {
              setFieldValue("assigned_name", data.label);
              setFieldValue("assigned_id", data.value);
            }}
          />
        </Col>
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <CommonDate
            name="Expected Date"
            // isFuture={true}
            isPast={true}
            disableDate={true}
            formate="YYYY-MM-DD"
            // showTime={true}
            placeholder="Expected Date"
            onChange={(e) =>
              setFieldValue(
                "expected_Date",
                e ? dayjs(e).format("YYYY-MM-DD") : null
              )
            }
            value={values.expected_Date}
            errormsg={
              errors.expected_Date && touched.expected_Date
                ? errors.expected_Date
                : ""
            }
            required={true}
            disablePastTime
          />
        </Col>
        <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
          <div className={classes.hourminutebox}>
            <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
              <Commoninput
                required={true}
                value={values.expected_time}
                onChange={(e) => handleExpectedTime(e, "expected_time")}
                // onChange={(e) => setFieldValue("expected_time", replaceText(e))}
                name="Expected Hour"
                maxLength={5}
                onBlur={() => {
                  try {
                    validationSchema.validateSyncAt(
                      "expected_time",
                      values.expected_time
                    );
                  } catch (error) {
                    if (error instanceof Error) {
                      setFieldTouched("expected_time", true);
                      setFieldError("expected_time", error.message);
                    }
                  }
                }}
                placeholder="Expected Time"
                errormsg={
                  errors.expected_time && touched.expected_time
                    ? errors.expected_time
                    : ""
                }
              />
            </Col>
            <Col xxl={12} xl={12} md={12} sm={12} xs={24}>
              <Commoninput
                // required={true}
                value={values.expected_min}
                onChange={(e) => handleExpectedTime(e, "expected_min")}
                // onChange={(e) => setFieldValue("expected_time", replaceText(e))}
                name="Expected Minutes"
                maxLength={5}
                onBlur={() => {
                  try {
                    validationSchema.validateSyncAt(
                      "expected_min",
                      values.expected_min
                    );
                  } catch (error) {
                    if (error instanceof Error) {
                      setFieldTouched("expected_min", true);
                      setFieldError("expected_min", error.message);
                    }
                  }
                }}
                placeholder="Expected Minutes"
                errormsg={
                  errors.expected_min && touched.expected_min
                    ? errors.expected_min
                    : ""
                }
              />
            </Col>
          </div>
        </Col>
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <CommonSelect
            options={priorityList}
            name="Priority"
            required={true}
            placeholder="Priority"
            value={values.priority_name ? values.priority_name : null}
            errormsg={
              errors.priority_name && touched.priority_name
                ? errors.priority_name
                : ""
            }
            onChange={(e, data) => {
              setFieldValue("priority_name", data.label);
              setFieldValue("priority_id", data.value);
            }}
          />
        </Col>
        <Col xxl={12} xl={8} md={8} sm={12} xs={24}>
          <CommonTextArea
            // required={true}
            name="Description"
            value={values.description}
            maxLength={Inputlengths.remark}
            // maxLength={20}
            // onKeyDown={(e) => {
            //   Addressvalidation(e);
            // }}
            onChange={(e) => setFieldValue("description", e)}
            placeholder="Description"
            onBlur={() => {
              try {
                validationSchema.validateSyncAt(
                  "description",
                  values.description
                );
              } catch (error) {
                if (error instanceof Error) {
                  setFieldTouched("description", true);
                  setFieldError("description", error.message);
                }
              }
            }}
            errormsg={
              errors.description && touched.description
                ? errors.description
                : ""
            }
          />
        </Col>
      </Row>
      <div className={classes.btnactionblock}>
        <CommonButton
          name={"CheckOut"}
          color="#004c97"
          onClick={handleSubmit}
        />
        <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
      </div>
    </>
  );
}
