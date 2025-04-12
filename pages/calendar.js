import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/Board.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);  // State to hold events
  const [newTask, setNewTask] = useState({ title: "", date: "", type: "task" });  // State for new task input

  // Load events from localStorage on initial load
  useEffect(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(parsedEvents); // Set events from localStorage
    }
  }, []);

  const handleAddEvent = () => {
    if (!newTask.title || !newTask.date) {
      alert("Please enter both title and date.");
      return;
    }

    // Check if the selected date is before today
    const today = new Date().setHours(0, 0, 0, 0);  // Midnight of today
    const selectedDate = new Date(newTask.date).setHours(0, 0, 0, 0);

    if (newTask.type === "deadline" && selectedDate < today) {
      alert("You cannot add a deadline to a past date.");
      return;
    }

    // Determine event color based on type (deadline or task)
    const color = newTask.type === "deadline" ? "#dc3545" : "#007bff";  // red for deadline, blue for task

    const event = {
      title: newTask.title,
      date: newTask.date,
      color,
    };

    // Add new event to the state
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);

    // Save updated events to localStorage
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));

    // Reset the new task input fields
    setNewTask({ title: "", date: "", type: "task" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📅 My Calendar</h1>
      <p>Here you'll see your daily tasks, deadlines, and completed work.</p>

      {/* Input Fields for Adding Events */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <select
          value={newTask.type}
          onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
          style={{ marginRight: 10 }}
        >
          <option value="task">Task</option>
          <option value="deadline">Deadline</option>
        </select>
        <button onClick={handleAddEvent}>➕ Add to Calendar</button>
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}  // Required plugins
        initialView="dayGridMonth"  // Default calendar view
        events={events}  // Passing events from state
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        navLinks={true}  // Allow navigation via month/year
      />

      {/* Back to Dashboard Link */}
      <Link href="/dashboard">
        <button style={{ marginTop: 20 }}>⬅ Back to Dashboard</button>
      </Link>
    </div>
  );
}
