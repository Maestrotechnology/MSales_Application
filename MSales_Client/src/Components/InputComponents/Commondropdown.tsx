import { ConfigProvider, Dropdown } from "antd";
import React from "react";
import classes from "./inputs.module.css";

export default function Commondropdown({
  children,
  items,
}: {
  children: React.ReactNode;
  items: any;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextDescription: "rgba(0, 0, 0, 0.45)",
          controlItemBgActive: "red",
          /* here is your global tokens */
        },
      }}
    >
      {" "}
      <Dropdown
        menu={{ items }}
        overlayStyle={{ cursor: "pointer" }}
        className={classes.itemstyle}
      >
        {children}
      </Dropdown>
    </ConfigProvider>
  );
}
