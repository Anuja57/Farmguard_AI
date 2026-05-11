from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.security import get_current_user
from app.schemas.ai import AIAskRequest, AIAskResponse
from app.schemas.analytics import AnalyticsResponse
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.schemas.disease import DiseaseDetectionResponse
from app.schemas.market import MarketPriceResponse
from app.schemas.notification import NotificationItem
from app.schemas.weather import WeatherResponse
from app.services.ai_service import ask_farmguard_ai
from app.services.analytics_service import get_analytics
from app.services.auth_service import login_user, register_user
from app.services.disease_service import detect_disease
from app.services.market_service import get_market_prices
from app.services.notification_service import get_notifications
from app.services.weather_service import get_weather

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest) -> UserResponse:
    return register_user(payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    token = login_user(payload)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return token


@router.post("/ask-ai", response_model=AIAskResponse)
async def ask_ai(payload: AIAskRequest, user: dict = Depends(get_current_user)) -> AIAskResponse:
    return await ask_farmguard_ai(payload, user)


@router.post("/detect-disease", response_model=DiseaseDetectionResponse)
async def detect_disease_route(
    crop_name: str,
    description: str = Form(""),
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
) -> DiseaseDetectionResponse:
    return await detect_disease(crop_name=crop_name, description=description, file=file, user=user)


@router.get("/weather/{location}", response_model=WeatherResponse)
async def weather(location: str, user: dict = Depends(get_current_user)) -> WeatherResponse:
    return await get_weather(location, user)


@router.get("/market-prices/{crop}", response_model=MarketPriceResponse)
async def market_prices(crop: str, user: dict = Depends(get_current_user)) -> MarketPriceResponse:
    return await get_market_prices(crop, user)


@router.get("/notifications", response_model=list[NotificationItem])
def notifications(user: dict = Depends(get_current_user)) -> list[NotificationItem]:
    return get_notifications(user)


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(user: dict = Depends(get_current_user)) -> AnalyticsResponse:
    return get_analytics(user)
