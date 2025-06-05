import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIRTasks, uploadImage } from "../services/ApiService";
import { IRTask } from "../types";
import ImageUploader from "./ImageUploader";
import TaskStatusDisplay from "./TaskStatusDisplay";

// Explicitly define that IRTaskView takes no props
const IRTaskView: React.FC<{}> = () => {
  const [tasks, setTasks] = useState<IRTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [submission, setSubmission] = useState<{
    image_id: string;
    task_uuid: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getIRTasks();
        console.log("Fetched tasks (JSON):", JSON.stringify(data, null, 2));
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
    if (!file || !(file instanceof File)) {
      setError("Invalid file: Please select a valid image file");
      return;
    }
    try {
      setSubmission(null); // Clear previous submission
      setError(null);
      console.log("Uploading image for task:", selectedTask, "File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });
      const response = await uploadImage(selectedTask, file);
      console.log("Upload response:", response);
      const image_id = response.image_id;
      if (!image_id) {
        setError("Upload response does not contain a valid image identifier");
        return;
      }
      const newSubmission = { image_id, task_uuid: selectedTask };
      setSubmission(newSubmission);
      console.log("Set submission:", newSubmission);
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

if (loading) return <div data-testid="loading-container" className="p-4">Loading...</div>;
if (error) return <div data-testid="error-container" className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Image Recognition Tasks</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Back
        </button>
      </div>
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
