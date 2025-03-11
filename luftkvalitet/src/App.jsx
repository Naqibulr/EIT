import { useState } from "react";
import "leaflet/dist/leaflet.css";
import Button from "@mui/material/Button";
import { MapContainer, TileLayer, SVGOverlay } from "react-leaflet";
import Enkel from "./components/Enkel";
import Avansert from "./components/Avansert";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [selected, setSelected] = useState("enkel");

  const bounds = [
    [63.425, 10.404],
    [63.416, 10.388],
  ];

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
          scrollWheelZoom={true}
          dragging={true}
          style={{ height: "100%", width: "50%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SVGOverlay bounds={bounds}>
            <svg>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="28%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "green", stopOpacity: 0.6 }}
                  />
                  <stop
                    offset="30%"
                    style={{ stopColor: "orange", stopOpacity: 0.6 }}
                  />
                  <stop
                    offset="37%"
                    style={{ stopColor: "red", stopOpacity: 0.6 }}
                  />
                  <stop
                    offset="44%"
                    style={{ stopColor: "orange", stopOpacity: 0.6 }}
                  />
                  <stop
                    offset="76%"
                    style={{ stopColor: "green", stopOpacity: 0.6 }}
                  />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grad1)" />
            </svg>
          </SVGOverlay>
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
            {selected === "enkel" ? <Enkel /> : <Avansert />}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
