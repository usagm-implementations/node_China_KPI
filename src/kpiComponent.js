import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SplineChart from "./spline";
import { getSums, transformData } from "./leaderboard";
import "./App.css";

const KPIComponent = ({ data, filteredData }) => {
  const chartData = filteredData.length !== 0 ? filteredData : data;
  // const sortedData = data.sort(
  //   (a, b) => new Date(a.report_end_date) - new Date(b.report_end_date)
  // );
  const properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];

  const newProperties = [
    { prop: "page_views", color: "#DA70D6" },
    {
      prop: "page_views_ma7",
      color: "#DA70D6",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "article_views", color: "#FFD700" },
    {
      prop: "article_views_ma7",
      color: "#FFD700",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "visits", color: "#6B8E23" },
    {
      prop: "visits_ma7",
      color: "#6B8E23",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "return_visits", color: "#FF7F50" },
    {
      prop: "return_visits_ma7",
      color: "#FF7F50",
      type: "spline",
      linkedTo: ":previous",
    },
    { prop: "audio_play", color: "#20B2AA", yAxis: 1 },
    {
      prop: "audio_play_ma7",
      color: "#20B2AA",
      type: "spline",
      yAxis: 1,
      linkedTo: ":previous",
    },
    { prop: "video_play_e5", color: "#FF8C00", yAxis: 1 },
    {
      prop: "video_play_e5_ma7",
      color: "#FF8C00",
      type: "spline",
      yAxis: 1,
      linkedTo: ":previous",
    },
  ];

  const RFATrend = transformData(
    getSums("total", "RFA", properties, chartData, true),
    "field",
    newProperties
  ).pop();
  const RFASeries = {
    dts: RFATrend.dts,
    field: "",
    series: [
      RFATrend.page_views,
      RFATrend.page_views_ma7,
      RFATrend.article_views,
      RFATrend.article_views_ma7,
      RFATrend.visits,
      RFATrend.visits_ma7,
      RFATrend.return_visits,
      RFATrend.return_visits_ma7,
      RFATrend.audio_play,
      RFATrend.audio_play_ma7,
      RFATrend.video_play_e5,
      RFATrend.video_play_e5_ma7,
    ],
  };

  return (
    <div className="kpiTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>KPI Trends</u>
      </h3>
      <div className="clearfix w-100 column">
        <div className="clearfix w-100 column">
          <div className="w-100 rfa">
            <SplineChart
              title={RFASeries.field}
              dates={RFASeries.dts}
              series={RFASeries.series}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIComponent;
