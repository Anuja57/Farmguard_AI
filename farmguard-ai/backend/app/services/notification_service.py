from app.db.mock_store import NOTIFICATIONS
from app.schemas.notification import NotificationItem


def get_notifications(user: dict) -> list[NotificationItem]:
    return [NotificationItem(**item) for item in NOTIFICATIONS]

