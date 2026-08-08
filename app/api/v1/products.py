from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.models.product import Product, ProductCategory
from app.schemas.product import ProductResponse, ProductCategoryResponse

router = APIRouter(prefix="/products", tags=["Digital Products Marketplace"])

@router.get("/categories", response_model=List[ProductCategoryResponse])
async def list_product_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProductCategory))
    return result.scalars().all()

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Product).where(Product.is_published == True)
    if category_id:
        stmt = stmt.where(Product.category_id == category_id)
    if featured_only:
        stmt = stmt.where(Product.is_featured == True)
    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))

    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product_by_id(product_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).where(Product.id == product_id, Product.is_published == True)
    product = (await db.execute(stmt)).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or unpublished")
    return product
