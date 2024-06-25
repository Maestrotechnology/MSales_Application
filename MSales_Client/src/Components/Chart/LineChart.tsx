import { Grid } from "@mui/material";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
export default function LineChart({
  series,
  labels = [],
  lineValue,
  count,
}: {
  series?: any;
  labels?: string[];
  lineValue?: number;
  count?: number[];
}) {
  let styleOptions: any = {
    fontFamily: "sans-serif",
    fontWeight: 600,
    fontSize: "13px",
  };
  const CustomTooltip = ({
    series,
    seriesIndex,
    dataPointIndex,
    w,
  }: {
    series: any;
    seriesIndex: number;
    dataPointIndex: number;
    w: any;
  }) => {
    const labels = w.globals.categoryLabels;

    return `<div class="custom-tooltip">
              <div class="tooltip-header">
                ${labels[dataPointIndex]}
              &ensp;</div>
            ${
              series[0][dataPointIndex] !== undefined
                ? ` <div class="tooltip-text">
              <div class="tooltip-marker" style="background-color:#008ffb;" >
              </div>
              <div>Open : <span>${series[0][dataPointIndex]}</span>
              </div>
              </div>`
                : ""
            }

             ${
               series[1][dataPointIndex] !== undefined
                 ? `   <div class="tooltip-text">
                   <div
                     class="tooltip-marker"
                     style="background-color:#00e396;"
                   ></div>
                   <div>
                     Assigned : <span>${series[1][dataPointIndex]}</span>
                   </div>
                 </div>`
                 : ""
             }

              ${
                series[2][dataPointIndex] !== undefined
                  ? `<div class="tooltip-text">
              <div class="tooltip-marker" style="background-color:#feb019;" >
              </div>
              <div>Order : <span>${series[2][dataPointIndex]}</span>
              </div></div>`
                  : ``
              }
              
            ${
              series[3][dataPointIndex] !== undefined
                ? `   <div class="tooltip-text">
                  <div
                    class="tooltip-marker"
                    style="background-color:#ff4560;"
                  ></div>
                  <div>
                    Cancel : <span>${series[3][dataPointIndex]}</span>
                  </div>
                </div>`
                : ""
            }
    
   
            </div>`;
  };
  return (
    <Grid>
      <h5>Employee Performance Report</h5>
      <ReactApexChart
        height={400}
        // width={1500}
        options={{
          labels: labels?.map((ele: any) =>
            moment()
              .month(ele - 1)
              .format("MMM")
          ),
          chart: {
            toolbar: {
              show: false,
            },
          },
          colors: ["#008ffb", "#00e396", "#feb019", "#ff4560"],
          fill: {
            opacity: 0.9,
            type: "solid",
            gradient: {
              shade: "dark",
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 100],
              colorStops: [],
            },
            image: {
              src: [],
              width: undefined,
              height: undefined,
            },
            pattern: {
              style: "verticalLines",
              width: 6,
              height: 6,
              strokeWidth: 2,
            },
          },
          stroke: {
            // show: false,
            curve: "straight",
            dashArray: [0, 0],
          },
          markers: {
            size: 5,
            shape: "circle",
            hover: {
              size: 7,
            },
          },
          xaxis: {
            tooltip: {
              enabled: false,
            },
            labels: {
              show: true,
              style: {
                ...styleOptions,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },
          yaxis: {
            labels: {
              show: true,
              style: {
                ...styleOptions,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },
          legend: {
            position: "bottom",
            show: true,
            fontFamily: "sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            labels: {
              colors: "#303030",
            },
          },
          noData: {
            text: "No Data Found",
            style: {
              color: "#5d5d5d",
              fontSize: "14px",
            },
          },
          tooltip: {
            enabled: true,

            custom({ series, seriesIndex, dataPointIndex, w }) {
              return CustomTooltip({ series, seriesIndex, dataPointIndex, w });
            },
            marker: {
              show: true,
            },
          },
        }}
        series={[
          {
            name: "Unassigned",
            data: series.map((ele: any) => ele.Open),
          },
          { name: "Assigned", data: series.map((ele: any) => ele.Assigned) },
          { name: "Order", data: series.map((ele: any) => ele.Order) },
          { name: "Cancel", data: series.map((ele: any) => ele.Close) },
        ]}
        type="line"
      />
    </Grid>
  );
}
