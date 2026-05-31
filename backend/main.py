from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import torch
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from pydantic import BaseModel
from datetime import datetime
import os

# Inisialisasi FastAPI
app = FastAPI(
    title="CulTour API - Danau Toba",
    description="Sistem Rekomendasi Wisata Danau Toba dengan Semantic Search",
    version="1.0.0"
)

# CORS middleware (untuk frontend nanti)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model untuk destinasi
class Destination(BaseModel):
    id: int
    name: str
    category: str  # wisata_alam, budaya, kuliner, event
    description: str
    location: str
    rating: float
    price_range: str  # murah, sedang, mahal
    latitude: float
    longitude: float
    image_url: Optional[str] = None

# Inisialisasi model AI (akan di-load saat startup)
model = None
index = None
destinations_data = []

@app.on_event("startup")
async def load_model():
    global model, index, destinations_data
    
    print("Loading Sentence Transformer model...")
    # Gunakan model multilingual untuk support Bahasa Indonesia
    model = SentenceTransformer('intfloat/multilingual-e5-small')
    print("Model loaded successfully!")
    
    # Load dummy data untuk testing (nanti diganti dengan DB)
    load_dummy_data()

def load_dummy_data():
    global destinations_data
    # Data dummy destinasi Danau Toba
    destinations_data = [
        Destination(
            id=1,
            name="Bukit Holbung Samosir",
            category="wisata_alam",
            description="Bukit dengan pemandangan indah Danau Toba dan Pulau Samosir",
            location="Samosir",
            rating=4.8,
            price_range="murah",
            latitude=2.5,
            longitude=98.7
        ),
        Destination(
            id=2,
            name="Air Terjun Efrata",
            category="wisata_alam",
            description="Air terjun cantik dengan kolam renang alami",
            location="Toba",
            rating=4.6,
            price_range="murah",
            latitude=2.3,
            longitude=98.9
        ),
        Destination(
            id=3,
            name="Museum Batak Tomok",
            category="budaya",
            description="Museum sejarah dan budaya Batak di Pulau Samosir",
            location="Samosir",
            rating=4.5,
            price_range="murah",
            latitude=2.4,
            longitude=98.8
        ),
        Destination(
            id=4,
            name="Restoran Ni Marnis",
            category="kuliner",
            description="Ikan bakar khas Danau Toba dengan sambal andaliman",
            location="Balige",
            rating=4.7,
            price_range="sedang",
            latitude=2.3,
            longitude=99.0
        ),
        Destination(
            id=5,
            name="Pesta Danau Toba",
            category="event",
            description="Festival tahunan budaya Batak di tepi Danau Toba",
            location="Parapat",
            rating=4.9,
            price_range="sedang",
            latitude=2.6,
            longitude=98.8
        )
    ]

# Endpoint dasar
@app.get("/")
async def root():
    return {
        "message": "CulTour API is running",
        "status": "active",
        "model_loaded": model is not None
    }

# Endpoint kesehatan
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "pytorch_version": torch.__version__,
        "model_loaded": model is not None
    }

# Endpoint semua destinasi
@app.get("/destinations", response_model=List[Destination])
async def get_all_destinations():
    return destinations_data

# Endpoint destinasi by ID
@app.get("/destinations/{destination_id}")
async def get_destination(destination_id: int):
    dest = next((d for d in destinations_data if d.id == destination_id), None)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

# Endpoint semantic search
@app.get("/search")
async def semantic_search(q: str = Query(..., min_length=1), limit: int = 10):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    # Encode query
    query_embedding = model.encode([q])
    
    # Hitung similarity dengan semua destinasi
    results = []
    for dest in destinations_data:
        # Encode deskripsi destinasi
        dest_text = f"{dest.name} {dest.description} {dest.category} {dest.location}"
        dest_embedding = model.encode([dest_text])
        
        # Hitung cosine similarity
        similarity = np.dot(query_embedding[0], dest_embedding[0]) / (
            np.linalg.norm(query_embedding[0]) * np.linalg.norm(dest_embedding[0])
        )
        
        results.append({
            "destination": dest,
            "score": float(similarity)
        })
    
    # Sort by score
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return results[:limit]

# Endpoint rekomendasi by kategori
@app.get("/recommendations/{category}")
async def get_recommendations(category: str, limit: int = 5):
    filtered = [d for d in destinations_data if d.category == category]
    
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No destinations in category {category}")
    
    # Sort by rating
    filtered.sort(key=lambda x: x.rating, reverse=True)
    
    return filtered[:limit]

# Endpoint untuk test embedding
@app.get("/test-embedding")
async def test_embedding(text: str = "Danau Toba wisata alam"):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    embedding = model.encode([text])
    return {
        "text": text,
        "embedding_shape": embedding.shape,
        "embedding_sample": embedding[0][:5].tolist()  # 5 nilai pertama
    }