from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "AI Security Agents"

    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3.5:4b"
    ollama_timeout: int = 60

    # Database
    database_url: str = "postgresql://user:pass@localhost:5432/security"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Security
    rate_limit_per_minute: int = 60
    threat_threshold: float = 0.7

    class Config:
        env_file = ".env"
