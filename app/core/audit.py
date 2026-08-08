import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog

async def log_audit_event(
    db: AsyncSession,
    action: str,
    user_id: Optional[uuid.UUID] = None,
    target_id: Optional[str] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None
) -> None:
    audit_entry = AuditLog(
        user_id=user_id,
        action=action,
        details=f"Target: {target_id} | Details: {details}" if target_id else details,
        ip_address=ip_address
    )
    db.add(audit_entry)
    await db.commit()
