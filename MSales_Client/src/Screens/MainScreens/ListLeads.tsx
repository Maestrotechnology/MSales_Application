import { useEffect, useRef, useState } from "react";
import PageHeader from "../../Components/PageHeader";
import CommonTable from "../../Components/CommonTable";
import { Inputlengths, LoginUserData, useToken } from "../../Shared/Constants";
import {
  DistrictDropdown,
  EmployeeDropdown,
  LeadsListservices,
  changeStatusAttentionService,
  cityDropdown,
  deleteLeads,
  hotLeadsServices,
  stateDropdown,
  statusFilterOption,
  userTypedropdown,
  viewLeads,
} from "../../Services/Apiservices";
import {
  CheckValueAvailable,
  Number_Validation,
  cancelApi,
  getCatchMsg,
  getTableSNO,
  isFormDirty,
} from "../../Shared/Methods";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Tooltip } from "antd";
import delete_icon from "../../Asserts/Icons/delete.png.png";
import edit_icon from "../../Asserts/Icons/edit.png";
import view_icon from "../../Asserts/Icons/view.png";
import classes from "./mainscreen.module.css";
import history_icon from "../../Asserts/Icons/history.png";
import transfer_icon from "../../Asserts/Icons/transfer_icon.png";
import status_icon from "../../Asserts/Icons/changestatus_icon.png";
import Deleteconfirmation from "../../Modals/Deleteconfirmation";
import GlobalModal from "../../Components/GlobalModal";
import { toast } from "react-toastify";
import AddLeadsModal from "../../Modals/AddLeadsModal";
import Loader from "../../SharedComponents/Loader/Loader";
import LeadTransferModal from "../../Modals/LeadTransferModal";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
import CommonButton from "../../Components/CommonButton/CommonButton";
import { useFormik } from "formik";
import ChangeStatusModal from "../../Modals/ChangeStatusModal";
import { CommonDate } from "../../Components/InputComponents/CommonDate";
import dayjs from "dayjs";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { useDispatch, useSelector } from "react-redux";
import { handleClearRedux } from "../../Store/Redux/Reducers/DashboardReducers";
import whatsapp from "../../Asserts/Icons/whatsapp.png";
import Confirmation from "../../Modals/Confirmation";
import bookmarkIcon from "../../Asserts/Icons/bookmark.svg";
import bookMarkActive from "../../Asserts/Icons/bookmarkActive.svg";
import HotLeadConfirmation from "../../Modals/HotLeadConfirmation";
import ModifiyMediaModal from "../../Modals/Masters/ModifiyMediaModal";
import LeadImportModal from "../../Modals/Masters/LeadImportModal";
import { CommonCheckBox } from "../../Components/InputComponents/Commoncheckbox";
import moment from "moment";
import followupicon from "../../Asserts/Icons/Followup.png";
import AccordionContent from "../../Components/AccordtionContent";
import { Hidden } from "@mui/material";
export default function ListLeads() {
  const { state } = useLocation();
  let controller = useRef<AbortController | null>(null);
  const pageHeaderRef = useRef<{ clearSearchText: () => void } | null>(null);
  const [isShowModal, setIsShowModal] = useState<any>({
    status: false,
    data: null,
    viewstatus: false,
  });
  const [page, setpage] = useState(1);
  const [size, setSize] = useState(50);
  const [stateDropdownList, setStateDropdownList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [districtDropdownList, setDistrictDropdownList] = useState([]);
  const [btnDisable, setBtnDisable] = useState(false);
  const [isShowLeadTransfer, setIsShowLeadTransfer] = useState({
    status: false,
    data: null,
    ismulti: false,
  });
  const [showmultitransfer, setshowmultitransfer] = useState<boolean>(false);
  const [transferconfirmation, setconfirmation] = useState<any>({
    show: false,
    handlefunction: null,
  });
  const [transferleadlist, setTransferLeadList] = useState<any>([]);
  const [isShowChangeStatus, setIsShowChangeStatus] = useState({
    status: false,
    data: null,
  });
  const [showfilterOption, setShowFilterOption] = useState(false);
  const { LeadsFilters } = useSelector((state: any) => state.dashboard);
  const [statusfilter, setStatusFilter] = useState([]);
  const [cityalert, setcityalert] = useState(false);
  const [districtalert, setdistrictalert] = useState(false);
  const [listleadbutton, setListLeadbutton] = useState(false);
  const [listleadRemainderbtn, setListleadRemainderbtn] = useState(false);
  const [hotLeadStatus, setHotLeadStatus] = useState<any>({
    status: false,
    data: null,
    isStatus: false,
  });
  const [filters, setfilters] = useState({
    lead_name: "",
    lead_code: "",
    phonenumber: "",
    dealer_name: "",
    dealer_id: "",
    employee_id: "",
    state: "",
    state_id: "",
    district_id: "",
    city: "",
    city_id: "",
    status_filterName: "",
    status_filterId: null,
    from_date: null,
    to_date: null,
  });
  const [loader, setloader] = useState(false);
  const [LeadsList, setLeadsList] = useState<any>({
    items: [],
    page: 1,
    size: 50,
  });
  const loginUserData = LoginUserData();
  const token = useToken();
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const [delarDropdownList, setDropdownList] = useState([]);
  const [EmployeeoList, setEmployeeList] = useState([]);
  const [employeeAlert, setEmployeeAlert] = useState(false);
  const [globalsearch, setGlobalsearch] = useState("");
  const [importmodal, setImportModal] = useState({
    status: false,
    data: null,
  });
  const [confirmationModal, setconfirmationModal] = useState({
    status: false,
    data: "",
  });
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    values,
    handleSubmit,
    errors,
    touched,

    resetForm,
    setValues,
    setFieldValue,
    initialValues,
  } = useFormik({
    initialValues: {
      lead_name: "",
      lead_code: "",
      phonenumber: "",
      dealer_name: "",
      dealer_id: "",
      employee_id: "",
      state: "",
      state_id: "",
      district_id: "",
      city: "",
      city_id: "",
      from_date: null,
      to_date: null,
      status_filterName: "",
      status_filterId: null,
    },
    onSubmit: (values) => {
      setfilters(values);
      StatusAttention(1, LeadsList.size, values);
      setTransferLeadList([]);
      if (initialValues) {
        setBtnDisable(false);
      }
    },
  });

  const getRowClassName = (item: any, index: number) => {
    return item?.due_type === -1
      ? "missedLead cursor_pointer"
      : item?.due_type === 1
      ? "leadRemainder cursor_pointer"
      : item?.activeStatus === 1
      ? "activeTableRow cursor_pointer"
      : "cursor_pointer";
  };

  const handleSelectAlllead = () => {
    if (!checkdata()) {
      setTransferLeadList(
        LeadsList.items?.reduce((acc: any, val: any) => {
          acc.push(val.leadId);
          return acc;
        }, [])
      );
    } else {
      setTransferLeadList([]);
    }
  };
  const handleSelectlead = (leadId: any) => {
    if (transferleadlist.includes(leadId)) {
      let dup = transferleadlist.filter((ele: any) => ele !== leadId);
      setTransferLeadList(dup);
    } else {
      setTransferLeadList([...transferleadlist, leadId]);
    }
  };

  const checkdata = () => {
    let checkallselected = LeadsList.items?.find(
      (ele: any) => !transferleadlist.includes(ele.leadId)
    );
    return checkallselected ? false : true;
  };
  const columns = [
    {
      title: (
        <div>
          <CommonCheckBox
            checked={LeadsList.items.length > 0 ? checkdata() : false}
            onClick={() => handleSelectAlllead()}
            // @ts-ignore
            ismain={true}
          />
        </div>
      ),

      key: "slelect_lead",

      className: classes.tablechechbox,
      render: (data: { leadId: number }) => (
        <div>
          <CommonCheckBox
            checked={transferleadlist.includes(data.leadId) ? true : false}
            onClick={(e) => {
              handleSelectlead(data.leadId);
              e.stopPropagation();
            }}
            // @ts-ignore
            fortable={true}
          />
        </div>
      ),
    },
    {
      title: "S.No",
      dataIndex: "Sno",
      key: "name",
      className: "tablesno",
    },
    // {
    //   title: "Lead Code",
    //   dataIndex: "leadCode",
    //   render: (text: any) => (text ? text : "-"),
    //   key: "leadCode",
    // },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      render: (text: string) => (text ? text : "-"),
      key: "name",
      className: classes.namecell,
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      render: (text: number) => (text ? text : "-"),
      key: "companyName",
      className: classes.namecell,
    },
    {
      title: "Lead Status",
      dataIndex: "leadStatusName",
      render: (text: string) => (text ? text : "-"),
      key: "name",
    },

    // {
    //   title:
    //     loginUserData?.userType === 3 ? "Sales Person Name" : "Dealer Name",
    //   dataIndex: loginUserData?.userType === 3 ? "assignedTo" : "dealerName",
    //   render: (text: string) => (text ? text : "-"),
    //   key: "name",
    //   className: classes.namecell,
    // },
    // {
    //   title: "Sales Person Name",
    //   dataIndex: "assignedTo",
    //   render: (text: string) => (text ? text : "-"),
    //   key: "assignedTo",
    // },

    {
      title: "Phone Number",
      dataIndex: "mobile",
      render: (text: number) => (text ? text : "-"),
      key: "mobile",
    },
    {
      title: "Followup Date",
      dataIndex: "schedule_date",
      render: (text: number) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-",
      key: "mobile",
    },
    {
      title: "Missing Days",
      dataIndex: "missed_days",
      render: (text: number) => (text !== null ? `Missed ${text} days` : "-"),
      key: "missed_days",
    },
    {
      title: "Remaining Days",
      dataIndex: "remaining_days",
      render: (text: number) =>
        text !== null ? `Remaining ${text} days` : "-",
      key: "remaining_days",
    },
    {
      title: "Receive Date",
      dataIndex: "receivedAt",
      render: (text: number) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
      key: "mobile",
    },
    {
      title: "Demo Date",
      dataIndex: "demo_date",
      render: (text: number) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-",
      key: "mobile",
    },
    {
      title: "POC Installed Date",
      dataIndex: "poc_date",
      render: (text: number) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-",
      key: "mobile",
      className: classes.namecell,
    },
    // {
    //   title: "City",
    //   dataIndex: "city",
    //   render: (text: number) => (text ? text : "-"),
    //   key: "city",
    //   className: classes.namecell,
    // },
    {
      title: "CreatedBy",
      dataIndex: "created_by",
      render: (text: number) => (text ? text : "-"),
      key: "created_at",
      // className: classes.namecell,
    },
    {
      title: "AssignedTo",
      dataIndex: "assignedTo",
      render: (text: number) => (text ? text : "-"),
      key: "created_at",
      // className: classes.namecell,
    },
    {
      title: "Deleted By",
      dataIndex: "deleted_by",
      render: (text: number) => (text ? text : "-"),
      key: "created_at",
      hidden: !listleadbutton ? true : false,
      // className: classes.namecell,
    },
    {
      title: "Action",
      render: (data: any) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className={classes.tableaction}
        >
          {/* <Tooltip title="View">
            <img
              onClick={() => {
                handleViewLeads(data.leadId, true, true);
                // setIsShowModal({
                //   status: false,
                //   data: data,
                // });
              }}
              className={classes.tableviewicon}
              src={view_icon}
              alt="view"
            />
          </Tooltip> */}
          <>
            <Tooltip title="Edit">
              <img
                onClick={() => {
                  handleViewLeads(data.leadId, false);
                  // navigate("/leads/addListLeads", {
                  //   state: { data: data, type: "edit" },
                  // });
                }}
                className={classes.tableediticon}
                src={edit_icon}
                alt="edit"
              />
            </Tooltip>

            {/* <Tooltip title="History">
                <img
                  onClick={() => {
                    navigate("/leads/history", {
                      state: {
                        data: data,
                        filters: filters,
                        page: LeadsList.page,
                        size: LeadsList.size,
                        name: "lead",
                      },
                    });
                    // setIsShowDeleteModal({
                    //   status: true,
                    //   data: data.userId,
                    // });
                  }}
                  className={classes.transfericon}
                  src={history_icon}
                  alt="History"
                />
              </Tooltip> */}
          </>

          {/* {loginUserData?.userType !== 4 ? ( */}
          <Tooltip title="Transfer">
            <img
              onClick={() => {
                setIsShowLeadTransfer({
                  status: true,
                  data: data,
                  ismulti: false,
                });
              }}
              className={classes.transfericon}
              src={transfer_icon}
              alt="transfer"
            />
          </Tooltip>
          {/* ) : null} */}
          <Tooltip title="Hot Lead">
            <img
              onClick={() => {
                if (data.leadStatusName === "Cancelled / Missed") {
                  toast.error(
                    "You cannot change this lead to 'Hot Lead' once it's set as 'Cancelled"
                  );
                } else {
                  setHotLeadStatus({
                    status: true,
                    data: data,
                    isStatus: data.activeStatus ? true : false,
                  });
                }
              }}
              style={{
                opacity: data.leadStatusName === "Cancelled / Missed" ? 0.5 : 1,
              }}
              className={classes.transfericon}
              src={data.activeStatus === 1 ? bookMarkActive : bookmarkIcon}
              alt="Hot Lead"
            />
          </Tooltip>
          <Tooltip title="Change Status">
            <img
              onClick={() => {
                // navigate("/leads/history", { state: data });
                setIsShowChangeStatus({
                  status: true,
                  data: data,
                });
              }}
              className={classes.tabledeleteicon}
              src={status_icon}
              alt="status"
            />
          </Tooltip>

          {/* {loginUserData?.userType === 1 ? ( */}
          <Tooltip title="Delete">
            <img
              onClick={() => {
                setIsShowDeleteModal({
                  status: true,
                  data: data.leadId,
                });
              }}
              className={classes.tabledeleteicon}
              src={delete_icon}
              alt="delete"
            />
          </Tooltip>
          {/* ) : null} */}
          {data?.whatsapp_no && (
            <Tooltip title="Whatsapp">
              <img
                onClick={() => {
                  if (data.leadStatusName === "Cancelled / Missed") {
                    toast.error(
                      "You cannot sent message/media files to  this lead once it's set as 'Cancelled"
                    );
                  } else {
                    setconfirmationModal({
                      status: true,
                      data: data.whatsapp_no,
                    });
                  }
                  // navigate("/leads/history", { state: data });
                }}
                className={classes.tablewhatsappicon}
                style={{
                  opacity:
                    data.leadStatusName === "Cancelled / Missed" ? 0.5 : 1,
                }}
                src={whatsapp}
                alt="whatsapp"
              />
            </Tooltip>
          )}

          <Tooltip title="Followup">
            <img
              onClick={() =>
                navigate("/leads/folloup", {
                  state: {
                    data: data,
                    filters: filters,
                    page: LeadsList.page,
                    size: LeadsList.size,
                  },
                })
              }
              src={followupicon}
              alt="followupicon"
              className={classes.tabledeleteicon}
              style={{ width: 23, height: 23 }}
            />
          </Tooltip>
        </div>
      ),
      key: "address",
    },
  ];
  const handleLeadesList = (
    page: number,
    size: number,
    values: any,
    search_key?: string,
    remainderlist?: any,
    deletedlist?: boolean
  ) => {
    if (token) {
      // if (!search_key) {
      setIsLoading(true);
      // }
      setloader(true);
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
      if (values.status_filterId || remainderlist) {
        formData.append(
          "type",
          remainderlist ? remainderlist : values.status_filterId
        );
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
      if (values.status_filterId || remainderlist) {
        formData.append(
          "lead_status",
          remainderlist ? remainderlist : values.status_filterId
        );
      }
      // if (remainderlist && !values.status_filterId) {
      //   formData.append("lead_status", remainderlist.toString());
      // }
      if (values.dealer_id) {
        formData.append("dealerId", values.dealer_id);
      }
      if (values.employee_id) {
        formData.append("employeeId", values.employee_id);
      }
      if (deletedlist) {
        formData.append("is_deleted", "1");
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
          setloader(false);
        });
    }
  };
  //viewuserdetail
  const handleViewLeads = (
    leadId: any,
    viewStatus: boolean,
    view?: boolean
  ) => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("leadId", leadId);
    viewLeads(formData)
      .then((res) => {
        if (res.data.status === 1) {
          if (viewStatus) {
            setIsShowModal({
              status: true,
              data: res.data.data,
              viewstatus: viewStatus ? true : false,
            });
          } else {
            navigate("/leads/addListLeads", {
              state: {
                data: res.data.data,
                type: view ? "view" : "edit",
                status: false,
                filters: filters,
                page: LeadsList.page,
                size: LeadsList.size,
                name: "lead",
                view: view ? true : false,
              },
            });
          }
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setloader(false);
      });
  };
  //Delete user
  const handleDeleteLeads = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    if (isShowDeleteModal?.data) {
      formData.append("leadId", isShowDeleteModal.data);
    }
    deleteLeads(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
          StatusAttention(
            LeadsList?.items.length === 1
              ? LeadsList?.page === 1
                ? LeadsList?.page
                : LeadsList?.page - 1
              : LeadsList?.page,
            LeadsList?.size,
            filters
          );
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => {
        setloader(false);
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
  const handleTableSearchClear = () => {
    setCityDropdownList([]);
    setDistrictDropdownList([]);
    setcityalert(false);
    setdistrictalert(false);
    resetForm();
    handleSubmit();
    setBtnDisable(false);
    // handleUserList(selectpage, pageSize);
  };

  //StateDropdown
  const handleStateDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    stateDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.stateName,
              value: ele.stateId,
              key: ind,
            };
          });
          setStateDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleDelardropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("isDealer", "1");
    userTypedropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setDropdownList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handelEmployeedropdown = (ID: any) => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("dealerId", ID);

    EmployeeDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setEmployeeList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleCityDropdown = (ID: any, district_id: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    if (district_id) {
      formData.append("district_id", district_id);
    }
    cityDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.cityName,
              value: ele.cityId,
              key: ind,
            };
          });
          setCityDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleDistrictDropdown = (ID: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    DistrictDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.districtName,
              value: ele.districtId,
              key: ind,
            };
          });
          setDistrictDropdownList(options);
        }
      })
      .catch((err) => {});
  };

  const StatusAttention = (page: number, size: number, datas: any) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("token", token);
    changeStatusAttentionService(formData)
      .then((res) => {
        if (res?.data?.status === 1) {
          handleLeadesList(page, size, datas, globalsearch);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (token) {
      StatusAttention(
        LeadsFilters?.page && !state ? LeadsFilters?.page : LeadsList.page,
        LeadsFilters?.size && !state ? LeadsFilters?.size : LeadsList.size,
        LeadsFilters.filters && !state
          ? LeadsFilters.filters
          : {
              ...values,
              status_filterName: state?.filters?.displayName
                ? state?.filters?.displayName
                : "",
              status_filterId: state?.filters?.type ? state?.filters?.type : "",
            }
      );
      dispatch(handleClearRedux());

      if (LeadsFilters.filters && !state) {
        setValues({ ...LeadsFilters.filters });
        setfilters({ ...LeadsFilters.filters });
        if (CheckValueAvailable(LeadsFilters?.filters)) {
          setShowFilterOption(true);
        }
      } else if (state?.filters) {
        if (CheckValueAvailable(state?.filters)) {
          setShowFilterOption(true);
        }
        setValues({
          ...values,
          status_filterName: state?.filters?.displayName,
          status_filterId: state?.filters?.type,
        });
        setfilters({
          ...values,
          status_filterName: state?.filters?.displayName,
          status_filterId: state?.filters?.type,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  useEffect(() => {
    if (token) {
      handleDelardropdown();
      // handleStateDropdown();
      // if (LeadsFilters.filters?.state_id) {
      //   handleCityDropdown(
      //     LeadsFilters.filters?.state_id,
      //     LeadsFilters.filters?.district_id
      //   );
      //   handleDistrictDropdown(LeadsFilters.filters?.state_id);
      // }
      if (LeadsFilters.filters?.dealer_id) {
        handelEmployeedropdown(LeadsFilters.filters?.dealer_id);
      }
      handleStatusFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleHotLeads = () => {
    setloader(true);
    let formData = new FormData();
    formData.append("token", token);
    formData.append("leadId", hotLeadStatus?.data?.leadId);
    formData.append("isActive", hotLeadStatus?.isStatus ? "0" : "1");
    hotLeadsServices(formData)
      .then((res) => {
        toast.success(res.data.msg);
        handleLeadesList(1, 50, values, globalsearch);
        setHotLeadStatus({
          status: false,
          data: null,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setloader(false);
      });
  };
  useEffect(() => {
    if (token && loginUserData?.userType === 3) {
      handelEmployeedropdown(loginUserData?.userId);
    }
  }, [token]);
  const search = (e: any) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  const checkselectetdId = () => {
    let isSelected = LeadsList.items?.find((ele: any) =>
      transferleadlist.includes(ele?.leadId)
    );
    if (isSelected) {
      return true;
    } else {
      return false;
    }
  };

  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setpage(1);
      handleSubmit();
    }
  };

  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        ref={pageHeaderRef}
        heading={"List Leads"}
        btntitle={"Add Leads"}
        importBtn={"Import"}
        remaindertittle={listleadRemainderbtn ? "List Lead" : "Remainder List"}
        Remainderlist={() => {
          setListleadRemainderbtn(!listleadRemainderbtn);
          // setFieldValue("status_filterId", null);
          setValues({
            ...values,
            // status_filterName: "",
            status_filterId: null,
          });
          if (listleadRemainderbtn) {
            handleLeadesList(page, size, values);
          } else {
            handleLeadesList(page, size, values, "", 5);
          }
          // @ts-ignore
          // handleLeadesList(page, size, values, "", 5);
        }}
        deleteLeads={listleadbutton ? "List Lead" : "Deleted List"}
        deletedListlead={() => {
          setListLeadbutton(!listleadbutton);
          if (listleadbutton) {
            handleLeadesList(page, size, values);
          } else {
            handleLeadesList(page, size, values, "", "", true);
          }
        }}
        LeadDataList={LeadsList}
        onFilterbutton={() => {
          if (!showfilterOption && pageHeaderRef.current) {
            pageHeaderRef.current?.clearSearchText();
          }
          setShowFilterOption(!showfilterOption);
          document.getElementById("accord")?.click();
        }}
        showfilter={showfilterOption}
        onMultitransfer={() => {
          setshowmultitransfer(!showmultitransfer);
          setTransferLeadList([]);
        }}
        showmultitransferdata={LeadsList?.items?.length > 0 ? true : false}
        transfertitle={!showmultitransfer ? "Multi Transfer" : "Close Transfer"}
        onBtnPress={() => {
          navigate("/leads/addListLeads", {
            state: {
              filters: filters,
              page: LeadsList.page,
              size: LeadsList.size,
              name: "lead",
            },
          });
        }}
        importBtnPress={() => {
          setImportModal({
            status: true,
            data: null,
          });
        }}
        onWarningIcon={() => {
          dispatch(handleClearRedux());
          navigate("/leads/notificationlist", {
            // state: {
            //   // filters: filters,
            //   page: LeadsList.page,
            //   size: LeadsList.size,
            // },
          });
          StatusAttention(1, LeadsList.size, filters);
        }}
        hasCommonSearch={!showfilterOption}
        onSearch={(searchText) => {
          setGlobalsearch(searchText);
          handleLeadesList(page, size, values, searchText);
        }}
      />

      <GlobalModal
        size={500}
        isVisible={confirmationModal.status}
        closeIcon={false}
        setIsVisible={() => {
          setconfirmationModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <Confirmation
          close={() =>
            setconfirmationModal({
              status: false,
              data: "",
            })
          }
          // handlefunction={() => {
          //   // handlewhatsappClick(values.whatsapp_no);
          // }}
          whatsappData={confirmationModal.data}
        />
      </GlobalModal>
      <GlobalModal
        size={500}
        isVisible={importmodal.status}
        title="Import"
        OnClose={() => {
          setImportModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        setIsVisible={() => {
          setImportModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <LeadImportModal
          close={() => {
            setImportModal((prev: any) => {
              return {
                ...prev,
                status: false,
                data: "",
              };
            });
          }}
          listapicall={() => {
            handleLeadesList(1, 50, values, globalsearch);
          }}
        />
      </GlobalModal>
      <GlobalModal
        size={500}
        isVisible={hotLeadStatus.status}
        closeIcon={false}
        setIsVisible={() => {
          setHotLeadStatus((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <HotLeadConfirmation
          msg={
            hotLeadStatus?.isStatus
              ? "Are you sure you want to remove this lead from hot lead?"
              : "Are you sure you want to add this lead from hot lead?"
          }
          btnTitle={hotLeadStatus?.isStatus ? "Remove" : "Add"}
          close={() => {
            setHotLeadStatus({
              status: false,
              data: null,
            });
          }}
          handlefunction={handleHotLeads}
        />
      </GlobalModal>
      {/* {showfilterOption ? ( */}
      <AccordionContent filterStat={showfilterOption}>
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                value={values.lead_code}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("lead_code", e);
                }}
                // onKeyDown={(e) => search(e)}
                maxLength={Inputlengths?.name}
                placeholder="Search Lead Code"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                value={values.lead_name}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("lead_name", e);
                }}
                // name="Search Name"
                // onKeyDown={(e) => search(e)}
                maxLength={Inputlengths?.name}
                placeholder="Search Lead Name"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <CommonSelect
                allowClear={true}
                options={statusfilter}
                required={true}
                // disabled={values?.state_id ? false : true}
                placeholder="Select Lead status"
                value={values?.status_filterId ? values?.status_filterId : null}
                onChange={(e, data) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("status_filterId", data?.value);
                  // setFieldValue("city", data.label);
                }}
              />
            </Col>
            {loginUserData?.userType !== 3 && loginUserData?.userType !== 4 ? (
              <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
                <CommonSelect
                  allowClear={true}
                  options={delarDropdownList}
                  value={values.dealer_id ? values.dealer_id : null}
                  placeholder="Select Dealer"
                  errormsg={
                    errors.dealer_id && touched.dealer_id
                      ? errors.dealer_id
                      : ""
                  }
                  onChange={(e, data) => {
                    if (e) {
                      setBtnDisable(false);
                      handelEmployeedropdown(e);
                      // setFieldValue("dealer_id", e);
                      setValues({
                        ...values,
                        employee_id: "",
                        dealer_id: e,
                      });
                    } else {
                      setBtnDisable(true);
                      // setFieldValue("dealer_id", null);
                      setValues({
                        ...values,
                        employee_id: "",
                        dealer_id: "",
                      });
                    }
                  }}
                />
              </Col>
            ) : null}
            {loginUserData?.userType !== 4 ? (
              <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
                <CommonSelect
                  allowClear={true}
                  options={EmployeeoList}
                  value={values.employee_id ? values.employee_id : null}
                  placeholder="Select Employee"
                  // disabled={values?.dealer_id ? false : true}
                  errormsg={
                    employeeAlert
                      ? "Please select dealer before selecting employee"
                      : errors.employee_id && touched.employee_id
                      ? errors.employee_id
                      : ""
                  }
                  onkeydown={(e) => {
                    if (!values?.dealer_id && loginUserData?.userType !== 3) {
                      setEmployeeAlert(true);
                      setEmployeeList([]);
                    } else {
                      setEmployeeAlert(false);
                    }
                  }}
                  onChange={(e, data) => {
                    if (e) {
                      setBtnDisable(false);
                      setFieldValue("employee_id", e);
                    } else {
                      setBtnDisable(true);
                      // handelAssignedTodropdown(null);
                      setFieldValue("employee_id", null);
                    }
                  }}
                />
              </Col>
            ) : null}
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  if (Number_Validation(e)) {
                    setFieldValue("phonenumber", e);
                  }
                }}
                value={values.phonenumber}
                // name="Phone Number"
                // onKeyDown={(e) => search(e)}
                maxLength={Inputlengths.phonenumber}
                placeholder="Search Phone Number"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                // allowClear={true}
                // options={stateDropdownList}
                // name="State"
                maxLength={Inputlengths.name}
                required={true}
                value={values.state_id ? values.state_id : null}
                placeholder="Enter State"
                errormsg={
                  errors.state_id && touched.state_id ? errors.state_id : ""
                }
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("state_id", e);
                  // if (e) {
                  //   setValues({
                  //     ...values,
                  //     state_id: data.value,
                  //     city_id: "",
                  //     district_id: "",
                  //   });
                  //   // setFieldValue("state", data.label);
                  //   handleCityDropdown(e, null);
                  //   handleDistrictDropdown(e);
                  // } else {
                  //   setCityDropdownList([]);
                  //   setDistrictDropdownList([]);
                  //   setValues({
                  //     ...values,
                  //     state_id: "",
                  //     state: "",
                  //     city_id: "",
                  //     district_id: "",
                  //   });
                  // }
                }}
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            {/* <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                maxLength={Inputlengths.name}
                // allowClear={true}
                // options={districtDropdownList}
                required={true}
                // disabled={values?.state_id ? false : true}
                placeholder="Enter District"
                value={values.district_id ? values.district_id : null}
                errormsg={
                  // districtalert
                  //   ? "Please select state before selecting district"
                  //   :
                  errors.district_id && touched.district_id
                    ? errors.district_id
                    : ""
                }
                // onkeydown={(e) => {
                //   if (!values?.state_id) {
                //     setdistrictalert(true);
                //   } else {
                //     setdistrictalert(false);
                //   }
                // }}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("district_id", e);
                  // if (e) {
                  //   setValues({
                  //     ...values,
                  //     district_id: data.value,
                  //     city_id: "",
                  //     city: "",
                  //   });

                  //   handleCityDropdown(values?.state_id, data.value);
                  //   // setFieldValue("city", data.label);
                  // } else {
                  //   setValues({
                  //     ...values,
                  //     district_id: "",
                  //     city_id: "",
                  //     city: "",
                  //   });
                  //   handleCityDropdown(values?.state_id, null);
                  // }
                }}
              />
            </Col> */}
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <Commoninput
                // allowClear={true}
                // options={cityDropdownList}
                required={true}
                // disabled={values?.state_id ? false : true}
                placeholder="Enter City"
                maxLength={Inputlengths.name}
                value={values.city_id ? values.city_id : null}
                errormsg={
                  // cityalert
                  //   ? "Please select state before selecting city"
                  //   :
                  errors.city_id && touched.city_id ? errors.city_id : ""
                }
                // onkeydown={(e) => {
                //   if (!values?.state_id) {
                //     setcityalert(true);
                //   } else {
                //     setcityalert(false);
                //   }
                // }}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("city_id", e);
                  // if (e) {
                  //   setFieldValue("city_id", data.value);
                  //   // setFieldValue("city", data.label);
                  // } else {
                  //   setValues({
                  //     ...values,
                  //     city_id: "",
                  //     city: "",
                  //   });
                  // }
                }}
                onKeyDown={handleEnterKeySearch}
              />
            </Col>

            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <CommonDate
                // name="From Date"
                // disableDate={true}
                formate="YYYY-MM-DD"
                isFuture={true}
                endDate={values?.to_date ? values?.to_date : null}
                placeholder="From Date"
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue(
                    "from_date",
                    e ? dayjs(e).format("YYYY-MM-DD") : null
                  );
                }}
                value={values.from_date}
              />
            </Col>
            <Col xxl={3} xl={6} md={8} sm={12} xs={24}>
              <CommonDate
                // name="To Date"
                // disableDate={true}
                isFuture={true}
                startDate={values?.from_date}
                placeholder="To Date"
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue(
                    "to_date",
                    e ? dayjs(e).format("YYYY-MM-DD") : null
                  );
                }}
                value={values.to_date}
              />
            </Col>
            {/* <Col xxl={24} xl={6} md={8} sm={12} xs={24}> */}
            <div className={classes.leadsaction}>
              <CommonButton
                onClick={() => handleSubmit()}
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
                name="search"
                color="#004c97"
              />
              <CommonButton
                onClick={handleTableSearchClear}
                name="Reset"
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
                color="#bf1c17"
              />
            </div>
            {/* </Col> */}
          </Row>
        </div>
      </AccordionContent>
      {/* ) : null} */}
      <GlobalModal
        size={500}
        title="Delete Lead"
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
          msg={"Are You Sure Delete This Lead?"}
          close={() => {
            setIsShowDeleteModal({
              status: false,
              data: null,
            });
          }}
          handlefunction={handleDeleteLeads}
        />
      </GlobalModal>
      <GlobalModal
        size={500}
        // title={
        //   loginUserData?.userType !== 3
        //     ? `${isShowModal?.data?.dealerName} ${
        //         isShowModal?.data?.cityName
        //           ? `(${isShowModal?.data?.cityName})`
        //           : ""
        //       }`
        //     : `${isShowModal?.data?.name} ${
        //         isShowModal?.data?.cityName
        //           ? `(${isShowModal?.data?.cityName})`
        //           : ""
        //       } `
        // }
        title={"Lead Details"}
        OnClose={() => {
          setIsShowModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowModal.status}
        setIsVisible={() => {
          setIsShowModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <AddLeadsModal editdata={isShowModal?.data} />
      </GlobalModal>
      <GlobalModal
        size={700}
        title={
          isShowLeadTransfer.ismulti
            ? "Transfer Multiple Lead"
            : "Transfer Lead"
        }
        OnClose={() => {
          setIsShowLeadTransfer((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowLeadTransfer.status}
        setIsVisible={() => {
          setIsShowLeadTransfer((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <LeadTransferModal
          filters={filters}
          listapicall={StatusAttention}
          pageSize={LeadsList.size}
          selectPage={LeadsList.page}
          editdata={isShowLeadTransfer.data}
          leadId={transferleadlist}
          ismulti={isShowLeadTransfer.ismulti}
          setTransferLeadList={setTransferLeadList}
          setshowmultitransfer={setshowmultitransfer}
          close={() => {
            setIsShowLeadTransfer((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
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
          filters={filters}
          listapicall={StatusAttention}
          pageSize={LeadsList.size}
          selectPage={LeadsList.page}
        />
      </GlobalModal>
      <CommonTable
        dataList={LeadsList}
        columns={
          showmultitransfer
            ? columns
            : columns?.filter((ele: any, ind: number) => ind !== 0)
        }
        filters={filters}
        // handleListapi={(page: number, size: number, data: any) => {
        //   StatusAttention(page, size, data);
        // }}
        handleListapi={(page: number, size: number, data: any) => {
          setpage(page);
          setSize(size);
          if (checkselectetdId()) {
            setconfirmation({
              show: true,
              handlefunction: () => {
                setTransferLeadList([]);
                StatusAttention(page, size, data);
              },
            });
          } else {
            setTransferLeadList([]);
            StatusAttention(page, size, data);
          }
        }}
        rowClassName={getRowClassName}
        onRowClick={(item: any, index: any) => {
          navigate("/leads/history", {
            state: {
              data: item,
              filters: filters,
              page: LeadsList.page,
              size: LeadsList.size,
              name: "lead",
            },
          });
        }}
        hasSingleLineCells
        isLoading={isLoading}
      />
      {transferleadlist.length > 0 && (
        <CommonButton
          name={"Transfer Lead"}
          color="#057e05e0"
          onClick={() => {
            setIsShowLeadTransfer({
              status: true,
              data: null,
              ismulti: true,
            });
          }}
          style={{
            margin: "5px 20px",
          }}
        />
      )}
    </div>
  );
}
