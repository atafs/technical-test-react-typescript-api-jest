import React, { useState, useEffect } from "react";
import { getIRTasks, uploadImage } from "../services/ApiService";
import ImageUploader from "./ImageUploader";
import TaskStatusDisplay from "./TaskStatusDisplay";

const IRTaskView: React.FC = () => {
  const [tasks, setTasks] = useState<{ uuid: string; name: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [submission, setSubmission] = useState<{
    image_id: string;
    task_uuid: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getIRTasks();
        setTasks(data);
        if (data.length > 0) setSelectedTask(data[0].uuid);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleUpload = async (file: File) => {
    if (!selectedTask) {
      setError("No task selected");
      return;
    }
    try {
      setSubmission(null); // Clear previous submission
      setError(null);
      const response = await uploadImage(selectedTask, file);
      console.log("Upload response:", response);
      setSubmission({ image_id: response.image_id, task_uuid: selectedTask });
    } catch (err: any) {
      console.error("Upload error:", err.message);
      setError(`Failed to upload image: ${err.message}`);
    }
  };

  const handleReset = () => {
    console.log("Resetting IRTaskView submission");
    setSubmission(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Image Recognition Tasks</h2>
      <select
        value={selectedTask}
        onChange={(e) => setSelectedTask(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      >
        {tasks.map((task) => (
          <option key={task.uuid} value={task.uuid}>
            {task.name}
          </option>
        ))}
      </select>
      <ImageUploader onUpload={handleUpload} onReset={handleReset} />
      {submission && (
        <TaskStatusDisplay
          task_uuid={submission.task_uuid}
          image_id={submission.image_id}
        />
      )}
    </div>
  );
};

export default IRTaskView;
