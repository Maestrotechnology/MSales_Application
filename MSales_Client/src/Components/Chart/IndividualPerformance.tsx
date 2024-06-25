import ReactApexChart from "react-apexcharts";
import { SeriesMethods } from "../../Shared/Methods";
interface props {
  series?: any;
  labels?: any;
  color?: string;
}

function IndividualBarChart({ series, labels, color }: props) {
  // const [toolTipValue, setToolTipValue] = useState<any>();
  let styleOptions: any = {
    fontFamily: "sans-serif",
    fontWeight: 600,
    fontSize: "13px",
  };
  return (
    <div>
      <h5>Performance Report</h5>

      <ReactApexChart
        // width={1500}
        options={{
          chart: {
            type: "bar",
            stacked: true,
            width: 100,
            height: 450,
            toolbar: {
              show: true,
            },
          },

          tooltip: {
            custom: ({ serie, seriesIndex, dataPointIndex, w }) => {
              return `<div class="custom-tooltip">
                <div class="tooltip-header">
                  ${series[dataPointIndex].Dealer}
                &ensp;</div>
              ${` <div class="tooltip-text">
                <div class="tooltip-marker" style="background-color:#008ffb;" >
                </div>
                <div>Success Percentage: <span> ${series[
                  dataPointIndex
                ].successPercentage.toFixed(2)} %</span>
                </div>
                </div>`}

               ${`   <div class="tooltip-text">
                     <div
                       class="tooltip-marker"
                       style="background-color:#00e396;"
                     ></div>
                     <div>
                       Total Lead : <span>${series[dataPointIndex].totalLead}</span>
                     </div>
                   </div>`}  
                   ${`   <div class="tooltip-text">
                   <div
                     class="tooltip-marker"
                     style="background-color:#00e396;"
                   ></div>
                   <div>
                     Order Lead : <span>${series[dataPointIndex].orderLead}</span>
                   </div>
                 </div>`}  
              </div>`;
            },
          },
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
              columnWidth: SeriesMethods(series),

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
            width: 5,
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
              formatter: (value) => {
                // Format y-axis labels as percentage
                return !Number.isInteger(value)
                  ? value.toFixed(2)
                  : value + "%";
              },
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
            name: "Success Percentage",
            data: series?.map((ele: any) => ele.successPercentage.toFixed(2)),
            color: color,
          },
          // {
          //   name: "orderLead",
          //   data: series?.map((ele: any) => ele.orderLead),
          //   color: color,
          // },
          // {
          //   name: "totalLead",
          //   data: series?.map((ele: any) => ele.totalLead),
          //   color: color,
          // },
          // {
          //   name: "Cancel",
          //   data: series?.map((ele: any) => ele.Close),
          //   color: color,
          // },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default IndividualBarChart;
