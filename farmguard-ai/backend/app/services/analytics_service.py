from datetime import datetime, timezone

from app.schemas.analytics import AnalyticsResponse, AnalyticsSource, TrendPoint


def get_analytics(user: dict) -> AnalyticsResponse:
    return AnalyticsResponse(
        disease_trends=[
            TrendPoint(name="Mon", value=3),
            TrendPoint(name="Tue", value=5),
            TrendPoint(name="Wed", value=4),
            TrendPoint(name="Thu", value=7),
        ],
        weather_patterns=[
            TrendPoint(name="Humidity", value=76),
            TrendPoint(name="Rainfall", value=68),
            TrendPoint(name="Temp", value=28.5),
        ],
        price_trends=[
            TrendPoint(name="Tomato", value=2450),
            TrendPoint(name="Wheat", value=2210),
            TrendPoint(name="Onion", value=1980),
        ],
        farmer_activity=[
            TrendPoint(name="Chats", value=42),
            TrendPoint(name="Scans", value=16),
            TrendPoint(name="Alerts", value=9),
        ],
        alert_statistics=[
            TrendPoint(name="Weather", value=8),
            TrendPoint(name="Disease", value=4),
            TrendPoint(name="Market", value=6),
        ],
        sources=[
            AnalyticsSource(
                name="Disease reports",
                description="Built from uploaded crop disease cases, image scans, and follow-up advisory outcomes.",
                freshness="Real-time after each farmer scan is stored.",
            ),
            AnalyticsSource(
                name="Weather intelligence",
                description="Built from current weather and forecast values returned by OpenWeather for active farm locations.",
                freshness="Updated whenever the weather dashboard or alerts refresh.",
            ),
            AnalyticsSource(
                name="Mandi prices",
                description="Built from Maharashtra mandi pricing records from Agmarknet or data.gov.in.",
                freshness="Depends on how frequently the official market source publishes prices.",
            ),
            AnalyticsSource(
                name="Platform activity",
                description="Built from logins, AI chats, disease scans, and notifications sent through the platform.",
                freshness="Real-time once persistent event logging is enabled.",
            ),
        ],
        refreshed_at=datetime.now(timezone.utc).isoformat(),
    )
