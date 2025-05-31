import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CatalogView from "../src/components/CatalogView";
import { getCatalogItems } from "../src/services/ApiService";

jest.mock("../src/services/ApiService");

const mockCatalogItems = [
  {
    id: "1",
    name: "Item 1",
    thumbnail: "http://example.com/thumb1.jpg",
    status: "capture",
    description: "Test item",
    category: "beverage",
    image_count: 5,
  },
];

test("renders catalog items", async () => {
  (getCatalogItems as jest.Mock).mockResolvedValue(mockCatalogItems);
  render(<CatalogView />);
  await waitFor(() => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Status: capture")).toBeInTheDocument();
    expect(screen.getByText("Description: Test item")).toBeInTheDocument();
    expect(screen.getByText("Category: beverage")).toBeInTheDocument();
    expect(screen.getByText("Images: 5")).toBeInTheDocument();
  });
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
