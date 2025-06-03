import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "../components/LoadingSpinner";

describe("LoadingSpinner", () => {
  test("has correct DOM hierarchy", () => {
    const { container } = render(<LoadingSpinner />);

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass("flex", "justify-center", "items-center");

    const spinnerDiv = outerDiv?.firstChild;
    expect(spinnerDiv).toHaveClass(
      "animate-spin",
      "rounded-full",
      "h-8",
      "w-8",
      "border-t-2",
      "border-b-2",
      "border-indigo-600"
    );
  });
});
