from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from joblib import load
from xgboost import XGBRegressor

# Load pre-trained models
multi_random_forest = load("models/multi_random_forest.joblib")

traffic_forecast = XGBRegressor()
traffic_forecast.load_model("models/traffic_model.json")

class SimplePredictionRequest(BaseModel):
    """
    Request model for prediction endpoints.

    Attributes:
        hour (int): Hour of the day (0-23).
        traffic (Optional[int]): Traffic level at the given time (if available).
        year (int): Year of the prediction request.
        month (int): Month of the prediction request.
        day (int): Day of the prediction request.
    """
    hour: int
    traffic: Optional[int] = None
    year: int
    month: int
    day: int

class AirQualityPredictionResponse(BaseModel):
    """
    Response model for air quality predictions.

    Attributes:
        pm25 (float): Predicted concentration of PM2.5 (particulate matter).
        pm10 (float): Predicted concentration of PM10.
        no2 (float): Predicted concentration of NO2 (nitrogen dioxide).
    """
    pm25: float
    pm10: float
    no2: float

class TrafficPredictionResponse(BaseModel):
    """
    Response model for traffic predictions.

    Attributes:
        traffic (int): Predicted traffic level.
    """
    traffic: int

# Initialize FastAPI application
app = FastAPI(
    title="Air Quality & Traffic Prediction API",
    description="This API provides predictions for air quality (PM2.5, PM10, NO2) and traffic levels based on historical data.",
    version="1.0.0"
)

# Define allowed origins for CORS
origins = [
    "http://localhost:5173",  # React frontend
    "http://127.0.0.1:5173",  # Alternate localhost
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post(
    "/airquality_prediction",
    response_model=AirQualityPredictionResponse,
    summary="Predict Air Quality",
    description="Predicts air quality parameters (PM2.5, PM10, NO2) based on provided date, time, and traffic data."
)
async def simple_prediction(request: SimplePredictionRequest):
    """
    Predict air quality parameters based on input features.

    - **hour**: Hour of the day (0-23).
    - **traffic**: Optional traffic level (if available).
    - **year, month, day**: Date details for the prediction.
    
    Returns:
    - Predicted levels of PM2.5, PM10, and NO2.
    """
    input_features = [[request.hour, request.traffic, request.year, request.month, request.day]]
    
    prediction = multi_random_forest.predict(input_features)

    return AirQualityPredictionResponse(
        pm25=prediction[0][0],
        pm10=prediction[0][1],
        no2=prediction[0][2],
    )

@app.post(
    "/traffic_prediction",
    response_model=TrafficPredictionResponse,
    summary="Predict Traffic Level",
    description="Predicts traffic congestion levels based on date and time information."
)
async def traffic_prediction(request: SimplePredictionRequest):
    """
    Predict traffic level based on input features.

    - **hour**: Hour of the day (0-23).
    - **year, month, day**: Date details for the prediction.

    Returns:
    - Estimated traffic congestion level.
    """
    input_features = [[request.hour, request.year, request.month, request.day]]
    
    prediction = traffic_forecast.predict(input_features)

    return TrafficPredictionResponse(
        traffic=int(prediction[0])
    )

if __name__ == "__main__":
    """
    Start the FastAPI application using Uvicorn.
    """
    uvicorn.run(app, host="0.0.0.0", port=8000)
