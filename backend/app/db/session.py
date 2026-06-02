from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Paksa reload .env terbaru
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan! Periksa file .env di folder backend.")

# 1. Perbaiki prefix (Hanya ganti postgres:// jadi postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 2. Tambahkan sslmode jika belum ada (Neon wajib SSL)
if "sslmode=require" not in DATABASE_URL:
    if "?" in DATABASE_URL:
        DATABASE_URL += "&sslmode=require"
    else:
        DATABASE_URL += "?sslmode=require"

try:
    # Buat engine. SQLAlchemy sudah otomatis menangani encoding password 
    # selama kita tidak memotong-motong stringnya secara manual.
    engine = create_engine(
        DATABASE_URL, 
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={'connect_timeout': 10}
    )
    print("✅ Engine Database Berhasil Dibuat.")
except Exception as e:
    print(f"❌ Gagal membuat engine: {e}")
    raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()