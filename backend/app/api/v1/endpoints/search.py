import logging
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any

from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db, engine, Base, SessionLocal
from app.models.destination import Destination
from app.ai.search import search_service

# --- CONFIGURATION & LOGGING ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Pastikan tabel database tercipta saat modul dimuat
Base.metadata.create_all(bind=engine)

def get_project_root() -> Path:
    """Mendapatkan root direktori proyek (cultour/) secara dinamis"""
    # File ini: backend/app/api/v1/endpoints/search.py
    # Naik 5 tingkat untuk sampai ke root
    return Path(__file__).resolve().parents[5]

def sync_csv_to_db(db: Session):
    """Migrasi data dari CSV ke PostgreSQL jika database masih kosong"""
    try:
        if db.query(Destination).count() > 0:
            return

        logger.info("⚠️ Database kosong. Memulai migrasi data dari dataset CSV...")
        
        root = get_project_root()
        dataset_dir = root / "dataset"
        
        files = {
            "destinations.csv": "Wisata", 
            "culinary.csv": "Kuliner", 
            "cultures.csv": "Budaya", 
            "events.csv": "Event"
        }

        total_migrated = 0
        for file_name, category in files.items():
            file_path = dataset_dir / file_name
            
            if not file_path.exists():
                logger.warning(f"⚠️ File tidak ditemukan: {file_path}")
                continue

            # Membaca CSV dengan penanganan teks yang lebih modern
            df = pd.read_csv(file_path, encoding='utf-8', quotechar='"', skipinitialspace=True)
            df = df.fillna({
                'name': 'Unknown',
                'location': 'Toba',
                'description': '',
                'rating': 0.0
            })

            for _, row in df.iterrows():
                try:
                    # Normalisasi data sebelum simpan
                    new_item = Destination(
                        name=str(row['name']).strip()[:255],
                        category=category,
                        location=str(row['location']).strip()[:100],
                        description=str(row.get('description', row.get('desctiption', ''))).strip(),
                        rating=float(row['rating'])
                    )
                    db.add(new_item)
                    total_migrated += 1
                except Exception as row_err:
                    logger.error(f"❌ Error pada baris {file_name}: {row_err}")

            db.commit()
            logger.info(f"✅ Berhasil migrasi: {file_name}")

        logger.info(f"🏁 Total {total_migrated} data berhasil dipindahkan ke Cloud Database.")

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Gagal total saat sinkronisasi database: {e}")

@router.on_event("startup")
async def startup_event():
    """Inisialisasi sistem AI dan Database saat server mulai"""
    db = SessionLocal()
    try:
        # 1. Sinkronisasi Data
        sync_csv_to_db(db)
        
        # 2. Persiapan Data untuk AI (Semantic Search)
        records = db.query(Destination).all()
        
        # Mapping objek SQLAlchemy ke dictionary yang bersih
        data_for_ai = [
            {
                "id": r.id,
                "name": r.name,
                "category": r.category,
                "location": r.location,
                "description": r.description,
                "rating": r.rating
            } for r in records
        ]
        
        # 3. Inisialisasi FAISS Index
        if data_for_ai:
            search_service.initialize_with_destinations(data_for_ai)
            logger.info(f"🚀 AI Search Service Ready | {len(data_for_ai)} Items Indexed")
        else:
            logger.error("❌ Gagal Inisialisasi AI: Tidak ada data ditemukan di Database.")
            
    except Exception as e:
        logger.error(f"❌ Kesalahan Startup: {e}")
    finally:
        db.close()

@router.get("/search")
async def semantic_search(
    q: str = Query(..., min_length=1, description="Kueri pencarian dalam bahasa alami"), 
    limit: int = Query(6, ge=1, le=20)
):
    """
    🔍 AI Semantic Search
    Mencari destinasi wisata berdasarkan konteks makna menggunakan Sentence Transformers & FAISS.
    """
    if not search_service.is_ready:
        raise HTTPException(
            status_code=503, 
            detail="AI Service sedang dalam proses inisialisasi. Silakan tunggu."
        )
    
    results = await search_service.search(q, limit)
    
    return {
        "status": "success",
        "query": q,
        "results": results,
        "metadata": {
            "total": len(results),
            "engine": "Sentence-Transformers",
            "model": "multilingual-e5-small"
        }
    }

@router.get("/status")
async def get_service_status():
    """Mengecek kesehatan sistem AI dan Database"""
    return {
        "ai_service": search_service.get_status(),
        "database": "Connected" if engine else "Disconnected"
    }