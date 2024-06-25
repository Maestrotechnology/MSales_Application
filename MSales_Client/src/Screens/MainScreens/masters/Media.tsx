import { Card, Col, Empty, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import classes from "../mainscreen.module.css";
import { useFormik } from "formik";
import CommonButton from "../../../Components/CommonButton/CommonButton";
import CommonTable from "../../../Components/CommonTable";
import {
  JSONtoformdata,
  getCatchMsg,
  getTableSNO,
} from "../../../Shared/Methods";
import delete_icon from "../../../Asserts/Icons/delete.png.png";
import edit_icon from "../../../Asserts/Icons/edit.png";
import {
  ListCatecory,
  deletecategory,
  deletemediafile,
  listmediaFile,
  requirementDropdown,
} from "../../../Services/Apiservices";
import { LoginUserData, useToken } from "../../../Shared/Constants";
import GlobalModal from "../../../Components/GlobalModal";
import Deleteconfirmation from "../../../Modals/Deleteconfirmation";
import { toast } from "react-toastify";
import ModifycategoryModal from "../../../Modals/Masters/ModifycategoryModal";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import ModifiyMediaModal from "../../../Modals/Masters/ModifiyMediaModal";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import deleteimg from "../../../Asserts/Icons/delete.png.png";
import downloadicon from "../../../Asserts/Icons/download.png";
import MediaCard from "../../../Components/mediaCard";
import { CommonSelect } from "../../../Components/InputComponents/CommonSelect";
import CommonPagination from "../../../Components/CommonPagination";
import PageHeader from "../../../Components/PageHeader";
interface Props {
  showfilterOption: boolean;
  setloader: (value: any) => void;
  modifymodalData: any;
  setmodifydata: any;
}

export default function Media() {
  const { setloader }: Props = useOutletContext();
  const token = useToken();
  const [requirementsList, setRequirementList] = useState([]);
  const [modifymodalData, setmodifydata] = useState({
    show: false,
    data: null,
    type: "",
  });
  const [MediaList, setmediaList] = useState({
    items: [],
    page: 1,
    size: 10,
  });
  const [showfilterOption, setShowFilterOption] = useState(false);
  const [filterdata, setfilterdata] = useState({
    name: null,
    requirements_name: "",
    requirements_id: "",
  });
  const [mediafileList, setmediafileList] = useState<any>([]);
  const loginUserData = LoginUserData();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const [activeTab, setActiveTab] = useState("1");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Image",
      children: (
        <Row className={"rowblock"}>
          {mediafileList?.items?.filter(
            (ele: any) =>
              !ele.MediaPath.includes(".mp4" || ".mov" || ".wmv" || ".avi")
          ).length > 0 ? (
            mediafileList?.items?.map((ele: any) => {
              return !ele.MediaPath.includes(".mp4") ? (
                <Col sm={4} lg={4}>
                  <MediaCard
                    data={ele}
                    onDelete={(data: any) =>
                      setIsShowDeleteModal((prev: any) => {
                        return {
                          ...prev,
                          data: data?.MediaID,
                          status: true,
                        };
                      })
                    }
                  />
                </Col>
              ) : null;
            })
          ) : (
            <Col xxl={24}>
              <Empty />
            </Col>
          )}
        </Row>
      ),
    },
    {
      key: "2",
      label: "Video",
      children:
        mediafileList?.items?.filter((ele: any) =>
          ele.MediaPath.includes(".mp4" || ".mov" || ".wmv" || ".avi")
        ).length > 0 ? (
          mediafileList?.items?.map((ele: any) => {
            return (
              <>
                {ele.MediaPath.includes(
                  ".mp4" || ".mov" || ".wmv" || ".avi"
                ) ? (
                  <Col sm={4} lg={4}>
                    <MediaCard
                      data={ele}
                      isimage={false}
                      onDelete={(data: any) => {
                        setIsShowDeleteModal((prev: any) => {
                          return {
                            ...prev,
                            data: data?.MediaID,
                            status: true,
                          };
                        });
                      }}
                    />
                  </Col>
                ) : // <div className={classes.mediaVideodisplay}>
                //   <video
                //     className={classes.mediafilevideo}
                //     //   width={500}
                //     controls
                //     onClick={() => window.open(ele.MediaPath)}
                //   >
                //     <source src={ele.MediaPath} type="video/mp4" />
                //   </video>
                //   <div className={classes.videoTextIcon}>
                //     <h5>{ele.MediaName}</h5>
                //     <div className={classes.btnactionblock}>
                //       <CommonButton
                //         name="delete"
                //         color="#CD2027"
                //         onClick={() => {
                //           setIsShowDeleteModal({
                //             status: true,
                //             data: ele.MediaID,
                //           });
                //         }}
                //       />
                //     </div>
                //   </div>
                // </div>
                null}
              </>
            );
          })
        ) : (
          <Col xxl={24}>
            <Empty />
          </Col>
        ),
    },
  ];
  const { values, handleSubmit, resetForm, setFieldValue, setValues } =
    useFormik({
      initialValues: {
        name: null,
        requirements_name: "",
        requirements_id: "",
      },
      onSubmit: (values) => {
        handleMediafileList(1, MediaList.size, values);
        setfilterdata(values);
      },
    });
  const handleRequirementDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    requirementDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.RequirementsName,
              value: ele.RequirementsId,
            };
          });
          setRequirementList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleMediafileList = (page: number, size: number, values: any) => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    if (values.requirements_id) {
      formData.append("requirementId", values.requirements_id);
    }
    formData.append("file_type", activeTab === "1" ? "1" : "2");
    listmediaFile(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setmediafileList(res.data.data);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setloader(false);
      });
  };

  const handleDeleteMediaFile = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (isShowDeleteModal.data) {
      formData.append("mediaId", isShowDeleteModal.data);
    }
    deletemediafile(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          handleMediafileList(MediaList.page, MediaList.size, values);
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  useEffect(() => {
    if (token) {
      handleRequirementDropdown();
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      handleMediafileList(MediaList.page, MediaList.size, values);
    }
  }, [token, activeTab]);
  const onChange = (key: string) => {
    setActiveTab(key);
  };
  const handleTableSearchClear = () => {
    resetForm();
    handleSubmit();
  };

  return (
    <>
      <PageHeader
        heading={"Media"}
        btntitle={activeTab === "1" ? "Add Image" : "Add Video"}
        onFilterbutton={() => {
          setShowFilterOption((pre) => !pre);
        }}
        showfilter={showfilterOption}
        onBtnPress={() => {
          setmodifydata((prev: any) => {
            return {
              ...prev,
              show: true,
              data: null,
            };
          });
        }}
      />
      {showfilterOption ? (
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={5} md={7} sm={10} xs={24}>
              <CommonSelect
                allowClear={true}
                options={requirementsList}
                // mode={"multiple"}

                // required={true}
                placeholder="Select Requirement"
                value={values.requirements_id ? values.requirements_id : null}
                // errormsg={
                //   errors.requirements_id && touched.requirements_id
                //     ? errors.requirements_id
                //     : ""
                // }
                onChange={(e, data) => {
                  if (e) {
                    setFieldValue("requirements_id", e);
                    setFieldValue("requirements_name", data.label);
                  } else {
                    setValues({
                      ...values,
                      requirements_id: "",
                      requirements_name: "",
                    });
                  }
                }}
              />
            </Col>
            <div className={classes.btnactionblock}>
              <CommonButton
                onClick={() => handleSubmit()}
                name="search"
                color="#004c97"
              />
              <CommonButton
                onClick={() => handleTableSearchClear()}
                name="Reset"
                color="#bf1c17"
              />
            </div>
          </Row>
        </div>
      ) : null}
      <div className="media">
        {/* modify modal  */}
        <Tabs
          // defaultActiveKey="2"
          activeKey={activeTab}
          items={items}
          onChange={onChange}
        />
        <GlobalModal
          size={500}
          title={"Add Media"}
          OnClose={() => {
            setmodifydata((prev: any) => {
              return {
                ...prev,
                show: false,
                type: "",
              };
            });
          }}
          isVisible={modifymodalData.show}
          setIsVisible={() => {
            setmodifydata((prev: any) => {
              return {
                ...prev,
                show: true,
                type: "",
              };
            });
          }}
        >
          <ModifiyMediaModal
            close={() => {
              setmodifydata((prev: any) => {
                return {
                  ...prev,
                  show: false,
                  type: "",
                };
              });
            }}
            activeTab={activeTab}
            listapicall={() => {
              handleMediafileList(1, MediaList.size, filterdata);
            }}
          />
        </GlobalModal>
        {/* delete modal  */}
        <GlobalModal
          size={500}
          title="Delete Category"
          OnClose={() => {
            setIsShowDeleteModal((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
          isVisible={isShowDeleteModal.status}
          setIsVisible={() => {
            setIsShowDeleteModal((prev: any) => {
              return {
                ...prev,
                status: true,
              };
            });
          }}
        >
          <Deleteconfirmation
            msg={"Are You Sure Delete This File?"}
            close={() => {
              setIsShowDeleteModal({
                status: false,
                data: null,
              });
            }}
            handlefunction={handleDeleteMediaFile}
          />
        </GlobalModal>
        <CommonPagination
          dataList={mediafileList}
          filters={filterdata}
          handleListapi={(page: number, size: number, data: any) => {
            handleMediafileList(page, size, data);
          }}
        />
      </div>
    </>
  );
}
