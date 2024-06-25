import React, { useEffect, useState } from "react";
import GlobalModal from "../../Components/GlobalModal";
import AddUser from "../../Modals/AddUser";
import PageHeader from "../../Components/PageHeader";
import CommonTable from "../../Components/CommonTable";
import {
  activeInactiveStatus,
  deleteuser,
  userListservices,
  userTypedropdown,
  viewuser,
} from "../../Services/Apiservices";
import { LoginUserData, UserDataType, useToken } from "../../Shared/Constants";
import delete_icon from "../../Asserts/Icons/delete.png.png";
import edit_icon from "../../Asserts/Icons/edit.png";
import view_icon from "../../Asserts/Icons/view.png";
import changepassword_icon from "../../Asserts/Icons/changepassword.png";
import classes from "./mainscreen.module.css";
import Deleteconfirmation from "../../Modals/Deleteconfirmation";
import {
  Number_Validation,
  getCatchMsg,
  getTableSNO,
  replaceText,
} from "../../Shared/Methods";
import Loader from "../../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import CommonSwitch from "../../Components/InputComponents/CommonSwitch";
import { Col, Row, Tooltip } from "antd";
import ChangePasswordmodal from "../../Modals/ChangePasswordmodal";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
import { useFormik } from "formik";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import CommonButton from "../../Components/CommonButton/CommonButton";

export default function UserManagement() {
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
  const { values, handleSubmit, errors, touched, resetForm, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        phonenumber: "",
        dealer_name: "",
        dealer_Id: "",
      },
      onSubmit: () => {
        setCurrent(1);
        handleUserList(1, 10);
      },
    });
  const [loader, setloader] = useState(false);
  const userType = UserDataType();
  const [pageSize, setPageSize] = useState(10);
  const loginUserData = LoginUserData();
  const [selectpage, setselectPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [delarDropdownList, setDropdownList] = useState([]);
  const [showfilterOption, setShowFilterOption] = useState(false);
  const token = useToken();
  const [current, setCurrent] = useState(1);
  //delar Dropdown
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
      .catch((err) => {});
  };
  const handleUserList = (page: number, size: number) => {
    setloader(true);
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
    userListservices(page, size, formData)
      .then((res) => {
        if (res.data.status == 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind) };
            }
          );

          setUserList({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setloader(false);
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
          handleUserList(selectpage, pageSize);
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
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text: string) => (text ? text : "-"),
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: any) => (text ? text : "-"),
      key: "email",
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
        <div>
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
          {loginUserData?.userType === 1 ? (
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
          handleUserList(selectpage, pageSize);
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
      handleUserList(selectpage, pageSize);
    }
  }, [token, pageSize, selectpage]);
  useEffect(() => {
    if (token) {
      handleDelardropdown();
    }
  }, [token]);
  const handleTableSearchClear = () => {
    resetForm();
    handleSubmit();
    // handleUserList(selectpage, pageSize);
  };

  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      <PageHeader
        heading={"User Management"}
        btntitle={"Add User"}
        onFilterbutton={() => {
          setShowFilterOption((pre) => !pre);
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
            ? "View User"
            : isShowModal.data
              ? "Edit User"
              : "Add User"
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
          listapicall={handleUserList}
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
        title="Delete User"
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
          msg={"Are You Sure Delete This User?"}
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
      {showfilterOption ? (
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={5} md={7} sm={10} xs={24}>
              <Commoninput
                value={values.name}
                onChange={(e) => setFieldValue("name", e)}
                // name="Search Name"
                maxLength={20}
                placeholder="Search Name"
              />
            </Col>
            <Col xxl={3} xl={5} md={7} sm={10} xs={24}>
              <Commoninput
                onChange={(e) => setFieldValue("phonenumber", e)}
                value={values.phonenumber}
                // name="Phone Number"
                maxLength={10}
                placeholder="Search Phone Number"
              />
            </Col>
            <Col xxl={3} xl={5} md={7} sm={10} xs={24}>
              <CommonSelect
                options={delarDropdownList}
                // name="Select Dealer"
                placeholder="Search Dealer"
                value={values.dealer_name ? values.dealer_name : null}
                // errormsg={
                //   errors.state_id && touched.state_id ? errors.state_id : ""
                // }
                onChange={(e, data) => {
                  setFieldValue("dealer_id", data.value);
                  setFieldValue("dealer_name", data.label);
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
                onClick={handleTableSearchClear}
                name="Reset"
                color="#bf1c17"
              />
            </div>
          </Row>
        </div>
      ) : null}
      <CommonTable
        dataList={userList}
        columns={columns}
        current={current}
        setCurrent={setCurrent}
        onChangePage={(page: any, pagesize: number) => {
          // handleUserList(page, pagesize);
          setPageSize(pagesize);
          setselectPage(page);
        }}
      />
    </div>
  );
}
