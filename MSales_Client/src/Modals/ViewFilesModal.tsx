import React from "react";
import NotFound from "../Components/ErrorElement/NotFound";
import { Col, Empty, Row, Tooltip } from "antd";
import classes from "./modal.module.css";
import uploadicon from "../Asserts/Icons/download.png";
import file from "../Asserts/Icons/files.png";
import { isImage } from "../Shared/Methods";
import foldericon from "../Asserts/Icons/folders.svg";

export default function ViewFilesModal({ editdata }: any) {
  return (
    <div>
      <Row className="rowend">
        {editdata?.files.length > 0 ? (
          editdata?.files?.map((ele: any, index: number) => {
            return (
              <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                <div className={classes.filebox}>
                  <div className={classes.fileactionblock}>
                    <button
                      onClick={() => {
                        window.open(ele.url);
                      }}
                      type="button"
                      className={classes.uploadbtn}
                    >
                      <img
                        src={uploadicon}
                        alt="upload"
                        className={classes.uploadicon}
                      />
                    </button>
                  </div>

                  <div className={classes.fileviewblock}>
                    <img
                      src={isImage(ele?.url) ? ele.url : foldericon}
                      alt="files"
                      className={classes.fileicon}
                    />
                    <Tooltip title={ele?.url?.split("/").pop()}>
                      <p className={classes.filename}>
                        {ele?.url?.split("/").pop()}
                      </p>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            );
          })
        ) : (
          <Empty description={"No Files Found"} />
        )}
      </Row>
    </div>
  );
}
