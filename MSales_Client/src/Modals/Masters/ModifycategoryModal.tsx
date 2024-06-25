import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useToken } from "../../Shared/Constants";
import { Col, Row } from "antd";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
import CommonButton from "../../Components/CommonButton/CommonButton";
import classes from "../modal.module.css";
import * as Yup from "yup";
import { createcategory, updatecategory } from "../../Services/Apiservices";
import {
  JSONtoformdata,
  checkSpecialChar,
  getCatchMsg,
  replaceText,
} from "../../Shared/Methods";
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

export default function ModifycategoryModal({
  type,
  Editdata,
  close,
  handleMasterList,
}: Props) {
  const token = useToken();
  const { values, setValues, handleSubmit, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
      },
      validationSchema: validation,
      onSubmit: (values) => {
        if (type === "add") {
          handleAddcategory(values);
        } else if (type === "update") {
          handleUpatecategory(values);
        }
      },
    });

  // Add master
  const handleAddcategory = (values: any) => {
    let finalObj = { ...values, token: token };
    createcategory(JSONtoformdata(finalObj))
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
  const handleUpatecategory = (values: any) => {
    let finalObj = {
      ...values,
      token: token,
      dataId: Editdata?.customerCategoryId,
    };
    updatecategory(JSONtoformdata(finalObj))
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

  useEffect(() => {
    if (token) {
      if (type === "update") {
        setFieldValue("name", Editdata?.customerCategoryName);
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
            styles={{ width: "100%" }}
            maxLength={20}
            placeholder="Name"
            // onKeyDown={(e: any) => checkSpecialChar(e)}
            errormsg={errors.name && touched.name ? errors.name : ""}
          />
        </Col>
      </Row>
      <div className={classes.btnactionblock}>
        <CommonButton
          name={Editdata ? "Update" : "Submit"}
          color="#004c97"
          Disabled={
            values.name === Editdata?.customerCategoryName ? true : false
          }
          onClick={handleSubmit}
        />
        <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
      </div>
    </>
  );
}
