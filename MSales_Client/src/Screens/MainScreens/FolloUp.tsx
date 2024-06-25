import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Inputlengths, useToken } from "../../Shared/Constants";
import { useFormik } from "formik";
import {
  ChangeInAciveStatusService,
  DeleteFollowUpService,
  LeadsListservices,
  ListFollowUpService,
  viewLeads,
} from "../../Services/Apiservices";
import {
  JSONtoformdata,
  cancelApi,
  getCatchMsg,
  getTableSNO,
  isFormDirty,
} from "../../Shared/Methods";
import CommonTable from "../../Components/CommonTable";
import classes from "./mainscreen.module.css";
import PageHeader from "../../Components/PageHeader";
import dayjs from "dayjs";
import Loader from "../../SharedComponents/Loader/Loader";
import GlobalModal from "../../Components/GlobalModal";
import ChangeStatusModal from "../../Modals/ChangeStatusModal";
import { Col, Row, Tooltip } from "antd";
import Confirmation from "../../Modals/Confirmation";
import { toast } from "react-toastify";
import whatsapp from "../../Asserts/Icons/whatsapp.png";
import { handleLeadsFilters } from "../../Store/Redux/Reducers/DashboardReducers";
import { useDispatch } from "react-redux";
import CommonSwitch from "../../Components/InputComponents/CommonSwitch";
import AddFollowupModal from "../../Modals/AddFollowupModal";
import edit_icon from "../../Asserts/Icons/edit.png";
import delete_icon from "../../Asserts/Icons/delete.png.png";
import Deleteconfirmation from "../../Modals/Deleteconfirmation";
import status_icon from "../../Asserts/Icons/status.png";
import FollowUpChangeStatusModal from "../../Modals/Masters/FollowUpChangeStatusModal";
import { ViewLeadDataProps } from "../../types/leadTypes";
function FolloUp() {
  let controller = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const pageHeaderRef = useRef<{ clearSearchText: () => void } | null>(null);

  const token = useToken();
  const { state } = useLocation();
  const [leadData, setLeadData] = useState<ViewLeadDataProps | null>(null);
  const [loader, setLoader] = useState(false);
  const [FollowUpList, setFollowUpList] = useState<any>({
    items: [],
    page: 1,
    size: 10,
    is_followup: state?.data?.is_followup,
    // total_count: 0,
  });
  const [LeadsList, setLeadsList] = useState<any>({
    items: [],
    page: 1,
    size: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowWhatsappShare, setIsShowWhatsappShare] = useState({
    status: false,
    data: "",
  });
  const [isShowFollowUp, setIsShowFollowup] = useState<any>({
    isView: false,
    item: {},
    action: "",
  });
  const dispatch = useDispatch();
  const [btnDisable, setBtnDisable] = useState(false);
  const { page, size, items } = FollowUpList;
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<any>({
    isView: false,
    item: "",
  });
  const [isShowAddFollowupStatus, setIsShowAddFollowupStatus] = useState({
    isView: false,
    item: null,
  });
  const [isShowChangeStatus, setIsShowChangeStatus] = useState({
    status: false,
    data: null,
  });
  const columns = [
    {
      title: "S.No",
      dataIndex: "Sno",
      key: "Sno",
    },
    {
      title: "Followup Status",
      dataIndex: "followup_status",
      render: (text: string) => (text ? text : "-"),
      key: "followup_status",
    },
    {
      title: "Followup Date",
      dataIndex: "followup_dt",
      render: (text: string) =>
        text ? dayjs(text).format("DD-MM-YYYY HH:mm:ss") : "-",
      key: "followup_dt",
    },
    {
      title: "Enquiry Type",
      dataIndex: "enquiry_type",
      render: (text: string) => (text ? text : "-"),
      key: "name",
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (text: string) => (text ? text : "-"),
      key: "created_by",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      render: (text: string) => (text ? text : "-"),
      key: "comment",
    },
    // {
    //   title: "Status",
    //   render: (record: any) => {
    //     return (
    //       <>
    //         <CommonSwitch
    //           checked={record?.is_followup === 1 ? true : false}
    //           onChange={() => handleStatusChange(record)}
    //         />
    //       </>
    //     );
    //   },
    //   key: "action",
    // },
    // {
    //   title: "Action",
    //   render: (record: any) => {
    //     return (
    //       <>
    //         <div className={classes.tableaction}>
    //           <Tooltip title="Edit">
    //             <img
    //               onClick={() => {
    //                 setIsShowFollowup({
    //                   isView: true,
    //                   item: record,
    //                   action: "Edit",
    //                 });
    //               }}
    //               className={classes.tableediticon}
    //               src={edit_icon}
    //               alt="edit"
    //             />
    //           </Tooltip>
    //           <Tooltip title="Change Status">
    //             <img
    //               onClick={() => {
    //                 // navigate("/leads/history", { state: data });
    //                 setIsShowChangeStatus({
    //                   isView: true,
    //                   item: record,
    //                 });
    //               }}
    //               className={classes.tabledeleteicon}
    //               src={status_icon}
    //               alt="status"
    //             />
    //           </Tooltip>
    //           <Tooltip title="Delete">
    //             <img
    //               onClick={() => {
    //                 setIsShowDeleteModal({
    //                   isView: true,
    //                   item: record.followup_id,
    //                 });
    //               }}
    //               className={classes.tabledeleteicon}
    //               src={delete_icon}
    //               alt="delete"
    //             />
    //           </Tooltip>
    //         </div>
    //       </>
    //     );
    //   },
    //   key: "action",
    // },
  ];

  useEffect(() => {
    if (token) {
      handleFollowupList(1, 10);
      dispatch(
        handleLeadsFilters({
          page: state?.page,
          size: state?.size,
          filters: state?.filters,
        })
      );
    }
  }, [token]);

  const handleFollowupList = (page: number, size: number) => {
    setLoader(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("leadId", state?.data?.leadId);
    // if (values?.leadStatusId) {
    //   formData.append("leadStatusId", values.leadStatusId);
    // }
    ListFollowUpService(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );

          setFollowUpList({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleCloseModals = () => {
    setIsShowFollowup({ isView: false, item: "", action: "" });
    setIsShowWhatsappShare((pre) => ({
      ...pre,
      status: false,
    }));
  };
  const handleWhatsappModalclose = () => {
    setIsShowWhatsappShare({
      status: false,
      data: "",
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

  useEffect(() => {
    if (state?.data?.leadId && token) {
      handleViewLeads(state?.data?.leadId);
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
  const handleStatusChange = (data: any) => {
    setLoader(true);

    let finalOBJ = {
      token: token,
      lead_id: data?.leadId,
      activeStatus: data?.is_followup === 1 ? -1 : 1,
    };

    ChangeInAciveStatusService(JSONtoformdata(finalOBJ))
      .then((res) => {
        if (res?.data?.status === 1) {
          toast.success(res?.data?.msg);
          handleFollowupList(page, size);
          // listLeadApi(leads_page, leads_size, filters);
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => setLoader(false));
  };
  const handleLeadesList = (
    page: number,
    size: number,
    values: any,
    search_key?: string
  ) => {
    if (token) {
      // if (!search_key) {
      setIsLoading(true);
      // }

      cancelApi(controller.current);
      controller.current = new AbortController();

      let formData = new FormData();
      formData.append("token", token);
      formData.append("globalName", search_key ? search_key : "");
      if (values.lead_name) {
        formData.append("name", values.lead_name);
      }
      if (values.phonenumber) {
        formData.append("phone", values.phonenumber);
      }
      if (values.status_filterId) {
        formData.append("type", values.status_filterId);
      }
      if (values.from_date) {
        formData.append("fromdatetime", values.from_date);
      }
      if (values.to_date) {
        formData.append("todatetime", values.to_date);
      }
      if (values.lead_code) {
        formData.append("lead_code", values.lead_code);
      }
      if (values.state_id) {
        formData.append("state", values.state_id);
      }
      if (values.district_id) {
        formData.append("district_id", values.district_id);
      }
      if (values.city_id) {
        formData.append("city", values.city_id);
      }
      if (values.status_filterId) {
        formData.append("lead_status", values.status_filterId);
      }
      if (values.dealer_id) {
        formData.append("dealerId", values.dealer_id);
      }
      if (values.employee_id) {
        formData.append("employeeId", values.employee_id);
      }
      formData.append("is_web", "1");
      LeadsListservices(page, size, formData, controller.current.signal)
        .then((res) => {
          if (res.data.status === 1) {
            let setkeyData = res.data?.data?.items?.map(
              (ele: any, ind: number) => {
                return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
              }
            );
            setLeadsList({ ...res?.data?.data, items: setkeyData });
          }
        })
        .catch((err) => {
          getCatchMsg(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const handleDeleteFollowUp = () => {
    setLoader(true);

    let finalOBJ = {
      token: token,
      followup_id: isShowDeleteModal?.item,
    };

    DeleteFollowUpService(JSONtoformdata(finalOBJ))
      .then((res) => {
        if (res?.data?.status === 1) {
          toast.success(res?.data?.msg);
          setIsShowDeleteModal({
            isView: false,
            item: null,
          });
          handleFollowupList(page, size);
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => setLoader(false));
  };

  return (
    <>
      {loader ? <Loader /> : null}

      <GlobalModal
        size={700}
        title="Change Status"
        OnClose={() => {
          setIsShowAddFollowupStatus((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowAddFollowupStatus.isView}
        setIsVisible={() => {
          setIsShowAddFollowupStatus((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <FollowUpChangeStatusModal
          editdata={isShowAddFollowupStatus.item}
          close={() => {
            setIsShowAddFollowupStatus({ isView: false, item: null });
          }}
          handleSuccess={() => {
            handleFollowupList(page, size);
          }}
        />
      </GlobalModal>
      <GlobalModal
        size={700}
        title="Change Status"
        OnClose={() => {
          setIsShowChangeStatus((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowChangeStatus.status}
        setIsVisible={() => {
          setIsShowChangeStatus((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <ChangeStatusModal
          editdata={isShowChangeStatus.data}
          close={() => {
            setIsShowChangeStatus((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
          // filters={filters}
          listapicall={() => handleViewLeads(state?.data?.leadId)}
          leadlistapicall={() => handleFollowupList(1, 10)}
          // pageSize={LeadsList.size}
          // selectPage={LeadsList.page}
        />
      </GlobalModal>
      <GlobalModal
        size={500}
        title="Delete Followup"
        OnClose={() => {
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              isView: false,
            };
          });
        }}
        isVisible={isShowDeleteModal.isView}
        setIsVisible={() => {
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              isView: true,
            };
          });
        }}
      >
        <Deleteconfirmation
          msg={"Are You Sure Delete This Followup?"}
          close={() => {
            setIsShowDeleteModal({
              isView: false,
              item: null,
            });
          }}
          handlefunction={handleDeleteFollowUp}
        />
      </GlobalModal>

      <GlobalModal
        size={700}
        title="Add Followup"
        OnClose={handleCloseModals}
        isVisible={isShowFollowUp?.isView}
        setIsVisible={() => {
          setIsShowFollowup((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <AddFollowupModal
          close={handleCloseModals}
          createdata={state?.data}
          Action={isShowFollowUp?.action}
          handleSuccess={() => {
            handleFollowupList(page, size);
          }}
          editdata={isShowFollowUp?.item}
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
        OnClose={handleCloseModals}
      >
        <Confirmation
          close={handleWhatsappModalclose}
          // handlefunction={() => {
          //   // handlewhatsappClick(values.whatsapp_no);
          // }}
          whatsappData={isShowWhatsappShare.data}
        />
      </GlobalModal>

      <div className={classes.background}>
        <PageHeader
          ref={pageHeaderRef}
          heading={"Followup"}
          btntitle2={"Add Followup"}
          onPressBtn2={() => {
            setIsShowFollowup((pre: any) => {
              return {
                ...pre,
                isView: true,
                action: "Add",
              };
            });
          }}
          btntitle={`Back To ${state?.isOverDue ? "Overdue" : "Leads"}`}
          onBtnPress={() => navigate(-1)}
          filters={false}
          customFilter={
            <CommonSwitch
              checked={FollowUpList?.is_followup === 1 ? true : false}
              onChange={() =>
                handleStatusChange({
                  leadId: state?.data?.leadId,
                  is_followup: FollowUpList?.is_followup,
                })
              }
            />
          }
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
                    label?.value && label?.value?.length > 30
                      ? label?.value
                      : ""
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
                {label?.displayName === "Lead Status" ? (
                  <Tooltip title="Change Status">
                    <img
                      onClick={() => {
                        setIsShowChangeStatus({
                          status: true,
                          data: leadData ? leadData : state?.data,
                        });
                        // navigate("/leads/history", { state: data });
                      }}
                      className={`ms-1 ${classes.tablewhatsappicon}`}
                      style={{
                        opacity:
                          state?.data?.leadStatusName === "Cancelled / Missed"
                            ? 0.5
                            : 1,
                      }}
                      src={status_icon}
                      alt="whatsapp"
                    />
                  </Tooltip>
                ) : null}
                {label?.hasWhatsapp && (
                  <Tooltip title="Whatsapp">
                    <img
                      onClick={() => {
                        if (
                          state?.data?.leadStatusName === "Cancelled / Missed"
                        ) {
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
                          state?.data?.leadStatusName === "Cancelled / Missed"
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

        <CommonTable
          dataList={FollowUpList}
          columns={columns}
          // filters={filters}
          // handleListapi={(page: number, size: number, data: any) => {
          //   StatusAttention(page, size, data);
          // }}
          handleListapi={(page: number, size: number, data: any) => {
            handleFollowupList(page, size);
          }}
        />
      </div>
    </>
  );
}

export default FolloUp;
