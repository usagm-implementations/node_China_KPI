import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BubbleChart from "./bubble";
import "./App.css";

const BubbleComponent = ({ data, filteredData }) => {
  const [loading, setLoading] = useState(true);
  const chartData = filteredData.length !== 0 ? filteredData : data;

  const properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];

  const sumData = (data, properties) => {
    const groupedData = data.reduce((groups, item) => {
      const { entity, ...rest } = item;
      if (!groups[entity]) {
        groups[entity] = { entity };
        properties.forEach((prop) => {
          groups[entity][prop] = 0;
        });
      }
      properties.forEach((prop) => {
        groups[entity][prop] += item[prop];
      });
      return groups;
    }, {});

    return Object.values(groupedData);
  };

  const bubbleSeries = sumData(chartData, properties).map((item) => {
    const { entity, ...rest } = item;
    const data = Object.entries(rest).map(([key, value]) => ({
      name: key,
      value: value,
    }));
    return { name: entity, data };
  });

  //   console.log(JSON.stringify(bubbleSeries));
  const RFAPV = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.page_views]);
  const VOAPV = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.page_views]);

  const RFAAV = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.article_views]);
  const VOAAV = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.article_views]);

  const RFAVisits = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.visits]);
  const VOAVisits = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.visits]);

  const RFARV = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.return_visits]);
  const VOARV = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.return_visits]);

  const RFAAP = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.audio_play]);
  const VOAAP = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.audio_play]);

  const RFAVP = chartData
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.video_play_e5]);
  const VOAVP = chartData
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.video_play_e5]);

  const scatterSeries = [];
  scatterSeries.push(
    { type: "scatter", id: `RFA-page_views`, data: RFAPV },
    { type: "scatter", id: `RFA-article_views`, data: RFAAV },
    { type: "scatter", id: `RFA-visits`, data: RFAVisits },
    { type: "scatter", id: `RFA-return_visits`, data: RFARV },
    { type: "scatter", id: `RFA-audio_play`, data: RFAAP },
    { type: "scatter", id: `RFA-video_play_e5`, data: RFAVP },
    { type: "scatter", id: `VOA-page_views`, data: VOAPV },
    { type: "scatter", id: `VOA-article_views`, data: VOAAV },
    { type: "scatter", id: `VOA-visits`, data: VOAVisits },
    { type: "scatter", id: `VOA-return_visits`, data: VOARV },
    { type: "scatter", id: `VOA-audio_play`, data: VOAAP },
    { type: "scatter", id: `VOA-video_play_e5`, data: VOAVP }
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="bubbleTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>RFA-VOA Breakdowns</u>
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
            <div className="w-100 bubbleCharts">
              <BubbleChart
                bubbleData={bubbleSeries}
                scatterData={scatterSeries}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleComponent;
