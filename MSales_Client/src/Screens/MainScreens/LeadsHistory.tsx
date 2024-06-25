import React, { useEffect, useState } from "react";
import PageHeader from "../../Components/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import {
  leadsHistory,
  statusFilterOption,
  viewLeads,
} from "../../Services/Apiservices";
import { useToken } from "../../Shared/Constants";
import { getCatchMsg, getTableSNO, isFormDirty } from "../../Shared/Methods";
import CommonTable from "../../Components/CommonTable";
import { Col, Row, Tooltip } from "antd";
import view_icon from "../../Asserts/Icons/view.png";
import classes from "./mainscreen.module.css";
import GlobalModal from "../../Components/GlobalModal";
import HistoryViewModal from "../../Modals/HistoryViewModal";
import dayjs from "dayjs";
import download from "../../Asserts/Icons/downloadicon.png";
import {
  handleLeadsFilters,
  handleNotificationFilters,
} from "../../Store/Redux/Reducers/DashboardReducers";
import { useDispatch } from "react-redux";
import ViewFilesModal from "../../Modals/ViewFilesModal";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { useFormik } from "formik";
import CommonButton from "../../Components/CommonButton/CommonButton";
import Loader from "../../SharedComponents/Loader/Loader";
import { ViewLeadDataProps } from "../../types/leadTypes";
import ChangeStatusModal from "../../Modals/ChangeStatusModal";
import whatsapp from "../../Asserts/Icons/whatsapp.png";
import { toast } from "react-toastify";
import Confirmation from "../../Modals/Confirmation";
import AddFollowupModal from "../../Modals/AddFollowupModal";

export default function LeadsHistory() {
  const navigate = useNavigate();
  const token = useToken();
  const { state } = useLocation();
  const [showfilterOption, setShowFilterOption] = useState(false);
  const [statusfilter, setStatusFilter] = useState([]);
  const [filters, setfilters] = useState<any>({
    leadStatusId: null,
  });
  const [loader, setLoader] = useState(false);
  const [isShowModal, setShowModal] = useState({
    status: false,
    data: null,
  });
  const [viewFileModal, setviewFileModal] = useState({
    status: false,
    data: null,
  });
  let dispatch = useDispatch();
  const [historyData, setHistoryData] = useState({
    items: [],
    page: 1,
    size: 10,
  });

  const [leadData, setLeadData] = useState<ViewLeadDataProps | null>(null);
  const [isShowFollowUp, setIsShowFollowup] = useState(false);
  const [isShowWhatsappShare, setIsShowWhatsappShare] = useState({
    status: false,
    data: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [leadHeaders, setLeadHeaders] = useState();

  const { values, setFieldValue, handleSubmit, initialValues } = useFormik({
    initialValues: {
      leadStatusId: null,
    },
    onSubmit: (values) => {
      setfilters(values);
      handleLeadHistory(1, historyData.size, values);
    },
  });
  const handleLeadHistory = (page: number, size: number, values?: any) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("leadId", state?.data?.leadId);
    if (values?.leadStatusId) {
      formData.append("leadStatusId", values.leadStatusId);
    }
    leadsHistory(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );

          setHistoryData({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStatusFilter = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("is_all", "1");
    statusFilterOption(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.leadStatusName,
              value: ele.leadStatusId,
              key: ind,
            };
          });
          setStatusFilter(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  useEffect(() => {
    if (state?.data?.leadId && token) {
      handleLeadHistory(historyData.page, historyData.size);
      handleViewLeads(state?.data?.leadId);
    }
    if (token) {
      if (state?.name === "lead") {
        dispatch(
          handleLeadsFilters({
            page: state?.page,
            size: state?.size,
            filters: state?.filters,
          })
        );
      } else if (state?.name === "notification") {
        dispatch(
          handleNotificationFilters({
            page: state?.page,
            size: state?.size,
            filters: state?.filters,
          })
        );
      }
      handleStatusFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.data?.leadId, token]);

  const handleViewLeads = (leadId: any) => {
    setLoader(true);

    let formData = new FormData();
    formData.append("token", token);
    formData.append("leadId", leadId);
    viewLeads(formData)
      .then((res) => {
        if (res.data.status) {
          setLeadData(res.data.data || null);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const getViewContent = () => {
    return [
      {
        displayName: "Lead Code",
        value: leadData?.leadCode ? leadData?.leadCode : "-",
      },
      {
        displayName: "Lead Name",
        value: leadData?.name ? leadData?.name : "-",
      },
      {
        displayName: "Contact Person",
        value: leadData?.userName ? leadData?.userName : "-",
      },
      {
        displayName: "Dealer Name",
        value: leadData?.dealerName ? leadData?.dealerName : "-",
      },
      {
        displayName: "Company Name",
        value: leadData?.company_name ? leadData?.company_name : "-",
      },
      {
        displayName: "Lead Status",
        value: leadData?.leadStatusName ? leadData?.leadStatusName : "-",
      },
      {
        displayName: "Email",
        value: leadData?.email ? leadData?.email : "-",
      },
      {
        displayName: "Phone Number",
        value: leadData?.phoneNumber ? leadData?.phoneNumber : "-",
      },
      {
        displayName: "Alternative Number",
        value: leadData?.alternativeNumber ? leadData?.alternativeNumber : "-",
      },
      {
        displayName: "Whatsapp Number",
        value: leadData?.whatsapp_no ? leadData?.whatsapp_no : "-",
        hasWhatsapp: leadData?.whatsapp_no ? true : false,
      },
      {
        displayName: "State",
        value: leadData?.stateName ? leadData?.stateName : "-",
      },
      {
        displayName: "City",
        value: leadData?.cityName ? leadData?.cityName : "-",
      },
      {
        displayName: "Area",
        value: leadData?.area ? leadData?.area : "-",
      },
      {
        displayName: "Address",
        value: leadData?.address ? leadData?.address : "-",
      },
    ];
  };

  const handleCloseModals = () => {
    setIsShowFollowup(false);
    setIsShowWhatsappShare((prev) => {
      return {
        ...prev,
        status: false,
      };
    });
  };
  const columns = [
    {
      title: "S.No",
      dataIndex: "Sno",
      key: "name",
      className: "tablesno",
    },
    {
      title: "Lead Status",
      dataIndex: "leadStatus",
      render: (text: string) => (text ? text : "-"),
      key: "name",
    },
    {
      title: "Enquiry Type",
      dataIndex: "enquire_type",
      render: (text: string) => (text ? text : "-"),
      key: "name",
    },
    {
      title: "Changed By",
      dataIndex: "changedBy",
      render: (text: string) => (text ? text : "-"),
      key: "userName",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (text: number) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-",
      key: "phoneNumber",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      render: (text: string) => (
        <Tooltip title={text && text?.length > 100 ? text : ""}>
          <p>
            {text
              ? text?.length > 100
                ? `${text?.slice(0, 98)}...`
                : text
              : "-"}
          </p>
        </Tooltip>
      ),
      key: "comment",
    },
    {
      title: "Action",
      render: (data: any) => (
        <div className={classes.tableaction}>
          {/* <Tooltip title="View">
            <img
              onClick={() => {
                //   handleViewuser(data.userId, true);
                setShowModal({
                  status: true,
                  data: data,
                });
              }}
              className={classes.tableviewicon}
              src={view_icon}
              alt="view"
            />
          </Tooltip> */}
          {data?.files?.length > 0 ? (
            <Tooltip title="File download">
              <img
                onClick={() => {
                  //   handleViewuser(data.userId, true);
                  setviewFileModal({
                    status: true,
                    data: data,
                  });
                }}
                // style={{ width: "19px" }}
                className={classes.tableviewicon}
                src={download}
                alt="download"
              />
            </Tooltip>
          ) : (
            "-"
          )}

          {/* <Tooltip title="Map">
            <img
              onClick={() => {
                //   handleViewuser(data.userId, true);
                // setIsShowModal({
                //   status: false,
                //   data: data,
                // });
              }}
              className={classes.map_icon}
              src={map_icon}
              alt="view"
            />
          </Tooltip> */}
        </div>
      ),
      key: "address",
    },
  ];

  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        heading={"Lead Details"}
        btntitle={`Back To ${state?.isOverDue ? "Overdue" : "Leads"}`}
        onBtnPress={() => {
          navigate(-1);
        }}
        onFilterbutton={() => {
          setShowFilterOption(!showfilterOption);
        }}
        filters={false}
        // btntitle2={
        //   leadData?.leadStatusName?.toLowerCase()?.includes("follow")
        //     ? "Add Followup"
        //     : ""
        // }
        btntitle2={"Add Followup"}
        onPressBtn2={() => {
          setIsShowFollowup(true);
        }}
      />
      <Row className="px-2">
        {getViewContent()?.map((label, labelIndex) => {
          return (
            <Row
              align={"top"}
              className={`py-2 px-3 position-relative ${classes.viewLabelRowContainer}`}
            >
              <h6 className="mb-0 pe-1">{`${label?.displayName}`}</h6>
              <span>:</span>
              &ensp;
              <Tooltip
                title={
                  label?.value && label?.value?.length > 30 ? label?.value : ""
                }
              >
                <p
                  style={{
                    maxWidth: "100%",
                    overflowWrap: "anywhere",
                  }}
                  className="mb-0"
                >
                  {label?.value
                    ? label?.value?.length > 30
                      ? `${label?.value?.slice(0, 28)}...`
                      : label?.value
                    : ""}
                </p>
              </Tooltip>
              {label?.hasWhatsapp && (
                <Tooltip title="Whatsapp">
                  <img
                    onClick={() => {
                      if (leadData?.leadStatusName === "Cancelled / Missed") {
                        toast.error(
                          // "You cannot sent message/media files to  this lead once it's set as 'Cancelled"
                          "You cannot sent message/informations to  this lead once it's set as 'Cancelled"
                        );
                      } else {
                        setIsShowWhatsappShare({
                          status: true,
                          data: label?.value,
                        });
                      }
                      // navigate("/leads/history", { state: data });
                    }}
                    className={`ms-1 ${classes.tablewhatsappicon}`}
                    style={{
                      opacity:
                        leadData?.leadStatusName === "Cancelled / Missed"
                          ? 0.5
                          : 1,
                    }}
                    src={whatsapp}
                    alt="whatsapp"
                  />
                </Tooltip>
              )}
            </Row>
          );
        })}
      </Row>
      <PageHeader
        heading={"Lead History"}
        // btntitle={"Back To Leads"}
        onBtnPress={() => {
          navigate(-1);
        }}
        onFilterbutton={() => {
          setShowFilterOption(!showfilterOption);
        }}
        showfilter={showfilterOption}
      />
      <GlobalModal
        size={800}
        title="Lead History Details"
        OnClose={() => {
          setShowModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowModal.status}
        setIsVisible={() => {
          setShowModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <HistoryViewModal editdata={isShowModal?.data} />
      </GlobalModal>
      <GlobalModal
        size={800}
        title="Uploaded Files Details"
        OnClose={() => {
          setviewFileModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={viewFileModal.status}
        setIsVisible={() => {
          setviewFileModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <ViewFilesModal editdata={viewFileModal?.data} />
      </GlobalModal>

      <GlobalModal
        size={700}
        title="Add Followup"
        OnClose={handleCloseModals}
        isVisible={isShowFollowUp}
        setIsVisible={() => {
          setIsShowFollowup((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        {/* <ChangeStatusModal
          editdata={state?.data}
          close={handleCloseModals}
          filters={filters}
          hasFollowup
        /> */}

        <AddFollowupModal
          close={handleCloseModals}
          createdata={state?.data}
          handleSuccess={() => {
            handleLeadHistory(1, 10);
          }}
          Action="Add"
        />
      </GlobalModal>

      <GlobalModal
        size={500}
        isVisible={isShowWhatsappShare.status}
        closeIcon={false}
        setIsVisible={() => {
          setIsShowWhatsappShare((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <Confirmation
          close={handleCloseModals}
          // handlefunction={() => {
          //   // handlewhatsappClick(values.whatsapp_no);
          // }}
          whatsappData={isShowWhatsappShare.data}
        />
      </GlobalModal>

      {showfilterOption ? (
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <CommonSelect
                allowClear={true}
                options={statusfilter}
                required={true}
                // disabled={values?.state_id ? false : true}
                placeholder="Select Lead status"
                value={values?.leadStatusId ? values?.leadStatusId : null}
                onChange={(e, data) => {
                  setFieldValue("leadStatusId", data?.value);
                  // setFieldValue("city", data.label);
                }}
              />
            </Col>
            {/* <Col xxl={3} xl={6} md={8} sm={12} xs={24}> */}
            <div className={classes.btnactionblock}>
              <CommonButton
                onClick={() => handleSubmit()}
                name="search"
                color="#004c97"
                Disabled={!isFormDirty(initialValues, values)}
              />
              <CommonButton
                onClick={() => {
                  setFieldValue("leadStatusId", null);

                  setfilters({ leadStatusId: null });
                  handleSubmit();
                }}
                Disabled={!isFormDirty(initialValues, values)}
                name="Reset"
                color="#bf1c17"
              />
            </div>
            {/* </Col> */}
          </Row>
        </div>
      ) : (
        ""
      )}

      <CommonTable
        dataList={historyData}
        columns={columns}
        handleListapi={(page: number, size: number, data: any) => {
          handleLeadHistory(page, size, filters);
        }}
        filters={filters}
        hasSingleLineCells
        isLoading={isLoading}
        // current={current}
        // setCurrent={setCurrent}
        // onChangePage={(page: any, pagesize: number) => {
        //   // handleUserList(page, pagesize);
        //   setPageSize(pagesize);
        //   setselectPage(page);
        // }}
      />
      {/* <div className={classes.mapdisplay}>
      </div> */}
    </div>
  );
}
