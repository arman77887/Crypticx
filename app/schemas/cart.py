from pydantic import BaseModel, ConfigDict
from uuid import UUID
from decimal import Decimal
from typing import List
from app.models.cart import ItemType

class CartItemAdd(BaseModel):
    item_type: ItemType
    item_id: UUID
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: UUID
    item_type: ItemType
    item_id: UUID
    item_name: str
    unit_price: Decimal
    quantity: int
    subtotal: Decimal

class CartResponse(BaseModel):
    id: UUID
    user_id: UUID
    items: List[CartItemResponse]
    total_amount: Decimal
    model_config = ConfigDict(from_attributes=True)
