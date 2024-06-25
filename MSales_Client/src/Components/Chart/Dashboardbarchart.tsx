// Import necessary libraries
import ReactApexChart from "react-apexcharts";
import classes from "./chart.module.css";
// Functional component for the bar chart
const DashboardBarChart = ({ data }: any) => {
  let styleOptions: any = {
    fontFamily: "sans-serif",
    fontWeight: 600,
    fontSize: "13px",
  };
  // Define the chart options
  const options = {
    chart: {
      type: "bar",
      stacked: true,
      width: 100,
      height: 450,
      toolbar: {
        show: true,
      },
    },
    title: {},
    xaxis: {
      title: {
        show: true,
        text: "Lead Status",
        style: {
          ...styleOptions,
          color: "#004c97",
        },
      },
      categories: data.map((item: any) => {
        return item.label;
      }), // Categories for each bar
      labels: {
        show: true,
        style: {
          ...styleOptions,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },

    yaxis: {
      title: {
        show: true,
        text: "Total Leads",
        style: {
          ...styleOptions,
          color: "#004c97",
        },
      },
      labels: {
        show: true,
        style: {
          ...styleOptions,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    // dataLabels: {
    //   style: {
    //     show: true,
    //     fontSize: "14px",
    //     fontFamily: "Helvetica, Arial, sans-serif",
    //     fontWeight: "bold",
    //     colors: "red",
    //   },
    // },

    // labels: data.map((item: any) => item.label),
    fill: {
      colors: "#03A9F4",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",

        borderRadius: 2,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
  };

  // Define the series data
  const series = [
    {
      name: "Total Leads",
      data: data.map((item: any) => item.value),
    },
  ];

  return (
    <div className={classes.DashboardBarChartBox}>
      <ReactApexChart
        // @ts-ignore
        options={options}
        series={series}
        type="bar"
        height="100%"
        // width="800"
      />
    </div>
  );
};

export default DashboardBarChart;
