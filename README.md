# Prerequisites and Project Requirements

## Prerequisites

- **Node.js**: Ensure Node.js (v16 or later) and npm are installed.
- **Text Editor**: Use VS Code or any editor with TypeScript support.
- **API Key**: Have the Neurolabs API key ready (provided by the test team).
- **Terminal**: Access to a terminal for running commands.

## Project Requirements

- **Task 1**: Fetch and display catalog items (GET /v2/catalog-items), showing thumbnails and highlighting items with `status: "capture"`.
- **Task 2**: Fetch IR tasks (GET /v2/image-recognition/tasks), allow image upload and submission (POST /v2/image-recognition/tasks/{task_uuid}/images), display request status, and check submission status.
- **Tests**: Include Jest tests for key components.
- **Submission**: Create a README, zip the project (excluding `node_modules` and `.env`), and I have informed Neurolabs that I use SuperGrok from xAI as my LLM of choice on a daily bases. It's my new google search and stack overflow engine as my GenAI.

## Releases and Notes

- Task 1: https://github.com/atafs/technical-test-react-typescript-api-jest/releases/tag/task1
