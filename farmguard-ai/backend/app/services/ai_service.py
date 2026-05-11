from app.schemas.ai import AIAskRequest, AIAskResponse
from app.services.ai_provider_service import answer_farming_query
from app.services.langgraph_service import run_langgraph


async def ask_farmguard_ai(payload: AIAskRequest, user: dict) -> AIAskResponse:
    live_answer = await answer_farming_query(
        query=payload.query,
        location=payload.location or user.get("location", "Pune"),
        language=payload.language,
        crop_name=payload.crop_name,
    )
    fallback = await run_langgraph(payload, user)
    if live_answer:
        return AIAskResponse(
            route=fallback.route,
            answer=live_answer["answer"],
            actions=fallback.actions,
            metadata={**fallback.metadata, "mode": "live-llm"},
            provider=live_answer["provider"],
        )
    fallback.provider = "farmguard-graph"
    return fallback
