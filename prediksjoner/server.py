from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from joblib import load
from xgboost import XGBRegressor

multi_random_forest = load("models/multi_random_forest.joblib")

traffic_forecast = XGBRegressor()
traffic_forecast.load_model("models/traffic_model.json")

class SimplePredictionRequest(BaseModel):
    hour: int
    traffic: Optional[int] = None
    year: int
    month: int
    day: int

class AirQualityPredictionResponse(BaseModel):
    pm25: float
    pm10: float
    no2: float

class TrafficPredictionResponse(BaseModel):
    traffic: int

app = FastAPI()

origins = [
    "http://localhost:5173",  # React frontend
    "http://127.0.0.1:5173",  # Alternate localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/airquality_prediction")
def simple_prediction(request: SimplePredictionRequest):
    input_features = [[request.hour, request.traffic, request.year, request.month, request.day]]
    
    prediction = multi_random_forest.predict(input_features)

    return AirQualityPredictionResponse(
        pm25=prediction[0][0],
        pm10=prediction[0][1],
        no2=prediction[0][2],
    )

@app.post("/traffic_prediction")
def traffic_prediction(request: SimplePredictionRequest):
    input_features = [[request.hour, request.year, request.month, request.day]]
    
    prediction = traffic_forecast.predict(input_features)

    return TrafficPredictionResponse(
        traffic=int(prediction[0])
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
