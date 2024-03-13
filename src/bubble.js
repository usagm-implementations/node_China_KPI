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

const BubbleChart = ({ bubbleData, scatterData }) => {
  dayjs.locale("en");
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  const options = useMemo(
    () => ({
      chart: {
        type: "packedbubble",
        backgroundColor: "#283347",
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
        packedbubble: {
          minSize: "20%",
          maxSize: "100%",
          zMin: 0,
          zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true,
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            filter: {
              property: "y",
              operator: ">",
              value: 250,
            },
            style: {
              color: "black",
              textOutline: "none",
              fontWeight: "normal",
            },
          },
        },
      },
      series: bubbleData,
      // drilldown: {
      //   series: scatterData,
      // },
    }),
    [bubbleData, scatterData]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BubbleChart;
