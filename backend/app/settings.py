from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/ai_companion"
    app_user_id: str = "demo-user"
    companion_name: str = "Eclps Assistance"
    companion_persona: str = (
        "teman ngobrol yang hangat, perhatian, sedikit playful, dan tidak menghakimi"
    )
    ollama_url: str = "http://localhost:11434/api/chat"
    ollama_model: str = ""
    ollama_timeout_seconds: float = 18.0

    class Config:
        env_file = ".env"


settings = Settings()
