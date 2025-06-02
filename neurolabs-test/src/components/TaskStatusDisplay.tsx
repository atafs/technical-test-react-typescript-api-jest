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
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 5;

  useEffect(() => {
    if (!image_id) {
      setError("Invalid image_id: cannot be undefined or empty");
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const pollStatus = async () => {
      try {
        const response = await getTaskStatus(task_uuid, image_id);
        setStatus(response.status || "unknown");
        setError(null);
        setRetryCount(0);
        if (response.status === "completed" || response.status === "failed") {
          if (intervalId) clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error(
          `Failed to fetch task status: ${err.message} (Task: ${task_uuid}, Image: ${image_id})`
        );
        if (err.message.includes("401")) {
          setError("Unauthorized: Invalid API key. Please contact support.");
          if (intervalId) clearInterval(intervalId);
        } else if (err.message.includes("404") && retryCount < maxRetries) {
          setError(
            `Image not found, retrying (${retryCount + 1}/${maxRetries})...`
          );
          setRetryCount(retryCount + 1);
        } else {
          setError(`Failed to fetch task status: ${err.message}`);
          if (intervalId) clearInterval(intervalId);
        }
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [task_uuid, image_id, retryCount]);

  if (error) {
    return <div className="text-red-500 mt-2">{error}</div>;
  }

  return <div className="mt-2">Status: {status || "pending"}</div>;
};

export default TaskStatusDisplay;
