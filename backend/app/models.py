from backend.app import db
from datetime import datetime

class TaskHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(200), nullable=False)
    assignee = db.Column(db.String(100), nullable=False)
    deadline = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "task_name": self.task_name,
            "assignee": self.assignee,
            "deadline": self.deadline,
            "status": self.status
        }