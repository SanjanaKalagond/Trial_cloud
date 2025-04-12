import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ title, tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  return (
    <div className="column">
      <h2>{title}</h2>
      <button onClick={() => onAddTask(title)}>+ Add Task</button>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default Column;
