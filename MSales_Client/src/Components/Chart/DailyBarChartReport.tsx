import ReactApexChart from "react-apexcharts";
import classes from "./chart.module.css";
interface props {
  series?: any;
  labels?: any;
  color?: string;
  values?: any;
}

function DailyBarChart({ series, labels, color }: props) {
  // const [toolTipValue, setToolTipValue] = useState<any>();
  let styleOptions: any = {
    fontFamily: "sans-serif",
    fontWeight: 600,
    fontSize: "13px",
  };
  return (
    <div className={classes.dailyreport}>
      <h5>Daily Report</h5>
      <ReactApexChart
        // width={1500}
        options={{
          chart: {
            type: "bar",
            // stacked: true,
            width: 100,
            height: 450,
            toolbar: {
              show: true,
            },
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
          //   tooltip: {
          //     custom: ({ serie, seriesIndex, dataPointIndex, w }) => {
          //       return `<div class="custom-tooltip">
          //         <div class="tooltip-header">
          //           ${series[dataPointIndex].Dealer}
          //         &ensp;</div>
          //       ${` <div class="tooltip-text">
          //         <div class="tooltip-marker" style="background-color:#008ffb;" >
          //         </div>
          //         <div>Success Percentage: <span> ${series[dataPointIndex].total} %</span>
          //         </div>
          //         </div>`}

          //        ${`   <div class="tooltip-text">
          //              <div
          //                class="tooltip-marker"
          //                style="background-color:#00e396;"
          //              ></div>
          //              <div>
          //                Total Lead : <span>${series[dataPointIndex].totalLead}</span>
          //              </div>
          //            </div>`}
          //            ${`   <div class="tooltip-text">
          //            <div
          //              class="tooltip-marker"
          //              style="background-color:#00e396;"
          //            ></div>
          //            <div>
          //              Order Lead : <span>${series[dataPointIndex].orderLead}</span>
          //            </div>
          //          </div>`}
          //       </div>`;
          //     },
          //   },
          responsive: [
            {
              // breakpoint: 1000,
              // options: {
              //   width: 100,
              // },
            },
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "65%",

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
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            // width: "55%",
            colors: ["transparent"],
          },
          // xaxis: {
          //   categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
          // },
          xaxis: {
            categories: labels?.map((ele: any) => ele),
            offsetX: 10,
            labels: {
              show: true,
              trim: true,
              style: {
                ...styleOptions,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },
          yaxis: {
            decimalsInFloat: 0,
            axisBorder: {
              color: "red",
            },
            labels: {
              //   formatter: (value) => {
              //     // Format y-axis labels as percentage
              //     return !Number.isInteger(value)
              //       ? value.toFixed(2)
              //       : value + "%";
              //   },
              style: {
                ...styleOptions,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },

          fill: {
            opacity: 1,
          },
        }}
        // series={[
        //   {
        //     name: "Series 1",
        //     data: [30, 40, 45, 50, 49],
        //   },
        // ]}
        series={[
          {
            name: "Total Lead",
            data: series?.map((ele: any) => ele.total),
            color: color,
          },
          {
            name: "Open",
            data: series?.map((ele: any) => ele.open),
            color: "#e2541f",
          },
          {
            name: "Assigned Lead",
            data: series?.map((ele: any) => ele.assigned),
            color: color,
          },
          {
            name: "Demo/Site",
            data: series?.map((ele: any) => ele.demo),
            color: color,
          },
          {
            name: "Demo POC",
            data: series?.map((ele: any) => ele.demo_poc),
            color: color,
          },
          {
            name: "FollowUP",
            data: series?.map((ele: any) => ele.follow_up),
            color: "#17cbb3",
          },
          {
            name: "Quotation",
            data: series?.map((ele: any) => ele.quotation),
            color: "#687481",
          },
          {
            name: "Order",
            data: series?.map((ele: any) => ele.order),
            color: "#21b80b",
          },
          {
            name: "Close",
            data: series?.map((ele: any) => ele.close),
            color: "#ef80ef",
          },
          {
            name: "Missed",
            data: series?.map((ele: any) => ele.missed),
            color: "#009782",
          },
        ]}
        type="bar"
        height={420}
      />
    </div>
  );
}

export default DailyBarChart;
