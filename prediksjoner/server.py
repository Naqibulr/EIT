from fastapi import FastAPI
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


app = FastAPI()

@app.post("/simple_prediction")
def simple_prediction(request: SimplePredictionRequest):
    if request.traffic is None:
        request.traffic = int(traffic_forecast.predict([[request.hour, request.year, request.month, request.day]])[0])

    input_features = [[request.hour, request.traffic, request.year, request.month, request.day]]
    
    prediction = multi_random_forest.predict(input_features)

    return AirQualityPredictionResponse(
        pm25=prediction[0][0],
        pm10=prediction[0][1],
        no2=prediction[0][2]
    )
