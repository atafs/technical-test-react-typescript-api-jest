import {
  getCatalogItems,
  getIRTasks,
  uploadImage,
  getTaskStatus,
} from "../services/ApiService";
import { API_BASE_URL, API_KEY } from "../services/Config";

// Mock the fetch API
global.fetch = jest.fn();

describe("API Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.API_KEY = "test-api-key";
  });

  describe("getCatalogItems", () => {
    it("should fetch and return catalog items successfully", async () => {
      const mockResponse = {
        items: [
          {
            uuid: "item-1",
            name: "Test Item",
            thumbnail_url: "http://example.com/thumbnail.jpg",
            status: "capture",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-02T00:00:00Z",
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getCatalogItems();

      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/catalog-items`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": API_KEY,
        },
      });
      expect(result).toEqual([
        {
          id: "item-1",
          uuid: "item-1",
          name: "Test Item",
          thumbnail_url: "http://example.com/thumbnail.jpg",
          status: "capture",
          barcode: undefined,
          custom_id: undefined,
          height: undefined,
          width: undefined,
          depth: undefined,
          brand: undefined,
          size: undefined,
          container_type: undefined,
          flavour: undefined,
          packaging_size: undefined,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-02T00:00:00Z",
          description: undefined,
          category: undefined,
          metadata: undefined,
          image_count: undefined,
        },
      ]);
    });

    it("should throw an error on failed fetch", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: jest.fn().mockResolvedValueOnce("Server error"),
      });

      await expect(getCatalogItems()).rejects.toThrow(
        "Failed to fetch catalog items: Internal Server Error"
      );
    });
  });

  describe("getIRTasks", () => {
    it("should fetch and return IR tasks successfully", async () => {
      const mockResponse = {
        items: [
          {
            uuid: "task-1",
            name: "Test Task",
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getIRTasks();

      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/image-recognition/tasks?limit=50&offset=0`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY,
          },
        }
      );
      expect(result).toEqual(mockResponse.items);
    });

    it("should throw an error on failed fetch", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: jest.fn().mockResolvedValueOnce("Not found"),
      });

      await expect(getIRTasks()).rejects.toThrow(
        "Failed to fetch IR tasks: Not Found"
      );
    });
  });

  describe("uploadImage", () => {
    it("should upload an image successfully", async () => {
      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = {
        image_id: "image-1",
        status: "uploaded",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await uploadImage("task-1", mockFile);

      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/image-recognition/tasks/task-1/images`,
        {
          method: "POST",
          headers: {
            "X-API-Key": API_KEY,
          },
          body: expect.any(FormData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error for invalid file", async () => {
      await expect(uploadImage("task-1", null as any)).rejects.toThrow(
        "Invalid file: File object is required"
      );
    });

    it("should throw an error on failed upload", async () => {
      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: jest.fn().mockResolvedValueOnce("Invalid image"),
      });

      await expect(uploadImage("task-1", mockFile)).rejects.toThrow(
        "HTTP error! Status: 400"
      );
    });
  });

  describe("getTaskStatus", () => {
    it("should fetch task status successfully", async () => {
      const mockResponse = {
        image_id: "image-1",
        status: "processed",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getTaskStatus("task-1", "image-1");

      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/image-recognition/tasks/task-1/images/image-1`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error for invalid image_id", async () => {
      await expect(getTaskStatus("task-1", "")).rejects.toThrow(
        "Invalid image_id: cannot be undefined or empty"
      );
    });

    it("should throw an error on failed fetch", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: jest.fn().mockResolvedValueOnce("Server error"),
      });

      await expect(getTaskStatus("task-1", "image-1")).rejects.toThrow(
        "HTTP error! Status: 500"
      );
    });
  });
});
