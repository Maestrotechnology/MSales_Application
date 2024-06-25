import { Pagination, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Data_SIZE, useToken } from "../Shared/Constants";
import classes from "./Common.module.css";
export default function CommonPagination({
  dataList,

  columns,

  handleListapi,
  filters,
}: any) {
  const token = useToken();

  // const [pageSize, setPageSize] = useState(10);
  // useEffect(() => {
  //   onChangePage(current, pageSize);
  // }, [current, pageSize]);

  const startingIndex: any =
    dataList?.total_count > (dataList?.page - 1) * dataList?.size + 1
      ? (dataList?.page - 1) * dataList?.size + 1
      : dataList?.total_count;
  const endIndex =
    dataList?.total_count > dataList?.size * dataList?.page
      ? dataList?.size * dataList?.page
      : dataList?.total_count;

  return (
    <>
      {dataList?.total_count !== 0 && (
        <div className={classes.paginationdisplay}>
          <div className={classes.itemsstyle}>
            Displaying&nbsp;&nbsp;
            <span className="dark-text">{startingIndex}</span>
            &nbsp;-&nbsp;
            <span className="dark-text">{endIndex}</span>&nbsp;of&nbsp;
            <span className="dark-text">{dataList?.total_count}&nbsp;</span>
            results.
          </div>
          <div className={classes.paginationandresult}>
            <Pagination
              current={dataList.page}
              onChange={(e) =>
                handleListapi(e, dataList.size, filters ? filters : null)
              }
              showSizeChanger={false}
              // onShowSizeChange={(page, pagesize) => {
              //   setPageSize(pagesize);
              // }}
              // defaultCurrent={6}
              pageSize={dataList.size}
              // pageSizeOptions={[10,20,50,100]}
              total={dataList?.total_count}
            />
            <Select
              className={classes.itemsperpage}
              value={dataList.size}
              style={{ width: 120 }}
              onChange={(e) => handleListapi(1, e, filters ? filters : null)}
              options={Data_SIZE}
            />
          </div>
        </div>
      )}
    </>
  );
}
