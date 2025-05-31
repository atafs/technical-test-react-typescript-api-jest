import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploader from "../components/ImageUploader";

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
URL.createObjectURL = mockCreateObjectURL;
URL.revokeObjectURL = mockRevokeObjectURL;

describe("ImageUploader", () => {
  beforeEach(() => {
    mockCreateObjectURL.mockReset();
    mockRevokeObjectURL.mockReset();
    mockCreateObjectURL.mockReturnValue("mocked-url");
    // Suppress console.error for expected test errors
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays larger preview, disables submit button, and resets states", async () => {
    const mockOnUpload = jest.fn().mockResolvedValue(undefined);
    const mockOnReset = jest.fn();
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });

    // Upload file
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toHaveAttribute(
        "src",
        "mocked-url"
      );
    });
    expect(mockOnUpload).not.toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByAltText("Preview")).toHaveClass(
      "max-w-[400px]",
      "h-64",
      "object-contain"
    );
    expect(screen.getByText("Upload Image")).toHaveClass(
      "bg-indigo-600",
      "text-white"
    );

    // Click Submit
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    expect(mockOnUpload).toHaveBeenCalledWith(file);
    expect(submitButton).toHaveTextContent("Submit Image");

    // Click Reset
    const resetButton = screen.getByTestId("reset-button");
    expect(resetButton).toHaveClass("bg-red-600", "text-white");
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalled();
    });
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("mocked-url");
    expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
  });

  test("displays error for non-image file", async () => {
    const mockOnUpload = jest.fn();
    const mockOnReset = jest.fn();
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to load preview: Selected file is not an image"
        )
      ).toBeInTheDocument();
    });
    expect(mockOnUpload).not.toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
  });

  test("displays error if image fails to load", async () => {
    const mockOnUpload = jest.fn();
    const mockOnReset = jest.fn();
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    mockCreateObjectURL.mockReturnValue("invalid-url");
    fireEvent.change(input, { target: { files: [file] } });
    const img = screen.getByAltText("Preview");
    fireEvent.error(img);
    await waitFor(() => {
      expect(
        screen.getByText("Failed to display image preview")
      ).toBeInTheDocument();
    });
    expect(mockOnReset).not.toHaveBeenCalled();
    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
  });

  test("displays error if submit clicked without file", async () => {
    const mockOnUpload = jest.fn();
    const mockOnReset = jest.fn();
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(input, { target: { files: null } });
    await waitFor(() => {
      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });
    expect(mockOnReset).not.toHaveBeenCalled();
    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  test("reenables button on submission error", async () => {
    const mockOnUpload = jest
      .fn()
      .mockRejectedValue(new Error("Upload failed"));
    const mockOnReset = jest.fn();
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Failed to submit image: Upload failed")
      ).toBeInTheDocument();
    });

    // Test reset after error
    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalled();
    });
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("mocked-url");
    expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Failed to submit image: Upload failed")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
  });
});
