import { Alert, Button, Col, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import classes from "../modal.module.css";
import * as Yup from "yup";
import { toast } from "react-toastify";

import alerticon from "../../Asserts/Icons/alerticon.png";
import { Inputlengths, LoginUserData, useToken } from "../../Shared/Constants";
import {
  importListLead,
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
import Loader from "../../SharedComponents/Loader/Loader";
interface Props {
  editdata?: any;
  close?: any;
  listapicall?: any;
  filters?: any;
  pageSize?: number;
  selectPage?: number;
  activeTab?: any;
}
export default function LeadImportModal({
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
  const [imageFiles, setImageFiles] = useState<
    { filename: string; file: Blob | string; id: "" }[]
  >([]);
  const [loader, setLoder] = useState(false);
  const [alert, setalert] = useState<boolean>(false);
  const validationSchema = Yup.object({
    // @ts-ignore
    choosefile: Yup.array() // Define an array schema type to validate an array of files
      .min(1, "Please select at least one file")
      .max(5, "You can select up to 5 files") // Maximum number of files allowed is 5
      .test(
        "fileSize", // Custom test name
        "File size of all selected files must be less than 20MB", // Error message if the test fails
        (value) => {
          // Custom validation test for the combined size of all selected files
          if (!value || value.length === 0) return true; // Return true if no files are selected
          const totalSize = value.reduce((acc, file) => acc + file.size, 0); // Calculate the total size of all selected files
          return totalSize / 1024 / 1024 <= 20; // Check if the total size is less than or equal to 20MB
        }
      ),
    // choosefile: Yup.mixed().required("File is required"),
    // emp_id: Yup.strig().required("Employee is required"),
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
    setLoder(true);
    formData.append("token", token);

    // @ts-ignore
    values.choosefile.map((ele) => formData.append("uploaded_file", ele));
    //@ts-ignore

    importListLead(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          listapicall();
          close();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoder(false);
      });
  };
  return (
    <>
      {loader ? <Loader /> : null}
      <div className={classes.leadtransferdisplay}>
        <Row className="rowend">
          {/* <div>
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
          </div> */}
          <Upload
            accept=".xlsx,.xls,.csv,.ods"
            multiple
            // fileList={values.choosefile}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture"
            onChange={(info: any) => {
              setFieldValue(
                "choosefile",
                info.fileList.map((file: any) => file.originFileObj)
              );
              // if (info.file.status !== "uploading") {
              // }
              // if (info.file.status === "done") {
              //   setalert(false);

              //   setFieldValue(
              //     "choosefile",
              //     info.fileList.map((file: any) => file.originFileObj)
              //   );
              // } else if (info.file.status === "failed") {
              //   console.log(info, info.file.status, "infoinfo");

              //   setalert(true);
              //   // toast.error(`${info.file.name} file upload failed.`);
              // }
            }}
            onRemove={(event: any) => {
              setFieldValue(
                "choosefile",
                values.choosefile.filter((ele: any) => ele.uid !== event.uid)
              );
            }}
            // defaultFileList={[...fileList]}
          >
            <Button>Upload Files</Button>
            {errors.choosefile && touched.choosefile ? (
              <p className={classes.errorText}>{errors.choosefile}</p>
            ) : null}
          </Upload>
        </Row>
      </div>
      {alert && (
        <Alert
          style={{ marginTop: "10px" }}
          showIcon
          closable
          onClose={() => setalert(false)}
          className={classes.alertmsg}
          message={"Invalid file format. Upload failed."}
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
      )}
      <div className={classes.btnactionblock}>
        {/* {CheckischangedLead(editdata, values) && ( */}
        <CommonButton color="#004c97" name="Submit" onClick={handleSubmit} />
        {/* )} */}
        <CommonButton color="#CD2027" name="Cancel" onClick={close} />
      </div>
    </>
  );
}
