from pydantic import BaseModel


class MarketPriceItem(BaseModel):
    market: str
    price: float
    trend: str


class MarketPriceResponse(BaseModel):
    crop_name: str
    prices: list[MarketPriceItem]
    summary: str

