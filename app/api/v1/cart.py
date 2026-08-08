from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from decimal import Decimal
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cart import Cart, CartItem, ItemType
from app.models.product import Product
from app.models.service import Service
from app.schemas.cart import CartItemAdd, CartResponse, CartItemResponse

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])

async def get_or_create_cart(user_id: UUID, db: AsyncSession) -> Cart:
    stmt = select(Cart).where(Cart.user_id == user_id)
    cart = (await db.execute(stmt)).scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    return cart

@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item_in: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify entity exists in DB
    if item_in.item_type == ItemType.PRODUCT:
        p_stmt = select(Product).where(Product.id == item_in.item_id, Product.is_published == True)
        if not (await db.execute(p_stmt)).scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Product not found")
    elif item_in.item_type == ItemType.SERVICE:
        s_stmt = select(Service).where(Service.id == item_in.item_id, Service.is_active == True)
        if not (await db.execute(s_stmt)).scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Service not found")

    cart = await get_or_create_cart(current_user.id, db)
    
    # Check if item already in cart
    existing_item = next((i for i in cart.items if i.item_id == item_in.item_id and i.item_type == item_in.item_type), None)
    if existing_item:
        existing_item.quantity += item_in.quantity
    else:
        new_item = CartItem(cart_id=cart.id, item_type=item_in.item_type, item_id=item_in.item_id, quantity=item_in.quantity)
        db.add(new_item)

    await db.commit()
    return await get_cart_response(cart, db)

@router.get("", response_model=CartResponse)
async def view_cart(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    cart = await get_or_create_cart(current_user.id, db)
    return await get_cart_response(cart, db)

@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_cart_item(item_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    cart = await get_or_create_cart(current_user.id, db)
    stmt = select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
    item = (await db.execute(stmt)).scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    await db.delete(item)
    await db.commit()
    return await get_cart_response(cart, db)

async def get_cart_response(cart: Cart, db: AsyncSession) -> CartResponse:
    item_responses = []
    total_amount = Decimal("0.00")

    for item in cart.items:
        if item.item_type == ItemType.PRODUCT:
            prod = (await db.execute(select(Product).where(Product.id == item.item_id))).scalar_one_or_none()
            if prod:
                price = prod.sale_price if prod.sale_price else prod.price
                sub = price * item.quantity
                total_amount += sub
                item_responses.append(CartItemResponse(id=item.id, item_type=item.item_type, item_id=item.item_id, item_name=prod.name, unit_price=price, quantity=item.quantity, subtotal=sub))
        elif item.item_type == ItemType.SERVICE:
            serv = (await db.execute(select(Service).where(Service.id == item.item_id))).scalar_one_or_none()
            if serv:
                price = serv.sale_price if serv.sale_price else serv.price
                sub = price * item.quantity
                total_amount += sub
                item_responses.append(CartItemResponse(id=item.id, item_type=item.item_type, item_id=item.item_id, item_name=serv.name, unit_price=price, quantity=item.quantity, subtotal=sub))

    return CartResponse(id=cart.id, user_id=cart.user_id, items=item_responses, total_amount=total_amount)
