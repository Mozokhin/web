
// frontend/src/components/Tasks/TaskColumn.js
import React from 'react';
import { Card } from 'react-bootstrap';
import TaskCard from './TaskCard';
import './TaskColumn.css';

const TaskColumn = ({ title, tasks, status, onDragStart, onDragOver, onDrop }) => {
  return (
    <Card 
      className="task-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <Card.Header className="column-header">
        <h5 className="mb-0">{title}</h5>
        <span className="task-count">{tasks.length}</span>
      </Card.Header>
      <Card.Body className="column-body">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
            >
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <div className="empty-column-message">
            Задач нет
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskColumn;