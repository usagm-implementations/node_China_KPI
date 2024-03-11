import React, { useMemo } from "react";
import Highcharts from "highcharts";
import drilldownModule from "highcharts/modules/drilldown";
import dataModule from "highcharts/modules/data";
import HighchartsReact from "highcharts-react-official";

// Initialize the drilldown module
drilldownModule(Highcharts);
dataModule(Highcharts);

const PieChart = ({ title, center, size, data, drilldowns }) => {
  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: "60%",
        // spacing: [10, 0, 10, 0], // Adjust spacing for the pie charts
        backgroundColor: "#283347",
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: title,
        style: {
          color: "#fff",
          fontSize: "12px",
        },
      },
      accessibility: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          colors: [
            "#DA70D6",
            "#FFD700",
            "#6B8E23",
            "#FF7F50",
            "#20B2AA",
            "#FF8C00",
            "#483D8B",
            "#2E8B57",
            "#FF69B4",
            "#1E90FF",
          ],
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            color: "#e6e6e6",
          },
          tooltip: {
            pointFormat: "<b>{point.percentage:.2f}%</b>",
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: title,
          center,
          size, // Adjust the size of the pie chart
          data,
        },
      ],
      drilldown: {
        series: [...drilldowns],
      },
    }),
    [data, drilldowns, center, size, title]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
