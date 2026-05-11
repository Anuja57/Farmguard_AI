import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_relay_payload(payload: dict) -> None:
    if not settings.relay_webhook_url:
        logger.info("Relay webhook not configured. Payload prepared: %s", payload)
        return
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            await client.post(settings.relay_webhook_url, json=payload)
        except Exception as exc:
            logger.warning("Relay webhook failed: %s", exc)

