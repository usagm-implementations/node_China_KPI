import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { CalendarRange, XLg } from "react-bootstrap-icons";
import MultiSelect from "react-select";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addYears,
  isSameDay,
  startOfQuarter,
  endOfQuarter,
  addQuarters,
} from "date-fns";
import PieComponent from "./PieComponent";
import StatsComponent from "./stats";
import LeaderboardComponent from "./leaderboard";
import KPIComponent from "./kpiComponent";
import RFAVOAComponent from "./areasplineComponent";
import VRSIdComponent from "./vrsComponent";
import BubbleComponent from "./bubbleComponent";
// import ScatterComponent from "./scatterComponent";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [data, setData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [vrsRsidOptions, setVrsRsidOptions] = useState([]);
  const [selectedVrsRsid, setSelectedVrsRsid] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredScatter, setFilteredScatter] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const promiseCache = useRef(new Map());
  const promiseScatter = useRef(new Map());

  const fetchDataWithCache = async (sd, ed, filters = false) => {
    const cacheKey = `data-${sd}_${ed}_${filters}`;

    if (promiseCache.current.has(cacheKey)) {
      console.log("CACHE HIT!");
      return promiseCache.current.get(cacheKey);
    }

    const requestPromise = axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/data?startDate=${sd}&endDate=${ed}`
      )
      .then((response) => {
        if (!filters) {
          const uniqueVrsRsidOptions = [
            ...new Set(response.data.map((item) => item.vrs_rsid)),
          ];
          const uniqueEntityOptions = [
            ...new Set(response.data.map((item) => item.entity)),
          ];
          setVrsRsidOptions(uniqueVrsRsidOptions);
          setEntityOptions(uniqueEntityOptions);
        }

        setData(response.data);
        setIsDataFetched(true);

        if (filters) {
          const selectedFilters = {
            vrsRsid: selectedVrsRsid.map((option) => option.value),
            entity: selectedEntity.map((option) => option.value),
          };
          console.log(selectedFilters);
          const filteredData = response.data.filter((item) => {
            return (
              (!selectedFilters.vrsRsid.length ||
                selectedFilters.vrsRsid.includes(item.vrs_rsid)) &&
              (!selectedFilters.entity.length ||
                selectedFilters.entity.includes(item.entity))
            );
          });
          console.log(filteredData);
          setFilteredData(filteredData);
        }
        // console.log(JSON.stringify(response.data));
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });

    promiseCache.current.set(cacheKey, requestPromise);

    return requestPromise;
  };

  const fetchData = async (sd, ed, filters = false) => {
    console.log(
      `${process.env.REACT_APP_API_BASE_URL}/data?startDate=${sd}&endDate=${ed}`
    );
    try {
      await fetchDataWithCache(sd, ed, filters);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchScatterWithCache = async (sd, ed, filters = false) => {
    const cacheKey = `scatter-${sd}_${ed}_${filters}`;

    if (promiseScatter.current.has(cacheKey)) {
      console.log("CACHE SCATTER!");
      return promiseScatter.current.get(cacheKey);
    }

    const requestScatterPromise = axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/scatterData?startDate=${sd}&endDate=${ed}`
      )
      .then((scatter) => {
        setScatterData(scatter.data);
        setIsDataFetched(true);

        if (filters) {
          const selectedFilters = {
            entity: selectedEntity.map((option) => option.value),
          };
          console.log(selectedFilters);
          const filteredData = scatter.data.filter((item) => {
            return (
              !selectedFilters.entity.length ||
              selectedFilters.entity.includes(item.entity)
            );
          });
          console.log(filteredData);
          setFilteredScatter(filteredData);
        }
        // console.log(JSON.stringify(response.data));
        console.log(scatter.data);
        return scatter.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });

    promiseScatter.current.set(cacheKey, requestScatterPromise);

    return requestScatterPromise;
  };

  const fetchScatter = async (sd, ed, filters = false) => {
    console.log(
      `${process.env.REACT_APP_API_BASE_URL}/scatterData?startDate=${sd}&endDate=${ed}`
    );
    try {
      await fetchScatterWithCache(sd, ed, filters);
    } catch (error) {
      console.error("Error fetching scatter:", error);
    }
  };

  const updateFilters = (elem, item) => {
    const selectData = filteredData.length !== 0 ? filteredData : data;
    const filtersData = selectData.filter((d) =>
      item.some((x) => d[elem] === x.value)
    );

    const uniqueVrsRsidOptions = [
      ...new Set(filtersData.map((item) => item.vrs_rsid)),
    ];
    const uniqueEntityOptions = [
      ...new Set(filtersData.map((item) => item.entity)),
    ];

    setVrsRsidOptions(uniqueVrsRsidOptions);
    setEntityOptions(uniqueEntityOptions);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 16);
    endDate.setDate(endDate.getDate() - 2);
    setSelection([{ startDate, endDate, key: "selection" }]);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setDateRange([startDate, endDate]);
    fetchData(formatDate(startDate), formatDate(endDate));
    fetchScatter(formatDate(startDate), formatDate(endDate));
  }, []);

  const customStaticRanges = [
    ...defaultStaticRanges.filter(
      (range) => range.label !== "Today" && range.label !== "Yesterday"
    ),
    {
      label: "This Quarter",
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "Last Quarter",
      range: () => ({
        startDate: startOfQuarter(addQuarters(new Date(), -1)),
        endDate: endOfQuarter(addQuarters(new Date(), -1)),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "This Year",
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "Last Year",
      range: () => ({
        startDate: startOfYear(addYears(new Date(), -1)),
        endDate: endOfYear(addYears(new Date(), -1)),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
  ];

  const handleSelect = (ranges) => {
    setSelection([ranges.selection]);
  };

  const handleFocusChange = (focusedRange) => {
    if (focusedRange.startDate && focusedRange.endDate) {
      setCalendarOpen(true);
    }
  };

  const handleToggleCalendar = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  const handleSelectFilters = async () => {
    setDashboardLoading(true);

    try {
      await fetchData(
        formatDate(selection[0].startDate),
        formatDate(selection[0].endDate),
        true
      );
      await fetchScatter(
        formatDate(selection[0].startDate),
        formatDate(selection[0].endDate),
        true
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  return (
    <div className="w-100 clearfix">
      <div className="filters w-100 p-2 clearfix">
        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="datePicker">
            Select Date Range:
          </label>
          <br />
          <div
            id="dtRange"
            className="bg-light border border-1 border-secondary rounded"
            onClick={handleToggleCalendar}
          >
            <span className="align-middle ms-2 d-flex">
              <CalendarRange className="m-2" />
              <div className="flex-grow-1 m-1">
                {selection[0].startDate.toLocaleDateString()} -{" "}
                {selection[0].endDate
                  ? selection[0].endDate.toLocaleDateString()
                  : "Select end date"}
              </div>
              {isCalendarOpen && <XLg className="m-2" />}
            </span>
          </div>

          {isCalendarOpen && (
            <DateRangePicker
              ranges={selection}
              onChange={handleSelect}
              onFocusChange={handleFocusChange}
              staticRanges={customStaticRanges}
            />
          )}
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="entity">
            Select Entity:
          </label>
          <MultiSelect
            id="entity"
            isMulti
            name="entity"
            options={entityOptions?.map((ent) => ({ value: ent, label: ent }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedEntity}
            onChange={(selectedOptions) => {
              setSelectedEntity(selectedOptions);
              updateFilters("entity", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-1 w-25 p-2 float-start">
          <label className="filterLabels" htmlFor="vrsRsid">
            Select VrsRsid:
          </label>
          <MultiSelect
            id="vrsRsid"
            isMulti
            name="vrsRsid"
            options={vrsRsidOptions?.map((vrsRsid) => ({
              value: vrsRsid,
              label: vrsRsid,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedVrsRsid}
            onChange={(selectedOptions) => {
              setSelectedVrsRsid(selectedOptions);
              updateFilters("VrsRsid", selectedOptions);
            }}
          />
        </div>

        <div className="filter-set-2 w-25 p-2 float-start">
          <br />
          <Bootstrap.Button
            variant="primary"
            id="selectFilters"
            name="selectFilters"
            className="custom-button"
            onClick={handleSelectFilters}
          >
            Select Filters
          </Bootstrap.Button>
        </div>
      </div>

      <div id="dashboard" className="m-2 w-100 clearfix d-flex">
        {dashboardLoading ? (
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
          <div className="area m-2 w-100 clearfix d-flex">
            {isDataFetched && <RFAVOAComponent data={data} />}
          </div>
        )}
        {dashboardLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="danger" />
            <Spinner animation="border" variant="warning" />
            <Spinner animation="border" variant="info" />
          </div>
        ) : (
          <div className="stats mx-1 my-2 float-start flex-fill">
            {isDataFetched && (
              <StatsComponent
                data={data}
                ed={formatDate(selection[0].endDate)}
              />
            )}
          </div>
        )}
      </div>
      {dashboardLoading ? (
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
        <div className="vrsArea m-2 w-100 clearfix d-flex">
          {isDataFetched && <VRSIdComponent data={data} />}
        </div>
      )}

      {dashboardLoading ? (
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
        <div className="bubblePlot m-2 w-100 clearfix d-flex">
          {isDataFetched && (
            <BubbleComponent
              data={scatterData}
              filteredData={filteredScatter}
            />
          )}
        </div>
      )}

      {/* {dashboardLoading ? (
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
        <div className="scatterPlot m-2 w-100 clearfix d-flex">
          {isDataFetched && <ScatterComponent data={scatterData} />}
        </div>
      )} */}

      {dashboardLoading ? (
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
        <div className="leaderboard m-2 w-100 clearfix d-flex">
          {isDataFetched && <LeaderboardComponent data={data} />}
        </div>
      )}

      {dashboardLoading ? (
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
        <div className="kpi m-2 w-100 clearfix d-flex">
          {isDataFetched && (
            <KPIComponent data={data} filteredData={filteredData} />
          )}
        </div>
      )}

      {dashboardLoading ? (
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
        <div className="piecharts m-2 w-100 clearfix d-flex">
          {isDataFetched && (
            <PieComponent data={data} filteredData={filteredData} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
