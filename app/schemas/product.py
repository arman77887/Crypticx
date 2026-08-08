from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from app.models.product import ProductType

class ProductCategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    name: str
    slug: str
    product_type: ProductType
    description: str
    price: Decimal
    sale_price: Optional[Decimal] = None
    currency: str = "USD"
    images: Optional[List[str]] = []
    stock: int = -1
    is_featured: bool = False
    is_published: bool = True

class ProductCreate(ProductBase):
    category_id: UUID

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None

class ProductResponse(ProductBase):
    id: UUID
    category_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
