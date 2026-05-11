from pydantic import BaseModel


class DiseaseDetectionResponse(BaseModel):
    crop_name: str
    disease_name: str
    confidence_score: float
    treatment_suggestions: list[str]
    prevention_tips: list[str]
    advisory_summary: str
    farmer_description: str | None = None
    image_url: str | None = None
    provider: str = "heuristic"
