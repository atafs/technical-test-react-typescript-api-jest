import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CatalogView from "../components/CatalogView";
import { getCatalogItems } from "../services/ApiService";

jest.mock("../services/ApiService");

const mockCatalogItems = [
  {
    id: "item1",
    name: "Coca-Cola Bottle",
    thumbnail: "https://picsum.photos/200/300?1",
    status: "capture",
    description: "500ml PET bottle of Coca-Cola",
    category: "beverage",
    image_count: 12,
  },
  {
    id: "item2",
    name: "Lay's Classic Chips",
    thumbnail: "https://picsum.photos/200/300?2",
    status: "active",
    description: "150g packet of Lay's Classic chips",
    category: "snack",
    image_count: 8,
  },
  {
    id: "item3",
    name: "Pepsi Can",
    thumbnail: "https://picsum.photos/200/300?3",
    status: "inactive",
    description: "330ml aluminum can of Pepsi",
    category: "beverage",
    image_count: 10,
  },
];

describe("CatalogView", () => {
  test("renders catalog items with correct status styles", async () => {
    (getCatalogItems as jest.Mock).mockResolvedValue(mockCatalogItems);
    render(<CatalogView />);

    // Wait for all items to render
    await waitFor(() => {
      expect(screen.getByText("Coca-Cola Bottle")).toBeInTheDocument();
      expect(screen.getByText("Lay's Classic Chips")).toBeInTheDocument();
      expect(screen.getByText("Pepsi Can")).toBeInTheDocument();
    });

    // Assertions for capture status
    const captureCard = screen.getByText("Coca-Cola Bottle").closest("div");
    expect(captureCard).toHaveClass("border-red-500", "border-4");
    expect(screen.getByText("Status: capture")).toHaveClass(
      "text-red-500",
      "bg-red-100"
    );

    // Assertions for active status
    const activeCard = screen.getByText("Lay's Classic Chips").closest("div");
    expect(activeCard).toHaveClass("border-green-500");
    expect(screen.getByText("Status: active")).toHaveClass("text-green-500");

    // Assertions for inactive status
    const inactiveCard = screen.getByText("Pepsi Can").closest("div");
    expect(inactiveCard).toHaveClass("border-gray-500");
    expect(screen.getByText("Status: inactive")).toHaveClass("text-gray-500");
  });

  test("displays error on fetch failure", async () => {
    (getCatalogItems as jest.Mock).mockRejectedValue(new Error("Fetch error"));
    render(<CatalogView />);
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch catalog items")
      ).toBeInTheDocument();
    });
  });
});
