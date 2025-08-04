import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # FastAPI Configuration
    FASTAPI_ENV: str = "development"
    DEBUG: bool = True
    TITLE: str = "Portfolio AI Assistant API"
    DESCRIPTION: str = "AI Assistant API for Huynh Duc Anh Portfolio"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 150
    OPENAI_TEMPERATURE: float = 0.7
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./ai_assistant.db"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Vector Database Configuration
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5000"]
    
    # Rate Limiting
    RATE_LIMIT_CALLS: int = 100
    RATE_LIMIT_PERIOD: int = 3600
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/ai_service.log"
    
    # Security
    SECRET_KEY: str = "your_secret_key_here_change_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File Upload
    MAX_FILE_SIZE: int = 10485760  # 10MB
    UPLOAD_DIR: str = "./uploads"
    
    # AI Assistant Configuration
    MAX_CONVERSATION_HISTORY: int = 10
    DEFAULT_CONTEXT: str = "portfolio"
    RESPONSE_TIMEOUT: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()
