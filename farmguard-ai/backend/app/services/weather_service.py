import httpx

from app.core.config import settings
from app.schemas.weather import ForecastSlot, WeatherResponse
from app.services.relay_service import send_relay_payload

REGION_COORDINATES = {
    "phaltan": {"display": "Phaltan, Satara", "lat": 17.9867, "lon": 74.4311},
    "satara": {"display": "Satara", "lat": 17.6805, "lon": 74.0183},
    "pune": {"display": "Pune", "lat": 18.5204, "lon": 73.8567},
}


async def get_weather(location: str, user: dict) -> WeatherResponse:
    if settings.openweathermap_api_key:
        weather = await _live_weather(location)
    else:
        weather = WeatherResponse(
            location=location,
            temperature=28.5,
            humidity=76,
            rainfall_probability=68,
            condition="Cloudy",
            recommendations=_recommend(68),
            forecast=[
                ForecastSlot(label="Next 3h", temperature=28.5, rainfall_probability=68, condition="Cloudy"),
                ForecastSlot(label="Next 6h", temperature=26.9, rainfall_probability=72, condition="Rain"),
                ForecastSlot(label="Tomorrow AM", temperature=27.3, rainfall_probability=54, condition="Clouds"),
            ],
            advisory_basis="demo-fallback",
        )

    if weather.rainfall_probability > 60:
        await send_relay_payload(
            {
                "user_name": user["name"],
                "crop_name": "",
                "disease": "",
                "weather_alert": f"Rain likely in {location}",
                "market_price": "",
                "timestamp": "generated-on-request",
            }
        )
    return weather


async def _live_weather(location: str) -> WeatherResponse:
    coords = _resolve_region(location)
    async with httpx.AsyncClient(timeout=15) as client:
        if coords:
            lat = coords["lat"]
            lon = coords["lon"]
            display_name = coords["display"]
        else:
            geocode = await client.get(
                "https://api.openweathermap.org/geo/1.0/direct",
                params={"q": location, "limit": 1, "appid": settings.openweathermap_api_key},
            )
            geocode.raise_for_status()
            geo_data = geocode.json()
            if not geo_data:
                raise ValueError(f"Location not found: {location}")
            lat = geo_data[0]["lat"]
            lon = geo_data[0]["lon"]
            display_name = geo_data[0]["name"]

        current_response = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": settings.openweathermap_api_key, "units": "metric"},
        )
        forecast_response = await client.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={"lat": lat, "lon": lon, "appid": settings.openweathermap_api_key, "units": "metric", "cnt": 8},
        )
        current_response.raise_for_status()
        forecast_response.raise_for_status()
        current = current_response.json()
        forecast = forecast_response.json()

    forecast_slots = []
    rain_candidates = []
    for item in forecast.get("list", [])[:3]:
        rain_probability = int(round((item.get("pop") or 0) * 100))
        rain_candidates.append(rain_probability)
        forecast_slots.append(
            ForecastSlot(
                label=item["dt_txt"].split(" ")[1][:5],
                temperature=item["main"]["temp"],
                rainfall_probability=rain_probability,
                condition=item["weather"][0]["main"],
            )
        )
    rainfall_probability = max(rain_candidates or [25])
    return WeatherResponse(
        location=display_name,
        temperature=current["main"]["temp"],
        humidity=current["main"]["humidity"],
        rainfall_probability=rainfall_probability,
        condition=current["weather"][0]["main"],
        recommendations=_recommend(rainfall_probability),
        forecast=forecast_slots,
        advisory_basis="openweathermap-live",
    )


def _resolve_region(location: str) -> dict | None:
    return REGION_COORDINATES.get(location.strip().lower())


def _recommend(rainfall_probability: int) -> list[str]:
    if rainfall_probability > 60:
        return [
            "Pause irrigation for the next 12 hours.",
            "Check drainage channels in low-lying plots.",
            "Delay pesticide spraying until weather stabilizes.",
        ]
    return [
        "Proceed with moderate irrigation.",
        "Mulch exposed soil to conserve moisture.",
        "Monitor humidity-sensitive crops closely.",
    ]
