import React from "react";
import { render, screen } from "@testing-library/react";
import CatalogItemCard from "../components/CatalogItemCard";
import { CatalogItem } from "../types";

// Mock CatalogItem type for reference
const mockItem: CatalogItem = {
  id: "123",
  uuid: "123", // Added uuid, assuming it's similar to id
  name: "Test Product",
  thumbnail_url: "https://example.com/thumbnail.jpg",
  status: "READY",
  barcode: "123456789",
  brand: "TestBrand",
  created_at: "2023-01-01T00:00:00Z", // Added created_at
  updated_at: "2023-01-02T00:00:00Z", // Added updated_at (assuming updated_atts is a typo)
};

describe("CatalogItemCard", () => {
  test("renders catalog item details correctly", () => {
    render(<CatalogItemCard item={mockItem} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Status: READY")).toBeInTheDocument();
    expect(screen.getByText("Barcode: 123456789")).toBeInTheDocument();
    expect(screen.getByText("Brand: TestBrand")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toHaveAttribute(
      "src",
      mockItem.thumbnail_url
    );
  });

  test("applies correct styles for READY status", () => {
    render(<CatalogItemCard item={mockItem} />);

    const card = screen.getByText("Test Product").closest("div");
    const status = screen.getByText("Status: READY");

    expect(card).toHaveClass("border-green-500");
    expect(status).toHaveClass("text-green-500");
  });

  test("applies correct styles for PROCESSING status", () => {
    const processingItem: CatalogItem = { ...mockItem, status: "PROCESSING" };
    render(<CatalogItemCard item={processingItem} />);

    const card = screen.getByText("Test Product").closest("div");
    const status = screen.getByText("Status: PROCESSING");

    expect(card).toHaveClass("border-red-500", "border-4");
    expect(status).toHaveClass(
      "text-red-500",
      "bg-red-100",
      "px-2",
      "py-1",
      "rounded"
    );
  });

  test("applies default styles for unknown status", () => {
    const unknownItem: CatalogItem = { ...mockItem, status: "UNKNOWN" };
    render(<CatalogItemCard item={unknownItem} />);

    const card = screen.getByText("Test Product").closest("div");
    const status = screen.getByText("Status: UNKNOWN");

    expect(card).toHaveClass("border-gray-300");
    expect(status).toHaveClass("text-gray-600");
  });

  test("does not render optional fields when absent", () => {
    const minimalItem: CatalogItem = {
      id: "123",
      uuid: "123",
      name: "Test Product",
      thumbnail_url: "https://example.com/thumbnail.jpg",
      status: "READY",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-02T00:00:00Z",
    };
    render(<CatalogItemCard item={minimalItem} />);

    expect(screen.queryByText(/Barcode:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Brand:/)).not.toBeInTheDocument();
  });

  test("displays full name in tooltip on hover", () => {
    render(<CatalogItemCard item={mockItem} />);

    const title = screen.getByText("Test Product");
    expect(title).toHaveAttribute("title", "Test Product");
  });

  test("has hover effects on card", () => {
    render(<CatalogItemCard item={mockItem} />);

    const card = screen.getByText("Test Product").closest("div");
    expect(card).toHaveClass(
      "transform",
      "transition-all",
      "duration-300",
      "hover:scale-105",
      "hover:shadow-lg"
    );
  });
});
