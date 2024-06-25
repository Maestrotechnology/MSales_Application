// Import necessary libraries
import ReactApexChart from "react-apexcharts";
import classes from "./chart.module.css";
import { getvalidData } from "../../Shared/Methods";
// Functional component for the pie chart
const DailyPieChart = ({ data }: any) => {
  // Define the chart options
  const options = {
    colors: getvalidData(data)
      ? [
          "#FB8B24",
          "#2196f3",
          "#9A031E",
          "#392467",
          "#00c853",
          "#f06292",
          "#795548",
          "#80BCBD",
        ]
      : ["#bebbbb"],
    position: "bottom",
    chart: {
      width: "70px",
      type: "pie",
    },
    responsive: [
      {
        breakpoint: undefined,
        options: {},
      },
    ],
    tooltip: {
      enabled: getvalidData(data) ? true : false,
    },
    marker: {
      show: getvalidData(data) ? true : false,
    },
    noData: {
      text: "No data found",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#FB8B24",
        fontSize: "13px",
        fontFamily: undefined,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: getvalidData(data) ? true : false,
      //   position: "bottom", // Set data label position to 'top', 'center', or 'bottom'
      offsetY: -20, // Adjust the offset based on your preference
    },
    legend: {
      position: "bottom",
      show: getvalidData(data) ? true : false,
      fontFamily: "sans-serif",
      fontWeight: 600,
      fontSize: "13px",
      labels: {
        colors: "#303030",
      },
    },
    // fill: { colors: ["#B32824"], toolbar: null },
    // labels: [],
    labels: getvalidData(data) ? data.map((item: any) => item.label) : [""], // Labels for each data point
  };

  // Define the series data
  const series = getvalidData(data) ? data.map((item: any) => item.value) : [1];

  return (
    <div className={classes.dailyPieChartReport}>
      {/* {getvalidData(data) ? ( */}
      <ReactApexChart
        // @ts-ignore
        options={options}
        series={series}
        type="pie"
        height={500}
        // width="600"
      />
      {/* ) : ( */}
      {/* <div className={classes.emptychartblock}>
          <img src={charticon} alt="piechart" className={classes.charticon} />
          <p> No Chart datas Found</p>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default DailyPieChart;
