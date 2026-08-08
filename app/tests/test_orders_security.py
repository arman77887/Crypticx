import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_idor_order_protection(client: AsyncClient, user_a_token: str, user_b_order_id: str):
    # User A tries to view User B's order by ID tampering
    res = await client.get(
        f"/api/v1/orders/{user_b_order_id}",
        headers={"Authorization": f"Bearer {user_a_token}"}
    )
    assert res.status_code == 404 # Ownership check blocks access completely
