from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from decimal import Decimal
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cart import Cart, ItemType
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import Product
from app.models.service import Service
from app.schemas.order import OrderResponse

router = APIRouter(prefix="/orders", tags=["User Orders & Checkout"])

@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def checkout_cart_to_order(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch User Cart
    c_stmt = select(Cart).where(Cart.user_id == current_user.id)
    cart = (await db.execute(c_stmt)).scalar_one_or_none()
    
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_order_amount = Decimal("0.00")
    order_items_to_create = []

    # Backend Strict Price Verification & Snapshot Construction
    for cart_item in cart.items:
        if cart_item.item_type == ItemType.PRODUCT:
            p_stmt = select(Product).where(Product.id == cart_item.item_id, Product.is_published == True)
            product = (await db.execute(p_stmt)).scalar_one_or_none()
            if not product:
                raise HTTPException(status_code=400, detail=f"Product {cart_item.item_id} no longer available")
            
            unit_price = product.sale_price if product.sale_price else product.price
            subtotal = unit_price * cart_item.quantity
            total_order_amount += subtotal

            order_items_to_create.append(OrderItem(
                item_type=ItemType.PRODUCT,
                reference_id=product.id,
                item_name=product.name,
                quantity=cart_item.quantity,
                unit_price_snapshot=unit_price,
                subtotal=subtotal
            ))

        elif cart_item.item_type == ItemType.SERVICE:
            s_stmt = select(Service).where(Service.id == cart_item.item_id, Service.is_active == True)
            service = (await db.execute(s_stmt)).scalar_one_or_none()
            if not service:
                raise HTTPException(status_code=400, detail=f"Service {cart_item.item_id} no longer available")

            unit_price = service.sale_price if service.sale_price else service.price
            subtotal = unit_price * cart_item.quantity
            total_order_amount += subtotal

            order_items_to_create.append(OrderItem(
                item_type=ItemType.SERVICE,
                reference_id=service.id,
                item_name=service.name,
                quantity=cart_item.quantity,
                unit_price_snapshot=unit_price,
                subtotal=subtotal
            ))

    # Construct Order with database-calculated totals
    new_order = Order(
        user_id=current_user.id,
        total_amount=total_order_amount,
        currency="USD",
        order_status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        items=order_items_to_create
    )

    db.add(new_order)
    
    # Clear User Cart after checkout
    for item in cart.items:
        await db.delete(item)

    await db.commit()
    await db.refresh(new_order)
    return new_order

@router.get("", response_model=List[OrderResponse])
async def list_my_orders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_details(order_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # STRICT IDOR PROTECTION & OWNERSHIP ENFORCEMENT
    stmt = select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
    order = (await db.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied")
    return order
