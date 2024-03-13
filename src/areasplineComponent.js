import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AreaSplineChart from "./areaspline";
import { getSums, transformData } from "./leaderboard";
import "./App.css";

const RFAVOAComponent = ({ data }) => {
  const [loading, setLoading] = useState(true);
  // const chartData = filteredData.length !== 0 ? filteredData : data;

  const RFAComponent = useRef(null);
  const VOAComponent = useRef(null);

  const legendItemClick = function () {
    const seriesName = this.name;
    const chart1 = RFAComponent.current.chart;
    const chart2 = VOAComponent.current.chart;
    const series1 = chart1.series.find((s) => s.name === seriesName);
    const series2 = chart2.series.find((s) => s.name === seriesName);

    series1.setVisible();
    series2.setVisible();

    return false;
  };

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
    { prop: "article_views", color: "#FFD700" },
    { prop: "visits", color: "#6B8E23" },
    { prop: "return_visits", color: "#FF7F50" },
    { prop: "audio_play", color: "#20B2AA", yAxis: 1 },
    { prop: "video_play_e5", color: "#FF8C00", yAxis: 1 },
  ];

  const RFATrend = transformData(
    getSums("entity", "RFA", properties, data, true),
    "field",
    newProperties
  ).pop();
  let RFASeries;
  if (RFATrend !== undefined) {
    RFATrend.audio_play.yAxis = undefined;
    RFATrend.video_play_e5.yAxis = undefined;
    RFASeries = {
      dts: RFATrend.dts,
      field: RFATrend.field,
      legend: false,
      series: [
        RFATrend.page_views,
        RFATrend.article_views,
        RFATrend.visits,
        RFATrend.return_visits,
        RFATrend.audio_play,
        RFATrend.video_play_e5,
      ],
    };
  }

  const VOATrend = transformData(
    getSums("entity", "VOA", properties, data),
    "field",
    newProperties
  ).pop();

  let VOASeries;
  if (VOATrend !== undefined) {
    VOATrend.audio_play.yAxis = undefined;
    VOATrend.video_play_e5.yAxis = undefined;
    VOASeries = {
      dts: VOATrend.dts,
      field: VOATrend.field,
      legend: true,
      series: [
        VOATrend.page_views,
        VOATrend.article_views,
        VOATrend.visits,
        VOATrend.return_visits,
        VOATrend.audio_play,
        VOATrend.video_play_e5,
      ],
    };
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="rfavoaTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>RFA-VOA Trends</u>
      </h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
          <Spinner animation="border" variant="light" />
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="clearfix w-100 column">
          <div className="clearfix w-100 column">
            <div className="w-100 rfaArea">
              <AreaSplineChart
                ref={RFAComponent}
                dates={RFASeries.dts}
                nm={RFASeries.field}
                hgt="25%"
                lgnd={RFASeries.legend}
                areaType="normal"
                trendData={RFASeries.series}
              />
            </div>
            <div className="w-100 voaArea">
              <AreaSplineChart
                ref={VOAComponent}
                dates={VOASeries.dts}
                nm={VOASeries.field}
                hgt="25%"
                lgnd={VOASeries.legend}
                areaType="normal"
                trendData={VOASeries.series}
                legendItemClick={legendItemClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFAVOAComponent;
