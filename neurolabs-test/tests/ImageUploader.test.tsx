import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploader from "../src/components/ImageUploader";

test("handles image upload and displays preview", () => {
  const mockOnUpload = jest.fn();
  render(<ImageUploader onUpload={mockOnUpload} />);
  const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
  const file = new File(["dummy"], "test.png", { type: "image/png" });
  fireEvent.change(input, { target: { files: [file] } });
  expect(mockOnUpload).toHaveBeenCalledWith(file);
  expect(screen.getByAltText("Preview")).toBeInTheDocument();
});
