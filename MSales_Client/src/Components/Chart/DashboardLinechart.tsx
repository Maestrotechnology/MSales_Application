import { Grid } from "@mui/material";

import ReactApexChart from "react-apexcharts";
export default function DashboardLinechart({
  chartData,
}: {
  chartData: any;
  series?: any;
  labels?: string[];
}) {
  // var Series = [
  //   {
  //     name: "Status",
  //     type: "line",
  //     data: Dealerstatus.map((ele: any) => ele?.value),
  //   },
  //   {
  //     name: "TEAM B",
  //     type: "line",
  //     data: [55, 69, 45, 61, 43, 54, 37],
  //   },
  // ];
  // var options: any = {
  //   chart: {
  //     height: 350,
  //     type: "line",
  //   },
  //   // stroke: {
  //   //   curve: "smooth",
  //   // },
  //   fill: {
  //     type: "solid",
  //     opacity: [0.35, 1],
  //   },
  //   labels: [
  //     "Dec 01",
  //     "Dec 02",
  //     "Dec 03",
  //     "Dec 04",
  //     "Dec 05",
  //     "Dec 06",
  //     "Dec 07",
  //     "Dec 08",
  //     "Dec 09 ",
  //     "Dec 10",
  //     "Dec 11",
  //   ],
  //   markers: {
  //     size: 5,
  //   },
  //   yaxis: [
  //     {
  //       title: {
  //         text: "Series A",
  //       },
  //       labels: {
  //         formatter: function (value: any) {
  //           return value + "$";
  //         },
  //       },
  //     },

  //     {
  //       opposite: true,
  //       title: {
  //         text: "Series B",
  //       },
  //     },
  //   ],
  //   tooltip: {
  //     shared: false,
  //     intersect: true,
  //     y: {
  //       formatter: undefined,
  //       title: {
  //         formatter: (seriesName: any) => seriesName,
  //       },
  //     },
  //   },
  // };

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
                <div>Total : <span>${series[0][dataPointIndex]}</span>
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
                       OverDue : <span>${series[1][dataPointIndex]}</span>
                     </div>
                   </div>`
                   : ""
               }

                
            
              </div>`;
  };
  return (
    <Grid>
      {/* <ReactApexChart
        options={options}
        series={Series}
        type="line"
        height={350}
      /> */}
      <ReactApexChart
        height={400}
        // width={1500}
        options={{
          labels: chartData?.map((ele: any) => ele?.Dealer),
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
            shared: true,
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
            name: "Total",
            data: chartData.map((ele: any) => ele.totalLead),
          },
          {
            name: "OverDue",
            data: chartData.map((ele: any) => ele.TOtalOverDue),
          },
        ]}
        type="line"
      />
    </Grid>
  );
}
