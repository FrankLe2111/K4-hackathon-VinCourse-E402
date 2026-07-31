from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


API_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
ROOT_ENV_FILE = Path(__file__).resolve().parents[5] / ".env"
load_dotenv(ROOT_ENV_FILE)
load_dotenv(API_ENV_FILE, override=True)


class Settings(BaseSettings):
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o", alias="OPENAI_MODEL")
    coursequest_demo_mode: bool = Field(default=True, alias="COURSEQUEST_DEMO_MODE")
    frontend_origin: str = Field(default="http://127.0.0.1:5173", alias="FRONTEND_ORIGIN")
    frontend_origins: str = Field(
        default="http://127.0.0.1:5173,http://localhost:5173",
        alias="FRONTEND_ORIGINS",
    )

    model_config = SettingsConfigDict(populate_by_name=True)

    @property
    def cors_origins(self) -> list[str]:
        origins = [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
        if self.frontend_origin not in origins:
            origins.append(self.frontend_origin)
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
