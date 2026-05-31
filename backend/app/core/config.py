import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/cultour_db")
    
    # AI Model
    MODEL_NAME: str = os.getenv("MODEL_NAME", "intfloat/multilingual-e5-small")
    
    # FAISS
    FAISS_INDEX_PATH: str = os.getenv("FAISS_INDEX_PATH", "faiss_index.bin")
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "CulTour API"
    VERSION: str = "1.0.0"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

settings = Settings()