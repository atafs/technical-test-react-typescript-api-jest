import React, { useState, useEffect, useRef } from "react";
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
  const [retryCount, setRetryCount] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const pollStatus = async (attempts = 30, delay = 5000) => {
      setLoading(true);
      setError(null);
      for (let i = 0; i < attempts; i++) {
        if (!isMounted.current) {
          console.log("Polling stopped: Component unmounted");
          return;
        }

        try {
          const response = await getTaskStatus(task_uuid, image_id);
          console.log("Task status response:", response);
          if (isMounted.current) {
            setStatus(response.status || "unknown");
            setLoading(false);
          }
          return;
        } catch (err: any) {
          if (err.message.includes("404")) {
            console.log(
              `Attempt ${
                i + 1
              }/${attempts}: Task status not found, retrying in ${delay}ms...`
            );
            if (i === attempts - 1) {
              if (isMounted.current) {
                setError(
                  "Task status not found after multiple attempts. The image may still be processing."
                );
                setLoading(false);
              }
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error("Error fetching task status:", err.message);
            if (isMounted.current) {
              setError(`Failed to fetch task status: ${err.message}`);
              setLoading(false);
            }
            return;
          }
        }
      }
    };

    pollStatus();

    return () => {
      isMounted.current = false;
    };
  }, [task_uuid, image_id, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) return <div className="p-4">Loading task status...</div>;
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 border rounded">
      <h3 className="text-xl font-semibold mb-2">Task Status</h3>
      <p>Status: {status}</p>
      <button
        onClick={handleRetry}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Status
      </button>
    </div>
  );
};

export default TaskStatusDisplay;
