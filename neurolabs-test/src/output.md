
## File: components/ImageUploader.tsx
import React, { useState, useEffect } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      console.log(
        "Selected file:",
        selectedFile.name,
        "Size:",
        selectedFile.size,
        "Type:",
        selectedFile.type
      );
      console.log("Preview URL set:", url);
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Submitting file:", file.name);
      onUpload(file);
    }
  };

  const handleResetClick = () => {
    console.log("Resetting ImageUploader states");
    setFile(null);
    if (previewUrl) {
      console.log("Revoking preview URL:", previewUrl);
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onReset();
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
        data-testid="file-input"
      />
      {previewUrl && (
        <div className="mb-2">
          <img src={previewUrl} alt="Preview" className="max-w-xs" />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!file}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          data-testid="submit-button"
        >
          Upload
        </button>
        <button
          onClick={handleResetClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          data-testid="reset-button"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;



## File: components/ErrorMessage.tsx
import React from "react";

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="text-red-500 text-center p-4">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;



## File: components/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CatalogView from "./CatalogView";
import IRTaskView from "./IRTaskView";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Neurolabs Demo</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CatalogView />
          <IRTaskView />
        </div>
      </div>
    </div>
  );
};

export default Home;



## File: components/CatalogView.tsx
import React, { useEffect, useState } from "react";
import { getCatalogItems } from "../services/ApiService";
import { CatalogItem } from "../types";
import CatalogItemCard from "./CatalogItemCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const CatalogView: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getCatalogItems();
        setItems(data);
      } catch (err) {
        setError("Failed to fetch catalog items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Catalog Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <CatalogItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CatalogView;



## File: components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default LoadingSpinner;



## File: components/IRTaskView.tsx
import React, { useState, useEffect } from "react";
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
      const image_id =
        Array.isArray(response) && response.length > 0 ? response[0] : null;
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



## File: components/CatalogItemCard.tsx
import React from "react";
import { CatalogItem } from "../types";

interface Props {
  item: CatalogItem;
}

const CatalogItemCard: React.FC<Props> = ({ item }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "READY":
        return { border: "border-green-500", text: "text-green-500" };
      case "PROCESSING":
        return {
          border: "border-red-500 border-4",
          text: "text-red-500 bg-red-100 px-2 py-1 rounded",
        };
      default:
        return { border: "border-gray-300", text: "text-gray-600" };
    }
  };

  const { border, text } = getStatusStyles(item.status);

  return (
    <div
      className={`p-4 border rounded bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${border}`}
    >
      <img
        src={item.thumbnail_url}
        alt={item.name}
        className="w-full h-32 object-cover mb-2 rounded"
      />
      <h3
        className="text-lg font-medium text-gray-800 w-full truncate"
        title={item.name} // Tooltip for full name on hover
      >
        {item.name}
      </h3>
      <p className={`text-sm font-semibold ${text}`}>Status: {item.status}</p>
      {item.barcode && (
        <p className="text-sm text-gray-600">Barcode: {item.barcode}</p>
      )}
      {item.brand && (
        <p className="text-sm text-gray-600">Brand: {item.brand}</p>
      )}
      {/* Commented out fields not in API response */}
      {/* {item.description && (
        <p className="text-sm text-gray-600">Description: {item.description}</p>
      )}
      {item.category && (
        <p className="text-sm text-gray-600">Category: {item.category}</p>
      )}
      {item.metadata?.brand && (
        <p className="text-sm text-gray-600">Brand: {item.metadata.brand}</p>
      )}
      {item.image_count !== undefined && (
        <p className="text-sm text-gray-600">Images: {item.image_count}</p>
      )} */}
    </div>
  );
};

export default CatalogItemCard;



## File: components/TaskStatusDisplay.tsx
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


