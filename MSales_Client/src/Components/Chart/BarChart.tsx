import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { SeriesMethods } from "../../Shared/Methods";
interface props {
  series?: any;
  labels?: any;
  color?: string;
}

function BarChart({ series, labels, color }: props) {
  // const [toolTipValue, setToolTipValue] = useState<any>();
  let styleOptions: any = {
    fontFamily: "sans-serif",
    fontWeight: 600,
    fontSize: "13px",
  };
  return (
    <div>
      <h5>Lead Report</h5>

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

          responsive: [
            {
              // breakpoint: 1000,
              // options: {
              //   width: 100,
              // },
            },
          ],
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
          xaxis: {
            categories: labels?.map((ele: any) =>
              moment()
                .month(ele - 1)
                .format("MMM")
            ),
            offsetX: 10,
            labels: {
              show: true,
              style: {
                ...styleOptions,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },
          yaxis: {
            axisBorder: {
              color: "red",
            },
            labels: {
              show: true,
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
        series={[
          {
            name: "Unassigned",
            data: series?.map((ele: any) => ele.Open),
            color: color,
          },
          {
            name: "Assign",
            data: series?.map((ele: any) => ele.Assigned),
            color: color,
          },
          {
            name: "Order",
            data: series?.map((ele: any) => ele.Order),
            color: color,
          },
          {
            name: "Cancel",
            data: series?.map((ele: any) => ele.Close),
            color: color,
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default BarChart;
