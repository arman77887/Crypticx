import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_user_registration(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123", "full_name": "Test User"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_duplicate_registration(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "User with this email already exists."

@pytest.mark.asyncio
async def test_login_and_invalid_password(client: AsyncClient):
    payload = {"email": "login@example.com", "password": "correct_password"}
    await client.post("/api/v1/auth/register", json=payload)
    
    # Invalid Login Attempt
    fail = await client.post("/api/v1/auth/login", data={"username": "login@example.com", "password": "wrong"})
    assert fail.status_code == 400

    # Successful Login Attempt
    success = await client.post("/api/v1/auth/login", data={"username": "login@example.com", "password": "correct_password"})
    assert success.status_code == 200
    assert "access_token" in success.json()
  
