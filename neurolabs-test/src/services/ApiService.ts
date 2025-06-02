import { CatalogItem, IRTask, ImageSubmission, TaskStatus } from "../types";

// Use proxy in development, fallback to full URL if proxy fails
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/v2"
    : "https://staging.api.neurolabs.ai/v2";
const API_KEY: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODAxNjA1MjMsImlhdCI6MTc0ODYyNDUyMywiaXNzIjoiaHR0cHM6Ly9zdGFnaW5nLmFwaS5uZXVyb2xhYnMuYWkvIiwianRpIjoiMjMxZjk0MWUtNTA5YS00MDE0LTk4OTMtOTNiYTM5ZTIwYWZjIiwic3ViIjoiYjExY2ZjZDAtMzk4YS00OGE1LTljODktODZjNDdlODBlZmY1In0.xbxonZ0YX6J3_OIlIk_FL0hE4rymBDre8FE6pCEaqE4";

const getHeaders = () => {
  if (!API_KEY) {
    throw new Error("API key is missing");
  }
  const headers = {
    accept: "application/json",
    "X-API-Key": API_KEY,
  };
  console.log("Request headers:", headers); // Debug headers
  return headers;
};

export const getCatalogItems = async (): Promise<CatalogItem[]> => {
  const url = `${API_BASE_URL}/catalog-items`;
  console.log("Fetching catalog items from:", url); // Debug URL
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to fetch catalog items: ${response.status} ${errorBody}`
    );
    throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Catalog items response:", data); // Debug response
  return data;
};

export const getIRTasks = async (): Promise<IRTask[]> => {
  const url = `${API_BASE_URL}/image-recognition/tasks?limit=50&offset=0`;
  console.log("Fetching IR tasks from:", url); // Debug URL
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch IR tasks: ${response.status} ${errorBody}`);
    throw new Error(`Failed to fetch IR tasks: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("IR tasks response:", data); // Debug response
  return data;
};

export const uploadImage = async (task_uuid: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const url = `${API_BASE_URL}/image-recognition/tasks/${task_uuid}/images`;
    console.log("Uploading image to:", url); // Debug URL
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    });
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
    const url = `${API_BASE_URL}/image-recognition/tasks/${task_uuid}/images/${image_id}`;
    console.log("Fetching task status from:", url); // Debug URL
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch task status: ${response.status} ${errorBody}`
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Task status response:", data); // Debug response
    return data;
  } catch (err) {
    console.error("Network or parsing error:", err);
    throw err;
  }
};

// Add this to make the file a module
export {};
