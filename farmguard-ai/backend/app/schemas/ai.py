from pydantic import BaseModel


class AIAskRequest(BaseModel):
    query: str
    crop_name: str | None = None
    location: str | None = None
    language: str = "English"
    conversation_history: list[dict] = []


class AIAskResponse(BaseModel):
    route: str
    answer: str
    actions: list[str]
    metadata: dict
    provider: str = "farmguard-graph"
