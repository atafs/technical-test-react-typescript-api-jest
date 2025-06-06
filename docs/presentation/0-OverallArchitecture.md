# RAG Chatbot Project

## Project Overview
This project is a real-time AI chatbot utilizing Retrieval-Augmented Generation (RAG) to answer questions based on user-uploaded documents (e.g., PDFs). The backend is built with Node.js, Express, and Socket.IO, while the frontend is a simple HTML client (`test-client.html`) for testing real-time communication. The system integrates a vector database (Pinecone) and a language model for document-based responses.

## Prerequisites
- **Node.js** (v16 or higher) and **npm** installed.
- **live-server** installed globally for running the client:
  ```bash
  npm install -g live-server
  ```
- A modern web browser (e.g., Chrome, Firefox).
- API keys for:
  - Pinecone: [Sign up](https://www.pinecone.io/)
  - Hugging Face: [Sign up](https://huggingface.co/)
  - xAI Grok API: [Get API key](https://x.ai/api)

## Project Structure
```
rag-chatbot/
├── node_modules/           # Project dependencies
├── public/                 # Static files for client
│   └── test-client.html    # HTML client for testing Socket.IO
├── server.js               # Node.js/Express/Socket.IO backend
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## Setup Instructions

### 1. Clone or Set Up the Project
Clone the repository (or download and extract the source code):
```bash
git clone <repository-url>
cd rag-chatbot
```
Alternatively, create the project directory and place `server.js` and `public/test-client.html` in it.

### 2. Install Backend Dependencies
Install the required Node.js dependencies:
```bash
npm install
```
This installs:
- `express`
- `socket.io`
- `pdf-parse`
- `@pinecone-database/pinecone`
- `axios`

### 3. Configure Environment Variables
Create a `.env` file in the project root and add your API keys:
```env
PINECONE_API_KEY=your_pinecone_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
GROK_API_KEY=your_xai_grok_api_key
```
**Note**: Add `.env` to `.gitignore` to avoid exposing API keys.

### 4. Run the Server
Start the Node.js/Express server:
```bash
npm start
```
The server runs on `http://localhost:3000` by default, handling HTTP requests and Socket.IO connections. Verify it’s running by checking the console for:
```
Server on http://localhost:3000
```

### 5. Run the Client
Run the client using `live-server` to serve `test-client.html`:
```bash
live-server --open=public/test-client.html
```
This command:
- Starts a local development server (typically on `http://localhost:8080`).
- Automatically opens `public/test-client.html` in your default browser.
- Enables live reloading for client-side changes.

**Note**: Ensure the backend server is running on `http://localhost:3000` before starting the client, as `test-client.html` connects to it via Socket.IO.

### 6. Using the Client
- **Access the Chat Interface**: The browser opens `test-client.html`, displaying a basic chat UI.
- **Upload Documents**: Use the file input to upload PDFs. The backend processes the file and stores embeddings in Pinecone.
- **Send Messages**: Type questions in the input field. The backend retrieves relevant document chunks via Pinecone and responds using the Grok API.
- **Real-Time Interaction**: Socket.IO ensures messages are updated instantly in the UI.

## Example `test-client.html`
Ensure `public/test-client.html` exists with the following structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RAG Chatbot Test Client</title>
  <style>
    .chat { border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: scroll; }
    .user { color: blue; }
    .bot { color: green; }
  </style>
</head>
<body>
  <h1>RAG Chatbot Test Client</h1>
  <input type="file" id="fileInput" accept=".pdf" />
  <button onclick="uploadFile()">Upload PDF</button>
  <div class="chat" id="chat"></div>
  <input type="text" id="message" placeholder="Ask a question" />
  <button onclick="sendMessage()">Send</button>
  <script src="http://localhost:3000/socket.io/socket.io.js"></script>
  <script>
    const socket = io('http://localhost:3000');
    const chat = document.getElementById('chat');
    const messageInput = document.getElementById('message');

    socket.on('response', (response) => {
      const p = document.createElement('p');
      p.className = 'bot';
      p.textContent = response;
      chat.appendChild(p);
      chat.scrollTop = chat.scrollHeight;
    });

    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        const p = document.createElement('p');
        p.className = 'user';
        p.textContent = message;
        chat.appendChild(p);
        socket.emit('chat', message);
        messageInput.value = '';
        chat.scrollTop = chat.scrollHeight;
      }
    }

    async function uploadFile() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('pdf', file);
        await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });
        alert('File uploaded');
      }
    }
  </script>
</body>
</html>
```

## Troubleshooting
- **Server Not Running**: Ensure `npm start` is active and `http://localhost:3000` is accessible.
- **Client Not Connecting**: Verify `test-client.html` references the correct Socket.IO URL (`http://localhost:3000/socket.io/socket.io.js`).
- **live-server Issues**: Confirm `live-server` is installed globally and the `public` directory contains `test-client.html`.
- **API Key Errors**: Check `.env` for valid Pinecone, Hugging Face, and Grok API keys.
- **Port Conflicts**: If port 3000 (backend) or 8080 (live-server) is in use, update `server.js` or use `live-server --port=NEW_PORT`.

## Notes
- The backend (`server.js`) handles PDF parsing, embedding storage in Pinecone, and LLM queries via the Grok API.
- `test-client.html` is a lightweight client for testing Socket.IO and file uploads. For production, consider a React frontend.
- Ensure Pinecone and API services are active before running the application.

## Resources
- [Express Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [live-server Documentation](https://www.npmjs.com/package/live-server)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Hugging Face API](https://huggingface.co/docs/api-inference)
- [xAI Grok API](https://x.ai/api)
