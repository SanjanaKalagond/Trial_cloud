import React from 'react';

const TaskForm = ({ taskData, setTaskData, onAddTask }) => {
  // Handle changes to the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Input for the task title */}
      <input
        type="text"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Task Title"
      />
      {/* Input for the task description */}
      <input
        type="text"
        name="description"
        value={taskData.description}
        onChange={handleChange}
        placeholder="Task Description"
      />
      {/* Button to add the task */}
      <button onClick={onAddTask}>Add Task</button>
    </div>
  );
};

export default TaskForm;
