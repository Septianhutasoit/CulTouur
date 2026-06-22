from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import search, vision # Tambahkan admin nanti
from app.ai.vision import vision_manager 
from app.models import destination, review
app = FastAPI(
    title="VISTARA Intelligence API",
    description="Tourism AI for Danau Toba",
    version="2.0.0" # Versi 2 untuk Hackathon
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"app": "VISTARA AI", "status": "Intelligence System Online"}

# Rute Search v2 (Semantic + Sentiment)
app.include_router(search.router, prefix="/api/v1", tags=["Intelligence Search"])

@app.on_event("startup")
async def startup_event():
    # Load dataset visual
    vision_manager.train_samples()
    print("🚀 Vistara Lens Intelligence Active")

app.include_router(vision.router, prefix="/api/v1/vision", tags=["Visual Discovery"])