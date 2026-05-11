from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class GraphState(TypedDict, total=False):
    query: str
    crop_name: str
    location: str
    language: str
    route: str
    answer: str
    actions: list[str]
    metadata: dict


def router_node(state: GraphState) -> GraphState:
    query = state["query"].lower()
    if any(word in query for word in ["disease", "leaf", "spot", "fungus", "infection"]):
        route = "disease"
    elif any(word in query for word in ["weather", "rain", "temperature", "humidity"]):
        route = "weather"
    elif any(word in query for word in ["water", "irrigation", "drip", "watering"]):
        route = "irrigation"
    elif any(word in query for word in ["price", "market", "mandi", "sell"]):
        route = "market"
    elif any(word in query for word in ["alert", "reminder", "notification"]):
        route = "notification"
    else:
        route = "advisory"
    return {**state, "route": route}


def disease_agent(state: GraphState) -> GraphState:
    crop = state.get("crop_name") or "crop"
    return {
        **state,
        "answer": f"The symptoms suggest early fungal stress in your {crop}. Capture a clear leaf image and start preventive fungicide spray if spotting spreads.",
        "actions": ["Upload a crop image", "Inspect lower leaf surface", "Isolate infected section"],
        "metadata": {"severity": "moderate", "category": "disease"},
    }


def weather_agent(state: GraphState) -> GraphState:
    location = state.get("location") or "your area"
    return {
        **state,
        "answer": f"For {location}, expect humid conditions with a chance of rain. Reduce irrigation and avoid spraying before rainfall.",
        "actions": ["Pause irrigation", "Check field drainage", "Monitor rain window"],
        "metadata": {"priority": "high", "category": "weather"},
    }


def irrigation_agent(state: GraphState) -> GraphState:
    return {
        **state,
        "answer": "Use short morning irrigation cycles and avoid flooding. Moisture-retentive mulching will reduce water waste.",
        "actions": ["Water at sunrise", "Mulch soil", "Review drip line pressure"],
        "metadata": {"priority": "medium", "category": "irrigation"},
    }


def market_agent(state: GraphState) -> GraphState:
    crop = state.get("crop_name") or "produce"
    return {
        **state,
        "answer": f"{crop.title()} prices are trending upward in nearby mandis. Consider staggered selling to average a better return.",
        "actions": ["Check Pune Mandi", "Set price alert", "Compare transport cost"],
        "metadata": {"priority": "medium", "category": "market"},
    }


def advisory_agent(state: GraphState) -> GraphState:
    return {
        **state,
        "answer": "Focus on soil moisture balance, disease scouting, and weather-aware spraying this week for more resilient crop growth.",
        "actions": ["Create weekly farm checklist", "Track crop stress", "Enable alerts"],
        "metadata": {"priority": "medium", "category": "advisory"},
    }


def notification_agent(state: GraphState) -> GraphState:
    return {
        **state,
        "answer": "Notification automation can send rain warnings, disease follow-ups, and mandi price alerts over WhatsApp or SMS.",
        "actions": ["Enable rain alert", "Enable treatment reminder", "Enable market alert"],
        "metadata": {"priority": "low", "category": "notification"},
    }


def aggregate_response(state: GraphState) -> dict:
    return {
        "route": state["route"],
        "answer": state["answer"],
        "actions": state["actions"],
        "metadata": state["metadata"],
    }


def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("router", router_node)
    graph.add_node("disease", disease_agent)
    graph.add_node("weather", weather_agent)
    graph.add_node("irrigation", irrigation_agent)
    graph.add_node("market", market_agent)
    graph.add_node("advisory", advisory_agent)
    graph.add_node("notification", notification_agent)

    graph.add_edge(START, "router")
    graph.add_conditional_edges(
        "router",
        lambda state: state["route"],
        {
            "disease": "disease",
            "weather": "weather",
            "irrigation": "irrigation",
            "market": "market",
            "advisory": "advisory",
            "notification": "notification",
        },
    )
    graph.add_edge("disease", END)
    graph.add_edge("weather", END)
    graph.add_edge("irrigation", END)
    graph.add_edge("market", END)
    graph.add_edge("advisory", END)
    graph.add_edge("notification", END)
    return graph.compile()


async def run_farmguard_graph(payload: dict, user: dict) -> dict:
    state: GraphState = {
        "query": payload["query"],
        "crop_name": payload.get("crop_name") or "",
        "location": payload.get("location") or user.get("location", ""),
        "language": payload.get("language", "English"),
    }
    app = build_graph()
    state = app.invoke(state)
    return aggregate_response(state)
