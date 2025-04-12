import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getTasks, updateTask, deleteTask } from "../firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import TaskCard from "../components/TaskCard";
import UserProfile from "../components/UserProfile";
import Link from "next/link";
import "../styles/Board.css";

const Dashboard = () => {
  const router = useRouter();
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newSubtasks, setNewSubtasks] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      }
    });

    const fetchTasks = async () => {
      const tasks = await getTasks();
      const grouped = { todo: [], inProgress: [], completed: [] };
      tasks.forEach((task) => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });
      setColumns(grouped);
    };

    fetchTasks();

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(columns));
  }, [columns]);

  const handleLogout = () => {
    signOut(auth).then(() => router.push("/"));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task = {
      id: uuidv4(),
      title: newTaskTitle,
      subtasks: newSubtasks ? newSubtasks.split(",").map((s) => s.trim()) : [],
      completedSubtasks: [],
      status: "todo",
    };

    setColumns((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }));
    setNewTaskTitle("");
    setNewSubtasks("");
  };

  const deleteTaskHandler = async (taskId) => {
    await deleteTask(taskId);
    setColumns((prev) => {
      const updatedColumns = { ...prev };
      Object.keys(updatedColumns).forEach((column) => {
        updatedColumns[column] = updatedColumns[column].filter((task) => task.id !== taskId);
      });
      return updatedColumns;
    });
  };

  const handleTaskStatusChange = async (taskId, status) => {
    // Update task status
    await updateTask(taskId, { status });
    setColumns((prev) => {
      const updatedColumns = { ...prev };
      Object.keys(updatedColumns).forEach((column) => {
        updatedColumns[column] = updatedColumns[column].map((task) =>
          task.id === taskId ? { ...task, status } : task
        );
      });
      return updatedColumns;
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    destinationColumn.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });

    await updateTask(movedTask.id, { status: destination.droppableId });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="board-title">Kanban Board</h1>
        <div className="header-right">
          <UserProfile />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="board-container">
        {/* Left Panel - Add Task */}
        <div className="left-panel">
          <h3>Add a New Task</h3>
          <div className="add-task-inputs">
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Subtasks (comma separated)"
              value={newSubtasks}
              onChange={(e) => setNewSubtasks(e.target.value)}
            />
            <button onClick={addTask}>➕ Add Task</button>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="board-columns">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="columns-wrapper">
              {["todo", "inProgress", "completed"].map((columnId) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      className="board-column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2>{columnId === "todo" ? "To Do" : columnId === "inProgress" ? "In Progress" : "Completed"}</h2>
                      {columns[columnId].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="task-content">
                                <h4>{task.title}</h4>
                                {task.subtasks.map((subtask, idx) => (
                                  <div key={idx}>
                                    <input type="checkbox" />
                                    {subtask}
                                  </div>
                                ))}
                              </div>
                              <div className="task-actions">
                                <button onClick={() => deleteTaskHandler(task.id)}>Delete</button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <div className="calendar-link">
        <Link href="/calendar">
          <button>View Calendar</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
