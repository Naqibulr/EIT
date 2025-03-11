import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Papa from "papaparse";

const Enkel = () => {
  const [startDateTime, setStartDateTime] = useState<Date | null>(
    new Date("2022-10-01T00:00:00")
  );
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState({
    antallKjørtøy: 5000,
    NO2: 0.0,
    PM25: 0.0,
    PM10: 0.0,
  });
  useEffect(() => {
    fetch("/luftkvalitet.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            setData(result.data);
            console.log(result.data);
          },
          header: true,
          skipEmptyLines: true,
        });
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    // Convert selected date to "DD.MM.YYYY HH:mm" to match Fra-tid format
    if (!startDateTime) return;

    const formattedDate = startDateTime
      .toLocaleString("nb-NO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", ""); // Remove comma between date and time

    console.log("Formatted Date:", formattedDate);

    // Find the row that matches startDateTime
    const matchingRow = data.find((row) => row["Fra-tid"] === formattedDate);

    if (matchingRow) {
      setFilteredData({
        antallKjørtøy: 5000,
        NO2:
          parseFloat(
            parseFloat(matchingRow["Elgeseter NO2µg/m³"]).toFixed(2)
          ) || 0.0,
        PM25:
          parseFloat(
            parseFloat(matchingRow["Elgeseter PM2.5µg/m³"]).toFixed(2)
          ) || 0.0,
        PM10:
          parseFloat(
            parseFloat(matchingRow["Elgeseter PM10µg/m³"]).toFixed(2)
          ) || 0.0,
      });
    } else {
      setFilteredData({
        antallKjørtøy: 5000,
        NO2: 0.0,
        PM25: 0.0,
        PM10: 0.0,
      });
    }
  }, [startDateTime, data]);

  return (
    <div>
      <div style={{ width: "100%", marginTop: "1rem" }}>
        <DatePicker
          selected={startDateTime}
          onChange={(date) => setStartDateTime(date)}
          showTimeSelect
          timeIntervals={60}
          timeCaption="Hour"
          dateFormat="MMMM d, yyyy HH"
          popperPlacement="right-end"
          customInput={
            <TextField
              variant="outlined"
              fullWidth
              label="Velg dato og tid"
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "white",
                    borderRadius: "4px",
                    fontSize: "16px",
                  },
                },
              }}
            />
          }
        />
      </div>
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <h4>Output</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            padding: "0 10px",
          }}
        >
          <h4>Antall Kjørtøy</h4>
          <h4>5000</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            padding: "0 10px",
          }}
        >
          <h4>NO2</h4>
          <h4>{filteredData.NO2} µg/m³</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            padding: "0 10px",
          }}
        >
          <h4>PM2.5</h4>
          <h4>{filteredData.PM25} µg/m³</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            padding: "0 10px",
          }}
        >
          <h4>PM10</h4>
          <h4>{filteredData.PM10} µg/m³</h4>
        </div>
      </div>
    </div>
  );
};

export default Enkel;
