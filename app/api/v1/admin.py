from fastapi import APIRouter, Depends
from app.core.deps import RoleChecker
from app.models.user import RoleEnum, User

router = APIRouter(prefix="/admin", tags=["Admin Controls"])

admin_guard = RoleChecker([RoleEnum.ADMIN])
staff_guard = RoleChecker([RoleEnum.STAFF, RoleEnum.ADMIN])

@router.get("/staff-metrics", dependencies=[Depends(staff_guard)])
async def get_staff_metrics():
    return {"status": "Access granted: Staff level permissions valid."}

@router.get("/system-settings", dependencies=[Depends(admin_guard)])
async def get_system_settings():
    return {"status": "Access granted: Admin restricted configurations loaded."}
