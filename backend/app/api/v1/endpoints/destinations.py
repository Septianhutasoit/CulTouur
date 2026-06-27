from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.destination import Destination
from typing import List

router = APIRouter()

@router.get("/")
async def get_all_destination(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    category: str = None
):
    query = db.query(Destination)
    if category:
        query = query.filter(Destination.category == category)

    results = query.limit(limit).all()
    return results

@router.get("/{id}")
async def get_destination_detail(id: int, db: Session = Depends(get_db)):
    result = db.query(Destination).filter(Destination.id == id).first()
    return result
