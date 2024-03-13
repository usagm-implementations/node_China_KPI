// import * as dotenv from "dotenv";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const cache = require("memory-cache");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const config = {
  user: "sql_reader",
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  port: 1433,
  database: process.env.DATABASE,
  requestTimeout: 600000,
};

app.get("/api/data", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const cacheKey = `data-${startDate}-${endDate}`; // Updated cache key

    // Check if data is in cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for exact dates: ${cacheKey}`);
      res.json(cachedData);
    } else {
      const dataQuery = `SELECT
        ISNULL(aar.vrs_rsid, '') AS vrs_rsid,
        ISNULL(dd.entity, '') AS entity,
        ISNULL(aar.report_start_date, '') AS report_start_date,
        ISNULL(aar.report_end_date, '') AS report_end_date,
        SUM(aar.audio_play_e3) AS audio_play,
        SUM(aar.video_play_e5) AS video_play_e5,
        SUM(aar.visits) AS visits,
        SUM(aar.return_visits) AS return_visits,
        SUM(aar.avg_time_spent_on_site_per_visit_C) AS avg_time_spent_on_site_per_visit,
        SUM(aar.page_views) AS page_views,
        SUM(aar.article_views) AS article_views
      FROM
        vw_data_dictionary dd
      INNER JOIN
        vw_par_adobe_web_all_reports aar ON dd.author_id = aar.vrs_rsid
      WHERE
        dd.country_region = 'China'
        AND dd.platform_opr = 'Adobe Analytics'
        AND dd.entity IN ('VOA', 'RFA')
        AND dd.service IN ('Mandarin', 'Cantonese', 'Uyghur')
        AND aar.report_start_date >= @startDate
        AND aar.report_end_date <= @endDate
      GROUP BY
        aar.vrs_rsid, dd.entity, aar.report_start_date, aar.report_end_date;`;

      console.log(`${startDate} => ${endDate}`);
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("startDate", sql.Date, startDate)
        .input("endDate", sql.Date, endDate)
        .query(dataQuery);

      // Cache data for 12 hours
      cache.put(cacheKey, result.recordset, 12 * 60 * 60 * 1000);

      // Return the data
      res.json(result.recordset);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/scatterData", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const cacheKey = `scatter-${startDate}-${endDate}`; // Updated cache key

    // Check if data is in cache
    const cachedScatterData = cache.get(cacheKey);

    if (cachedScatterData) {
      console.log(`Cache scatter for exact dates: ${cacheKey}`);
      res.json(cachedScatterData);
    } else {
      const scatterQuery = `SELECT
        ISNULL(dd.entity, '') AS entity,
        ISNULL(aar.vrs_rsid, '') AS vrs_rsid,
        ISNULL(aar.report_start_date, '') AS report_start_date,
        ISNULL(aar.report_end_date, '') AS report_end_date,
        aar.audio_play_e3 AS audio_play,
        aar.video_play_e5 AS video_play_e5,
        aar.visits AS visits,
        aar.return_visits AS return_visits,
        aar.page_views AS page_views,
        aar.article_views AS article_views
      FROM
        vw_data_dictionary dd
      INNER JOIN
        vw_par_adobe_web_all_reports aar ON dd.author_id = aar.vrs_rsid
      WHERE
        dd.country_region = 'China'
        AND dd.platform_opr = 'Adobe Analytics'
        AND dd.entity IN ('VOA', 'RFA')
        AND dd.service IN ('Mandarin', 'Cantonese', 'Uyghur')
        AND aar.report_start_date >= @startDate
        AND aar.report_end_date <= @endDate;`;

      console.log(`Scatter ${startDate} => ${endDate}`);
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("startDate", sql.Date, startDate)
        .input("endDate", sql.Date, endDate)
        .query(scatterQuery);

      // Cache data for 12 hours
      cache.put(cacheKey, result.recordset, 12 * 60 * 60 * 1000);

      // Return the data
      res.json(result.recordset);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
