import React, { useEffect, useState } from "react";
import { getIRTasks, submitImage, getTaskStatus } from "../services/ApiService";
import { IRTask, ImageSubmission, TaskStatus } from "../types";
import ImageUploader from "./ImageUploader";
import TaskStatusDisplay from "./TaskStatusDisplay";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const IRTaskView: React.FC = () => {
  const [tasks, setTasks] = useState<IRTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [submission, setSubmission] = useState<ImageSubmission | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getIRTasks();
        setTasks(data);
        if (data.length > 0) setSelectedTask(data[0].uuid);
      } catch (err) {
        setError("Failed to fetch IR tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!selectedTask) return;
    setLoading(true);
    try {
      const result = await submitImage(selectedTask, file);
      setSubmission(result);
      pollStatus(result.task_uuid, result.image_id);
    } catch (err) {
      setError("Failed to submit image");
      setLoading(false);
    }
  };

  const pollStatus = async (taskUuid: string, imageId: string) => {
    try {
      const result = await getTaskStatus(taskUuid, imageId);
      setStatus(result);
      if (result.status === "pending") {
        setTimeout(() => pollStatus(taskUuid, imageId), 2000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch task status");
      setLoading(false);
    }
  };

  if (loading && !submission) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Image Recognition Tasks</h2>
      <select
        className="mb-4 p-2 border rounded"
        value={selectedTask}
        onChange={(e) => setSelectedTask(e.target.value)}
      >
        {tasks.map((task) => (
          <option key={task.uuid} value={task.uuid}>
            {task.name}
          </option>
        ))}
      </select>
      <ImageUploader onUpload={handleImageUpload} />
      {submission && status && <TaskStatusDisplay status={status} />}
    </div>
  );
};

export default IRTaskView;
