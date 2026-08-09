from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.wallet import (
    Wallet,
    WalletTransaction,
    TransactionType,
    TransactionStatus,
)


router = APIRouter(
    prefix="/wallet",
    tags=["Wallet"],
)


class WalletResponse(BaseModel):
    id: UUID
    user_id: UUID
    balance: Decimal
    currency: str

    model_config = ConfigDict(from_attributes=True)


class WalletTransactionResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    amount: Decimal
    type: TransactionType
    status: TransactionStatus
    reference: str
    description: str | None
    created_at: object
    completed_at: object | None

    model_config = ConfigDict(from_attributes=True)


class WalletCreditRequest(BaseModel):
    amount: Decimal = Field(
        ...,
        gt=Decimal("0.00"),
        max_digits=12,
        decimal_places=2,
    )
    reference: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )


async def get_or_create_wallet(
    user_id: UUID,
    db: AsyncSession,
) -> Wallet:
    result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )

    wallet = result.scalar_one_or_none()

    if wallet is not None:
        return wallet

    wallet = Wallet(
        user_id=user_id,
        balance=Decimal("0.00"),
        currency="USD",
    )

    db.add(wallet)
    await db.flush()
    await db.refresh(wallet)

    return wallet


@router.get(
    "",
    response_model=WalletResponse,
    status_code=status.HTTP_200_OK,
)
async def get_my_wallet(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wallet = await get_or_create_wallet(
        current_user.id,
        db,
    )

    return wallet


@router.get(
    "/transactions",
    response_model=list[WalletTransactionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_my_wallet_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wallet_result = await db.execute(
        select(Wallet).where(
            Wallet.user_id == current_user.id
        )
    )

    wallet = wallet_result.scalar_one_or_none()

    if wallet is None:
        return []

    result = await db.execute(
        select(WalletTransaction)
        .where(
            WalletTransaction.wallet_id == wallet.id
        )
        .order_by(
            WalletTransaction.created_at.desc()
        )
    )

    return list(result.scalars().all())


@router.post(
    "/credit",
    response_model=WalletTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def credit_wallet(
    request: WalletCreditRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Internal wallet credit endpoint.

    This endpoint is intentionally kept simple for the current
    architecture. A production payment gateway/webhook should
    call a dedicated payment service after independently verifying
    the payment.
    """

    wallet = await get_or_create_wallet(
        current_user.id,
        db,
    )

    existing_result = await db.execute(
        select(WalletTransaction).where(
            WalletTransaction.wallet_id == wallet.id,
            WalletTransaction.reference == request.reference,
        )
    )

    existing_transaction = (
        existing_result.scalar_one_or_none()
    )

    if existing_transaction is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transaction reference already exists",
        )

    transaction = WalletTransaction(
        wallet_id=wallet.id,
        amount=request.amount,
        type=TransactionType.CREDIT,
        status=TransactionStatus.COMPLETED,
        reference=request.reference,
        description=request.description,
    )

    wallet.balance = (
        wallet.balance + request.amount
    )

    db.add(transaction)

    await db.flush()
    await db.refresh(transaction)

    return transaction


@router.get(
    "/transactions/{transaction_id}",
    response_model=WalletTransactionResponse,
    status_code=status.HTTP_200_OK,
)
async def get_wallet_transaction(
    transaction_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WalletTransaction)
        .join(Wallet)
        .where(
            WalletTransaction.id == transaction_id,
            Wallet.user_id == current_user.id,
        )
    )

    transaction = result.scalar_one_or_none()

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wallet transaction not found",
        )

    return transaction
