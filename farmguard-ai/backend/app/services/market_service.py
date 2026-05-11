from datetime import datetime

import httpx

from app.core.config import settings
from app.schemas.market import MarketPriceItem, MarketPriceResponse


async def get_market_prices(crop: str, user: dict) -> MarketPriceResponse:
    if settings.data_gov_api_key and settings.data_gov_resource_id:
        live_response = await _fetch_live_market_prices(crop)
        if live_response:
            return live_response

    prices = [
        MarketPriceItem(market="Pune Mandi", price=2450, trend="up"),
        MarketPriceItem(market="Nashik Mandi", price=2380, trend="steady"),
        MarketPriceItem(market="Satara Mandi", price=2520, trend="up"),
    ]
    summary = f"{crop.title()} prices are improving across nearby mandis with the best rate in Satara."
    return MarketPriceResponse(crop_name=crop.title(), prices=prices, summary=summary)


async def _fetch_live_market_prices(crop: str) -> MarketPriceResponse | None:
    params = {
        "api-key": settings.data_gov_api_key,
        "format": "json",
        "limit": 20,
        "filters[commodity]": crop.title(),
        "filters[state]": "Maharashtra",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            f"https://api.data.gov.in/resource/{settings.data_gov_resource_id}",
            params=params,
        )
        response.raise_for_status()
        data = response.json()

    records = data.get("records", [])
    if not records:
        return None

    preferred_markets = {"phaltan", "satara", "pune"}
    filtered = []
    for record in records:
        market_name = (record.get("market") or "").lower()
        district_name = (record.get("district") or "").lower()
        if market_name in preferred_markets or district_name in preferred_markets:
            filtered.append(record)

    usable_records = filtered or records[:5]
    prices = []
    for record in usable_records[:5]:
        modal_price = float(record.get("modal_price") or record.get("max_price") or 0)
        arrival_date = record.get("arrival_date") or datetime.utcnow().strftime("%d/%m/%Y")
        prices.append(
            MarketPriceItem(
                market=f"{record.get('market', 'Market')} ({arrival_date})",
                price=modal_price,
                trend="live",
            )
        )

    best = max(prices, key=lambda item: item.price)
    summary = f"Live mandi data for {crop.title()} shows the highest observed rate in {best.market}."
    return MarketPriceResponse(crop_name=crop.title(), prices=prices, summary=summary)
