from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.wallet import (
    Wallet,
    WalletTransaction,
    TransactionType,
    TransactionStatus,
)


router = APIRouter()


class WalletResponse(BaseModel):
    id: UUID
    balance: Decimal
    currency: str

    class Config:
        from_attributes = True


class WalletTransactionResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    amount: Decimal
    type: TransactionType
    status: TransactionStatus
    reference: str

    class Config:
        from_attributes = True


@router.get(
    "/{user_id}",
    response_model=WalletResponse,
    status_code=status.HTTP_200_OK,
)
async def get_wallet(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )

    wallet = result.scalar_one_or_none()

    if wallet is None:
        wallet = Wallet(
            user_id=user_id,
            balance=Decimal("0.00"),
            currency="USD",
        )

        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)

    return wallet


@router.get(
    "/{user_id}/transactions",
    response_model=list[WalletTransactionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_wallet_transactions(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    wallet_result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )

    wallet = wallet_result.scalar_one_or_none()

    if wallet is None:
        return []

    result = await db.execute(
        select(WalletTransaction)
        .where(WalletTransaction.wallet_id == wallet.id)
        .order_by(WalletTransaction.created_at.desc())
    )

    return list(result.scalars().all())
