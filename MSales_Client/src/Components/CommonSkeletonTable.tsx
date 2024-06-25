import { Table } from "antd";
import React from "react";

export default function CommonSkeletonTable() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200, // Set the width of the column
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 150, // Set the width of the column
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300, // Set the width of the column
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} className="custom-table" />
    </div>
  );
}
