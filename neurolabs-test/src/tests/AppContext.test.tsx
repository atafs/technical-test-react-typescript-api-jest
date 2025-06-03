import React from "react";
import { render, screen } from "@testing-library/react";
import { AppProvider, useAppContext } from "../context/AppContext";

describe("AppContext", () => {
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules();
    process.env.REACT_APP_API_KEY = mockApiKey;
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.REACT_APP_API_KEY;
  });

  test("AppProvider renders children and provides apiKey", () => {
    const TestComponent = () => {
      const { apiKey } = useAppContext();
      return <div data-testid="api-key">{apiKey}</div>;
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const apiKeyElement = screen.getByTestId("api-key");
    expect(apiKeyElement).toBeInTheDocument();
    expect(apiKeyElement).toHaveTextContent(mockApiKey);
  });

  test("useAppContext throws error when used outside AppProvider", () => {
    const TestComponent = () => {
      const { apiKey } = useAppContext();
      return <div>{apiKey}</div>;
    };

    // Suppress console.error to avoid clutter
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useAppContext must be used within an AppProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  test("AppProvider renders multiple children correctly", () => {
    const Child1 = () => <div data-testid="child1">Child 1</div>;
    const Child2 = () => <div data-testid="child2">Child 2</div>;

    render(
      <AppProvider>
        <Child1 />
        <Child2 />
      </AppProvider>
    );

    expect(screen.getByTestId("child1")).toHaveTextContent("Child 1");
    expect(screen.getByTestId("child2")).toHaveTextContent("Child 2");
  });
});
