import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ScatterChart from "./scatter";
import "./App.css";
import dayjs from "dayjs";
import "dayjs/locale/es";

const ScatterComponent = ({ data }) => {
  dayjs.locale("en");
  const [loading, setLoading] = useState(true);

  const RFAPV = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [d.report_end_date, d.page_views]);
  const VOAPV = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.page_views,
    ]);

  const RFAAV = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.article_views,
    ]);
  const VOAAV = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.article_views,
    ]);

  const RFAVisits = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [dayjs(d.report_end_date).format("MMM DD, YYYY"), d.visits]);
  const VOAVisits = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [dayjs(d.report_end_date).format("MMM DD, YYYY"), d.visits]);

  const RFARV = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.return_visits,
    ]);
  const VOARV = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.return_visits,
    ]);

  const RFAAP = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.audio_play,
    ]);
  const VOAAP = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.audio_play,
    ]);

  const RFAVP = data
    .filter((d) => d.entity === "RFA")
    .map((d) => [
      dayjs(d.report_end_date).format("MMM DD, YYYY"),
      d.video_play_e5,
    ]);
  const VOAVP = data
    .filter((d) => d.entity === "VOA")
    .map((d) => [d.report_end_date, d.video_play_e5]);

  const scatterSeries = [];
  scatterSeries.push(
    { name: "Page Views", id: `RFA-page_views`, data: RFAPV }
    // { name: "Article Views", id: `RFA-article_views`, data: RFAAV },
    // { name: "Visits", id: `RFA-visits`, data: RFAVisits },
    // { name: "Return Visits", id: `RFA-return_visits`, data: RFARV },
    // { name: "Audio Play", id: `RFA-audio_play`, data: RFAAP },
    // { name: "Video Play", id: `RFA-video_play_e5`, data: RFAVP }
    // { type: "scatter", id: `VOA-page_views`, data: VOAPV },
    // { type: "scatter", id: `VOA-article_views`, data: VOAAV },
    // { type: "scatter", id: `VOA-visits`, data: VOAVisits },
    // { type: "scatter", id: `VOA-return_visits`, data: VOARV },
    // { type: "scatter", id: `VOA-audio_play`, data: VOAAP },
    // { type: "scatter", id: `VOA-video_play_e5`, data: VOAVP }
  );
  // console.log(JSON.stringify(scatterSeries));
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="scatterTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>RFA-VOA Scatter</u>
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
            <div className="w-100 scatterCharts">
              <ScatterChart nm={"ztest"} scatterData={scatterSeries} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScatterComponent;
