import { getCatalogItems, getIRTasks } from "../services/ApiService";

global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});

test("getCatalogItems fetches items successfully", async () => {
  const mockItems = [
    { id: "1", name: "Item 1", thumbnail: "url", status: "active" },
  ];
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockItems,
  });
  const result = await getCatalogItems();
  expect(fetch).toHaveBeenCalledWith("/v2/catalog-items", expect.any(Object));
  expect(result).toEqual(mockItems);
});

test("getIRTasks fetches tasks successfully", async () => {
  const mockTasks = [{ uuid: "1", name: "Task 1" }];
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockTasks,
  });
  const result = await getIRTasks();
  expect(fetch).toHaveBeenCalledWith(
    "/v2/image-recognition/tasks",
    expect.any(Object)
  );
  expect(result).toEqual(mockTasks);
});
