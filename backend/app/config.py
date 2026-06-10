from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    ga_api_base: str = "https://api.gatcg.com"
    ga_image_base: str = "https://api.gatcg.com"
    cors_origins: list[str] = ["http://localhost:3000"]
    request_timeout_seconds: float = 10.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
