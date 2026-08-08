from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Dict, Any

class BasePaymentGateway(ABC):
    @abstractmethod
    async def initiate_payment(self, order_id: str, amount: Decimal, currency: str, callback_url: str) -> Dict[str, Any]:
        """Initiates gateway transaction. To be implemented in Phase 4."""
        pass

    @abstractmethod
    async def verify_payment(self, payload: Dict[str, Any]) -> bool:
        """Verifies payment webhook signature/status. To be implemented in Phase 4."""
        pass
