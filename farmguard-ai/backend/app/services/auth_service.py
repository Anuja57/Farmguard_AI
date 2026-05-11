import uuid

from app.core.security import create_access_token, hash_password, verify_password
from app.db.mock_store import USERS
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


def register_user(payload: RegisterRequest) -> UserResponse:
    user = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "phone": payload.phone,
        "location": payload.location,
        "language": payload.language,
    }
    USERS.append(user)
    return UserResponse(**{k: v for k, v in user.items() if k != "password"})


def login_user(payload: LoginRequest) -> TokenResponse | None:
    user = next((item for item in USERS if item["email"] == payload.email), None)
    if not user or not verify_password(payload.password, user["password"]):
        return None

    token = create_access_token(
        {
            "sub": user["email"],
            "user_id": user["id"],
            "name": user["name"],
            "location": user["location"],
        }
    )
    public_user = UserResponse(**{k: v for k, v in user.items() if k != "password"})
    return TokenResponse(access_token=token, user=public_user)

