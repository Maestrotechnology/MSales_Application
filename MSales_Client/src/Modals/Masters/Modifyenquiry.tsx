import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useToken } from "../../Shared/Constants";
import { Col, Row } from "antd";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
import CommonButton from "../../Components/CommonButton/CommonButton";
import classes from "../modal.module.css";
import * as Yup from "yup";
import {
  createcategory,
  createenquiry,
  updatecategory,
  updateenquiry,
} from "../../Services/Apiservices";
import { JSONtoformdata, getCatchMsg, replaceText } from "../../Shared/Methods";
import { toast } from "react-toastify";
interface Props {
  type: string;
  Editdata?: any;
  close: () => void;
  handleMasterList: (type: string) => void;
}
const validation = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is required"),
});

export default function ModifyenquiryModal({
  type,
  Editdata,
  close,
  handleMasterList,
}: Props) {
  const token = useToken();
  const { values, setValues, handleSubmit, setFieldValue, errors, touched } =
    useFormik({
      initialValues: { name: "" },
      validationSchema: validation,
      onSubmit: (values) => {
        if (type === "add") {
          handleAddenquiry(values);
        } else if (type === "update") {
          handleUpateenquiry(values);
        }
      },
    });

  // Add master
  const handleAddenquiry = (values: any) => {
    let finalObj = { ...values, token: token };
    createenquiry(JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          handleMasterList("add");
          close();
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };

  // Update Master
  const handleUpateenquiry = (values: any) => {
    let finalObj = {
      ...values,
      token: token,
      dataId: Editdata?.enquireId,
    };
    updateenquiry(JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          handleMasterList("update");
          close();
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };

  // Set Values
  const handleSetValues = (data: any) => {
    setValues({ ...values, name: data?.enquireTypeName });
  };

  useEffect(() => {
    if (token) {
      if (type === "update") {
        handleSetValues(Editdata);
      }
    }
  }, [token]);

  return (
    <>
      <Row className="rowend">
        <Col xl={24} md={24} sm={24} xs={24}>
          <Commoninput
            required={true}
            value={values.name}
            onChange={(e) => setFieldValue("name", replaceText(e))}
            name="Name"
            maxLength={20}
            styles={{ width: "100%" }}
            placeholder="Name"
            errormsg={errors.name && touched.name ? errors.name : ""}
          />
        </Col>
      </Row>
      <div className={classes.btnactionblock}>
        <CommonButton
          name={Editdata ? "Update" : "Submit"}
          color="#004c97"
          Disabled={Editdata?.enquireTypeName === values?.name ? true : false}
          onClick={handleSubmit}
        />
        <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
      </div>
    </>
  );
}
