import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

describe("IRTaskView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state while fetching tasks", () => {
    (getIRTasks as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<IRTaskView />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message when fetch fails", async () => {
    (getIRTasks as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    render(<IRTaskView />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch tasks")).toBeInTheDocument();
    });
  });

  it("resets submission status when reset button is clicked", async () => {
    const mockTasks: IRTask[] = [
      { uuid: "task2", name: "Snack Recognition Task" },
    ];
    (getIRTasks as jest.Mock).mockResolvedValue(mockTasks);
    (uploadImage as jest.Mock).mockResolvedValue(["img123"]);

    render(<IRTaskView />);

    // Verify task is rendered
    await waitFor(() => {
      expect(screen.getByText("Image Recognition Tasks")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveValue("task2");
      expect(screen.getByText("Snack Recognition Task")).toBeInTheDocument();
    });

    // Simulate file upload
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verify TaskStatusDisplay is rendered
    await waitFor(() => {
      expect(screen.getByTestId("task-status-display")).toHaveTextContent(
        "Status for task2/img123"
      );
    });

    // Simulate reset
    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    // Verify TaskStatusDisplay is removed
    await waitFor(() => {
      expect(
        screen.queryByTestId("task-status-display")
      ).not.toBeInTheDocument();
    });
  });
});
