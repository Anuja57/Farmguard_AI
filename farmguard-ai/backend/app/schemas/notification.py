from pydantic import BaseModel


class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    status: str
    created_at: str

