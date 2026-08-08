import asyncio

from app.core.database import engine, Base

from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductCategory
from app.models.service import Service, ServiceCategory
from app.models.wallet import Wallet, WalletTransaction


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Database tables created successfully.")


if __name__ == "__main__":
    asyncio.run(create_tables())
