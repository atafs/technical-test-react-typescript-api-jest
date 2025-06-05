import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import IRTaskView from "../components/IRTaskView";
import { getIRTasks, uploadImage } from "../services/ApiService";
import { IRTask } from "../types";

// Mock the ApiService
jest.mock("../services/ApiService");

// Mock child components
jest.mock(
  "../components/ImageUploader",
  () =>
    ({
      onUpload,
      onReset,
    }: {
      onUpload: (file: File) => void;
      onReset: () => void;
    }) =>
      (
        <div data-testid="image-uploader">
          <input
            data-testid="file-input"
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) onUpload(e.target.files[0]);
            }}
          />
          <button data-testid="reset-button" onClick={onReset}>
            Reset
          </button>
        </div>
      )
);
jest.mock(
  "../components/TaskStatusDisplay",
  () =>
    ({ task_uuid, image_id }: { task_uuid: string; image_id: string }) =>
      (
        <div data-testid="task-status-display">
          Status for {task_uuid}/{image_id}
        </div>
      )
);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("IRTaskView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renders loading state while fetching tasks", () => {
    (getIRTasks as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <IRTaskView />
      </BrowserRouter>
    );

    const loadingElement = screen.getByTestId("loading-container");
    expect(loadingElement).toHaveTextContent("Loading...");
    expect(loadingElement).toHaveClass("p-4");
  });

  it("renders error message when fetch fails", async () => {
    (getIRTasks as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <IRTaskView />
      </BrowserRouter>
    );

    await waitFor(() => {
      const errorElement = screen.getByTestId("error-container");
      expect(errorElement).toHaveTextContent("Failed to fetch tasks");
      expect(errorElement).toHaveClass("text-red-500");
    });
  });

  it("navigates to home when back button is clicked", async () => {
    (getIRTasks as jest.Mock).mockResolvedValue([]);

    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <IRTaskView />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Image Recognition Tasks")).toBeInTheDocument();
    });

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
