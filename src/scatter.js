import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import highchartsExporting from "highcharts/modules/exporting";
import highchartsExportData from "highcharts/modules/export-data";
import highchartsPackedbubble from "highcharts/highcharts-more";
import dayjs from "dayjs";
import "dayjs/locale/es";

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);
highchartsPackedbubble(Highcharts);

const ScatterChart = ({ nm, scatterData }) => {
  dayjs.locale("en");
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  const options = useMemo(
    () => ({
      chart: {
        type: "scatter",
        backgroundColor: "#283347",
        zoomType: "xy",
      },
      exporting: {
        enabled: true,
      },
      navigation: {
        buttonOptions: {
          verticalAlign: "top",
          y: -10,
          x: -5,
        },
      },
      title: {
        text: nm,
        style: {
          color: "#fff",
        },
      },
      accessibility: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: "#fff",
        },
      },
      xAxis: {
        type: "datetime",
        lineColor: "#fff",
        lineWidth: 3,
        labels: {
          style: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        gridLineColor: "#283347",
        lineColor: "#fff",
        lineWidth: 3,
        labels: {
          style: {
            color: "#000",
          },
        },
        title: {
          text: "",
        },
        opposite: false,
      },
      tooltip: {
        backgroundColor: "#283347",
        style: { color: "#fff" },
        formatter: function () {
          if (this.y !== undefined || this.key !== undefined) {
            let tooltip = `<span><b><u>${this.key}</u></b>: ${addCommas(
              this.y
            )}</span>`;
            return tooltip;
          }
        },
        useHTML: true,
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: "circle",
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)",
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          jitter: {
            x: 0.005,
          },
        },
      },
      series: scatterData,
    }),
    [nm, scatterData]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ScatterChart;
