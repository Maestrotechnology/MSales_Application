import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import classes from "../mainscreen.module.css";
import PageHeader from "../../../Components/PageHeader";
import Loader from "../../../SharedComponents/Loader/Loader";

export default function UsermanagementLayouts() {
  let { pathname } = useLocation();
  const [loader, setloader] = useState(false);
  const [showfilterOption, setShowFilterOption] = useState(false);
  const [modifymodalData, setmodifydata] = useState({
    show: false,
    data: null,
    type: "",
  });
  const checkIsFilterditems = (data: any) => {
    if (JSON.stringify(data) !== "{}") {
      return Object.values(data).map((ele: any) => {
        if (ele !== "") {
          return true;
        }
        return false;
      });
    }
    return [false];
  };

  const getCurrentmaster = () => {
    if (pathname.includes("totalreports")) {
      return {
        headername: "Lead Report",
        name: "Leadsreport",
      };
    } else if (pathname.includes("employeereport")) {
      return {
        headername: "Employee Report",
        name: "Employeereport",
      };
    }
  };

  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}

      <div className={classes.contentblock}>
        <Outlet
          context={{
            showfilterOption: showfilterOption,
            setloader: setloader,
            modifymodalData: modifymodalData,
            setmodifydata: setmodifydata,
          }}
        />
      </div>
    </div>
  );
}
