import React, { useEffect, useState } from "react";
import BarChart from "../../Components/Chart/BarChart";
import { useToken } from "../../Shared/Constants";
import { leadchartreport } from "../../Services/Apiservices";
import { getCatchMsg } from "../../Shared/Methods";
import LineChart from "../../Components/Chart/LineChart";
import PageHeader from "../../Components/PageHeader";
import classes from "./mainscreen.module.css";
export default function Reports() {
  const token = useToken();
  const [chartdata, setChartdata] = useState([]);
  const handleReportData = () => {
    let formData = new FormData();
    formData.append("token", token);
    leadchartreport(formData)
      .then((res) => {
        if (res.data.status == 1) {
          setChartdata(res.data.data);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  useEffect(() => {
    if (token) {
      handleReportData();
    }
  }, [token]);
  return (
    <div className={classes.background}>
      <PageHeader
        heading={"Reports"}
        // btntitle={"Back To Leads"}
        // onBtnPress={() => {
        //   navigate("/leads");
        // }}
      />
      <div className={classes.chartdisplay}>
        <div className={classes.chartbackground}>
          <BarChart
            labels={chartdata.map((ele: any) => ele.month)}
            series={chartdata}
          />
        </div>
        <div className={classes.chartbackground}>
          <LineChart
            labels={chartdata.map((ele: any) => ele.month)}
            // series={chartdata || []}
            series={chartdata || []}
          />
        </div>
      </div>
    </div>
  );
}
