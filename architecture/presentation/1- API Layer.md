# Neurolabs API Functions Summary

The following table summarizes the key functions from the Neurolabs Frontend Engineer Technical Test TypeScript file, detailing their purpose, API endpoint, HTTP method, and key features.

| **Function Name** | **Purpose**                                           | **API Endpoint**                                            | **HTTP Method** | **Key Features**                                                                                                                  |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `getCatalogItems` | Fetches catalog items for visualization               | `/v2/catalog-items`                                         | GET             | - Returns `CatalogItem[]`<br>- Maps API response to typed objects<br>- Logs requests and errors<br>- Handles thumbnail and status |
| `getIRTasks`      | Retrieves available image recognition tasks           | `/v2/image-recognition/tasks?limit=50&offset=0`             | GET             | - Returns `IRTask[]`<br>- Supports pagination<br>- Logs requests and errors                                                       |
| `uploadImage`     | Submits an image to an IR task                        | `/v2/image-recognition/tasks/{task_uuid}/images`            | POST            | - Uses `FormData` for file upload<br>- Validates file input<br>- Logs file details and response<br>- Handles errors               |
| `getTaskStatus`   | Checks the status of an uploaded image for an IR task | `/v2/image-recognition/tasks/{task_uuid}/images/{image_id}` | GET             | - Validates `image_id`<br>- Logs request and response<br>- Returns status data<br>- Handles errors                                |

## Notes

- All functions use the `X-API-Key` header for authentication with a hardcoded API key.
- API base URL switches between `/v2` (development with proxy) and `https://staging.api.neurolabs.ai/v2` (production).
- Functions include robust error handling and logging for debugging.
