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
import { REGEX, useToken } from "../Shared/Constants";
import { toast } from "react-toastify";
import { Number_Validation, getCatchMsg } from "../Shared/Methods";
export default function CustomersViewModal({ editdata }: any) {
  const token = useToken();

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
        {RenderText("Name", editdata?.name)}
        {RenderText("Company Name", editdata?.companyName)}
        {RenderText("Phone Number", editdata.phone)}
        {RenderText("Email", editdata.email)}
        {RenderText("State", editdata.stateName)}
        {RenderText("City", editdata.cityName)}

        {RenderText("Area", editdata.area)}
        {RenderText("Whatsapp", editdata.whatsapp_no)}
        {RenderText("Alternative Number", editdata.alternative_number)}
        {RenderText("Address", editdata.address)}
      </div>
    </>
  );
}
