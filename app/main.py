from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.config import settings
from app.core.database import get_db

# Existing Phase 1-4 V1 Routers
from app.api.v1 import (
    auth,
    users,
    services,
    products,
    cart,
    orders,
    wallet,
    admin,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure CORS for Next.js frontend
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register existing API V1 Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(services.router, prefix=f"{settings.API_V1_STR}/services", tags=["services"])
app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(cart.router, prefix=f"{settings.API_V1_STR}/cart", tags=["cart"])
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(wallet.router, prefix=f"{settings.API_V1_STR}/wallet", tags=["wallet"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])


@app.get("/health", status_code=status.HTTP_200_OK, tags=["system"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    System Health Endpoint: Validates FastAPI service uptime and PostgreSQL DB connection.
    """
    try:
        await db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "database": db_status,
    }
