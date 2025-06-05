import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploader from "../components/ImageUploader";

describe("ImageUploader", () => {
  const mockOnUpload = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log
    jest.spyOn(console, "log").mockImplementation(() => {});
    // Define URL.createObjectURL and URL.revokeObjectURL as jest functions
    Object.defineProperty(global.URL, "createObjectURL", {
      value: jest.fn(() => "mock-preview-url"),
      writable: true,
    });
    Object.defineProperty(global.URL, "revokeObjectURL", {
      value: jest.fn(),
      writable: true,
    });
    // Spy on the mocked functions
    jest.spyOn(URL, "createObjectURL");
    jest.spyOn(URL, "revokeObjectURL");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders ImageUploader with file input and buttons", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  test("displays image preview when a file is selected", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const file = new File(["image"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    const img = screen.getByAltText("Preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "mock-preview-url");
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(console.log).toHaveBeenCalledWith(
      "Selected file:",
      "test.png",
      "Size:",
      file.size,
      "Type:",
      "image/png"
    );
    expect(console.log).toHaveBeenCalledWith(
      "Preview URL set:",
      "mock-preview-url"
    );
  });

  test("enables submit button when a file is selected", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const file = new File(["image"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByTestId("submit-button")).not.toBeDisabled();
  });

  test("calls onUpload with selected file when submit button is clicked", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const file = new File(["image"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(mockOnUpload).toHaveBeenCalledWith(file);
    expect(console.log).toHaveBeenCalledWith("Submitting file:", "test.png");
  });

  test("resets state and calls onReset when reset button is clicked", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const file = new File(["image"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("mock-preview-url");
    expect(console.log).toHaveBeenCalledWith("Resetting ImageUploader states");
    expect(console.log).toHaveBeenCalledWith(
      "Revoking preview URL:",
      "mock-preview-url"
    );
    expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  test("does not call onUpload when no file is selected", () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(mockOnUpload).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining("Submitting file:")
    );
  });
});