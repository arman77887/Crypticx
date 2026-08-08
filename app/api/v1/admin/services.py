from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.core.database import get_db
from app.core.deps import RoleChecker
from app.core.audit import log_audit_event
from app.models.user import RoleEnum, User
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter(prefix="/admin/services", tags=["Admin Service Management"])
admin_guard = RoleChecker([RoleEnum.ADMIN, RoleEnum.STAFF])

@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_in: ServiceCreate,
    request: Request,
    current_user: User = Depends(admin_guard),
    db: AsyncSession = Depends(get_db)
):
    new_service = Service(**service_in.model_dump())
    db.add(new_service)
    await db.commit()
    await db.refresh(new_service)

    await log_audit_event(db, action="SERVICE_CREATED", user_id=current_user.id, target_id=str(new_service.id), ip_address=request.client.host)
    return new_service

@router.patch("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: UUID,
    service_in: ServiceUpdate,
    request: Request,
    current_user: User = Depends(admin_guard),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Service).where(Service.id == service_id)
    service = (await db.execute(stmt)).scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    for field, value in service_in.model_dump(exclude_unset=True).items():
        setattr(service, field, value)

    await db.commit()
    await db.refresh(service)

    await log_audit_event(db, action="SERVICE_UPDATED", user_id=current_user.id, target_id=str(service.id), ip_address=request.client.host)
    return service
