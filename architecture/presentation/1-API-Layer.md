# Neurolabs API Functions Summary

The following sections describe the key functions from the Neurolabs Frontend Engineer Technical Test TypeScript file, presented as individual cards for clarity.

## getCatalogItems

- **Purpose**: Fetches catalog items for visualization
- **API Endpoint**: `/v2/catalog-items`
- **HTTP Method**: GET
- **Key Features**:
  - Returns `CatalogItem[]`
  - Maps API response to typed objects
  - Logs requests and errors
  - Handles thumbnail and status: Processes the `thumbnail_url` and `status` fields from the API response, mapping them to the `CatalogItem` type. Ensures `thumbnail_url` is a valid string (defaulting to an empty string if missing) for displaying item thumbnails in the UI. Maps `status` (e.g., 'capture' or other states) to highlight items needing attention, such as those requiring image capture, as specified in the test requirements. This enables the UI to visually distinguish item states based on their status.

## getIRTasks

- **Purpose**: Retrieves available image recognition tasks
- **API Endpoint**: `/v2/image-recognition/tasks?limit=50&offset=0`
- **HTTP Method**: GET
- **Key Features**:
  - Returns `IRTask[]`
  - Supports pagination
  - Logs requests and errors
  - **Pagination Mechanism**:
    - The Neurolabs API likely supports pagination by allowing clients to specify `limit` (number of items per page) and `offset` (starting point of the result set). This is a common REST API pagination pattern.
    - By setting `limit=50` and `offset=0`, the function retrieves the first "page" of up to 50 IR tasks.
    - To fetch additional pages, the function could be modified to accept dynamic `limit` and `offset` parameters, allowing it to retrieve subsequent sets of tasks (e.g., `offset=50` for the next 50 tasks).

## uploadImage

- **Purpose**: Submits an image to an IR task
- **API Endpoint**: `/v2/image-recognition/tasks/{task_uuid}/images`
- **HTTP Method**: POST
- **Key Features**:
  - Uses `FormData` for file upload
  - Validates file input: Checks that the file is a valid `File` object and not `null` or `undefined`, ensuring it can be appended to the `FormData` for upload
  - Logs file details (name, size, type) and response
  - Handles errors

## getTaskStatus

- **Purpose**: Checks the status of an uploaded image for an IR task
- **API Endpoint**: `/v2/image-recognition/tasks/{task_uuid}/images/{image_id}`
- **HTTP Method**: GET
- **Key Features**:
  - Validates `image_id`: Checks that the `image_id` is a non-empty string and neither `undefined` nor `null`, ensuring it can be safely included in the API request URL to retrieve the status of the specific image
  - Logs request and response
  - Returns status data
  - Handles errors

## Notes

- All functions use the `X-API-Key` header for authentication with a hardcoded API key. The hardcoded key in source code simplifies development but is insecure. In development, a proxy (configured in `setupProxy.js`) mitigates CORS issues by forwarding client-side requests to the staging API, bypassing browser restrictions. For production, store the API key in environment variables (e.g., `process.env.API_KEY`) to prevent exposure and enable secure key management.
- API base URL switches between `/v2` (development with proxy) and `https://staging.api.neurolabs.ai/v2` (production).
- Functions include robust error handling and logging for debugging.
