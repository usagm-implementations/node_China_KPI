import React, { useMemo, forwardRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import highchartsExporting from "highcharts/modules/exporting";
import highchartsExportData from "highcharts/modules/export-data";
import dayjs from "dayjs";
import "dayjs/locale/es";

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);

const AreaSplineChart = forwardRef(
  ({ dates, nm, hgt, lgnd, areaType, trendData, legendItemClick }, ref) => {
    dayjs.locale("en");
    const addCommas = (x) =>
      x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    const options = useMemo(
      () => ({
        chart: {
          type: "areaspline",
          backgroundColor: "#283347",
          zoomType: "x",
          height: hgt,
          // marginRight: 120,
          // marginLeft: -10,
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
        xAxis: {
          categories: dates,
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
              color: "#fff",
            },
          },
          title: {
            text: "",
          },
          opposite: false,
        },
        legend: {
          enabled: lgnd,
          itemStyle: {
            color: "#fff",
          },
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
            const yFormat = addCommas(this.y);
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
            stacking: areaType === "normal" ? "normal" : undefined,
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                },
              },
            },
            events: { legendItemClick },
          },
        },
        series: trendData,
      }),
      [nm, hgt, dates, lgnd, areaType, legendItemClick, trendData]
    );
    //   console.log(document.querySelector(".rfaArea"));
    return (
      <HighchartsReact
        ref={ref}
        highcharts={Highcharts}
        containerProps={{ className: `${nm}-area` }}
        options={options}
      />
    );
  }
);

export default AreaSplineChart;
