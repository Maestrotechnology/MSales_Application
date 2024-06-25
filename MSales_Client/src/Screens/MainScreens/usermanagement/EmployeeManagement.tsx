import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Inputlengths,
  LoginUserData,
  UserDataType,
  useToken,
} from "../../../Shared/Constants";
import {
  activeInactiveStatus,
  deleteuser,
  userListservices,
  userTypedropdown,
  viewuser,
} from "../../../Services/Apiservices";
import {
  Number_Validation,
  getCatchMsg,
  getTableSNO,
  isFormDirty,
  replaceText,
} from "../../../Shared/Methods";
import { toast } from "react-toastify";
import CommonSwitch from "../../../Components/InputComponents/CommonSwitch";
import { Col, Row, Tooltip } from "antd";
import Loader from "../../../SharedComponents/Loader/Loader";
import PageHeader from "../../../Components/PageHeader";
import GlobalModal from "../../../Components/GlobalModal";
import AddUser from "../../../Modals/AddUser";
import Deleteconfirmation from "../../../Modals/Deleteconfirmation";
import ChangePasswordmodal from "../../../Modals/ChangePasswordmodal";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import { CommonSelect } from "../../../Components/InputComponents/CommonSelect";
import CommonButton from "../../../Components/CommonButton/CommonButton";
import CommonTable from "../../../Components/CommonTable";
import classes from "../mainscreen.module.css";
import delete_icon from "../../../Asserts/Icons/delete.png.png";
import edit_icon from "../../../Asserts/Icons/edit.png";
import view_icon from "../../../Asserts/Icons/view.png";
import changepassword_icon from "../../../Asserts/Icons/changepassword.png";
import AccordionContent from "../../../Components/AccordtionContent";

export default function EmployeeManagement() {
  let controller: undefined | AbortController = undefined;
  const [isShowModal, setIsShowModal] = useState<any>({
    status: false,
    data: null,
    viewstatus: false,
  });
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const [isChangePasswordModal, setIsChangePasswordModal] = useState({
    status: false,
    data: null,
  });
  const [filters, setfilters] = useState({
    name: "",
    phonenumber: "",
    dealer_name: "",
    dealer_Id: "",
  });
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    setFieldError,
    resetForm,
    setValues,
    setFieldValue,
    initialValues,
  } = useFormik({
    initialValues: {
      name: "",
      phonenumber: "",
      dealer_name: "",
      dealer_Id: "",
    },
    onSubmit: (values) => {
      setCurrent(1);

      setfilters(values);
      handleUserList(1, userList.size, values);
      if (initialValues) {
        setBtnDisable(false);
      }
    },
  });
  const [loader, setloader] = useState(false);
  const userType = UserDataType();
  const [pageSize, setPageSize] = useState(10);
  const loginUserData = LoginUserData();
  const [selectpage, setselectPage] = useState(1);
  const [btnDisable, setBtnDisable] = useState(false);
  const [userList, setUserList] = useState({
    items: [],
    page: 1,
    size: 50,
  });
  const [delarDropdownList, setDropdownList] = useState([]);
  const [showfilterOption, setShowFilterOption] = useState(false);
  const token = useToken();
  const [current, setCurrent] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  //delar Dropdown
  const handleDelardropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("isDealer", "1");
    userTypedropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any, ind: number) => {
            return {
              label: ele.userName,
              value: ele.userId,
              key: ind,
            };
          });

          setDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleUserList = (page: number, size: number, values: any) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("token", token);
    if (values.name) {
      formData.append("username", values.name);
    }
    if (values.dealer_Id) {
      formData.append("dealerId", values.dealer_Id);
    }
    if (values.phonenumber) {
      formData.append("phoneNumber", values.phonenumber);
    }
    formData.append("type", "4");
    userListservices(page, size, formData)
      .then((res) => {
        if (res.data.status == 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );

          setUserList({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleactiveInactive = (data: any) => {
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    let formData = new FormData();
    formData.append("token", token);

    formData.append("userId", data?.userId);
    // @ts-ignore
    formData.append("activeStatus", data?.userStatus ? 0 : 1);
    activeInactiveStatus(formData, { signal: controller.signal })
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          handleUserList(userList.page, userList.size, filters);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
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
      title: "Name",
      dataIndex: "name",
      render: (text: string) => (text ? text : "-"),
      key: "name",
      className: classes.namecell,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text: string) => (text ? text : "-"),
      key: "userName",
      className: classes.namecell,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: any) => (text ? text : "-"),
      key: "email",
      className: classes.emailcell,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (text: number) => (text ? text : "-"),
      key: "phoneNumber",
    },
    {
      title: "Status",
      render: (data: any) => {
        return (
          <div>
            <CommonSwitch
              checked={data?.userStatus === 0 ? false : true}
              onChange={() => handleactiveInactive(data)}
            />
          </div>
        );
      },
    },
    {
      title: "Action",
      render: (data: any) => (
        <div className={classes.tableaction}>
          <Tooltip title="View">
            <img
              onClick={() => {
                handleViewuser(data.userId, true);
                // setIsShowModal({
                //   status: false,
                //   data: data,
                // });
              }}
              className={classes.tableviewicon}
              src={view_icon}
              alt="view"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <img
              onClick={() => {
                handleViewuser(data.userId, false);
                // setIsShowModal({
                //   status: true,
                //   // data: data,
                // });
              }}
              className={classes.tableediticon}
              src={edit_icon}
              alt="edit"
            />
          </Tooltip>
          <Tooltip title="Change Password">
            <img
              onClick={() => {
                setIsChangePasswordModal({
                  status: true,
                  data: data,
                });
              }}
              className={classes.tableChangepassword}
              src={changepassword_icon}
              alt="changepassword"
            />
          </Tooltip>
          {loginUserData?.userType === 1 || loginUserData?.userType === 3 ? (
            <Tooltip title="Delete">
              <img
                onClick={() => {
                  setIsShowDeleteModal({
                    status: true,
                    data: data.userId,
                  });
                }}
                className={classes.tabledeleteicon}
                src={delete_icon}
                alt="delete"
              />
            </Tooltip>
          ) : null}
        </div>
      ),
      key: "address",
    },
  ];
  //viewuserdetail
  const handleViewuser = (userId: any, viewStatus: boolean) => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("userId", userId);

    viewuser(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setIsShowModal({
            status: true,
            data: res.data.data,
            viewstatus: viewStatus ? true : false,
            // ViewData:false
          });

          // setViewDataList(res.data);
        }
      })
      .catch((err) => {});
  };
  //Delete user
  const handleDeleteUser = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (isShowDeleteModal?.data) {
      formData.append("userId", isShowDeleteModal.data);
    }
    deleteuser(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
          handleUserList(
            userList.items.length === 1
              ? userList.page === 1
                ? userList.page
                : userList.page - 1
              : userList.page,
            userList.size,
            filters
          );
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };
  const handlechangeContact = (event: any) => {
    if (Number_Validation(event)) {
      setFieldValue("phonenumber", event);
    }
  };
  useEffect(() => {
    if (token) {
      handleUserList(userList.page, userList.size, filters);
      handleDelardropdown();
    }
  }, [token]);

  const handleTableSearchClear = () => {
    resetForm();
    setBtnDisable(false);
    handleSubmit();
    // handleUserList(selectpage, pageSize);
  };

  const search = (e: any) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };
  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        heading={"Employee Management"}
        btntitle={"Add Employee"}
        onFilterbutton={() => {
          setShowFilterOption((pre) => !pre);
          document.getElementById("accord")?.click();
        }}
        showfilter={showfilterOption}
        onBtnPress={() => {
          setIsShowModal((prev: any) => {
            return {
              ...prev,
              status: true,
              data: null,
              viewstatus: false,
            };
          });
        }}
      />
      <GlobalModal
        size={isShowModal.viewstatus ? 500 : 1000}
        title={
          isShowModal.viewstatus
            ? "Employee Details"
            : isShowModal.data
            ? "Edit Employee"
            : "Add Employee"
        }
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
        <AddUser
          type={4}
          listapicall={handleUserList}
          filters={filters}
          dataList={userList}
          editData={isShowModal.data}
          viewStatus={isShowModal.viewstatus}
          close={() => {
            setIsShowModal((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
        />
      </GlobalModal>
      <GlobalModal
        size={500}
        title="Delete Employee"
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
          msg={"Are You Sure Delete This Employee?"}
          close={() => {
            setIsShowDeleteModal({
              status: false,
              data: null,
            });
          }}
          handlefunction={handleDeleteUser}
        />
      </GlobalModal>
      <GlobalModal
        size={700}
        title="Change Password"
        OnClose={() => {
          setIsChangePasswordModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isChangePasswordModal.status}
        setIsVisible={() => {
          setIsChangePasswordModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <ChangePasswordmodal
          listapicall={handleUserList}
          editData={isChangePasswordModal.data}
          // viewStatus={isShowModal.viewstatus}
          close={() => {
            setIsChangePasswordModal((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
        />
      </GlobalModal>
      {/* {showfilterOption ? ( */}
      <AccordionContent filterStat={showfilterOption}>
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={5} md={8} sm={12} xs={24}>
              <Commoninput
                value={values.name}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("name", e);
                }}
                // name="Search Name"
                // onKeyDown={(e) => search(e)}
                maxLength={Inputlengths.name}
                placeholder="Search Name"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            <Col xxl={3} xl={5} md={8} sm={12} xs={24}>
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
                maxLength={Inputlengths.phonenumber}
                // onKeyDown={(e) => search(e)}
                placeholder="Search Phone Number"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
            {loginUserData?.userType !== 3 ? (
              <Col xxl={3} xl={5} md={8} sm={12} xs={24}>
                <CommonSelect
                  options={delarDropdownList}
                  // name="Select Dealer"
                  placeholder="Search Dealer"
                  value={values.dealer_Id ? values.dealer_Id : null}
                  // errormsg={
                  //   errors.state_id && touched.state_id ? errors.state_id : ""
                  // }
                  allowClear={true}
                  // onkeydown={(e) => {
                  //   if (e.code === "Enter") {
                  //     handleSubmit();
                  //   }
                  // }}
                  onChange={(e, data) => {
                    if (e) {
                      setBtnDisable(false);
                      setValues({
                        ...values,
                        dealer_Id: data.value,
                        dealer_name: data.label,
                      });
                    } else {
                      setBtnDisable(true);
                      setValues({
                        ...values,
                        dealer_Id: "",
                        dealer_name: "",
                      });
                    }
                  }}
                />
              </Col>
            ) : null}
            <div className={classes.btnactionblock}>
              <CommonButton
                onClick={() => handleSubmit()}
                name="search"
                color="#004c97"
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
              />
              <CommonButton
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
                onClick={handleTableSearchClear}
                name="Reset"
                color="#bf1c17"
              />
            </div>
          </Row>
        </div>
      </AccordionContent>
      {/* ) : null} */}
      <CommonTable
        dataList={userList}
        columns={columns}
        filters={filters}
        handleListapi={(page: number, size: number, data: any) => {
          handleUserList(page, size, data);
        }}
        hasSingleLineCells
        isLoading={isLoading}
        // onChangePage={(page: any, pagesize: number) => {
        //   // handleUserList(page, pagesize);
        //   setPageSize(pagesize);
        //   setselectPage(page);
        // }}
      />
    </div>
  );
}
