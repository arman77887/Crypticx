import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_rbac_authorization(client: AsyncClient, user_token: str, admin_token: str):
    # Test USER hitting ADMIN endpoint -> 403 Forbidden
    response_user = await client.get(
        "/api/v1/admin/system-settings",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response_user.status_code == 403

    # Test ADMIN hitting ADMIN endpoint -> 200 OK
    response_admin = await client.get(
        "/api/v1/admin/system-settings",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response_admin.status_code == 200
