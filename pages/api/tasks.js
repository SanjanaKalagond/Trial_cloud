// /pages/api/tasks.js
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../../firebase/firestore";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const tasks = await getTasks();
        res.status(200).json(tasks); // Return all tasks
      } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
      }
      break;
    case "POST":
      try {
        const taskData = req.body; // Task data from request body
        const taskId = await addTask(taskData); // Add task to Firestore
        res.status(201).json({ id: taskId }); // Return the ID of the newly created task
      } catch (error) {
        res.status(500).json({ error: "Error adding task" });
      }
      break;
    case "PUT":
      try {
        const { taskId, updatedData } = req.body; // Data to update the task
        await updateTask(taskId, updatedData); // Update task in Firestore
        res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error updating task" });
      }
      break;
    case "DELETE":
      try {
        const { taskId } = req.query; // Task ID to delete
        await deleteTask(taskId); // Delete task from Firestore
        res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
      }
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}
