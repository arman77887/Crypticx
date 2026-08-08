from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from decimal import Decimal

from app.core.database import get_db
from app.core.deps import RoleChecker
from app.models.user import RoleEnum, User
from app.models.service import Service
from app.models.product import Product
from app.models.order import Order, OrderStatus, PaymentStatus
from app.schemas.admin import AdminDashboardMetrics

router = APIRouter(prefix="/admin", tags=["Admin System Control"])
admin_guard = RoleChecker([RoleEnum.ADMIN])

@router.get("/dashboard/metrics", response_model=AdminDashboardMetrics, dependencies=[Depends(admin_guard)])
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_services = (await db.execute(select(func.count(Service.id)))).scalar_one()
    total_products = (await db.execute(select(func.count(Product.id)))).scalar_one()
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar_one()
    
    pending_orders = (await db.execute(select(func.count(Order.id)).where(Order.order_status == OrderStatus.PENDING))).scalar_one()
    completed_orders = (await db.execute(select(func.count(Order.id)).where(Order.order_status == OrderStatus.COMPLETED))).scalar_one()
    
    # Revenue calculated STRICTLY from database orders marked PAID
    rev_stmt = select(func.sum(Order.total_amount)).where(Order.payment_status == PaymentStatus.PAID)
    total_revenue = (await db.execute(rev_stmt)).scalar_one_or_none() or Decimal("0.00")

    return AdminDashboardMetrics(
        total_users=total_users,
        total_services=total_services,
        total_products=total_products,
        total_orders=total_orders,
        pending_orders=pending_orders,
        completed_orders=completed_orders,
        total_revenue=total_revenue
    )
