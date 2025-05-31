import { CatalogItem, IRTask, ImageSubmission, TaskStatus } from "../types";

const API_BASE_URL = "/v2";
const API_KEY = process.env.REACT_APP_API_KEY;

const getHeaders = () => ({
  Authorization: `Bearer ${API_KEY}`,
});

export const getCatalogItems = async (): Promise<CatalogItem[]> => {
  const response = await fetch(`${API_BASE_URL}/catalog-items`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
  }
  return response.json();
};

export const getIRTasks = async (): Promise<IRTask[]> => {
  const response = await fetch(`${API_BASE_URL}/image-recognition/tasks`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch IR tasks: ${response.statusText}`);
  }
  return response.json();
};

export const uploadImage = async (task_uuid: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `/v2/image-recognition/tasks/${task_uuid}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            process.env.REACT_APP_API_KEY || "dummy-key"
          }`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Upload failed: ${response.status} ${errorBody}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Upload response data:", data);
    return data;
  } catch (err) {
    console.error("Upload network or parsing error:", err);
    throw err;
  }
};

export const getTaskStatus = async (task_uuid: string, image_id: string) => {
  try {
    const response = await fetch(
      `/v2/image-recognition/tasks/${task_uuid}/images/${image_id}`,
      {
        headers: {
          Authorization: `Bearer ${
            process.env.REACT_APP_API_KEY || "dummy-key"
          }`,
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch task status: ${response.status} ${errorBody}`
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error("Network or parsing error:", err);
    throw err;
  }
};

// Add this to make the file a module
export {};
