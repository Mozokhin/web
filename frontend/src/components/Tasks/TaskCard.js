// frontend/src/components/Tasks/TaskCard.js
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card className="task-card mb-3">
      <Card.Body>
        <Card.Title className="task-title">{task.title}</Card.Title>
        <Card.Text className="task-description">
          {task.description || 'Нет описания'}
        </Card.Text>

        <div className="task-footer">
          <div className="task-assignee">
            👤 {task.assignee_name || 'Не назначен'}
          </div>
          {task.due_date && (
            <Badge 
              pill 
              bg={isOverdue ? 'danger' : 'secondary'}
              className="task-due-date"
            >
              {formatDate(task.due_date)}
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;