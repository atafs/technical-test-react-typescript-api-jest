# Neurolabs Frontend Engineer Technical Test

This is a React + TypeScript application for the Neurolabs Frontend Engineer Technical Test, integrating with the Neurolabs Staging API to visualize catalog items and submit image recognition tasks.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- API key for the Neurolabs Staging API (provided by Neurolabs)

## Setup and Running the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/atafs/technical-test-react-typescript-api-jest.git
   cd neurolabs-test
   ```

2. **Install Dependencies**
   Install the required npm packages:

   ```bash
   npm install
   ```

3. **Configure API Key**

   - Create a `.env` file in the root directory.
   - Add your Neurolabs Staging API key:
     ```
     REACT_APP_API_KEY=your-api-key-here
     ```

4. **Start the Development Server**
   Run the application locally:

   ```bash
   npm start
   ```

   - The app will open in your default browser at `http://localhost:3000`.
   - Note: If you encounter CORS issues, ensure the `"proxy": "https://staging.api.neurolabs.ai/"` is set in `package.json`.

5. **Run Tests**
   Execute the test suite to verify functionality:
   ```bash
   npm test
   ```
   - Tests are written using Jest and React Testing Library.
   - Press `a` to run all tests or follow prompts for specific test runs.

## Project Structure

- `src/`: Contains the React components, API integration, and TypeScript code.
- `src/components/ImageUploader.tsx`: Handles image selection, preview, and submission.
- `public/`: Static assets and HTML template.
- `tests/`: Test files for components and API interactions.

## Notes

- The application uses Tailwind CSS for styling. Ensure Tailwind is properly configured in `tailwind.config.js`.
- For API requests, refer to the [Neurolabs Staging API docs](https://staging.api.neurolabs.ai/docs).
- Feedback on the API, docs, or test is welcome, as per the Neurolabs test instructions.
- "output": "find src -type f -exec sh -c 'echo "File: {}"; cat "{}"' \; > output.txt",

## Troubleshooting

- If `npm start` fails, ensure all dependencies are installed and the API key is correct.
- For test failures, check the console output for specific error messages.
