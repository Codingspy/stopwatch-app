import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);

  // Start/Stop toggle
  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  // Reset
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
  };

  // Save to backend
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/sessions", {
        duration: time,
      });
      fetchSessions(); // refresh
    } catch (err) {
      console.error("Error saving session", err);
    }
  };

  // Fetch saved sessions
  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Format time
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>⏱️ Stopwatch MVP</h1>
      <h2>{formatTime(time)}</h2>
      <button onClick={handleStartStop}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={handleReset} disabled={isRunning}>Reset</button>
      <button onClick={handleSave} disabled={time === 0 || isRunning}>Save</button>

      <h3>Saved Sessions</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sessions.map((session, idx) => (
          <li key={idx}>
            #{sessions.length - idx} - {formatTime(session.duration)} ({new Date(session.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
