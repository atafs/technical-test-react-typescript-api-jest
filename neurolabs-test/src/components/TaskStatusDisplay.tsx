import React, { useState, useEffect } from "react";
import { getTaskStatus } from "../services/ApiService";
interface Props {
  task_uuid: string;
  image_id: string;
}

const TaskStatusDisplay: React.FC<Props> = ({ task_uuid, image_id }) => {
  const [status, setStatus] = useState<string>("pending");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const data = await getTaskStatus(task_uuid, image_id);
        if (!data || typeof data.status !== "string") {
          throw new Error("Invalid status response");
        }
        setStatus(data.status);
        setResult(data.result);
        setError(null);
      } catch (err: any) {
        const errorMessage = `Failed to fetch task status: ${err.message} (Task: ${task_uuid}, Image: ${image_id})`;
        console.error(errorMessage);
        setError(errorMessage);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [task_uuid, image_id]);

  if (error) return <div className="text-red-500 mt-2">{error}</div>;

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold">Status: {status}</p>
      {result && (
        <div>
          <h3 className="text-lg font-medium">Recognized Items:</h3>
          <ul className="list-disc pl-5">
            {result.recognized_items.map((item: any) => (
              <li key={item.item_id} className="text-sm">
                Item ID: {item.item_id}, Confidence: {item.confidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskStatusDisplay;
