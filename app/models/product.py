import uuid
import enum
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Text, Numeric, Boolean, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class ProductType(str, enum.Enum):
    WEBSITE = "WEBSITE"
    TEMPLATE = "TEMPLATE"
    DIGITAL_PRODUCT = "DIGITAL_PRODUCT"
    SERVICE = "SERVICE"
    OTHER = "OTHER"

class ProductCategory(Base):
    __tablename__ = "product_categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    products: Mapped[List["Product"]] = relationship(back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("product_categories.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    product_type: Mapped[ProductType] = mapped_column(Enum(ProductType), default=ProductType.DIGITAL_PRODUCT, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    price: Mapped[Decimal] = mapped_column(Numeric(precision=12, scale=2), nullable=False)
    sale_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(precision=12, scale=2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    
    images: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True, default=list)
    stock: Mapped[Optional[int]] = mapped_column(default=-1, nullable=False) # -1 = Infinite digital stock
    
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    
    # Secure storage file reference - Private path, NOT publicly accessible directly
    private_file_path: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category: Mapped["ProductCategory"] = relationship(back_populates="products")
  
