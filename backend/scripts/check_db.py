from app import models, db
import json

def check():
    session = db.SessionLocal()
    unit_count = session.query(models.Unit).count()
    user_count = session.query(models.User).count()
    task_count = session.query(models.TaskTemplate).count()
    print(f"Units: {unit_count}")
    print(f"Users: {user_count}")
    print(f"Tasks: {task_count}")
    
    task = session.query(models.TaskTemplate).first()
    if task:
        print(f"Task ID: {task.id}")
        print(f"Meta Data Type: {type(task.meta_data)}")
        print(f"Meta Data Content: {task.meta_data}")
        print(f"Substitute Instructions (Column): {task.substitute_instructions}")
    session.close()

if __name__ == "__main__":
    check()
