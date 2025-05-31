import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploader from "../components/ImageUploader";

describe("ImageUploader", () => {
  const mockOnUpload = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
    global.URL.revokeObjectURL = jest.fn(() => {});
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up mocks
    jest.restoreAllMocks();
  });

  test("renders file input and allows image selection with preview", async () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    await waitFor(
      () => {
        expect(screen.getByAltText("Preview")).toHaveAttribute(
          "src",
          "mocked-url"
        );
      },
      { timeout: 1000 }
    );
  });

  test("displays error for non-image files", async () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["text"], "test.txt", { type: "text/plain" });

    // Suppress and verify expected console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "Failed to load preview: Selected file is not an image"
          )
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error generating preview:",
      "Selected file is not an image"
    );
    consoleErrorSpy.mockRestore();
  });

  test("displays larger preview, disables submit button after submission, and resets states", async () => {
    mockOnUpload.mockResolvedValueOnce(undefined);
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(
      () => {
        expect(screen.getByAltText("Preview")).toHaveAttribute(
          "src",
          "mocked-url"
        );
      },
      { timeout: 1000 }
    );

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalledWith(file);
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute("disabled");
      },
      { timeout: 1000 }
    );

    expect(submitButton).toHaveTextContent("Submit Image");

    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    await waitFor(
      () => {
        expect(mockOnReset).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mocked-url");
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(fileInput).toHaveValue("");
      },
      { timeout: 1000 }
    );
  });

  test("re-enables submit button on new file selection", async () => {
    mockOnUpload.mockResolvedValueOnce(undefined);
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute("disabled");
      },
      { timeout: 1000 }
    );

    const newFile = new File(["image"], "new.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [newFile] } });

    await waitFor(
      () => {
        expect(submitButton).not.toBeDisabled();
      },
      { timeout: 1000 }
    );
  });

  test("allows re-selecting the same image after reset", async () => {
    mockOnUpload.mockResolvedValueOnce(undefined);
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    fireEvent.click(screen.getByTestId("reset-button"));

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(
      () => {
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2);
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(screen.getByAltText("Preview")).toHaveAttribute(
          "src",
          "mocked-url"
        );
      },
      { timeout: 1000 }
    );
  });

  test("re-enables submit button on failed submission", async () => {
    mockOnUpload.mockRejectedValueOnce(new Error("Upload failed"));
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    // Suppress and verify expected console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(
          screen.getByText("Failed to submit image: Upload failed")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("submit-button")).not.toBeDisabled();
      },
      { timeout: 1000 }
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Submission error:",
      "Upload failed"
    );
    consoleErrorSpy.mockRestore();
  });

  test("handles image load error", async () => {
    render(<ImageUploader onUpload={mockOnUpload} onReset={mockOnReset} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["image"], "test.png", { type: "image/png" });

    // Suppress and verify expected console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(
      () => {
        expect(screen.getByAltText("Preview")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    const previewImage = screen.getByAltText("Preview");
    fireEvent.error(previewImage);

    await waitFor(
      () => {
        expect(
          screen.getByText("Failed to display image preview")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(fileInput).toHaveValue("");
      },
      { timeout: 1000 }
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Image failed to load:",
      expect.any(Object)
    );
    consoleErrorSpy.mockRestore();
  });
});
