import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_cart_operations(client: AsyncClient, user_token: str, product_id: str):
    # Add to cart
    add_res = await client.post(
        "/api/v1/cart/items",
        json={"item_type": "PRODUCT", "item_id": product_id, "quantity": 2},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert add_res.status_code == 200
    assert len(add_res.json()["items"]) > 0
