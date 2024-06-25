import classes from "./modal.module.css";
import whatsaappIcon from "../Asserts/Icons/whatsapp.png";
import CommonButton from "../Components/CommonButton/CommonButton";
import { Commoninput } from "../Components/InputComponents/CommonInput";
import { useEffect, useState } from "react";
import { Checkbox, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  addMessageContentServices,
  readMessageContentServices,
} from "../Services/Apiservices";
import { JSONtoformdata, getCatchMsg } from "../Shared/Methods";
import { toast } from "react-toastify";
import { useToken } from "../Shared/Constants";
// import CommonButton from "../../Components/Commoncomponents/Commonbtn";

interface modalProps {
  msg?: string;
  handlefunction?: any;
  close?: () => void;
  whatsappData?: any;
}

export default function Confirmation({
  msg,
  handlefunction,
  close,
  whatsappData,
}: modalProps) {
  const token = useToken();
  const [loader, setloader] = useState(false);
  const [rememberText, setRememberText] = useState(true);
  const [textData, setTextData] = useState("");

  useEffect(() => {
    if (token) {
      getSavedMessageContent();
    }
  }, [token]);
  const handlewhatsappClick = () => {
    if (rememberText) {
      saveMessageContent();
      return;
    }

    const whatsappURL = `https://wa.me/${whatsappData}?text=${encodeURIComponent(
      textData
    )}`;
    window.open(whatsappURL);
    // @ts-ignore
  };

  const saveMessageContent = () => {
    const data = {
      token: token,
      content: textData,
    };
    addMessageContentServices(JSONtoformdata(data))
      .then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.msg);
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        const whatsappURL = `https://wa.me/${whatsappData}?text=${encodeURIComponent(
          textData
        )}`;
        window.open(whatsappURL);
      });
  };

  const getSavedMessageContent = () => {
    setloader(true);
    const data = {
      token: token,
    };
    readMessageContentServices(JSONtoformdata(data))
      .then((res) => {
        if (res?.data?.status) {
          setTextData(res?.data?.data?.content || "");
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        setloader(false);
      });
  };

  return (
    <>
      <div className={classes.modalmsgblock}>
        <img
          src={whatsaappIcon}
          alt="whatsapp"
          className={classes.deletemodalwarningicon}
        />
        <div className={classes.deletemodaltext}>
          <p className={classes.confirmation_head}>{msg}</p>
          <p className={classes.confirmation_msg}>
            Do you want to share message/informations to this lead?
          </p>
          <TextArea
            name="Enter Text Message"
            value={textData}
            onChange={(e: any) => {
              setTextData(e.target.value);
            }}
            // name="Search Name"
            // onKeyDown={(e) => search(e)}
            maxLength={250}
            placeholder="Enter Text Message"
          />
          {/* <Commoninput
            name="Enter Text Message"
            value={textData}
            onChange={(e) => {
              setTextData(e);
            }}
            // name="Search Name"
            // onKeyDown={(e) => search(e)}
            maxLength={50}
            placeholder="Enter Text Message"
          /> */}
          <Row align={"middle"}>
            <Checkbox
              checked={rememberText}
              onChange={(e) => {
                setRememberText(e.target.checked);
              }}
            />
            <p className={`mb-0 ms-1 ${classes.confirmation_msg}`}>
              Remember this message
            </p>
          </Row>
        </div>
      </div>

      <div className={classes.btnactionblock} style={{ marginTop: "5px" }}>
        <CommonButton color="#bf1c17" onClick={close} name="Cancel" />
        <CommonButton
          color="#069344"
          onClick={() => {
            handlewhatsappClick();
            // @ts-ignore
            close();
          }}
          name="Share"
        />
      </div>
    </>
  );
}
