from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.wallet import Wallet
from app.models.order import Order
from app.schemas.user import UserResponse, UserDashboard

router = APIRouter(prefix="/users", tags=["User Dashboard"])

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        roles=[r.role for r in current_user.roles],
        created_at=current_user.created_at
    )

@router.get("/dashboard", response_model=UserDashboard)
async def get_dashboard(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    wallet_stmt = select(Wallet.balance).where(Wallet.user_id == current_user.id)
    balance = (await db.execute(wallet_stmt)).scalar_one_or_none() or 0.0

    order_stmt = select(func.count(Order.id)).where(Order.user_id == current_user.id)
    order_count = (await db.execute(order_stmt)).scalar_one_or_none() or 0

    return UserDashboard(
        user_id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        roles=[r.role for r in current_user.roles],
        wallet_balance=float(balance),
        total_orders=order_count,
        account_created=current_user.created_at
    )
