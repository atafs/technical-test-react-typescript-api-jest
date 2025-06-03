import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TaskStatusDisplay from "../components/TaskStatusDisplay";
import { getTaskStatus } from "../services/ApiService";

jest.mock("../services/ApiService");

describe("TaskStatusDisplay", () => {
  const mockTaskUuid = "task-123";
  const mockImageId = "img-456";
  const mockGetTaskStatus = getTaskStatus as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("renders loading state initially", async () => {
    mockGetTaskStatus.mockReturnValue(new Promise(() => {})); // Never resolve
    render(
      <TaskStatusDisplay task_uuid={mockTaskUuid} image_id={mockImageId} />
    );

    expect(screen.getByText("Loading task status...")).toBeInTheDocument();
    expect(
      screen.getByText("Loading task status...").closest("div")
    ).toHaveClass("p-4");
  });

  test("displays task status on successful API call", async () => {
    mockGetTaskStatus.mockImplementationOnce(() =>
      Promise.resolve({ status: "COMPLETED" })
    );
    render(
      <TaskStatusDisplay task_uuid={mockTaskUuid} image_id={mockImageId} />
    );

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve(); // Flush microtasks
    });

    await waitFor(
      () => {
        expect(screen.getByText("Task Status")).toBeInTheDocument();
        expect(screen.getByText("Status: COMPLETED")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(mockGetTaskStatus).toHaveBeenCalledWith(mockTaskUuid, mockImageId);
    expect(console.log).toHaveBeenCalledWith("Task status response:", {
      status: "COMPLETED",
    });
    expect(
      screen.getByRole("button", { name: /Refresh Status/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Task Status").closest("div")).toHaveClass(
      "p-4",
      "mt-4",
      "border",
      "rounded"
    );
    expect(screen.getByText("Task Status")).toHaveClass(
      "text-xl",
      "font-semibold",
      "mb-2"
    );
  });

  test("displays error for non-404 API errors", async () => {
    mockGetTaskStatus.mockImplementationOnce(() =>
      Promise.reject(new Error("Server Error"))
    );
    render(
      <TaskStatusDisplay task_uuid={mockTaskUuid} image_id={mockImageId} />
    );

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve(); // Flush microtasks
    });

    await waitFor(
      () => {
        expect(
          screen.getByText("Failed to fetch task status: Server Error")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(mockGetTaskStatus).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching task status:",
      "Server Error"
    );
    expect(
      screen.getByText(/Failed to fetch task status/).closest("div")
    ).toHaveClass("p-4", "text-red-500");
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  test("refresh status button triggers polling", async () => {
    mockGetTaskStatus.mockImplementationOnce(() =>
      Promise.resolve({ status: "COMPLETED" })
    );
    render(
      <TaskStatusDisplay task_uuid={mockTaskUuid} image_id={mockImageId} />
    );

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve(); // Flush microtasks
    });

    await waitFor(
      () => {
        expect(screen.getByText("Status: COMPLETED")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    mockGetTaskStatus.mockImplementationOnce(() =>
      Promise.resolve({ status: "PENDING" })
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Refresh Status/i }));
      jest.runAllTimers();
      await Promise.resolve(); // Flush microtasks
    });

    await waitFor(
      () => {
        expect(screen.getByText("Status: PENDING")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(mockGetTaskStatus).toHaveBeenCalledTimes(2);
  });

  test("applies correct button styling", async () => {
    mockGetTaskStatus.mockImplementationOnce(() =>
      Promise.reject(new Error("Server Error"))
    );
    render(
      <TaskStatusDisplay task_uuid={mockTaskUuid} image_id={mockImageId} />
    );

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve(); // Flush microtasks
    });

    await waitFor(
      () => {
        const retryButton = screen.getByRole("button", { name: /Retry/i });
        expect(retryButton).toHaveClass(
          "mt-2",
          "px-4",
          "py-2",
          "bg-blue-500",
          "text-white",
          "rounded",
          "hover:bg-blue-600"
        );
      },
      { timeout: 5000 }
    );
  });
});
