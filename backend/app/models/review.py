from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    user_name = Column(String(100), default="Wisatawan Anonim")
    comment = Column(Text, nullable=False)
    
    # Skor murni dari user (1-5)
    rating = Column(Integer)
    
    # Skor hasil olahan AI (-1.0 sangat negatif s/d 1.0 sangat positif)
    sentiment_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())