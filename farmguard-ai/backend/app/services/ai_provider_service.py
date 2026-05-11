import base64
import json
from typing import Any

import httpx

from app.core.config import settings


async def answer_farming_query(query: str, location: str, language: str, crop_name: str | None = None) -> dict[str, Any] | None:
    if settings.openai_api_key:
        return await _openai_text_answer(query, location, language, crop_name)
    if settings.groq_api_key:
        return await _groq_text_answer(query, location, language, crop_name)
    return None


async def analyze_crop_image(
    image_bytes: bytes,
    mime_type: str,
    crop_name: str,
    farmer_description: str,
    location: str,
) -> dict[str, Any] | None:
    if settings.openai_api_key:
        return await _openai_vision_answer(image_bytes, mime_type, crop_name, farmer_description, location)
    return None


async def _openai_text_answer(query: str, location: str, language: str, crop_name: str | None) -> dict[str, Any]:
    prompt = (
        "You are FarmGuard AI, a practical agricultural assistant for Indian farmers. "
        "Answer clearly, safely, and with field-ready steps. "
        f"Respond in {language}. Farmer location: {location}. Crop: {crop_name or 'not specified'}."
    )
    payload = {
        "model": settings.openai_model,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query},
        ],
        "temperature": 0.3,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
    return {"answer": data["choices"][0]["message"]["content"], "provider": f"openai:{settings.openai_model}"}


async def _groq_text_answer(query: str, location: str, language: str, crop_name: str | None) -> dict[str, Any]:
    prompt = (
        "You are FarmGuard AI, a practical agricultural assistant for Indian farmers. "
        "Answer clearly, safely, and with field-ready steps. "
        f"Respond in {language}. Farmer location: {location}. Crop: {crop_name or 'not specified'}."
    )
    payload = {
        "model": settings.groq_model,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query},
        ],
        "temperature": 0.3,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
    return {"answer": data["choices"][0]["message"]["content"], "provider": f"groq:{settings.groq_model}"}


async def _openai_vision_answer(
    image_bytes: bytes,
    mime_type: str,
    crop_name: str,
    farmer_description: str,
    location: str,
) -> dict[str, Any]:
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = (
        "Analyze this crop disease image and return JSON with keys: "
        "disease_name, confidence_score, treatment_suggestions, prevention_tips, advisory_summary. "
        f"Crop: {crop_name}. Farmer location: {location}. Farmer description: {farmer_description or 'None provided'}."
    )
    payload = {
        "model": settings.openai_model,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{image_base64}"}},
                ],
            }
        ],
        "temperature": 0.2,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
    parsed = json.loads(data["choices"][0]["message"]["content"])
    parsed["provider"] = f"openai:{settings.openai_model}"
    return parsed
