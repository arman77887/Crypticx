from pydantic import BaseModel
from decimal import Decimal

class AdminDashboardMetrics(BaseModel):
    total_users: int
    total_services: int
    total_products: int
    total_orders: int
    pending_orders: int
    completed_orders: int
    total_revenue: Decimal
