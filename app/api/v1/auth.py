from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, create_email_token
from app.models.user import User, UserRole, RoleEnum
from app.models.wallet import Wallet
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, PasswordResetRequest, PasswordResetConfirm

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Duplicate Check
    stmt = select(User).where(User.email == user_in.email)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    new_user.roles.append(UserRole(role=RoleEnum.USER))
    
    # Provision empty wallet architecture
    new_wallet = Wallet(user=new_user)
    
    db.add(new_user)
    db.add(new_wallet)
    await db.commit()
    await db.refresh(new_user)
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        is_active=new_user.is_active,
        is_verified=new_user.is_verified,
        roles=[r.role for r in new_user.roles],
        created_at=new_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == form_data.username)
    user = (await db.execute(stmt)).unique().scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

    roles = [r.role.value for r in user.roles]
    token = create_access_token(subject=user.id, roles=roles)
    return Token(access_token=token, token_type="bearer")

@router.post("/request-password-reset")
async def request_password_reset(req: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == req.email)
    user = (await db.execute(stmt)).unique().scalar_one_or_none()
    if user:
        reset_token = create_email_token(email=user.email, token_type="reset")
        # In actual deployment, send via SMTP. Architecture mock output:
        print(f"RESET TOKEN GENERATED FOR {user.email}: {reset_token}")
    return {"message": "If the account exists, a password reset email has been sent."}
