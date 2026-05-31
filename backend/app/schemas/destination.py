from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DestinationBase(BaseModel):
    name: str
    category: str
    description: str
    location: str
    rating: float = 0.0
    price_range: str = "sedang"
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    opening_hours: Optional[str] = None
    contact: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(DestinationBase):
    pass

class DestinationInDB(DestinationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class Destination(DestinationInDB):
    pass