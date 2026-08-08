from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from app.models.order import OrderStatus, PaymentStatus
from app.models.cart import ItemType

class OrderItemResponse(BaseModel):
    id: UUID
    item_type: ItemType
    reference_id: UUID
    item_name: str
    quantity: int
    unit_price_snapshot: Decimal
    subtotal: Decimal
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    total_amount: Decimal
    currency: str
    order_status: OrderStatus
    payment_status: PaymentStatus
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    order_status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    internal_notes: Optional[str] = None
