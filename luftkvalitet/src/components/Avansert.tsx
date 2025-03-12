import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Papa from "papaparse";
import { green, purple, red, orange } from "@mui/material/colors";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const CustomSlider = styled(Slider)({
  color: "black",
  height: 4,
  "& .MuiSlider-thumb": {
    backgroundColor: "#426B1F",
    width: 40,
    height: 25,
    borderRadius: 5,
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
  },

  "& .MuiSlider-rail": {
    color: "black",
    opacity: 1,
    height: 2,
  },
});

const Avansert = ({ setSummary }) => {
  const [startDateTime, setStartDateTime] = useState<Date | null>(
    new Date("2022-10-01T00:00:00")
  );
  const [filteredData, setFilteredData] = useState({
    trafikkMendge: 0,
    NO2: 0.0,
    PM25: 0.0,
    PM10: 0.0,
  });
  const [trafikkData, setTrafikkData] = useState<any[]>([]);
  const [AntallBiler, setAntallBiler] = useState(0);
  const [andelElektrisk, setAndelElektrisk] = useState(0);
  const [data, setData] = useState<any[]>([]);

  // API
  // Request Method: POST

  fetch("http://127.0.0.1:8000/simple_prediction ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      year: startDateTime?.getFullYear(),
      month: startDateTime?.getMonth(),
      day: startDateTime?.getDate(),
      hour: startDateTime?.getHours(),
      traffic: AntallBiler,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    });

  const thresholds = {
    NO2: {
      green: 100,
      yellow: 200,
      red: 400,
    },
    PM25: {
      green: 30,
      yellow: 50,
      red: 150,
    },
    PM10: {
      green: 60,
      yellow: 120,
      red: 400,
    },
  };

  useEffect(() => {
    fetch("/luftkvalitet.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            setData(result.data);
          },
          header: true,
          skipEmptyLines: true,
        });
      });
  }, []);
  useEffect(() => {
    fetch("/trafikkdata.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            setTrafikkData(result.data);
          },
          header: true,
          skipEmptyLines: true,
          delimiter: ";",
        });
      });
  }, []);

  useEffect(() => {
    if (data.length === 0 || trafikkData.length === 0) return;

    if (!startDateTime) return;

    const formattedAirQualityDate = startDateTime
      .toLocaleString("nb-NO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
    const formattedTrafficDate = startDateTime.toISOString().split("T")[0];
    const formattedTrafficTime = startDateTime.toTimeString().slice(0, 5);
    const matchingAirQualityRow = data.find(
      (row) => row["Fra-tid"] === formattedAirQualityDate
    );
    const matchingTrafficRow = trafikkData.find(
      (row) =>
        row["Dato"] === formattedTrafficDate &&
        row["Fra tidspunkt"] === formattedTrafficTime
    );

    setFilteredData({
      NO2: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter NO2µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      PM25: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter PM2.5µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      PM10: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter PM10µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      trafikkMendge: matchingTrafficRow
        ? parseInt(matchingTrafficRow["Trafikkmengde"]) || 0
        : 0,
    });
    setSummary({
      NO2: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter NO2µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      PM25: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter PM2.5µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      PM10: matchingAirQualityRow
        ? parseFloat(
            parseFloat(matchingAirQualityRow["Elgeseter PM10µg/m³"]).toFixed(2)
          ) || 0.0
        : 0.0,
      trafikkMendge: matchingTrafficRow
        ? parseInt(matchingTrafficRow["Trafikkmengde"]) || 0
        : 0,
    });
    setAntallBiler(
      matchingTrafficRow
        ? parseInt(matchingTrafficRow["Trafikkmengde"]) || 0
        : 0
    );
  }, [startDateTime, data]);

  const MAX = 5000;
  const MIN = 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <DatePicker
          inline
          selected={startDateTime}
          onChange={(date) => setStartDateTime(date)}
          showTimeSelect
          timeIntervals={60}
          timeCaption="Hour"
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy HH"
          popperPlacement="right-end"
          className="custom-datepicker"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 50px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4>Antall kjøretøy</h4>
            <CustomSlider
              marks={
                [
                  {
                    value: 0,
                    label: "0",
                  },
                  {
                    value: 5000,
                    label: "5000",
                  },
                ] as any
              }
              step={10}
              value={AntallBiler}
              valueLabelDisplay="auto"
              min={MIN}
              max={MAX}
              onChange={(e, value) => setAntallBiler(value as number)}
              style={{ width: "200px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4>Andel elbiler</h4>
            <CustomSlider
              marks={
                [
                  {
                    value: 0,
                    label: "0%",
                  },
                  {
                    value: 100,
                    label: "100%",
                  },
                ] as any
              }
              step={1}
              value={andelElektrisk}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              onChange={(e, value) => setAndelElektrisk(value as number)}
              style={{ width: "200px" }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          marginTop: "0.2rem",
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
          <h4>{AntallBiler}</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            padding: "0 10px",
            backgroundColor:
              filteredData.NO2 < thresholds.NO2.green
                ? green[500]
                : filteredData.NO2 < thresholds.NO2.yellow
                ? orange[500]
                : filteredData.NO2 < thresholds.NO2.red
                ? red[500]
                : purple[500],
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
            backgroundColor:
              filteredData.PM25 < thresholds.PM25.green
                ? green[500]
                : filteredData.PM25 < thresholds.PM25.yellow
                ? orange[500]
                : filteredData.PM25 < thresholds.PM25.red
                ? red[500]
                : purple[500],
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
            backgroundColor:
              filteredData.PM10 < thresholds.PM10.green
                ? green[500]
                : filteredData.PM10 < thresholds.PM10.yellow
                ? orange[500]
                : filteredData.PM10 < thresholds.PM10.red
                ? red[500]
                : purple[500],
          }}
        >
          <h4>PM10</h4>
          <h4>{filteredData.PM10} µg/m³</h4>
        </div>
      </div>
    </div>
  );
};

export default Avansert;
