from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.models.service import Service, ServiceCategory
from app.schemas.service import ServiceResponse, ServiceCategoryResponse

router = APIRouter(prefix="/services", tags=["Services Marketplace"])

@router.get("/categories", response_model=List[ServiceCategoryResponse])
async def list_service_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceCategory))
    return result.scalars().all()

@router.get("", response_model=List[ServiceResponse])
async def list_services(
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Service).where(Service.is_active == True)
    if category_id:
        stmt = stmt.where(Service.category_id == category_id)
    if featured_only:
        stmt = stmt.where(Service.is_featured == True)
    if search:
        stmt = stmt.where(Service.name.ilike(f"%{search}%"))

    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service_by_id(service_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Service).where(Service.id == service_id, Service.is_active == True)
    service = (await db.execute(stmt)).scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found or inactive")
    return service
