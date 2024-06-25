import React, { useEffect, useState } from "react";
import { Inputlengths, useToken } from "../Shared/Constants";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../SharedComponents/Loader/Loader";
import {
  Button,
  Col,
  GetProp,
  Image,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { CommonDate } from "../Components/InputComponents/CommonDate";
import dayjs from "dayjs";
import classes from "./modal.module.css";
import CommonButton from "../Components/CommonButton/CommonButton";
import {
  CreateFollowUpService,
  EditFollowUpService,
  enquiryDropdown,
} from "../Services/Apiservices";
import {
  JSONtoformdata,
  JSONtoformdataWithSameKey,
  getCatchMsg,
} from "../Shared/Methods";
import { CommonTextArea } from "../Components/InputComponents/CommonTextarea";
import { toast } from "react-toastify";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";

const validationSchema = Yup.object().shape({
  followup_dt: Yup.string().required("Followup Date is required"),
  enquiry_type: Yup.string().required("* Enquiry Type is required"),
});

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
function AddFollowupModal({
  close,
  editdata,
  createdata,
  Action,
  handleSuccess,
}: any) {
  const token = useToken();
  const [loader, setLoader] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [enquiryDropdownList, setEnquiryDropdownList] = useState([]);
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
      lead_id: "",
      followup_dt: "",
      comment: "",
      upload_file: [],
      enquiry_type: "",
      enquiry_type_name: "",
    },
    validationSchema,
    onSubmit: (Values) => {
      if (Action === "Add") {
        handleCreateFollowUp();
      } else {
        handleEditFollowup();
      }
    },
  });

  useEffect(() => {
    if (Action === "Edit") {
      setValues({
        ...values,

        comment: editdata?.comment || "",
        followup_dt: editdata?.followup_dt
          ? dayjs(editdata?.followup_dt).format("YYYY-MM-DD HH:mm:ss")
          : "",
        upload_file:
          editdata?.files?.length > 0
            ? editdata?.files?.map((ele: any) => ele?.url)
            : [],
      });
      setUploadedFile(
        editdata?.files?.length > 0
          ? editdata?.files?.map((ele: any) => ele?.url)
          : []
      );
    }
  }, []);

  const handleCreateFollowUp = () => {
    setLoader(true);
    close();
    let finalOBJ: any = {
      ...values,
      token: token,
      lead_id: createdata?.leadId,
    };

    delete finalOBJ?.upload_file;

    CreateFollowUpService(
      JSONtoformdataWithSameKey(finalOBJ, {
        key: "upload_file",
        value: values?.upload_file,
      })
    )
      .then((res) => {
        if (res.data?.status === 1) {
          toast.success(res?.data?.msg);
          handleSuccess();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => setLoader(false));
  };

  const handleEditFollowup = () => {
    setLoader(true);

    let finalOBJ: any = {
      ...values,
      token: token,
      followup_id: editdata?.followup_id,
    };

    delete finalOBJ?.upload_file;

    EditFollowUpService(
      JSONtoformdataWithSameKey(finalOBJ, {
        key: "upload_file",
        value: values?.upload_file,
      })
    )
      .then((res) => {
        if (res.data?.status === 1) {
          toast.success(res?.data?.msg);
          handleSuccess();
          close();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => setLoader(false));
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
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  useEffect(() => {
    if (token) {
      handleEnquiryDropdown();
    }
  }, [token]);

  return (
    <>
      {loader ? <Loader /> : null}

      <Row className="rowend">
        <Col xl={12} md={12} sm={12} xs={24}>
          <CommonDate
            name="Followup Date"
            // isFuture={true}
            isPast={true}
            disableDate={true}
            formate="YYYY-MM-DD HH:mm"
            // showTime={true}
            placeholder="Followup Date"
            onChange={(e) =>
              setFieldValue(
                "followup_dt",
                e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
              )
            }
            value={values.followup_dt}
            errormsg={
              errors.followup_dt && touched.followup_dt
                ? errors.followup_dt
                : ""
            }
            required={true}
            disablePastTime
          />
        </Col>

        <Col xl={12} md={12} sm={12} xs={24}>
          <CommonSelect
            // disabled={setfieldsDisable()}
            allowClear={true}
            options={enquiryDropdownList}
            value={values.enquiry_type_name ? values.enquiry_type_name : null}
            name="Enquiry Type"
            required={true}
            placeholder="Select Enquiry Type"
            errormsg={
              errors.enquiry_type && touched.enquiry_type
                ? errors.enquiry_type
                : ""
            }
            onChange={(e, data) => {
              if (e) {
                setValues({
                  ...values,
                  enquiry_type: data.value,
                  enquiry_type_name: data.label,
                });
                // setFieldValue("enquiry_type_id", data.value);
                // setFieldValue("enquiry_type_name", data.label);
              } else {
                setValues({
                  ...values,
                  enquiry_type: "",
                  enquiry_type_name: "",
                });
              }
            }}
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
          accept={"image/*,.pdf, .png, .svg, .xls, .xlsx, .txt"}
          multiple
          // fileList={values?.upload_file}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          onChange={(info) => {
            setFieldValue(
              "upload_file",
              info.fileList.map((file) => file.originFileObj)
            );
            // if (info.file.status !== "uploading") {
            // }
            // if (info.file.status === "done") {
            //   // toast.success(`${info.file.name} file uploaded successfully`);
            //   // setFieldValue("uploadFile", info.file.originFileObj);
            //   setFieldValue(
            //     "upload_file",
            //     info.fileList.map((file) => file.originFileObj)
            //   );
            // } else if (info.file.status === "error") {
            //   toast.error(`${info.file.name} file upload failed.`);
            // }
          }}
          onPreview={handlePreview}
          // defaultFileList={[...fileList]}
        >
          <Button>Upload</Button>
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
        {Action === "Edit" ? (
          <div className="w-100">
            <h5>Uploaded File</h5>
            {uploadedFile?.length > 0 ? (
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
            ) : (
              <p style={{ textAlign: "center" }}>No Data Found</p>
            )}
          </div>
        ) : null}
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

export default AddFollowupModal;
