import {
  ConfigProvider,
  Pagination,
  Select,
  Skeleton,
  Space,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { Data_SIZE, useToken } from "../Shared/Constants";
import classes from "./Common.module.css";
export default function CommonTable({
  dataList,

  columns,
  current,
  setCurrent,
  handleListapi,
  filters,
  rowClassName = "",
  onRowClick,
  onChangePage,
  hasSingleLineCells,
  isLoading,
}: {
  dataList: any;
  columns: any;
  handleListapi?: any;
  filters?: any;
  rowClassName?: any;
  onRowClick?: any;
  current?: any;
  setCurrent?: any;
  onChangePage?: any;
  hasSingleLineCells?: boolean;
  isLoading?: boolean;
}) {
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
  // const tableRowStyle = {
  //   background: "red !important", // Your desired background color
  // };

  const getColumns = () => {
    return columns && hasSingleLineCells
      ? [...columns].map((column) => {
          const rendered =
            column?.render?.toString()?.replace(/\s/g, "") !==
              'text=>text?text:"-"' || !column?.render
              ? true
              : false;

          return {
            ...column,
            render: isLoading
              ? () => (
                  <Skeleton
                    paragraph={{
                      rows: 1,
                      width: "100%",
                      style: {
                        marginBottom: 0,
                        padding: "4px 6px",
                      },
                    }}
                    title={false}
                    active
                  />
                )
              : rendered
              ? column.render
              : (text: string | React.ReactNode) => (
                  <Tooltip mouseEnterDelay={0.5} title={text || ""}>
                    <p className="mb-0">{text ? text?.toString() : "-"}</p>
                  </Tooltip>
                ),
          };
        })
      : columns;
  };
  const getSkeletonColumns = () => {
    return [...columns]?.map((column) => {
      return {
        ...column,
        render: () => (
          <Skeleton
            paragraph={{
              rows: 1,
              width: "100%",
              style: {
                marginBottom: 0,
                padding: "4px 6px",
              },
            }}
            title={false}
            active
          />
        ),
      };
    });
  };

  return (
    <>
      <div
        className={`${hasSingleLineCells ? "single-line-cells" : ""} ${
          classes.tableBoxsize
        }`}
      >
        {isLoading ? (
          <Table
            dataSource={[...Array(10)]?.fill({})}
            columns={getSkeletonColumns()}
            className={classes.tablecontainer}
          />
        ) : (
          <Table
            dataSource={dataList?.items}
            columns={getColumns()}
            className={classes.tablecontainer}
            pagination={false}
            // rowClassName={(record, index) => "ant-table-row "}
            // @ts-ignore
            rowStyle={() => tableRowStyle}
            // pagination={paginationOptions}
            rowClassName={rowClassName}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  if (onRowClick) onRowClick(record, rowIndex);
                },
              };
            }}
          />
        )}
      </div>
      {dataList?.total_count && dataList?.total_count !== 0 ? (
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
      ) : null}
    </>
  );
}
