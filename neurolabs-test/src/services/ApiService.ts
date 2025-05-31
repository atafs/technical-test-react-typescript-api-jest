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

export const submitImage = async (
  taskUuid: string,
  image: File
): Promise<ImageSubmission> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch(
    `${API_BASE_URL}/image-recognition/tasks/${taskUuid}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to submit image: ${response.statusText}`);
  }
  return response.json();
};

export const getTaskStatus = async (
  taskUuid: string,
  imageId: string
): Promise<TaskStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/image-recognition/tasks/${taskUuid}/images/${imageId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch task status: ${response.statusText}`);
  }
  return response.json();
};

// Add this to make the file a module
export {};
