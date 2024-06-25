import React, { useEffect, useState } from "react";
import classes from "./mainscreen.module.css";
import DashboardLinechart from "../../Components/Chart/DashboardLinechart";
import filterIcon from "../../Asserts/Icons/filter.png";
import { Col, Pagination, Row } from "antd";
import { LoginUserData, useToken } from "../../Shared/Constants";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import { useFormik } from "formik";
import CommonButton from "../../Components/CommonButton/CommonButton";
import { DealerwisereportService } from "../../Services/Apiservices";
import { JSONtoformdata, getCatchMsg } from "../../Shared/Methods";
type filters = {
  dealerId?: number | null;
};

export default function DealerwiseReport({
  delarDropdownList,
}: {
  delarDropdownList: any;
}) {
  const loginUserData = LoginUserData();
  const token = useToken();
  const [dealerList, setdealerList] = useState({
    items: [],
    page: 1,
    size: 10,
    total_count: 0,
  });
  const [filterdata, setfilterdata] = useState({
    dealerId: null,
  });
  const {
    values,
    setFieldValue,
    setValues,
    touched,
    errors,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      dealerId: null,
    },
    onSubmit: (values) => {
      setfilterdata(values);
      getDealerwiseReport(1, dealerList.size, values);
    },
  });

  const [filter, setshowfilter] = useState(false);

  const getDealerwiseReport = (
    page: number,
    size: number,
    values?: filters
  ) => {
    let finalObj = { ...values, token: token };
    DealerwisereportService(page, size, JSONtoformdata(finalObj))
      .then((res) => {
        if (res?.data?.status === 1) {
          setdealerList({ ...res?.data.data });
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  useEffect(() => {
    if (token) {
      getDealerwiseReport(1, 10, values);
    }
  }, [token]);
  return (
    <div className={classes.Linechartutline}>
      <div className={classes.chartdisplay}>
        <h5>Dealer wise Report</h5>
        {loginUserData?.userType !== 3 && (
          <div
            onClick={() => setshowfilter(!filter)}
            className={classes.filterdisply}
          >
            <h6>Filters</h6>
            <img
              className={classes.filter_icon}
              src={filterIcon}
              alt="filter_icon"
            />
          </div>
        )}
      </div>
      {filter && loginUserData?.userType !== 3 && (
        <div className={classes.searchOption}>
          <Row className={`rowTop`}>
            {loginUserData?.userType !== 3 ? (
              <Col xxl={3} xl={5} md={7} sm={12} xs={24}>
                <CommonSelect
                  allowClear={true}
                  options={delarDropdownList}
                  value={values.dealerId ? values.dealerId : null}
                  placeholder="Select Dealer"
                  errormsg={
                    errors.dealerId && touched.dealerId ? errors.dealerId : ""
                  }
                  onChange={(e, data) => {
                    if (e) {
                      setFieldValue("dealerId", e);
                    } else {
                      setFieldValue("dealerId", null);
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
              />
              <CommonButton
                onClick={() => {
                  resetForm();
                  handleSubmit();
                }}
                name="Reset"
                color="#bf1c17"
              />
            </div>
          </Row>
        </div>
      )}
      <DashboardLinechart chartData={dealerList.items} />
      {dealerList.total_count > 0 && (
        <Pagination
          current={dealerList.page}
          onChange={(e) =>
            getDealerwiseReport(
              e,
              dealerList.size,
              filterdata ? filterdata : undefined
            )
          }
          showSizeChanger={false}
          // onShowSizeChange={(page, pagesize) => {
          //   setPageSize(pagesize);
          // }}
          // defaultCurrent={6}
          pageSize={dealerList.size}
          total={dealerList?.total_count}
        />
      )}
    </div>
  );
}
