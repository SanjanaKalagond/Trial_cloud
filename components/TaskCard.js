import React from "react";

const TaskCard = ({ task, onUpdateTask, onDeleteTask }) => {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-actions">
        <button onClick={() => onUpdateTask(task)}>Edit</button>
        <button onClick={() => onDeleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
