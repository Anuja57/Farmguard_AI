from pydantic import BaseModel


class TrendPoint(BaseModel):
    name: str
    value: float


class AnalyticsSource(BaseModel):
    name: str
    description: str
    freshness: str


class AnalyticsResponse(BaseModel):
    disease_trends: list[TrendPoint]
    weather_patterns: list[TrendPoint]
    price_trends: list[TrendPoint]
    farmer_activity: list[TrendPoint]
    alert_statistics: list[TrendPoint]
    sources: list[AnalyticsSource]
    refreshed_at: str
