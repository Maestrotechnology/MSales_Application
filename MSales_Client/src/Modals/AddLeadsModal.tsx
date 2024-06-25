import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalHeader from "./ModalHeader";
import { Commoninput } from "../Components/InputComponents/CommonInput";
import { Col, Row } from "antd";
import { CommonSelect } from "../Components/InputComponents/CommonSelect";
import CommonButton from "../Components/CommonButton/CommonButton";
import classes from "./modal.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  createLeads,
  createuser,
  stateDropdown,
  updateuser,
  userTypedropdown,
  viewuser,
} from "../Services/Apiservices";
import { LoginUserData, REGEX, useToken } from "../Shared/Constants";
import { toast } from "react-toastify";
import { Number_Validation, getCatchMsg } from "../Shared/Methods";
export default function AddLeadsModal({ editdata }: any) {
  const token = useToken();
  const loginUserData = LoginUserData();

  const RenderText = (key: string, value: string | number | undefined) => {
    return (
      <div className={classes.InsideListChilds}>
        <p>{key}</p>
        <strong>:</strong>
        <span>{value ?? "-"}</span>
      </div>
    );
  };

  return (
    <>
      <div
        className={classes.ViewInsideListContainer}
        style={{
          borderBottom: "none",
        }}
      >
        {RenderText("Lead Code", editdata.leadCode)}

        {RenderText("Lead Name", editdata?.name)}
        {RenderText("Contact Person", editdata?.userName)}
        {loginUserData?.userType === 3 &&
          RenderText("Sales Person", editdata?.assignedUserName)}
        {(loginUserData?.userType === 1 || loginUserData?.userType === 2) &&
          RenderText("Dealer Name", editdata?.dealerName)}
        {RenderText("Company Name", editdata?.company_name)}
        {RenderText("Lead Status", editdata.leadStatusName)}
        {RenderText("Email", editdata.email)}
        {RenderText("Phone Number", editdata.phoneNumber)}
        {RenderText("Alternative Number", editdata.alternativeNumber)}
        {RenderText("Whatsapp Number", editdata.whatsapp_no)}
        {RenderText("State", editdata.stateName)}
        {RenderText("City", editdata.cityName)}
        {RenderText("Area", editdata.area)}
        {RenderText("Address", editdata.address)}
      </div>

      <>
        {/* <Row className="rowend">
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                value={values.name}
                onChange={handleChange("name")}
                name="Name"
                maxLength={20}
                placeholder="Name"
                errormsg={errors.name && touched.name ? errors.name : ""}
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                name="Company Name"
                value={values.company_name}
                maxLength={20}
                onChange={handleChange("company_name")}
                placeholder="Company Name"
                errormsg={
                  errors.company_name && touched.company_name
                    ? errors.company_name
                    : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                name="Address"
                value={values.address}
                maxLength={20}
                onChange={handleChange("address")}
                placeholder="Address"
                errormsg={
                  errors.address && touched.address ? errors.address : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                name="Area"
                value={values.area}
                maxLength={20}
                onChange={handleChange("area")}
                placeholder="Area"
                errormsg={errors.area && touched.area ? errors.area : ""}
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                value={values.contact_person}
                onChange={handleChange("contact_person")}
                name="contact_person"
                maxLength={20}
                placeholder="contact_person"
                errormsg={
                  errors.contact_person && touched.contact_person
                    ? errors.contact_person
                    : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                onChange={(e) => handlechangeContact(e)}
                value={values.phone}
                name="Phone Number"
                maxLength={10}
                placeholder="Phone Number"
                errormsg={errors.phone && touched.phone ? errors.phone : ""}
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                value={values.email}
                onChange={handleChange("email")}
                name="Email"
                maxLength={25}
                placeholder="Email"
                errormsg={errors.email && touched.email ? errors.email : ""}
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                onChange={(e) => handlechangeAlternativeNumber(e)}
                value={values.alternative_no}
                name="alternative_no"
                maxLength={10}
                placeholder="Phone Number"
                errormsg={
                  errors.alternative_no && touched.alternative_no
                    ? errors.alternative_no
                    : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                onChange={(e) => handlechangeWhatsappnumber(e)}
                value={values.whatsapp_no}
                name="whatsapp_no"
                maxLength={10}
                placeholder="whatsapp_no"
                errormsg={
                  errors.whatsapp_no && touched.whatsapp_no
                    ? errors.whatsapp_no
                    : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                name="Requirements "
                value={values.requirements_id}
                maxLength={20}
                onChange={handleChange("requirements_id")}
                placeholder="Requirements"
                errormsg={
                  errors.requirements_id && touched.requirements_id
                    ? errors.requirements_id
                    : ""
                }
              />
            </Col>

            <Col xl={6} md={18} sm={24}>
              <CommonSelect
                options={stateDropdownList}
                name="Select State"
                value={values.state ? values.state : null}
                placeholder="select state"
                errormsg={
                  errors.state_id && touched.state_id ? errors.state_id : ""
                }
                onChange={(e, data) => {
                  setFieldValue("state_id", data.value);
                  setFieldValue("state", data.label);
                }}
              />
            </Col>

            <Col xl={6} md={18} sm={24}>
              <CommonSelect
                options={cityDropdownList}
                name="Select City"
                placeholder="select city"
                value={values.city ? values.city : null}
                errormsg={
                  errors.city_id && touched.city_id ? errors.city_id : ""
                }
                onChange={(e, data) => {
                  setFieldValue("city_id", data.value);
                  setFieldValue("city", data.label);
                }}
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <Commoninput
                name="Pincode "
                value={values.pincode}
                maxLength={20}
                onChange={(e) => handlechangePincode(e)}
                placeholder="Pincode"
                errormsg={
                  errors.pincode && touched.pincode ? errors.pincode : ""
                }
              />
            </Col>
            <Col xl={6} md={18} sm={24}>
              <CommonSelect
                options={cityDropdownList}
                name="Enquiry Type Name"
                placeholder="enquiry type name"
                value={
                  values.enquiry_type_name ? values.enquiry_type_name : null
                }
                // errormsg={
                //   errors.city_id && touched.city_id ? errors.city_id : ""
                // }
                onChange={(e, data) => {
                  setFieldValue("enquiry_type_id", data.value);
                  setFieldValue("enquiry_type_name", data.label);
                }}
              />
            </Col>
          </Row>
          <div className={classes.btnactionblock}>
            <CommonButton
              name="Submit"
              color="#004c97"
              onClick={handleSubmit}
            />
            <CommonButton name="Cancel" color="#bf1c17" onClick={close} />
          </div> */}
      </>
    </>
  );
}
