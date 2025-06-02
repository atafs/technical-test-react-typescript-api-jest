# Neurolabs Components Summary

# Navigation Structure

- **Framework**: Uses React Router for client-side navigation, configured with `BrowserRouter`, `Routes`, and `Route` components.
- **Root (`/`)**:
  - Landing page serving as the application’s entry point.
  - Displays a centered, static UI with a bold title ("Neurolabs Technical Test") in white, animated with a fade-in effect (`animate-fade-in`).
  - Features a "Start the Demo" button linking to `/home`, styled with Tailwind CSS (`bg-white text-indigo-600`, `hover:bg-gray-100`).
  - Uses a full-screen gradient background (`from-indigo-500 to-purple-600`) for a modern, engaging look.
- **Home Page (`/home`)**:
  - Main feature hub showcasing catalog visualization and IR task management.
  - Features a responsive grid layout with `CatalogView` (displays catalog items with thumbnails and status) and `IRTaskView` (handles task selection, image uploads, and status viewing).
  - Includes a "Neurolabs Demo" title and a "Back" button to return to the root (`/`).
  - Styled with Tailwind CSS, using a gradient background (`from-blue-100 to-purple-100`) and a two-column grid on medium screens.
- **Proxy**: A proxy configured in `setupProxy.js` mitigates CORS issues in development by forwarding API requests to `https://staging.api.neurolabs.ai`.

# Component Views

- **CatalogView**:
  - **Purpose**: Visualizes catalog items fetched from the API, fulfilling Task 1 of the test.
  - **Supported by**: `CatalogItemCard`, which renders individual catalog items.
  - **Key Features**:
    - Fetches items using `getCatalogItems` and displays them in a responsive grid (`grid-cols-1 sm:grid-cols-2`).
    - Shows a loading spinner (`LoadingSpinner`) during fetch and an error message (`ErrorMessage`) if the fetch fails.
    - Delegates item rendering to `CatalogItemCard`, which displays thumbnails, names, statuses, barcodes, and brands, with status-specific styling (e.g., red border for 'PROCESSING', green for 'READY').
    - Highlights items needing 'capture' status via `CatalogItemCard`’s styling, as required by the test.
- **IRTaskView**:
  - **Purpose**: Manages image recognition tasks, including task selection, image uploads, and status display, fulfilling Task 2 of the test.
  - **Supported by**: `ImageUploader` for image selection and submission, `TaskStatusDisplay` for showing task status.
  - **Key Features**:
    - Fetches tasks using `getIRTasks` and renders them in a dropdown, defaulting to the first task.
    - Uses `ImageUploader` to select and preview images, validate file inputs (e.g., checks for valid `File` object), and submit images via `uploadImage`.
    - Displays upload errors or success states and passes `task_uuid` and `image_id` to `TaskStatusDisplay` for status polling.
    - `TaskStatusDisplay` polls `getTaskStatus` every 5 seconds (up to 30 attempts) to show status (e.g., 'processing', 'completed'), with retry and refresh options.

## CatalogItemCard

- **Purpose**: Displays a list of catalog items fetched from the API
- **Key Features**:
  - Fetches items using `getCatalogItems` and renders them in a grid or list layout
  - Displays each item’s thumbnail (via `thumbnail_url`) with a fallback for missing images
  - Highlights item status (e.g., 'capture' in a distinct color or badge) to indicate items needing attention, as per test requirements
  - Uses Tailwind CSS for responsive styling
  - Includes a unit test to verify rendering of items and status highlighting

## TaskSelector

- **Purpose**: Lists available IR tasks for user selection
- **Key Features**:
  - Retrieves tasks using `getIRTasks` and displays them in a dropdown or list
  - Extracts `task_uuid` from selected task for use in image uploads
  - Handles pagination by displaying the first 50 tasks (as fetched with `limit=50&offset=0`)
  - Styled with Tailwind CSS for a clean, user-friendly interface
  - Includes a unit test to ensure tasks are fetched and rendered correctly

## ImageUploader

- **Purpose**: Allows users to upload images for an IR task
- **Key Features**:
  - Provides a file input to select an image and displays a preview of the selected image
  - Submits the image to the API using `uploadImage` with the selected `task_uuid`
  - Shows upload progress and success/error states (e.g., loading spinner, error message)
  - Validates file input client-side (e.g., checks for image type and size) before submission
  - Styled with Tailwind CSS for a modern upload interface
  - Includes a unit test to verify file selection and upload state handling

## TaskStatusDisplay

- **Purpose**: Displays the status of an uploaded image for an IR task
- **Key Features**:
  - Fetches status using `getTaskStatus` with `task_uuid` and `image_id`
  - Renders status details (e.g., processing, completed, or error) in a clear format
  - Polls or refreshes status periodically to show updates
  - Uses Tailwind CSS for consistent styling
  - Includes a unit test to confirm status rendering and error handling

## Notes

- **TypeScript Usage**:
  - All components are written in TypeScript, leveraging interfaces defined in `types.ts` to ensure type safety for props and API response data.
  - The `CatalogItem` interface defines a comprehensive structure for catalog items, mapping API fields like `uuid`, `name`, `thumbnail_url`, and `status` (e.g., 'READY', 'PROCESSING'), with optional fields (`barcode`, `brand`, etc.) allowing flexibility for null API values. Additional optional fields (`description`, `category`, `metadata`, `image_count`) support `CatalogItemCard`’s UI compatibility, though not populated by the API, preventing runtime errors during rendering.
  - The `IRTask` interface enforces type safety for task data from `getIRTasks`, requiring `uuid`, `name`, `created_at`, `updated_at`, and boolean flags (`compute_realogram`, `compute_shares`), used by `TaskSelector` and `IRTaskView` for task selection and upload workflows.
  - The `ImageSubmission` interface (`image_id`, `status`) and `TaskStatus` interface (`status`, optional `result`) ensure robust handling of upload responses and status polling in `IRTaskView` and `TaskStatusDisplay`, validating data from `uploadImage` and `getTaskStatus`.
  - TypeScript’s strict typing catches invalid prop usage (e.g., ensuring `CatalogItemCard` receives a valid `item` prop) and API response mismatches, reducing bugs in components like `CatalogView` and `IRTaskView`. It also enhances developer experience with autocompletion and type checking during development, aligning with the test’s focus on clean, maintainable code.
- **General Notes**:
  - Styling uses Tailwind CSS for responsive, utility-first design, aligning with React best practices.
  - In development, a proxy (configured in `setupProxy.js`) mitigates CORS issues by forwarding requests to `https://staging.api.neurolabs.ai`, enabling client-side API calls.
  - Components include minimal unit tests (e.g., using Jest and React Testing Library) to verify rendering and basic functionality, as required by the test.
  - For production, consider adding more comprehensive tests, optimizing performance (e.g., memoizing API calls), and securing API key handling via environment variables.
