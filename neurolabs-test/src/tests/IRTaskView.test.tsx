import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IRTaskView from "../components/IRTaskView";
import { getIRTasks, uploadImage, getTaskStatus } from "../services/ApiService";

jest.mock("../services/ApiService");

describe("IRTaskView", () => {
  beforeEach(() => {
    (getIRTasks as jest.Mock).mockResolvedValue([
      { uuid: "task2", name: "Snack Recognition Task" },
    ]);
    (uploadImage as jest.Mock).mockResolvedValue({
      image_id: "img123",
      task_uuid: "task2",
      status: "pending",
      result: null,
    });
    (getTaskStatus as jest.Mock).mockResolvedValue({
      image_id: "img123",
      task_uuid: "task2",
      status: "pending",
      result: null,
    });
    // Mock URL.createObjectURL and URL.revokeObjectURL
    URL.createObjectURL = jest.fn().mockReturnValue("mocked-url");
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("resets submission status when reset button is clicked", async () => {
    render(<IRTaskView />);
    await waitFor(() => {
      expect(screen.getByText("Snack Recognition Task")).toBeInTheDocument();
    });

    // Upload file
    const input = screen.getByTestId("file-input");
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for preview and buttons
    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    // Submit image
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Status: pending")).toBeInTheDocument();
    });

    // Reset
    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.queryByText("Status: pending")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });
  });
});
