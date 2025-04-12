import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Import app, auth, and db from firebaseConfig.js
import { app, db, auth } from "./firebaseConfig"; // Import app, db, and auth

// Initialize Firestore and Auth using the already initialized app
const firestore = getFirestore(app); // We use getFirestore to get Firestore instance

// Add a new task
export const addTask = async (taskData) => {
  try {
    const tasksCollection = collection(firestore, "tasks"); // Using modular API for collection
    const docRef = await addDoc(tasksCollection, taskData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
};

// Get all tasks
export const getTasks = async () => {
  try {
    const tasksCollection = collection(firestore, "tasks"); // Again using modular API
    const querySnapshot = await getDocs(tasksCollection); // Modular API for getting docs
    const tasks = [];
    querySnapshot.forEach((docSnapshot) => {
      tasks.push({ id: docSnapshot.id, ...docSnapshot.data() });
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, updatedData) => {
  try {
    const taskRef = doc(firestore, "tasks", taskId); // Modular API for updating docs
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(firestore, "tasks", taskId); // Modular API for deleting docs
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};
