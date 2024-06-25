import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import classes from "../mainscreen.module.css";
import PageHeader from "../../../Components/PageHeader";
import Loader from "../../../SharedComponents/Loader/Loader";

export default function Masterslayout() {
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
    if (pathname.includes("category")) {
      return {
        headername: "Category",
        name: "Category",
      };
    } else if (pathname.includes("enquiry")) {
      return {
        headername: "Enquiry",
        name: "Enquiry",
      };
    } else if (pathname.includes("requirements")) {
      return {
        headername: "Requirements",
        name: "Requirements",
      };
    } else if (pathname.includes("lead_status")) {
      return {
        headername: "Lead Status",
        name: "Lead Status",
      };
    } else if (pathname.includes("competitor")) {
      return {
        headername: "Competitor",
        name: "Competitor",
      };
    }
    //  else if (pathname.includes("media")) {
    //   return {
    //     headername: "Media",
    //     name: "Media",
    //   };
    // }
  };

  useEffect(() => {
    setShowFilterOption(false);
  }, [pathname]);
  return (
    <div className={classes.background}>
      {loader ? <Loader /> : null}
      {pathname === "/masters/media" ? null : (
        <PageHeader
          heading={getCurrentmaster()?.headername}
          btntitle={`Add ${getCurrentmaster()?.headername}`}
          onFilterbutton={() => {
            setShowFilterOption((pre) => !pre);
            document.getElementById("accord")?.click();
          }}
          showfilter={showfilterOption}
          onBtnPress={() => {
            setmodifydata((prev: any) => {
              return {
                ...prev,
                show: true,
                data: null,
                type: "add",
              };
            });
          }}
        />
      )}

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
