import { API_BASE_URL, API_KEY } from "./Config"; // Adjust the path based on your file structure
import { CatalogItem, IRTask } from "../types";

const getHeaders = () => {
  if (!API_KEY) {
    throw new Error("API key is missing");
  }
  return {
    accept: "application/json",
    "X-API-Key": API_KEY,
  };
};

export const getCatalogItems = async (): Promise<CatalogItem[]> => {
  const url = `${API_BASE_URL}/catalog-items`;
  console.log("Fetching catalog items from:", url);
  const headers = getHeaders();
  console.log("Request headers:", headers);
  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to fetch catalog items: ${response.status} ${errorBody}`
    );
    throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Catalog items response:", data);
  return (data.items || []).map((item: any) => ({
    id: item.uuid || "",
    uuid: item.uuid || "",
    name: item.name || "",
    thumbnail_url: item.thumbnail_url || "",
    status: item.status || "",
    barcode: item.barcode,
    custom_id: item.custom_id,
    height: item.height,
    width: item.width,
    depth: item.depth,
    brand: item.brand,
    size: item.size,
    container_type: item.container_type,
    flavour: item.flavour,
    packaging_size: item.packaging_size,
    created_at: item.created_at || "",
    updated_at: item.updated_at || "",
    description: undefined,
    category: undefined,
    metadata: undefined,
    image_count: undefined,
  }));
};

export const getIRTasks = async (): Promise<IRTask[]> => {
  const url = `${API_BASE_URL}/image-recognition/tasks?limit=50&offset=0`;
  console.log("Fetching IR tasks from:", url);
  const headers = getHeaders();
  console.log("Request headers:", headers);
  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch IR tasks: ${response.status} ${errorBody}`);
    throw new Error(`Failed to fetch IR tasks: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("IR tasks response:", data);
  return data.items || [];
};

export const uploadImage = async (task_uuid: string, file: File) => {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file: File object is required");
    }
    console.log(
      "File to upload:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );
    const formData = new FormData();
    formData.append("images", file);
    const url = `${API_BASE_URL}/image-recognition/tasks/${task_uuid}/images`;
    console.log("Uploading image to:", url);
    const headers = {
      "X-API-Key": API_KEY,
    };
    console.log("Request headers:", headers);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Upload failed: ${response.status} ${errorBody}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Upload response data:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Upload network or parsing error:", err);
    throw err;
  }
};

export const getTaskStatus = async (task_uuid: string, image_id: string) => {
  try {
    if (!image_id) {
      throw new Error("Invalid image_id: cannot be undefined or empty");
    }
    const url = `${API_BASE_URL}/image-recognition/tasks/${task_uuid}/images/${image_id}`;
    console.log("Fetching task status from:", url);
    const headers = getHeaders();
    console.log("Request headers:", headers);
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch task status: ${response.status} ${errorBody}`
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Task status response:", data);
    return data;
  } catch (err) {
    console.error("Network or parsing error:", err);
    throw err;
  }
};

// Add this to make the file a module
export {};
