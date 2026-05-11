from datetime import datetime

from app.core.security import hash_password

USERS = [
    {
        "id": "user-1",
        "name": "Anuja Gadekar",
        "email": "anuja@example.com",
        "password": hash_password("farmguard123"),
        "phone": "9999999999",
        "location": "Pune",
        "language": "Marathi",
    }
]

NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "Rain alert",
        "message": "Heavy rain expected in the next 6 hours. Delay irrigation.",
        "status": "unread",
        "created_at": datetime.utcnow().isoformat(),
    },
    {
        "id": "notif-2",
        "title": "Market price rise",
        "message": "Tomato mandi prices increased by 8% today.",
        "status": "read",
        "created_at": datetime.utcnow().isoformat(),
    },
]

