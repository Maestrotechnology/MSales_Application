import { Dialog, DialogContent } from "@material-ui/core";
import React from "react";
import { GlobalModalProps } from "./Types.d";
import { Modal } from "antd";
import classes from "./globalmodal.module.css";
import CommonButton from "./CommonButton/CommonButton";
export default function GlobalModal({
  isVisible = false,
  setIsVisible,
  children,
  size = "md",
  customStyle,
  ModalStyle,
  title,
  OnClose,
  closeIcon = true,
  centered = true,
}: GlobalModalProps) {
  //   const { modalloading } = useSelector((state: any) => state.dashboard);

  return (
    <Modal
      open={isVisible}
      width={size}
      centered={centered}
      style={{ borderRadius: "0px" }}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
      footer={null}
      destroyOnClose={true}
      closable={closeIcon}
      closeIcon={
        <i
          className={`fa fa-times ${classes.modalclosebtn}`}
          aria-hidden="true"
          onClick={OnClose}
        />
      }
      title={<h3 className={classes.modalhead}>{title}</h3>}
    >
      {/* {modalloading && <Loader />} */}
      {/* <Modal */}

      {children}
    </Modal>
  );
}
