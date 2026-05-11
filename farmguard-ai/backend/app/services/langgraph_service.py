import importlib.util
from pathlib import Path

from app.schemas.ai import AIAskRequest, AIAskResponse


WORKFLOW_PATH = Path(__file__).resolve().parents[3] / "ai-workflows" / "farmguard_graph.py"


def _load_workflow_module():
    spec = importlib.util.spec_from_file_location("farmguard_graph", WORKFLOW_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


async def run_langgraph(payload: AIAskRequest, user: dict) -> AIAskResponse:
    module = _load_workflow_module()
    result = await module.run_farmguard_graph(payload.model_dump(), user)
    return AIAskResponse(**result)

