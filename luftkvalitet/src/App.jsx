import { useState } from "react";
import "leaflet/dist/leaflet.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer } from "react-leaflet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [selected, setSelected] = useState("enkel");

  const [startDate, setStartDate] = useState(new Date("2022-10-01T00:00:00"));

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "97.5vh",
          width: "95vw",
          gap: "1rem",
        }}
      >
        <MapContainer
          center={[63.4208, 10.395806]}
          zoom={16}
          scrollWheelZoom={false}
          dragging={false}
          style={{ height: "100%", width: "50%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            width: "50%",
            padding: "1rem",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "end", width: "100%" }}
          >
            <h3 style={{ color: "#426b1f" }}>NTNU - EIT</h3>
          </div>
          <div>
            <h1>Luftkvalitet i Trondheim</h1>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <h3>Velg modus</h3>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <Button
                id="enkel"
                style={{
                  width: "50%",
                  color: "white",
                  backgroundColor: selected === "enkel" ? "#426b1f" : "gray",
                }}
                onClick={() => setSelected("enkel")}
              >
                Enkel
              </Button>
              <Button
                id="avansert"
                style={{
                  width: "50%",
                  backgroundColor: selected === "avansert" ? "#426b1f" : "gray",
                  color: "white",
                }}
                onClick={() => setSelected("avansert")}
              >
                Avansert
              </Button>
            </div>

            <div style={{ width: "100%", marginTop: "1rem" }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
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
                <h4>21.1 µg/m³</h4>
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
                <h4>5.1 µg/m³</h4>
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
                <h4>8.8 µg/m³</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
