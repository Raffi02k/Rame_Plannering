from fastapi import APIRouter, Depends, HTTPException
import json
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import uuid
from .. import models, schemas, db
from ..auth import get_current_user_hybrid

router = APIRouter(tags=["api"])


@router.get("/units", response_model=List[schemas.Unit])
def get_units(
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user_hybrid),
):
    # Admin: alla units
    if current_user.role == "admin":
        return db_session.query(models.Unit).all()

    # Admin: bara de units admin är kopplad till (inte alla)
    if current_user.role == "unit_admin":
        return current_user.admin_units

    # Staff/User: bara sin unit
    if not current_user.unit_id:
        return []

    return db_session.query(models.Unit).filter(models.Unit.id == current_user.unit_id).all()


@router.get("/staff", response_model=List[schemas.User])
def get_staff(
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user_hybrid),
):
    staff_roles = ["staff", "admin", "unit_admin"]

    if current_user.role == "admin":
        return db_session.query(models.User).filter(models.User.role.in_(staff_roles)).all()

    if current_user.role == "unit_admin":
        allowed_unit_ids = [unit.id for unit in current_user.admin_units]
        if not allowed_unit_ids:
            return []
        return db_session.query(models.User).filter(
            models.User.role.in_(staff_roles),
            models.User.unit_id.in_(allowed_unit_ids),
        ).all()

    if not current_user.unit_id:
        return []
    return db_session.query(models.User).filter(
        models.User.role.in_(staff_roles),
        models.User.unit_id == current_user.unit_id,
    ).all()


@router.get("/users", response_model=List[schemas.User])
def get_users(
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user_hybrid),
):
    if current_user.role == "admin":
        return db_session.query(models.User).filter(models.User.role == "user").all()

    if current_user.role == "unit_admin":
        allowed_unit_ids = [unit.id for unit in current_user.admin_units]
        if not allowed_unit_ids:
            return []

        return db_session.query(models.User).filter(
            models.User.role == "user",
            models.User.unit_id.in_(allowed_unit_ids),
        ).all()

    if not current_user.unit_id:
        return []

    return db_session.query(models.User).filter(
        models.User.role == "user",
        models.User.unit_id == current_user.unit_id,
    ).all()


@router.get("/schedule/day", response_model=schemas.DaySchedule)
def get_day_schedule(
    date: date,
    unitId: str,
    db_session: Session = Depends(db.get_db),
):
    templates = db_session.query(models.TaskTemplate).filter(
        models.TaskTemplate.unit_id == unitId,
        (models.TaskTemplate.valid_on_date == None) | (models.TaskTemplate.valid_on_date == date),
    ).all()

    instances = db_session.query(models.TaskInstance).filter(
        models.TaskInstance.date == date,
        models.TaskInstance.template_id.in_([t.id for t in templates]),
    ).all()

    instance_map = {i.template_id: i for i in instances}

    tasks_data = []
    for t in templates:
        inst = instance_map.get(t.id)
        status = inst.status if inst else "pending"

        meta = t.meta_data or {}
        if isinstance(meta, str):
            try:
                meta = json.loads(meta)
            except json.JSONDecodeError:
                meta = {}

        tasks_data.append(
            {
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
                "meta": meta,
                "assigneeId": meta.get("assigneeId") if isinstance(meta, dict) else None,
                "reportData": inst.report_data if inst else None,
            }
        )

    return {"date": date, "tasks": tasks_data}


@router.patch("/task-instances/{template_id}")
def update_task_status(
    template_id: str,
    update: schemas.TaskInstanceUpdate,
    db_session: Session = Depends(db.get_db),
):
    instance = db_session.query(models.TaskInstance).filter(
        models.TaskInstance.template_id == template_id,
        models.TaskInstance.date == update.date,
    ).first()

    if instance:
        instance.status = update.status
        instance.signed_by = update.signed_by
        instance.signed_at = update.signed_at
        if update.report_data is not None:
            instance.report_data = update.report_data
    else:
        instance = models.TaskInstance(
            template_id=template_id,
            date=update.date,
            status=update.status,
            signed_by=update.signed_by,
            signed_at=update.signed_at,
            report_data=update.report_data,
        )
        db_session.add(instance)

    db_session.commit()
    return {"status": "success"}


@router.post("/tasks")
def create_task(
    task: schemas.TaskCreate,
    db_session: Session = Depends(db.get_db),
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
        meta_data=task.meta_data,
    )
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)
    return {"status": "success", "id": new_id}


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    db_session: Session = Depends(db.get_db),
):
    db_session.query(models.TaskInstance).filter(models.TaskInstance.template_id == task_id).delete()

    task = db_session.query(models.TaskTemplate).filter(models.TaskTemplate.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_session.delete(task)
    db_session.commit()
    return {"status": "success"}
