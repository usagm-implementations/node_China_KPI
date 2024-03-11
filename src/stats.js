import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import dayjs from "dayjs";
import "dayjs/locale/es";

const StatsComponent = ({ data, ed }) => {
  dayjs.locale("en");
  const addCommas = (x) =>
    x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const formatDate = (inputDate) => {
    inputDate = new Date(inputDate);
    return inputDate.toISOString().split("T")[0];
  };

  const averages = (elem, val, properties, statsData) => {
    const elemData = statsData.filter(
      (sd) => formatDate(sd.report_end_date) === ed && sd[elem] === val
    );
    let { sum, count } = elemData.reduce(
      (acc, obj) => {
        if (
          properties.every(
            (prop) =>
              obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== 0
          )
        ) {
          properties.forEach((prop) => {
            acc.sum[prop] += Number(obj[prop]);
          });
          acc.count += 1;
        }
        return acc;
      },
      {
        sum: Object.fromEntries(properties.map((prop) => [prop, 0])),
        count: 0,
      }
    );
    val = val.includes("cantonese")
      ? "Cantonese"
      : val.includes("mandarin")
      ? "Mandarin"
      : val.includes("uyghur")
      ? "Uyghur"
      : val;
    // Calculate the averages
    var averages = { val };

    properties.forEach((prop) => {
      averages[prop] = count > 0 ? sum[prop] / count : undefined;
      if (prop === "avg_time_spent_on_site_per_visit")
        averages[prop] = averages[prop].toFixed(2);
      else averages[prop] = Math.ceil(averages[prop]);
    });

    return averages;
  };

  let properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];
  const allAvgs = [];
  const RFAAvg = averages("entity", "RFA", properties, data);
  const VOAAvg = averages("entity", "VOA", properties, data);
  const rfaCantoneseAvg = averages(
    "vrs_rsid",
    "vrs_bbg1_rfacantoneseallsites",
    properties,
    data
  );
  const rfaMandarinAvg = averages(
    "vrs_rsid",
    "vrs_bbg1_rfamandarinallsitesv",
    properties,
    data
  );
  const rfaUyghurAvg = averages(
    "vrs_rsid",
    "vrs_bbg1_rfauyghurallsitesvrs",
    properties,
    data
  );
  const voaCantoneseAvg = averages(
    "vrs_rsid",
    "vrs_bbg1_voacantoneseallsites",
    properties,
    data
  );
  const voaMandarinAvg = averages(
    "vrs_rsid",
    "vrs_bbg1_voamandarinallsitesv",
    properties,
    data
  );

  allAvgs.push(
    RFAAvg,
    rfaCantoneseAvg,
    rfaMandarinAvg,
    rfaUyghurAvg,
    VOAAvg,
    voaCantoneseAvg,
    voaMandarinAvg
  );

  return (
    <div className="avgs clearfix w-100 column">
      <h4 className="mt-1 ms-1">
        <u>Average Stats on {dayjs(ed).format("MMM DD, YYYY")}</u>
      </h4>
      <br />
      <table className="table table-dark">
        <thead style={{ fontSize: "12px" }}>
          <tr>
            <th></th>
            <th>Page Views</th>
            <th>Article Views</th>
            <th>Visits</th>
            <th>Return Visits</th>
            <th>Audio Play</th>
            <th>Video Play</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "11px" }}>
          {allAvgs.map((avg, index) => (
            <tr
              key={index}
              className={
                avg.val === "RFA" || avg.val === "VOA" ? "highlight-row" : ""
              }
            >
              <td>{avg.val}</td>
              <td>{addCommas(avg.page_views)}</td>
              <td>{addCommas(avg.article_views)}</td>
              <td>{addCommas(avg.visits)}</td>
              <td>{addCommas(avg.return_visits)}</td>
              <td>{addCommas(avg.audio_play)}</td>
              <td>{addCommas(avg.video_play_e5)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsComponent;
