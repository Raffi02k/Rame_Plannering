from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    name: str
    role: str
    unit_id: Optional[str] = None
    avatar: Optional[str] = None # URL to avatar image

    class Config:
        from_attributes = True

class TaskInstanceUpdate(BaseModel):
    date: date
    status: str
    signed_by: Optional[str] = None
    signed_at: Optional[str] = None
    notes: Optional[str] = None
    report_data: Optional[dict] = None

class Task(BaseModel):
    id: str  # template_id
    unitId: str
    title: str
    description: Optional[str] = None
    assigneeId: Optional[str] = None
    substituteInstructions: Optional[str] = None
    category: str
    status: str # Computed from instance
    roleType: str # Mapped from role_type
    isShared: bool # Mapped from is_shared
    validOnDate: Optional[date] = None # Mapped from valid_on_date
    meta: Optional[dict] = {}
    reportData: Optional[dict] = None

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    unit_id: str
    title: str
    description: Optional[str] = None
    substitute_instructions: Optional[str] = None
    category: str
    role_type: str
    is_shared: bool = False
    valid_on_date: Optional[date] = None
    meta_data: Optional[dict] = {}

class DaySchedule(BaseModel):
    date: date
    tasks: List[Task]
