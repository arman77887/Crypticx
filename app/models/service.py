import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Text, Numeric, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    services: Mapped[List["Service"]] = relationship(back_populates="category", cascade="all, delete-orphan")

class Service(Base):
    __tablename__ = "services"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("service_categories.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    short_description: Mapped[str] = mapped_column(String(500), nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    
    price: Mapped[Decimal] = mapped_column(Numeric(precision=12, scale=2), nullable=False)
    sale_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(precision=12, scale=2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    gallery: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True, default=list)
    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    delivery_time_days: Mapped[int] = mapped_column(default=1, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category: Mapped["ServiceCategory"] = relationship(back_populates="services")
