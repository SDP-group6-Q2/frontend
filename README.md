# AROL Customer Platform - Frontend

Frontend application for the **AROL Customer Platform**.

The current version provides the initial chatbot interface and the basic project structure required to communicate with the backend through the `/chat` endpoint.

---

# Technologies

The project is built using:

- React
- Vite
- JavaScript
- Fetch API
- CSS

Vite is used as the development environment for its fast startup and lightweight configuration.

---

# Project Structure

```
src/
│
├── api/
│   └── chatApi.js
│
├── components/
│   └── chat/
│       ├── ChatInput.jsx
│       ├── ChatMessage.jsx
│       ├── LoadingMessage.jsx
│       └── MessageList.jsx
│
├── pages/
│   └── ChatPage.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

### `api/`

Contains the functions responsible for communicating with the backend.

All HTTP requests are centralized inside this folder.

Current file:

- `chatApi.js`

---

### `components/chat/`

Contains all reusable chatbot components.

- **ChatInput**  
  Input area where the user writes messages and sends them.

- **ChatMessage**  
  Displays a single message. It is used for both user and assistant messages.

- **MessageList**  
  Displays the complete conversation and automatically scrolls to the latest message.

- **LoadingMessage**  
  Displays the loading indicator while waiting for the backend response.

---

### `pages/`

Contains the application pages.

Current page:

- **ChatPage**

This page manages:

- conversation state
- sending messages
- receiving responses
- loading state
- error handling

---

### Root Files

- **App.jsx**  
  Main application component.

- **main.jsx**  
  React application entry point.

- **index.css**  
  Global styles.

---

# Chatbot Flow

The interaction between the user and the frontend follows this flow:

```
User

    │

    ▼

ChatInput

    │

    ▼

ChatPage

    │

    ▼

chatApi.js

    │

    ▼

POST /chat

    │

    ▼

Backend

    │

    ▼

Response

    │

    ▼

ChatPage

    │

    ▼

MessageList
```

The UI components are responsible only for displaying data and collecting user input.

The communication with the backend is delegated to the API layer.

---

# Backend Integration

All backend communication is handled inside:

```
src/api/chatApi.js
```

The chatbot sends requests using:

```
POST /chat
```

Example request:

```json
{
  "message": "How can I reset machine A?"
}
```

Expected response:

```json
{
  "reply": "To reset the machine..."
}
```

The frontend components do not perform HTTP requests directly.

Instead, they invoke the functions exposed by `chatApi.js`, which acts as the communication layer between the UI and the backend.

---

# Environment Variable

The backend base URL is configured through an environment variable.

Example:

```
VITE_API_BASE_URL=http://localhost:8000
```

The API service automatically uses this value when building requests.

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```