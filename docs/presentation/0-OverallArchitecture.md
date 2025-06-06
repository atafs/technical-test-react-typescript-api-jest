# Frontend Engineer Technical Test - 2025

## Background
We have developed an Image Recognition API that our clients integrate with to recognize products in images. There are two key concepts: a **Catalog** of items and **Image Recognition (IR)** tasks.

For this test, we have:
- Created a test user account with a set of example Catalog items.
- Created an IR task for detecting those items.

View our [Staging API docs](https://staging.api.neurolabs.ai/) here. Using the API docs, you can authorize with your API key and test endpoints.

> **Note**: We will give you an API key for a test user in our Staging environment. This will be revoked once you return your test. Please use it sensibly!

## Task 1: Visualise the Catalog
1. To view the available Catalog items:
   - **GET** `/v2/catalog-items`
2. Create an App to integrate with the API:
   - Using **React** and **TypeScript**
3. Query for the items in the Catalog
4. Visualise the Catalog items:
   - Including the **thumbnail**
5. Highlight the Catalog item status:
   - In particular, those that need **‘capture’**

## Task 2: Submit IR Tasks
1. To view the available IR tasks:
   - **GET** `/v2/image-recognition/tasks`
   - Find a task and copy the **uuid** (`task_uuid`)
2. Add functionality to the App to submit images to the IR tasks
3. Open an image to send:
   - Show the image
4. Submit the image to the endpoint:
   - **POST** `/v2/image-recognition/tasks/{task_uuid}/images`
   - Show the state of the request
5. Add ability to send further requests to view the status of the original request:
   - Show the output/result
6. Include a few tests

> **Note**: If there are CORS issues, one approach is to add `"proxy": "https://staging.api.neurolabs.ai/"` to the `package.json` and remove this base URL from any URLs.

---

# Frontend Technical Test Architecture

## Overview
This document outlines the architecture for the Frontend Engineer Technical Test application. The application integrates with the Staging API to visualize catalog items and submit image recognition (IR) tasks. The solution is built using **React** with **TypeScript**, styled with **Tailwind CSS**, and includes unit tests with **Jest** and **React Testing Library**. The application features a landing page with navigation to a Home screen, where all test-related functionality is centralized.

## Objectives
- **Visualize Catalog Items**: Display catalog items with thumbnails and highlight items needing 'capture' status.
- **Submit IR Tasks**: Allow users to view IR tasks, upload images, submit them to a task, and check the status of submissions.
- **Ensure Code Quality**: Use TypeScript for type safety, modular components, and include tests for critical functionality.
- **Handle CORS**: Configure a proxy in `package.json` to resolve CORS issues with the Staging API.
- **Provide a User-Friendly Entry Point**: Include a landing page with navigation to the main functionality.

## Tech Stack
- **Frontend Framework**: React 18 (with JSX)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN for simplicity)
- **HTTP Client**: Native Fetch API (for API requests)
- **Routing**: React Router DOM
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App (for development and bundling)
- **API**: Staging API (`https://staging.api.neurolabs.ai/`)

## System Architecture
The application is a single-page application (SPA) with a modular component-based architecture, using **React Router** for navigation. It follows a clean architecture pattern with separation of concerns between UI components, API services, and state management. The entry point is a landing page (`/`) that navigates to the Home screen (`/home`), where all test functionality is centralized.

### Components
- **App**: Root component that sets up React Router with two routes:
  - `/`: Landing page with a styled welcome message and a button to navigate to `/home`.
  - `/home`: Renders the Home component, which contains all test-related components.
- **Home**: Central component that integrates `CatalogView`, `IRTaskView`, and supporting components to fulfill test requirements.
- **CatalogView**: Displays the list of catalog items with thumbnails and status indicators.
- **IRTaskView**: Manages IR task selection, image upload, submission, and status display.
- **CatalogItemCard**: Reusable component to render individual catalog item details.
- **ImageUploader**: Handles image selection and preview.
- **TaskStatusDisplay**: Shows the status and results of IR task submissions.
- **LoadingSpinner**: Reusable component for loading states.
- **ErrorMessage**: Reusable component for error states.

### Services
- **ApiService**: Encapsulates API calls to the Staging API using the Fetch API.
  - `getCatalogItems`: Fetches catalog items (`GET /v2/catalog-items`).
  - `getIRTasks`: Fetches available IR tasks (`GET /v2/image-recognition/tasks`).
  - `submitImage`: Submits an image to an IR task (`POST /v2/image-recognition/tasks/{task_uuid}/images`).
  - `getTaskStatus`: Polls the status of an IR task submission.
- **Config**: Stores API key and base URL, loaded from environment variables.

### State Management
- **React Context**: Used for global state (e.g., API key, selected task UUID).
- **React Hooks**:
  - `useState`: Manages local component state (e.g., selected image, loading state).
  - `useEffect`: Handles side effects like API calls and polling.
  - `useQuery` (from `react-query`, optional): Manages API data fetching and caching (if added for optimization).

### Data Flow
- **Landing Page**:
  - The `App` component renders a landing page at `/` with a button to navigate to `/home`.
  - Navigation uses `react-router-dom` to load the `Home` component.
- **Catalog Visualization** (in `Home`):
  - `CatalogView` triggers `ApiService.getCatalogItems` on mount.
  - Response data is stored in the component state.
  - `CatalogItemCard` components render each item, with conditional styling for 'capture' status.
- **IR Task Submission** (in `Home`):
  - `IRTaskView` fetches tasks via `ApiService.getIRTasks`.
  - User selects a task UUID and uploads an image via `ImageUploader`.
  - `ApiService.submitImage` sends the image to the API.
  - `TaskStatusDisplay` polls `ApiService.getTaskStatus` to show results.
- **Error Handling**:
  - API errors are caught and displayed using `ErrorMessage`.
  - Network failures trigger retry logic (limited to 3 attempts).

## File Structure
```
neurolabs-test/
├── src/
│   ├── components/
│   │   ├── CatalogItemCard.tsx
│   │   ├── CatalogView.tsx
│   │   ├── Home.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── IRTaskView.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── TaskStatusDisplay.tsx
│   ├── services/
│   │   ├── ApiService.ts
│   │   └── Config.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.css
│   └── reportWebVitals.ts
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── package.json
├── tsconfig.json
└── README.md
```

## API Integration
- **Base URL**: `https://staging.api.neurolabs.ai/`
- **Authentication**: API key passed via `Authorization: Bearer` header.
- **CORS Handling**: Proxy set in `package.json` (`"proxy": "https://staging.api.neurolabs.ai/"`).
- **HTTP Client**: Fetch API is used for all requests, with `FormData` for image uploads and JSON parsing for responses.

### Endpoints and 200 OK Response Structures
#### GET /v2/catalog-items
- **Purpose**: Fetches the list of catalog items.
- **Response (200 OK)**:
```json
[
  {
    "id": "string",
    "name": "string",
    "thumbnail": "string",
    "status": "string",
    "description": "string",
    "category": "string",
    "created_at": "string",
    "updated_at": "string",
    "metadata": {
      "sku": "string",
      "brand": "string",
      "weight": number,
      "dimensions": {
        "width": number,
        "height": number,
        "depth": number
      }
    },
    "image_count": number
  },
  ...
]
```
- **Notes**: The response is an array of catalog items. Required fields are `id`, `name`, `thumbnail`, and `status`, used for visualization and status highlighting (e.g., 'capture'). Optional fields (`description`, `category`, `created_at`, `updated_at`, `metadata`, `image_count`) provide additional context for display or filtering. The `thumbnail` URL is assumed to be publicly accessible. The `status` field drives conditional styling in `CatalogItemCard`.

#### GET /v2/image-recognition/tasks
- **Purpose**: Fetches the list of available IR tasks.
- **Response (200 OK)**:
```json
[
  {
    "uuid": "string",
    "name": "string"
  },
  ...
]
```
- **Notes**: The response is an array of IR tasks. The `uuid` is used for submitting images to a specific task.

#### POST /v2/image-recognition/tasks/{task_uuid}/images
- **Purpose**: Submits an image to the specified IR task.
- **Request Body**: `FormData` containing the image file (key: `image`).
- **Response (200 OK)**:
```json
{
  "image_id": "string",
  "task_uuid": "string",
  "status": "string"
}
```
- **Notes**: The `image_id` is used to poll for the submission status. The `status` field indicates the processing state.

#### GET /v2/image-recognition/tasks/{task_uuid}/images/{image_id} (Assumed)
- **Purpose**: Retrieves the status and results of an image submission.
- **Response (200 OK)**:
```json
{
  "image_id": "string",
  "task_uuid": "string",
  "status": "string",
  "result": {
    "recognized_items": [
      {
        "item_id": "string",
        "confidence": number
      },
      ...
    ]
  }
}
```
- **Notes**: This endpoint is assumed based on standard REST patterns for polling task status. The `result` field is included only when the `status` is "completed".

## Styling
- **Tailwind CSS**: Used for responsive, utility-first styling.
- **Layout**: Flexbox and Grid for catalog and task views within the `Home` component.
- **Theming**: Consistent colors and typography (e.g., blue for active states, red for errors).
- **Landing Page**: Gradient background with animated fade-in text and a styled button, as defined in `App.tsx`.

## Testing
### Unit Tests
- **CatalogView**: Renders catalog items correctly, including optional fields like `description` and `category`.
- **ImageUploader**: Handles file selection and preview.
- **ApiService**: Mocks Fetch API calls to ensure correct request/response handling.
- **Home**: Verifies rendering of child components (`CatalogView`, `IRTaskView`).
- **App**: Tests routing to landing page and Home screen.
- **Tools**: Jest, React Testing Library (included with Create React App).
- **Coverage**: Focus on critical components and services.

## Deployment
- **Development**: Run locally with `npm start` (Create React App).
- **Build**: `npm run build` generates a production-ready bundle.
- **Dependencies**: Managed via `npm`, listed in `package.json`.

## Assumptions
- API key is provided and stored in `.env` as `REACT_APP_API_KEY`.
- IR task status endpoint is assumed based on standard REST patterns.
- Thumbnail URLs in catalog items are accessible without additional authentication.
- Image uploads are handled as `multipart/form-data` via Fetch API.
- The `Home` component is responsible for orchestrating all test-related functionality.
- The `GET /v2/catalog-items` response structure is inferred from the test description and typical REST API conventions for catalog management in image recognition systems, as the exact schema was not provided.
- Optional fields in the `GET /v2/catalog-items` response (`description`, `category`, `created_at`, `updated_at`, `metadata`, `image_count`) may be null or omitted if not applicable.

## Risks and Mitigations
- **CORS Issues**: Mitigated by proxy configuration.
- **API Rate Limits**: Handle with retry logic and exponential backoff.
- **Type Safety**: Use TypeScript interfaces for API responses, aligned with documented response structures, with optional fields to handle variability.
- **Scalability**: Modular components and services allow easy extension.
- **Routing Performance**: React Router is lightweight, but lazy loading could be added for larger apps.
- **API Schema Changes**: TypeScript interfaces can be updated if actual response structures differ from assumed properties.

## Future Improvements
- Add `react-query` for advanced data fetching and caching.
- Implement pagination for large catalog lists.
- Add accessibility (ARIA) attributes for better usability.
- Enhance tests with end-to-end testing (e.g., Cypress).
- Introduce lazy loading for routes to optimize performance.
- Display additional catalog item properties (e.g., `description`, `category`) in `CatalogItemCard` for richer visualization.
