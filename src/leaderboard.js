import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendLine from "./trendline";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./App.css";
dayjs.locale("en");
export const getSums = (elem, val, properties, leaderData, kpis = false) => {
  const sumsMap = new Map();
  leaderData = leaderData.sort(
    (a, b) => new Date(a.report_end_date) - new Date(b.report_end_date)
  );

  leaderData.forEach((item, index) => {
    if (elem === "total") {
      if (!sumsMap.has(item.report_end_date)) {
        sumsMap.set(item.report_end_date, {
          date: item.report_end_date,
          field: "",
        });
      }

      properties.forEach((key) => {
        sumsMap.get(item.report_end_date)[key] =
          (sumsMap.get(item.report_end_date)[key] || 0) + (item[key] || 0);
      });
    } else {
      const { [elem]: itemGroupValue } = item;
      if (itemGroupValue === val) {
        if (!sumsMap.has(item.report_end_date)) {
          sumsMap.set(item.report_end_date, {
            date: item.report_end_date,
            field: val,
          });
        }

        properties.forEach((key) => {
          sumsMap.get(item.report_end_date)[key] =
            (sumsMap.get(item.report_end_date)[key] || 0) + (item[key] || 0);
        });
      }
      // else {
      //   if (!sumsMap.has(item.report_end_date)) {
      //     sumsMap.set(item.report_end_date, {
      //       date: item.report_end_date,
      //       field: "All",
      //     });
      //   }

      //   properties.forEach((key) => {
      //     sumsMap.get(item.report_end_date)[key] =
      //       (sumsMap.get(item.report_end_date)[key] || 0) + (item[key] || 0);
      //   });
      // }
    }
  });

  const result = [...sumsMap.values()];

  //   const calculateDoD = (current, prev) => {
  //     return (((current || 0) - (prev || 0)) / (prev || 1)) * 100;
  //   };

  //   const calculateWoW = (current, prevWeek) => {
  //     return (((current || 0) - (prevWeek || 0)) / (prevWeek || 1)) * 100;
  //   };

  result.forEach((item, index) => {
    const { return_visits, visits, article_views, page_views } = item;
    const newItem = { ...item }; // Create a new object

    newItem.field = newItem.field.includes("cantonese")
      ? "Cantonese"
      : newItem.field.includes("mandarin")
      ? "Mandarin"
      : newItem.field.includes("uyghur")
      ? "Uyghur"
      : newItem.field;
    newItem.return_visit_rate = (return_visits / visits) * 100 || 0;
    newItem.conversion_rate = (article_views / page_views) * 100 || 0;

    if (kpis === true) {
      // Calculate day-over-day
      //   if (index > 0) {
      //     const prevItem = result.find((prev) => prev.date === newItem.date);
      //     properties.forEach((key) => {
      //       newItem[`${key}_dod`] = calculateDoD(newItem[key], prevItem[key]);
      //     });
      //   }

      //   // Calculate week-over-week
      //   if (index > 6) {
      //     const prevWeekItem = result.find(
      //       (prev) => prev.date === result[index - 7].date
      //     );
      //     properties.forEach((key) => {
      //       newItem[`${key}_wow`] = calculateWoW(newItem[key], prevWeekItem[key]);
      //     });
      //   }

      // Calculate moving average 7 days
      const movingAverage = (index, key) => {
        const start = Math.max(0, index - 6);
        const sum = result
          .slice(start, index + 1)
          .reduce((acc, curr) => acc + (curr[key] || 0), 0);
        return sum / Math.min(7, index - start + 1);
      };

      properties.forEach((key) => {
        newItem[`${key}_ma7`] = movingAverage(index, key);
      });
    }

    result[index] = newItem; // Update the result array
  });

  return result;
};

export const transformData = (inputList, groupByKey, properties) => {
  inputList = inputList.sort((a, b) => new Date(a.date) - new Date(b.date));
  const groupedData = inputList.reduce((acc, item) => {
    const groupKey = item[groupByKey];

    if (!acc[groupKey]) {
      acc[groupKey] = { [groupByKey]: groupKey, dts: [] };
      properties.forEach((key) => {
        acc[groupKey][key.prop] = {
          name: key.prop,
          data: [],
          color: key.color,
          type: key.type,
          yAxis: key.yAxis,
          //   linkedTo: key.linkedTo,
        };
      });
    }

    acc[groupKey].dts.push(dayjs(item.date).format("MMM DD, YYYY"));
    properties.forEach((key) => {
      acc[groupKey][key.prop].data.push(item[key.prop]);
    });

    return acc;
  }, {});

  return Object.values(groupedData);
};

const LeaderboardComponent = ({ data }) => {
  let properties = [
    "page_views",
    "article_views",
    "visits",
    "return_visits",
    "audio_play",
    "video_play_e5",
  ];

  let newProperties = [
    { prop: "page_views", color: "#DA70D6" },
    { prop: "conversion_rate", color: "#483D8B" },
    { prop: "article_views", color: "#FFD700" },
    { prop: "visits", color: "#6B8E23" },
    { prop: "return_visits", color: "#FF7F50" },
    { prop: "return_visit_rate", color: "#2E8B57" },
    { prop: "audio_play", color: "#20B2AA" },
    { prop: "video_play_e5", color: "#FF8C00" },
  ];
  //   properties.push("return_visit_rate", "conversion_rate");
  const leaders = [];
  const RFATrend = transformData(
    getSums("entity", "RFA", properties, data),
    "field",
    newProperties
  ).pop();
  const VOATrend = transformData(
    getSums("entity", "VOA", properties, data),
    "field",
    newProperties
  ).pop();
  const RFACantoneseTrend = transformData(
    getSums("vrs_rsid", "vrs_bbg1_rfacantoneseallsites", properties, data),
    "field",
    newProperties
  ).pop();
  const RFAMandarinTrend = transformData(
    getSums("vrs_rsid", "vrs_bbg1_rfamandarinallsitesv", properties, data),
    "field",
    newProperties
  ).pop();
  const RFAUyghurTrend = transformData(
    getSums("vrs_rsid", "vrs_bbg1_rfauyghurallsitesvrs", properties, data),
    "field",
    newProperties
  ).pop();
  const VOACantoneseTrend = transformData(
    getSums("vrs_rsid", "vrs_bbg1_voacantoneseallsites", properties, data),
    "field",
    newProperties
  ).pop();
  const VOAMandarinTrend = transformData(
    getSums("vrs_rsid", "vrs_bbg1_voamandarinallsitesv", properties, data),
    "field",
    newProperties
  ).pop();

  leaders.push(
    RFATrend,
    RFACantoneseTrend,
    RFAMandarinTrend,
    RFAUyghurTrend,
    VOATrend,
    VOACantoneseTrend,
    VOAMandarinTrend
  );

  return (
    <div className="leaderboards clearfix w-100 column">
      <h3 className="mt-1 ms-1" style={{ color: "#81b0d2" }}>
        <u>Leaderboard</u>
      </h3>
      <table className="table table-dark">
        <thead style={{ fontSize: "12px" }}>
          <tr>
            <th></th>
            <th className="text-center align-middle">Page Views</th>
            <th className="text-center align-middle">Article Views</th>
            <th className="text-center align-middle">Conversion Rate</th>
            <th className="text-center align-middle">Visits</th>
            <th className="text-center align-middle">Return Visits</th>
            <th className="text-center align-middle">Return Visit Rate</th>
            <th className="text-center align-middle">Audio Play</th>
            <th className="text-center align-middle">Video Play</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "15px" }}>
          {leaders.map((avg, index) => (
            <tr
              key={index}
              className={
                avg.field === "RFA" || avg.field === "VOA"
                  ? "highlight-row"
                  : ""
              }
            >
              <td className="text-center align-middle" style={{ width: "20%" }}>
                {avg.field}
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.page_views.name}
                  trendData={avg.page_views.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.article_views.name}
                  trendData={avg.article_views.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.conversion_rate.name}
                  trendData={avg.conversion_rate.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visits.name}
                  trendData={avg.return_visits.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visits.name}
                  trendData={avg.return_visits.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.return_visit_rate.name}
                  trendData={avg.return_visit_rate.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.audio_play.name}
                  trendData={avg.audio_play.data}
                />
              </td>
              <td style={{ width: "10%" }}>
                <TrendLine
                  dates={avg.dts}
                  nm={avg.video_play_e5.name}
                  trendData={avg.video_play_e5.data}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardComponent;
