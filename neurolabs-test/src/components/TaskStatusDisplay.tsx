import React, { useState, useEffect } from "react";
import { getTaskStatus } from "../services/ApiService";

interface TaskStatusDisplayProps {
  task_uuid: string;
  image_id: string;
}

const TaskStatusDisplay: React.FC<TaskStatusDisplayProps> = ({
  task_uuid,
  image_id,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollStatus = async (attempts = 10, delay = 2000) => {
      for (let i = 0; i < attempts; i++) {
        try {
          const response = await getTaskStatus(task_uuid, image_id);
          console.log("Task status response:", response);
          setStatus(response.status || "unknown");
          setLoading(false);
          return; // Exit the loop on success
        } catch (err: any) {
          if (err.message.includes("404")) {
            console.log(
              `Attempt ${
                i + 1
              }/${attempts}: Task status not found, retrying in ${delay}ms...`
            );
            if (i === attempts - 1) {
              setError("Task status not found after multiple attempts");
              setLoading(false);
              return;
            }
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error("Error fetching task status:", err.message);
            setError(`Failed to fetch task status: ${err.message}`);
            setLoading(false);
            return;
          }
        }
      }
    };

    pollStatus();
  }, [task_uuid, image_id]);

  if (loading) return <div className="p-4">Loading task status...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 mt-4 border rounded">
      <h3 className="text-xl font-semibold mb-2">Task Status</h3>
      <p>Status: {status}</p>
    </div>
  );
};

export default TaskStatusDisplay;
