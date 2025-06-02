import React, { useState, useEffect } from "react";
import { getIRTasks } from "../services/ApiService"; // Adjust path if needed
import { IRTask } from "../types";

const IRTaskView: React.FC = () => {
  const [tasks, setTasks] = useState<IRTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const taskData = await getIRTasks(); // Returns IRTask[]
        setTasks(taskData);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Image Recognition Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.uuid}>
              <strong>{task.name}</strong> (UUID: {task.uuid})
              {/* Add button or form for image submission */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IRTaskView;
