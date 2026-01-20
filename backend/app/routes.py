from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from fastapi.security import OAuth2PasswordRequestForm
import uuid
from . import models, schemas, db, auth

router = APIRouter()

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(db.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Auth / Me ---
@router.get("/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Schedule ---
@router.get("/schedule/day", response_model=schemas.DaySchedule)
def get_day_schedule(
    date: date,
    unitId: str,
    db: Session = Depends(db.get_db)
):
    # 1. Get all templates for this unit
    # Filter: either no date (recurring) or date matches today
    templates = db.query(models.TaskTemplate).filter(
        models.TaskTemplate.unit_id == unitId,
        (models.TaskTemplate.valid_on_date == None) | (models.TaskTemplate.valid_on_date == date)
    ).all()
    
    # 2. Get instances for this date
    instances = db.query(models.TaskInstance).filter(
        models.TaskInstance.date == date,
        models.TaskInstance.template_id.in_([t.id for t in templates])
    ).all()
    
    instance_map = {i.template_id: i for i in instances}
    
    tasks_data = []
    for t in templates:
        inst = instance_map.get(t.id)
        status = inst.status if inst else "pending"
        
        # Map DB model to API Schema
        tasks_data.append({
            "id": t.id,
            "unitId": t.unit_id,
            "title": t.title,
            "description": t.description,
            "substituteInstructions": t.substitute_instructions,
            "category": t.category,
            "status": status,
            "roleType": t.role_type,
            "isShared": t.is_shared,
            "validOnDate": t.valid_on_date,
            "meta": t.meta_data or {},
            "assigneeId": t.meta_data.get('assigneeId') if t.meta_data else None,
            "reportData": inst.report_data if inst else None
        })
        
    return {"date": date, "tasks": tasks_data}

@router.patch("/task-instances/{template_id}")
def update_task_status(
    template_id: str,
    update: schemas.TaskInstanceUpdate,
    db: Session = Depends(db.get_db)
):
    instance = db.query(models.TaskInstance).filter(
        models.TaskInstance.template_id == template_id,
        models.TaskInstance.date == update.date
    ).first()
    
    if instance:
        instance.status = update.status
        instance.signed_by = update.signed_by
        instance.signed_at = update.signed_at
        if update.report_data is not None:
             instance.report_data = update.report_data
    else:
        # Lazy create
        instance = models.TaskInstance(
            template_id=template_id,
            date=update.date,
            status=update.status,
            signed_by=update.signed_by,
            signed_at=update.signed_at,
            report_data=update.report_data
        )
        db.add(instance)
    
    db.commit()
    return {"status": "success"}

@router.post("/tasks")
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(db.get_db)
):
    new_id = str(uuid.uuid4())
    db_task = models.TaskTemplate(
        id=new_id,
        unit_id=task.unit_id,
        title=task.title,
        description=task.description,
        substitute_instructions=task.substitute_instructions,
        category=task.category,
        role_type=task.role_type,
        is_shared=task.is_shared,
        valid_on_date=task.valid_on_date,
        meta_data=task.meta_data
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return {"status": "success", "id": new_id}

@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(db.get_db)
):
    # Check if instances exist, maybe delete them too?
    # For now just delete template, foreign key might complain if not cascade
    # SQLite default FK off? But SQLAlchemy might enforce.
    # Let's delete instances first
    db.query(models.TaskInstance).filter(models.TaskInstance.template_id == task_id).delete()
    
    task = db.query(models.TaskTemplate).filter(models.TaskTemplate.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"status": "success"}
