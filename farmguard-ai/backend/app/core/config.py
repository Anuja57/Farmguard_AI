from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FarmGuard AI"
    app_env: str = "development"
    app_secret_key: str = "change-me"
    access_token_expire_minutes: int = 60
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    openweathermap_api_key: str = ""
    data_gov_api_key: str = ""
    data_gov_resource_id: str = ""
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_role_key: str = ""
    relay_webhook_url: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
