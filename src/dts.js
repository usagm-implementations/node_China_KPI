import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const DateRangePickerComponent = () => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    // Calculate the start date for the last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    setSelection([
      {
        startDate: startDate,
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }, []);

  const handleSelect = (ranges) => {
    setSelection([ranges.selection]);
    console.log("Start Date:", ranges.selection.startDate);
    console.log("End Date:", ranges.selection.endDate);
  };

  const handleFocusChange = (focusedRange) => {
    // Calendar is closed only when both start and end dates are selected
    if (focusedRange.startDate && focusedRange.endDate) {
      setCalendarOpen(false);
    }
  };

  const handleToggleCalendar = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  return (
    <div>
      <div onClick={handleToggleCalendar}>
        {/* Display selected date range */}
        {selection[0].startDate.toLocaleDateString()} -{" "}
        {selection[0].endDate
          ? selection[0].endDate.toLocaleDateString()
          : "Select end date"}
      </div>

      {isCalendarOpen && (
        <DateRangePicker
          ranges={selection}
          onChange={handleSelect}
          onFocusChange={handleFocusChange}
        />
      )}
    </div>
  );
};

export default DateRangePickerComponent;

useEffect(() => {
  console.log(isInitialMount);
  if (isInitialMount.current) {
    isInitialMount.current = false;
    return;
  }
  // Set default date range (past 2 days)
  // const defaultEndDate = new Date();
  // const defaultStartDate = new Date();
  // defaultStartDate.setDate(defaultStartDate.getDate() - 3);
  // defaultEndDate.setDate(defaultEndDate.getDate() - 1);

  // Initialize dateRange state with the default values
  // setDateRange([defaultStartDate, defaultEndDate]);

  // Fetch data based on the default date range
  // fetchData(formatDate(defaultStartDate), formatDate(defaultEndDate));
}, []);
