from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.deps import RoleChecker
from app.core.audit import log_audit_event
from app.models.user import RoleEnum, User
from app.models.order import Order
from app.schemas.order import OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/admin/orders", tags=["Admin Order Management"])
admin_guard = RoleChecker([RoleEnum.ADMIN, RoleEnum.STAFF])

@router.get("", response_model=List[OrderResponse], dependencies=[Depends(admin_guard)])
async def list_all_orders(db: AsyncSession = Depends(get_db)):
    stmt = select(Order).order_by(Order.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    status_in: OrderStatusUpdate,
    request: Request,
    current_user: User = Depends(admin_guard),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Order).where(Order.id == order_id)
    order = (await db.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if status_in.order_status:
        order.order_status = status_in.order_status
    if status_in.payment_status:
        order.payment_status = status_in.payment_status
    if status_in.internal_notes:
        order.internal_notes = status_in.internal_notes

    await db.commit()
    await db.refresh(order)

    await log_audit_event(db, action="ORDER_STATUS_UPDATED", user_id=current_user.id, target_id=str(order.id), details=f"New Status: {order.order_status}", ip_address=request.client.host)
    return order
