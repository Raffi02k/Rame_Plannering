from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, JSON, Table
from sqlalchemy.orm import relationship
from .db import Base

admin_units = Table(
    "admin_units",
    Base.metadata,
    Column("user_id", String, ForeignKey("users.id"), primary_key=True),
    Column("unit_id", String, ForeignKey("units.id"), primary_key=True),
)

class Unit(Base):
    __tablename__ = "units"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String, default="unit")

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    avatar = Column(String, nullable=True)
    role = Column(String)  # 'admin', 'staff', 'user', 'unit_admin'
    unit_id = Column(String, ForeignKey("units.id"))
    unit = relationship("Unit")
    # units som en unit_admin är kopplad till
    admin_units = relationship("Unit", secondary=admin_units, backref="unit_admins")

class TaskTemplate(Base):
    __tablename__ = "task_templates"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    substitute_instructions = Column(Text, nullable=True)
    category = Column(String)
    role_type = Column(String) # 'personal', 'unit', 'delegated'
    unit_id = Column(String, ForeignKey("units.id"), nullable=True)
    is_shared = Column(Boolean, default=False)
    valid_on_date = Column(Date, nullable=True) # If set, only valid for this date
    
    # Simple JSON field for extra data (time_of_day, recurrence rules etc)
    # to keep schema simple for prototype
    meta_data = Column(JSON, nullable=True) 

class TaskInstance(Base):
    __tablename__ = "task_instances"
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("task_templates.id"))
    date = Column(Date, index=True)
    status = Column(String) # 'pending', 'completed', 'missed'
    signed_by = Column(String, ForeignKey("users.id"), nullable=True)
    signed_at = Column(String, nullable=True) # ISO timestamp
    notes = Column(Text, nullable=True)
    report_data = Column(JSON, nullable=True)
    template = relationship("TaskTemplate")
    signer = relationship("User")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(String, ForeignKey("units.id"))
    date = Column(Date, index=True)
    content = Column(Text)
    created_by = Column(String, ForeignKey("users.id"))
    
    author = relationship("User")
