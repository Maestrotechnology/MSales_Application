import React, { useState } from "react";
import { FollowUpStatus, Inputlengths, useToken } from "../../Shared/Constants";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../../SharedComponents/Loader/Loader";
import { Button, Col, Row, Upload } from "antd";
import { CommonTextArea } from "../../Components/InputComponents/CommonTextarea";
import { toast } from "react-toastify";
import classes from "../modal.module.css";
import CommonButton from "../../Components/CommonButton/CommonButton";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { FollowUpChangeStatusService } from "../../Services/Apiservices";
import {
  JSONtoformdata,
  JSONtoformdataWithSameKey,
  getCatchMsg,
} from "../../Shared/Methods";

const validationSchema = Yup.object().shape({
  followup_status: Yup.string().required("Followup Date is required"),
});

function FollowUpChangeStatusModal({ editdata, close, handleSuccess }: any) {
  const token = useToken();
  const [loader, setLoader] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>([]);

  const {
    values,
    setValues,
    handleSubmit,
    handleChange,
    resetForm,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      followup_status: "",
      comment: "",
      upload_file: [],
    },
    validationSchema,
    onSubmit: (Values) => {
      handleChangeStatus();
    },
  });

  const handleChangeStatus = () => {
    setLoader(true);

    let finalOBJ = {
      token: token,
      ...values,
      followup_id: editdata?.followup_id,
    };

    FollowUpChangeStatusService(
      JSONtoformdataWithSameKey(finalOBJ, {
        key: "upload_file",
        value: values?.upload_file,
      })
    )
      .then((res) => {
        if (res?.data?.status === 1) {
          handleSuccess();
          close();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => setLoader(false));
  };

  return (
    <>
      {loader ? <Loader /> : null}

      <Row>
        <Col xl={12} md={12} sm={12} xs={24}>
          <CommonSelect
            name={"Followup Status"}
            value={values.followup_status || null}
            onChange={(e) => setFieldValue("followup_status", e)}
            placeholder={"Followup Status"}
            options={FollowUpStatus}
          />
        </Col>
        <Col xl={12} md={12} sm={12} xs={24}>
          <CommonTextArea
            name={"Comment"}
            value={values.comment}
            maxLength={Inputlengths.comments}
            onChange={(e) => setFieldValue("comment", e)}
            placeholder={"Comment"}
          />
        </Col>
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
                "upload_file",
                info.fileList.map((file) => file.originFileObj)
              );
            } else if (info.file.status === "error") {
              toast.error(`${info.file.name} file upload failed.`);
            }
          }}
          // defaultFileList={[...fileList]}
        >
          <Button>Upload</Button>
        </Upload>

        {/* <div className="w-100">
          <h5>Uploaded File</h5>

            <div style={{ display: "flex", gap: 5, flexFlow: "wrap" }}>
              {uploadedFile?.map((ele: any) => {
                return (
                  <>
                    <img
                      src={ele}
                      alt="image"
                      style={{ width: 101, height: 101 }}
                    />
                  </>
                );
              })}
            </div>
         
        </div> */}
      </Row>

      <div className={classes.btnactionblock}>
        {/* {CheckisChangedData(editdata, values) && ( */}
        <CommonButton
          //   Disabled={!CheckisChangedData(editdata, values)}
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

export default FollowUpChangeStatusModal;
