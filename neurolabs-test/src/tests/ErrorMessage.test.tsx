import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  test("renders the error message correctly", () => {
    const testMessage = "An error occurred";
    render(<ErrorMessage message={testMessage} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test("applies correct styling to the container", () => {
    const testMessage = "Test error";
    render(<ErrorMessage message={testMessage} />);

    const container = screen.getByText(testMessage).closest("div");
    expect(container).toHaveClass("text-red-500", "text-center", "p-4");
  });

  test("renders different messages correctly", () => {
    const messages = ["Error one", "Another error"];
    messages.forEach((message) => {
      render(<ErrorMessage message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  test("renders empty message without breaking", () => {
    render(<ErrorMessage message="" />);

    // Query the <p> element, which may have empty content
    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("");

    // Verify the parent <div> has the correct classes
    const container = paragraph.closest("div");
    expect(container).toHaveClass("text-red-500", "text-center", "p-4");
  });
});
