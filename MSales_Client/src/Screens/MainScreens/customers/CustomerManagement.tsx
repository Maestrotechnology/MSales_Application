import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  Inputlengths,
  LoginUserData,
  useToken,
} from "../../../Shared/Constants";
import {
  customerListServices,
  deleteCustomerServices,
} from "../../../Services/Apiservices";
import {
  CheckValueAvailable,
  Number_Validation,
  getCatchMsg,
  getTableSNO,
  isFormDirty,
} from "../../../Shared/Methods";
import { toast } from "react-toastify";
import { Col, Row, Tooltip } from "antd";
import Loader from "../../../SharedComponents/Loader/Loader";
import PageHeader from "../../../Components/PageHeader";
import GlobalModal from "../../../Components/GlobalModal";
import Deleteconfirmation from "../../../Modals/Deleteconfirmation";
import ChangePasswordmodal from "../../../Modals/ChangePasswordmodal";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import CommonButton from "../../../Components/CommonButton/CommonButton";
import CommonTable from "../../../Components/CommonTable";
import classes from "../mainscreen.module.css";
import delete_icon from "../../../Asserts/Icons/delete.png.png";
import edit_icon from "../../../Asserts/Icons/edit.png";
import view_icon from "../../../Asserts/Icons/view.png";
import { useNavigate } from "react-router-dom";
import CustomersViewModal from "../../../Modals/CustomersViewModal";
import { useSelector } from "react-redux";
import AccordionContent from "../../../Components/AccordtionContent";

export default function CustomerManagement() {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const [isChangePasswordModal, setIsChangePasswordModal] = useState({
    status: false,
    data: null,
  });
  const [isShowViewModal, setIsShowViewModal] = useState({
    status: false,
    data: null,
  });

  const { CustomerFilters } = useSelector((state: any) => state.dashboard);
  const [btnDisable, setBtnDisable] = useState(false);
  const [filters, setfilters] = useState({
    name: "",
    phonenumber: "",
    dealer_name: "",
    dealer_Id: "",
  });
  const {
    values,
    handleSubmit,

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
      setfilters({ ...values });
      handleCustomerList(1, userList?.size, values);
      if (initialValues) {
        setBtnDisable(false);
      }
    },
  });
  const [loader, setloader] = useState(false);
  const [userList, setUserList] = useState({
    items: [],
    page: 1,
    size: 50,
  });
  const loginUserData = LoginUserData();
  // const [delarDropdownList, setDropdownList] = useState([]);
  const [showfilterOption, setShowFilterOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useToken();
  const navigate = useNavigate();
  //delar Dropdown
  // const handleDelardropdown = () => {
  //   let formData = new FormData();
  //   formData.append("token", token);
  //   formData.append("isDealer", "1");
  //   userTypedropdown(formData)
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         let options = res.data.data.map((ele: any, ind: number) => {
  //           return {
  //             label: ele.userName,
  //             value: ele.userId,
  //             key: ind,
  //           };
  //         });
  //         setDropdownList(options);
  //       }
  //     })
  //     .catch((err) => {});
  // };
  const handleCustomerList = (page: number, size: number, values: any) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("token", token);
    if (values.name) {
      formData.append("name", values.name);
    }
    if (values.dealer_Id) {
      formData.append("dealerId", values.dealer_Id);
    }
    if (values.phonenumber) {
      formData.append("mobileNumber", values.phonenumber);
    }

    customerListServices(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );

          setUserList({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setIsLoading(false);
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
      title: "Contact Person",
      dataIndex: "contactPerson",
      render: (text: string) => (text ? text : "-"),
      key: "contactPerson",
      className: classes.personcell,
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
      dataIndex: "phone",
      render: (text: number) => (text ? text : "-"),
      key: "phone",
    },
    {
      title: "State",
      dataIndex: "stateName",
      render: (text: number) => (text ? text : "-"),
      key: "stateName",
      className: classes.emailcell,
    },
    {
      title: "City",
      dataIndex: "cityName",
      render: (text: number) => (text ? text : "-"),
      key: "cityName",
      className: classes.emailcell,
    },

    {
      title: "Action",
      render: (data: any) => (
        <div className={classes.tableaction}>
          <Tooltip title="View">
            <img
              onClick={() => {
                setIsShowViewModal({
                  status: true,
                  data: data,
                });
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
                navigate("/management/customermanagement/addcustomer", {
                  state: {
                    data: data,
                    filters: filters,
                    page: userList.page,
                    size: userList.size,
                  },
                });
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
                    data: data.customerId,
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
  // const handleViewuser = (userId: any, viewStatus: boolean) => {
  //   let formData = new FormData();
  //   formData.append("token", token);
  //   formData.append("userId", userId);

  //   viewuser(formData)
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         navigate("/management/customermanagement/addcustomer");

  //         // setViewDataList(res.data);
  //       }
  //     })
  //     .catch((err) => {});
  // };
  //Delete user
  const handleDeleteCustomer = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (isShowDeleteModal?.data) {
      formData.append("customerId", isShowDeleteModal.data);
    }
    deleteCustomerServices(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
          handleCustomerList(
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

  useEffect(() => {
    if (token) {
      handleCustomerList(
        CustomerFilters?.page ? CustomerFilters?.page : userList.page,

        CustomerFilters?.size ? CustomerFilters?.size : userList.size,
        CustomerFilters.filters ? CustomerFilters.filters : filters
      );
      if (CustomerFilters.filters) {
        setValues({ ...CustomerFilters.filters });
        setfilters({ ...CustomerFilters.filters });
        if (CheckValueAvailable(CustomerFilters?.filters)) {
          setShowFilterOption(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     handleDelardropdown();
  //   }
  // }, [token]);
  const handleTableSearchClear = () => {
    resetForm();
    handleSubmit();
    setBtnDisable(false);
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
        heading={"Customer Management"}
        btntitle={"Add Customer"}
        onFilterbutton={() => {
          document.getElementById("accord")?.click();
          setShowFilterOption((pre) => !pre);
        }}
        showfilter={showfilterOption}
        onBtnPress={() => {
          navigate(
            "/management/customermanagement/addcustomer",

            {
              state: {
                filters: filters,
                page: userList.page,
                size: userList.size,
              },
            }
          );
          // setIsShowModal((prev: any) => {
          //   return {
          //     ...prev,
          //     status: true,
          //     data: null,
          //     viewstatus: false,
          //   };
          // });
        }}
      />
      <GlobalModal
        size={700}
        title={"Customer Details"}
        OnClose={() => {
          setIsShowViewModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
        }}
        isVisible={isShowViewModal.status}
        setIsVisible={() => {
          setIsShowViewModal((prev: any) => {
            return {
              ...prev,
              status: true,
            };
          });
        }}
      >
        <CustomersViewModal editdata={isShowViewModal.data} />
      </GlobalModal>
      <GlobalModal
        size={500}
        title="Delete Customer"
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
          msg={"Are You Sure Delete This Customer?"}
          close={() => {
            setIsShowDeleteModal({
              status: false,
              data: null,
            });
          }}
          handlefunction={handleDeleteCustomer}
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
          listapicall={handleCustomerList}
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
                placeholder="Search Name"
                maxLength={Inputlengths.name}
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
                // onKeyDown={(e) => search(e)}
                maxLength={Inputlengths.phonenumber}
                placeholder="Search Phone Number"
                onKeyDown={handleEnterKeySearch}
              />
            </Col>
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
                onClick={handleTableSearchClear}
                name="Reset"
                color="#bf1c17"
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
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
          handleCustomerList(page, size, data);
        }}
        hasSingleLineCells
        isLoading={isLoading}
        // setCurrent={setCurrent}
        // onChangePage={(page: any, pagesize: number) => {
        //   // handleUserList(page, pagesize);
        //   setPageSize(pagesize);
        //   setselectPage(page);
        // }}
      />
    </div>
  );
}
