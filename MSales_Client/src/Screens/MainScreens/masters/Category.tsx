import { Col, Row, Tooltip } from "antd";
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
  isFormDirty,
} from "../../../Shared/Methods";
import delete_icon from "../../../Asserts/Icons/delete.png.png";
import edit_icon from "../../../Asserts/Icons/edit.png";
import { ListCatecory, deletecategory } from "../../../Services/Apiservices";
import { LoginUserData, useToken } from "../../../Shared/Constants";
import GlobalModal from "../../../Components/GlobalModal";
import Deleteconfirmation from "../../../Modals/Deleteconfirmation";
import { toast } from "react-toastify";
import ModifycategoryModal from "../../../Modals/Masters/ModifycategoryModal";
import { Commoninput } from "../../../Components/InputComponents/CommonInput";
import AccordionContent from "../../../Components/AccordtionContent";

interface Props {
  showfilterOption: boolean;
  setloader: (value: any) => void;
  modifymodalData: any;
  setmodifydata: any;
}

export default function Category() {
  const { showfilterOption, setloader, modifymodalData, setmodifydata }: Props =
    useOutletContext();
  const token = useToken();

  const [masterList, setmasterList] = useState({
    items: [],
    page: 1,
    size: 50,
  });
  const [filterdata, setfilterdata] = useState({
    name: "",
  });
  const loginUserData = LoginUserData();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const [btnDisable, setBtnDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, handleSubmit, resetForm, setFieldValue, initialValues } =
    useFormik({
      initialValues: {
        name: "",
      },
      onSubmit: (values) => {
        setfilterdata(values);
        handleMasterList(1, masterList.size, values);
        if (initialValues) {
          setBtnDisable(false);
        }
      },
    });

  const handleTableSearchClear = () => {
    resetForm();
    handleSubmit();
    setBtnDisable(false);
  };

  const handleMasterList = (page: number, size: number, values: any) => {
    setIsLoading(true);
    const finalObj = {
      token: token,
      ...values,
    };

    ListCatecory(page, size, JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );

          setmasterList({ ...res?.data?.data, items: setkeyData });
        }
      })
      .catch((err: any) => {})
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
      title: "Category Name",
      dataIndex: "customerCategoryName",
      render: (text: string) => (text ? text : "-"),
      key: "customerCategoryName",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text: string) => (text ? text : "-"),
      key: "createdAt",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (text: any) => (text ? text : "-"),
      key: "createdBy",
    },

    {
      title: "Action",
      render: (data: any) => (
        <div className={classes.tableaction}>
          <Tooltip title="Edit">
            <img
              onClick={() => {
                setmodifydata({
                  data: data,
                  show: true,
                  type: "update",
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
                    data: data.customerCategoryId,
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

  //Delete Master
  const handleDeleteMaster = () => {
    let finalObj = { token: token, dataId: isShowDeleteModal?.data };
    deletecategory(JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setIsShowDeleteModal((prev: any) => {
            return {
              ...prev,
              status: false,
            };
          });
          handleMasterList(
            masterList.items.length === 1
              ? masterList.page === 1
                ? masterList.page
                : masterList.page - 1
              : masterList.page,
            masterList.size,
            filterdata
          );
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      });
  };

  const handleEnterKeySearch = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (token) {
      handleMasterList(masterList.page, masterList.size, filterdata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      {/* modify modal  */}
      <GlobalModal
        size={500}
        title={modifymodalData.data ? "Edit Category" : "Add Category"}
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
        <ModifycategoryModal
          Editdata={modifymodalData.data}
          type={modifymodalData?.type}
          close={() => {
            setmodifydata((prev: any) => {
              return {
                ...prev,
                show: false,
                type: "",
              };
            });
          }}
          handleMasterList={(type: string) => {
            if (type === "add") {
              handleMasterList(1, masterList.size, filterdata);
            } else {
              handleMasterList(masterList.page, masterList.size, filterdata);
            }
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
          msg={"Are You Sure Delete This Category?"}
          close={() => {
            setIsShowDeleteModal({
              status: false,
              data: null,
            });
          }}
          handlefunction={handleDeleteMaster}
        />
      </GlobalModal>
      <AccordionContent filterStat={showfilterOption}>
        <div className={classes.searchOption}>
          <Row className="rowend">
            <Col xxl={3} xl={5} md={7} sm={10} xs={24}>
              <Commoninput
                placeholder="Search Category"
                value={values.name}
                onChange={(e) => {
                  if (e) {
                    setBtnDisable(false);
                  } else {
                    setBtnDisable(true);
                  }
                  setFieldValue("name", e);
                }}
                // onKeyDown={(e) => {
                //   if (e.keyCode === 13) {
                //     handleSubmit();
                //   }
                // }}
                onKeyDown={handleEnterKeySearch}
              />
            </Col>

            <div className={classes.btnactionblock}>
              <CommonButton
                onClick={() => handleSubmit()}
                name="search"
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
                color="#004c97"
              />
              <CommonButton
                onClick={() => handleTableSearchClear()}
                Disabled={
                  btnDisable ? !btnDisable : !isFormDirty(initialValues, values)
                }
                name="Reset"
                color="#bf1c17"
              />
            </div>
          </Row>
        </div>
      </AccordionContent>
      <CommonTable
        dataList={masterList}
        columns={columns}
        filters={filterdata}
        handleListapi={(page: number, size: number, data: any) => {
          handleMasterList(page, size, data);
        }}
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
    </div>
  );
}
