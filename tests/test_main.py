import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "database" in data

@pytest.mark.asyncio
async def test_openapi_route_registration():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/openapi.json")
    assert response.status_code == 200
    paths = response.json()["paths"]
    
    # Verify all Phase 1-4 routers are registered
    assert "/api/v1/auth/login" in paths or "/api/v1/auth/register" in paths
    assert any(p.startswith("/api/v1/users") for p in paths)
    assert any(p.startswith("/api/v1/products") for p in paths)
    assert any(p.startswith("/api/v1/services") for p in paths)
    assert any(p.startswith("/api/v1/cart") for p in paths)
    assert any(p.startswith("/api/v1/orders") for p in paths)
    assert any(p.startswith("/api/v1/wallet") for p in paths)
    assert any(p.startswith("/api/v1/admin") for p in paths)

@pytest.mark.asyncio
async def test_protected_route_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/wallet/balance")
    assert response.status_code in [401, 403]
