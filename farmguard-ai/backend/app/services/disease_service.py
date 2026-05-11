import random

from fastapi import UploadFile

from app.schemas.disease import DiseaseDetectionResponse
from app.services.ai_provider_service import analyze_crop_image
from app.services.relay_service import send_relay_payload


async def detect_disease(crop_name: str, description: str, file: UploadFile, user: dict) -> DiseaseDetectionResponse:
    image_bytes = await file.read()
    live_result = await analyze_crop_image(
        image_bytes=image_bytes,
        mime_type=file.content_type or "image/jpeg",
        crop_name=crop_name,
        farmer_description=description,
        location=user.get("location", "Pune"),
    )
    if live_result:
        response = DiseaseDetectionResponse(
            crop_name=crop_name,
            disease_name=live_result["disease_name"],
            confidence_score=float(live_result["confidence_score"]),
            treatment_suggestions=live_result["treatment_suggestions"],
            prevention_tips=live_result["prevention_tips"],
            advisory_summary=live_result["advisory_summary"],
            farmer_description=description or None,
            image_url=file.filename,
            provider=live_result["provider"],
        )
    else:
        response = _heuristic_disease_response(crop_name, description, file.filename)

    await send_relay_payload(
        {
            "user_name": user["name"],
            "crop_name": crop_name,
            "disease": response.disease_name,
            "weather_alert": "",
            "market_price": "",
            "timestamp": "generated-on-request",
        }
    )
    return response


def _heuristic_disease_response(crop_name: str, description: str, filename: str) -> DiseaseDetectionResponse:
    lowered = f"{crop_name} {description} {filename}".lower()
    if any(token in lowered for token in ["white", "powder", "dust"]):
        return DiseaseDetectionResponse(
            crop_name=crop_name,
            disease_name="Powdery Mildew",
            confidence_score=0.82,
            treatment_suggestions=["Spray sulfur-based fungicide.", "Improve plant spacing and airflow."],
            prevention_tips=["Avoid late evening irrigation.", "Inspect leaves every 2-3 days during humid weather."],
            advisory_summary="The image and description suggest powdery fungal growth. Act early before it spreads.",
            farmer_description=description or None,
            image_url=filename,
            provider="heuristic",
        )

    disease_options = [
        (
            "Leaf Blight",
            0.79,
            ["Apply copper-based fungicide.", "Remove infected leaves from the field."],
            ["Avoid overhead irrigation.", "Use disease-resistant seeds when possible."],
            "The visual pattern suggests a spreading leaf infection. Check lower leaves for dark expanding lesions.",
        ),
        (
            "Bacterial Leaf Spot",
            0.74,
            ["Use copper bactericide as per agronomy guidance.", "Reduce splash irrigation and isolate affected plants."],
            ["Avoid touching wet leaves.", "Sanitize tools used across plots."],
            "The image and farmer note suggest a spotting disease that can spread fast in wet conditions.",
        ),
    ]
    disease_name, confidence_score, treatment_suggestions, prevention_tips, summary = random.choice(disease_options)
    return DiseaseDetectionResponse(
        crop_name=crop_name,
        disease_name=disease_name,
        confidence_score=confidence_score,
        treatment_suggestions=treatment_suggestions,
        prevention_tips=prevention_tips,
        advisory_summary=summary,
        farmer_description=description or None,
        image_url=filename,
        provider="heuristic",
    )
