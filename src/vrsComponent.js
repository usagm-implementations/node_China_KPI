import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AreaSplineChart from "./areaspline";
import { getSums, transformData } from "./leaderboard";
import "./App.css";

const VRSIdComponent = ({ data }) => {
  const RFACantoneseComponent = useRef(null);
  const RFAMandarinComponent = useRef(null);
  const RFAUyghurComponent = useRef(null);
  const VOACantoneseComponent = useRef(null);
  const VOAMandarinComponent = useRef(null);

  const legendItemClick = function () {
    const seriesName = this.name;
    const chart1 = RFACantoneseComponent.current.chart;
    const chart2 = RFAMandarinComponent.current.chart;
    const chart3 = RFAUyghurComponent.current.chart;
    const chart4 = VOACantoneseComponent.current.chart;
    const chart5 = VOAMandarinComponent.current.chart;
    const series1 = chart1.series.find((s) => s.name === seriesName);
    const series2 = chart2.series.find((s) => s.name === seriesName);
    const series3 = chart3.series.find((s) => s.name === seriesName);
    const series4 = chart4.series.find((s) => s.name === seriesName);
    const series5 = chart5.series.find((s) => s.name === seriesName);

    series1.setVisible();
    series2.setVisible();
    series3.setVisible();
    series4.setVisible();
    series5.setVisible();

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

  const createSeries = (source, sourceKey, properties, data) => {
    const trend = transformData(
      getSums("vrs_rsid", source, properties, data),
      "field",
      newProperties
    ).pop();
    trend.audio_play.yAxis = undefined;
    trend.video_play_e5.yAxis = undefined;

    return {
      dts: trend.dts,
      field: trend.field,
      series: [
        trend.page_views,
        trend.article_views,
        trend.visits,
        trend.return_visits,
        trend.audio_play,
        trend.video_play_e5,
      ],
    };
  };
  const RFACantoneseSeries = createSeries(
    "vrs_bbg1_rfacantoneseallsites",
    "vrs_rsid",
    properties,
    data
  );
  const RFAMandarinSeries = createSeries(
    "vrs_bbg1_rfamandarinallsitesv",
    "vrs_rsid",
    properties,
    data
  );
  RFAMandarinSeries["legend"] = true;
  const RFAUyghurSeries = createSeries(
    "vrs_bbg1_rfauyghurallsitesvrs",
    "vrs_rsid",
    properties,
    data
  );
  const VOACantoneseSeries = createSeries(
    "vrs_bbg1_voacantoneseallsites",
    "vrs_rsid",
    properties,
    data
  );
  const VOAMandarinSeries = createSeries(
    "vrs_bbg1_voamandarinallsitesv",
    "vrs_rsid",
    properties,
    data
  );

  return (
    <div className="vrsTrends clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>VRS Id Trends</u>
      </h3>
      <div className="clearfix w-100 column">
        <div className="clearfix w-100 column">
          <div className="rfa-cantonese float-start" style={{ width: "33%" }}>
            <AreaSplineChart
              ref={RFACantoneseComponent}
              dates={RFACantoneseSeries.dts}
              nm={`RFA - ${RFACantoneseSeries.field}`}
              hgt="45%"
              lgnd={RFACantoneseSeries.legend}
              areaType=""
              trendData={RFACantoneseSeries.series}
            />
          </div>
          <div className="rfa-mandarin float-start" style={{ width: "33%" }}>
            <AreaSplineChart
              ref={RFAMandarinComponent}
              dates={RFAMandarinSeries.dts}
              nm={`RFA - ${RFAMandarinSeries.field}`}
              hgt="60%"
              lgnd={RFAMandarinSeries.legend}
              areaType=""
              trendData={RFAMandarinSeries.series}
              legendItemClick={legendItemClick}
            />
          </div>
          <div className="rfa-Uyghur float-start" style={{ width: "33%" }}>
            <AreaSplineChart
              ref={RFAUyghurComponent}
              dates={RFAUyghurSeries.dts}
              nm={`RFA - ${RFAUyghurSeries.field}`}
              hgt="45%"
              lgnd={RFAUyghurSeries.legend}
              areaType=""
              trendData={RFAUyghurSeries.series}
            />
          </div>
        </div>
        <div className="clearfix w-100 column">
          <div className="voa-cantonese float-start" style={{ width: "50%" }}>
            <AreaSplineChart
              ref={VOACantoneseComponent}
              dates={VOACantoneseSeries.dts}
              nm={`VOA - ${VOACantoneseSeries.field}`}
              hgt="45%"
              lgnd={VOACantoneseSeries.legend}
              areaType=""
              trendData={VOACantoneseSeries.series}
            />
          </div>
          <div className="voa-mandarin float-start" style={{ width: "50%" }}>
            <AreaSplineChart
              ref={VOAMandarinComponent}
              dates={VOAMandarinSeries.dts}
              nm={`VOA - ${VOAMandarinSeries.field}`}
              hgt="45%"
              lgnd={VOAMandarinSeries.legend}
              areaType=""
              trendData={VOAMandarinSeries.series}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRSIdComponent;
