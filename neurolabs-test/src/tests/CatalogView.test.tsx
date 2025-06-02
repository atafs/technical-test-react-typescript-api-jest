import { render, screen, waitFor } from "@testing-library/react";
import CatalogView from "../components/CatalogView";
import { getCatalogItems } from "../services/ApiService";
import { CatalogItem } from "../types";

// Mock the ApiService
jest.mock("../services/ApiService");

// Mock child components
jest.mock(
  "../components/CatalogItemCard",
  () =>
    ({ item }: { item: CatalogItem }) =>
      <div data-testid="catalog-item-card">{item.name}</div>
);
jest.mock("../components/LoadingSpinner", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));
jest.mock(
  "../components/ErrorMessage",
  () =>
    ({ message }: { message: string }) =>
      <div data-testid="error-message">{message}</div>
);

describe("CatalogView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner while fetching items", () => {
    (getCatalogItems as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<CatalogView />);

    expect(screen.getByTestId("loading-spinner")).toHaveTextContent(
      "Loading..."
    );
  });

  it("renders error message when fetch fails", async () => {
    (getCatalogItems as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    render(<CatalogView />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Failed to fetch catalog items"
      );
    });
  });

  it("renders catalog items when fetch succeeds", async () => {
    const mockItems: CatalogItem[] = [
      {
        id: "1",
        uuid: "1",
        name: "Item 1",
        thumbnail_url: "https://example.com/image.jpg",
        status: "active",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
      {
        id: "2",
        uuid: "2",
        name: "Item 2",
        thumbnail_url: "https://example.com/image2.jpg",
        status: "capture",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    ];
    (getCatalogItems as jest.Mock).mockResolvedValue(mockItems);

    render(<CatalogView />);

    await waitFor(() => {
      const itemCards = screen.getAllByTestId("catalog-item-card");
      expect(itemCards).toHaveLength(2);
      expect(itemCards[0]).toHaveTextContent("Item 1");
      expect(itemCards[1]).toHaveTextContent("Item 2");
      expect(screen.getByText("Catalog Items")).toBeInTheDocument();
    });
  });
});
