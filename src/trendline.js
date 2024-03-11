import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";
import "dayjs/locale/es";

const TrendLine = ({ dates, nm, trendData }) => {
  dayjs.locale("en");
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const options = useMemo(
    () => ({
      chart: {
        type: "areaspline",
        backgroundColor: "#283347",
        height: "45%",
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: dates,
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      legend: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "#283347",
        style: { color: "#fff" },
        formatter: function () {
          const yFormat =
            this.point.series.name === "conversion_rate" ||
            this.point.series.name === "return_visit_rate"
              ? `${this.y.toFixed(2)}%`
              : addCommas(this.y);
          let tooltip = `
              <span><b><u>${dayjs(this.key).format(
                "MMM DD, YYYY"
              )}</u></b>: ${yFormat}</span>`;
          return tooltip;
        },
        useHTML: true,
      },
      plotOptions: {
        series: {
          fillOpacity: 0,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [
        {
          name: nm,
          data: trendData,
        },
      ],
    }),
    [nm, dates, trendData]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TrendLine;
