from pydantic import BaseModel


class ForecastSlot(BaseModel):
    label: str
    temperature: float
    rainfall_probability: int
    condition: str


class WeatherResponse(BaseModel):
    location: str
    temperature: float
    humidity: int
    rainfall_probability: int
    condition: str
    recommendations: list[str]
    forecast: list[ForecastSlot] = []
    advisory_basis: str = "live-weather-api"
