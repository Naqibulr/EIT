import "leaflet/dist/leaflet.css";

import "./App.css";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";

function App() {
  const rectangle = [
    [63.420827, -0.28],
    [63.120827, -0.28],
  ];
  const blackOptions = { color: "black" };
  return (
    <>
      <div style={{ height: "97vh", width: "95vw" }}>
        <MapContainer
          center={[63.420827, 10.391806]}
          zoom={16}
          scrollWheelZoom={true}
          className="map leaflet-container"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Rectangle bounds={rectangle} pathOptions={blackOptions} />
        </MapContainer>
      </div>
    </>
  );
}

export default App;
