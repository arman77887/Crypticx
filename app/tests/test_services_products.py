import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_public_service_and_product_listing(client: AsyncClient):
    s_res = await client.get("/api/v1/services")
    assert s_res.status_code == 200
    
    p_res = await client.get("/api/v1/products")
    assert p_res.status_code == 200
