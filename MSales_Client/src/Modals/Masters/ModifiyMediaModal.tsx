import { Alert, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import classes from "../modal.module.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
// import alerticon from "../Asserts/Icons/alerticon.png";
import { Inputlengths, LoginUserData, useToken } from "../../Shared/Constants";
import {
  leadsReassign,
  requirementDropdown,
  uploadmediaFile,
  userTypedropdown,
} from "../../Services/Apiservices";
import { CheckischangedLead, getCatchMsg } from "../../Shared/Methods";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { CommonTextArea } from "../../Components/InputComponents/CommonTextarea";
import CommonButton from "../../Components/CommonButton/CommonButton";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
interface Props {
  editdata?: any;
  close?: any;
  listapicall?: any;
  filters?: any;
  pageSize?: number;
  selectPage?: number;
  activeTab?: any;
}
export default function ModifiyMediaModal({
  editdata,
  close,
  listapicall,
  filters,
  pageSize,
  selectPage,
  activeTab,
}: Props) {
  const token = useToken();
  const LoginuserData = LoginUserData();
  const [requirementsList, setRequirementList] = useState([]);
  const [imageFiles, setImageFiles] = useState<
    { filename: string; file: Blob | string; id: "" }[]
  >([]);
  const validationSchema = Yup.object({
    // @ts-ignore
    requirements_id: Yup.string()
      // .min(1, "Please select atleast one requirement")
      .required("Requirement is required"),
    choosefile: Yup.mixed()
      .test("fileSize", "File must be less than or equal to 20MB ", (value) => {
        if (!value) {
          return true;
        }
        // @ts-ignore
        return value.size <= 20 * 1024 * 1024;
      })
      .required("File is required"),
    // choosefile: Yup.mixed().required("File is required"),
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
      requirements_name: "",
      requirements_id: "",
      file_name: "",
      choosefile: [],
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleUploadImage();
      //   handleTransfer();
    },
  });
  const handleUploadImage = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (values.requirements_id) {
      // @ts-ignore
      formData.append("requirement_id", values.requirements_id);
    }
    // @ts-ignore
    formData.append("upload_file", values.choosefile);
    //@ts-ignore
    formData.append("file_title", values.file_name);
    formData.append("file_type", activeTab);
    uploadmediaFile(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          listapicall();
          close();
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleRequirementDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    requirementDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.RequirementsName,
              value: ele.RequirementsId,
            };
          });
          setRequirementList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  useEffect(() => {
    if (token) {
      handleRequirementDropdown();
    }
  }, [token]);
  return (
    <>
      <div className={classes.leadtransferdisplay}>
        <Row className="rowend">
          <Col xl={12} md={12} sm={12} xs={24}>
            <CommonSelect
              allowClear={true}
              options={requirementsList}
              // mode={"multiple"}
              name="Requirement"
              required={true}
              placeholder="Select Requirement"
              value={values.requirements_id ? values.requirements_id : null}
              errormsg={
                errors.requirements_id && touched.requirements_id
                  ? errors.requirements_id
                  : ""
              }
              onChange={(e, data) => {
                if (e) {
                  setFieldValue("requirements_id", e);
                  // setFieldValue("requirements_name", e);
                } else {
                  setValues({
                    ...values,
                    requirements_id: "",
                    requirements_name: "",
                  });
                }
              }}
            />
          </Col>

          <Col xl={12} md={12} sm={12} xs={24}>
            <Commoninput
              name="File Name"
              value={values.file_name}
              maxLength={Inputlengths.fileName}
              onChange={(e) => setFieldValue("file_name", e)}
              placeholder="File Name"
              // errormsg={
              //   errors.company_name && touched.company_name
              //     ? errors.company_name
              //     : ""
              // }
            />
          </Col>
          <div>
            <input
              type="file"
              multiple
              accept={
                activeTab === "1"
                  ? ".jpg,.jpeg,.png,.webp,.avif,.gif,.svg,"
                  : ".mp4,.mov,.wmv,.avi"
              }
              onChange={(e) => {
                if (e) {
                  // @ts-ignore

                  // @ts-ignore
                  setFieldValue("choosefile", e.target.files[0]);
                }
              }}
            />
            {errors.choosefile && touched.choosefile ? (
              <p className={classes.errorText}>{errors.choosefile}</p>
            ) : null}
          </div>
        </Row>
      </div>
      <div className={classes.btnactionblock}>
        {/* {CheckischangedLead(editdata, values) && ( */}
        <CommonButton color="#CD2027" name="Submit" onClick={handleSubmit} />
        {/* )} */}
        <CommonButton color="#bf1c17" name="Cancel" onClick={close} />
      </div>
    </>
  );
}
