from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

class ServiceCategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ServiceBase(BaseModel):
    name: str
    slug: str
    short_description: str
    full_description: str
    price: Decimal
    sale_price: Optional[Decimal] = None
    currency: str = "USD"
    is_featured: bool = False
    is_active: bool = True
    thumbnail_url: Optional[str] = None
    gallery: Optional[List[str]] = []
    requirements: Optional[str] = None
    delivery_time_days: int = 1

class ServiceCreate(ServiceBase):
    category_id: UUID

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ServiceResponse(ServiceBase):
    id: UUID
    category_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
