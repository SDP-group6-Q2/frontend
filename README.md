# AROL Customer Platform — Frontend

Frontend application for the **AROL Customer Platform**, a customer-facing interface for accessing company machines, technical documentation, operational information, commercial records, and AI-assisted support.


---

## Technologies

- **React 19** and **React DOM** — user interface.
- **Vite 8** — development server and production build.
- **JavaScript / JSX** — application logic and components.
- **React Router 7** — client-side navigation and protected routes.
- **Fetch API** — HTTP communication with the backend.
- **CSS** — responsive layouts, navigation, cards, transitions, and states.
- **react-markdown** and **remark-gfm** — chat message rendering.
- **BarcodeDetector** and **MediaDevices** browser APIs — QR scanning, when supported.

The repository also contains an **older Node/Express server and PostgreSQL seeding utilities** under `server/`. The main React application described below authenticates against the external backend API; the legacy server is not required by the React routing code itself.

---

## Project structure

```text
frontend/
├── public/
│   ├── dashboard/            
│   ├── manuals/               
│   ├── favicon.png
│   └── icons.svg
├── server/                    
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── seed/
│   └── index.js
├── src/
│   ├── api/
│   │   ├── httpClient.js
│   │   ├── authApi.js
│   │   ├── chatApi.js
│   │   ├── machinesApi.js
│   │   ├── manualsApi.js
│   │   ├── ordersApi.js
│   │   ├── ticketsApi.js
│   │   └── documentsAPI.js
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── VisibilityRoute.jsx
│   │   ├── chat/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── LoadingMessage.jsx
│   │   │   └── MessageList.jsx
│   │   ├── documents/
│   │   │   └── DocumentCard.jsx
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── mocks/
│   │   └── documents.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── MachinesPage.jsx
│   │   ├── MachinePage.jsx
│   │   ├── MachineChatPage.jsx
│   │   ├── ManualPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── AlarmsPage.jsx
│   │   ├── TicketsPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── QrScannerPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── DocumentsPage.jsx       
│   │   └── DocumentViewerPage.jsx  
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### Responsibility of each layer

- **`api/`** centralizes requests to the backend; pages call these functions rather than constructing HTTP requests themselves.
- **`context/AuthContext.jsx`** maintains the authenticated user, loading state, login/logout functions, and visibility checks.
- **`components/auth/`** protects authenticated routes and redirects users away from disallowed service pages.
- **`components/layout/`** provides the shared navigation, account controls, responsive menu, and page layout.
- **`components/chat/`** provides reusable message display and input components.
- **`pages/`** coordinates UI state, data loading, filtering, pagination, and user interactions.
- **`public/`** stores static assets served directly by Vite.

---

## Features

### Authentication and profile

The login page is the only public application route. The other routes are nested under `ProtectedRoute`, which waits for authentication state and redirects unauthenticated visitors to `/login`.

The login flow is:

1. Submit email and password to `POST /auth/jwt/login` as URL-encoded form data (`username`, `password`).
2. Save the returned JWT `access_token` in `localStorage`.
3. Request the signed-in user from `GET /users/me`.
4. Make authenticated API requests using `Authorization: Bearer <token>`.
5. On HTTP `401`, remove the stored token and clear the frontend session.


> **Security note:** The frontend visibility checks are a user-interface safeguard, not an authorization boundary. The backend must independently validate the authenticated user, company ownership, and permissions for every request. The JWT is stored in `localStorage` in the current implementation; deployment security should review this choice.

### Dashboard and navigation

The dashboard links to the available services using image-backed cards. Its cards use the assets in `public/dashboard/`. The responsive navigation includes active-link states, a mobile drawer, profile access, and logout. Service links are filtered according to the current user's visibility.

### Machines

The Machines page retrieves the machines available to the signed-in account. Selecting a machine opens its overview with identification, model and configuration details, plus links to:

- **Assist machine:** AI chat with the selected `machine_id`.
- **Manual reader:** view the corresponding manual.

Users with operational access also see latest telemetry, recent alarms, and maintenance tickets on the machine detail page. Users without that access do not trigger those operational data requests from this page.

### AI Assistant

Two chat entry points share the chat UI/API layer:

- **General assistant** (`/chat`): sends `machine_id: null`.
- **Machine assistant** (`/machines/:machineId/assistant`): sends the selected machine ID.

The assistant sends messages to `POST /assistant/` and retains the returned `conversation_id` to continue a conversation. Chat components manage message display, input, loading, and error feedback. A chat history helper for `GET /assistant/{conversationId}` also exists in `chatApi.js`.

### Manuals

The machine manual page calls `GET /manuals/{machineId}` and embeds the returned URL in an `iframe`. The **Open PDF in new tab** action requests a fresh manual URL before opening it, to reduce failures caused by expired signed links.

The frontend contains bundled PDFs under `public/manuals/`, but the routed machine manual reader uses the backend API response rather than selecting those local files directly. Availability of signed manuals depends on the backend and its configured storage service.

### Alarms

The Alarms page collects alarm records for the company's machines via the machine-specific alarm endpoints. It provides:

- **Severity** and **Status** dropdown filters.
- **From** and **To** date inputs.
- Clear filters action.
- Status-colored cards, loading/error/empty states, and pagination at **8 cards per page**.

The dropdown values are derived from alarm records returned by the API; they are not a hard-coded list of possible server values.

### Maintenance tickets

The Tickets page calls the maintenance tickets endpoint and provides:

- **Status** and **Priority** dropdown filters.
- **From** and **To** date inputs.
- Clear filters action.
- Ticket cards, loading/error/empty states, and pagination at **8 cards per page**.

Filters are passed to the tickets API. The dropdown options are built from values encountered in returned records, so options may depend on the current response and filtering context.

### Orders

The Orders page uses the orders overview API and presents company orders as cards with order status, shipment status, dates, line counts, and totals when available. It supports:

- Text search by order identifier or notes.
- **Order status** and **Shipment** dropdown filters.
- Clear filters action.
- Pagination at **8 cards per page**.

In the supplied implementation, Orders filtering is performed **client-side on the records returned by `/orders/overview`**; it is not a server-side query filter.

### QR scanner

The QR scanner can request camera access and decode QR codes through the browser's `BarcodeDetector` API. It accepts machine links, query parameters, or machine identifiers, checks the identifier against the machines available to the user, and navigates to the machine overview. If browser QR scanning is unsupported or camera access is unavailable, users can enter a machine ID manually.

Camera availability and `BarcodeDetector` support depend on browser/device capabilities and secure-context requirements.

### Empty, loading, and error states

The pages provide explicit feedback for unavailable data, including companies with **zero machines, alarms, tickets, or orders**. The UI distinguishes loading, errors, and no matching results where implemented.

---

## Visibility model

The frontend reads `visibility` from the authenticated user returned by `/users/me` and maps it to service availability:

| Service / data | `full` | `technician` | `commercial` |
| --- | :---: | :---: | :---: |
| Machines and machine details | Yes | Yes | Yes |
| Machine manuals | Yes | Yes | Yes |
| Telemetry, alarms, maintenance tickets | Yes | Yes | No |
| Orders | Yes | No | Yes |
| General and machine AI assistant | Yes | Yes | Yes |
| QR scanner | Yes | Yes | Yes |
| Dashboard and profile | Yes | Yes | Yes |

This matrix is enforced in three frontend locations:

1. **Dashboard:** unavailable service cards are hidden.
2. **Navbar:** unavailable service links are hidden.
3. **Routes:** `VisibilityRoute` redirects access to disallowed pages to `/`.

The machine overview additionally skips operational API calls when operational visibility is not granted.

**Important implementation detail:** `AuthContext.jsx` currently falls back to `full` for missing or unrecognized visibility values. This is the code's present behavior, **not a recommended security default**. Production authorization must be enforced by the backend, and a deny-by-default frontend fallback is advisable.

The backend is responsible for the `companyId` tenant boundary. Hiding a service in React does not protect API data against direct requests.

---

## Application routes

| Route | Page | Access |
| --- | --- | --- |
| `/login` | Login | Public |
| `/` | Dashboard | Authenticated |
| `/machines` | Machines list | Machines visibility |
| `/machines/:machineId` | Machine overview | Machines visibility |
| `/machines/:machineId/assistant` | Machine-specific assistant | Assistant visibility |
| `/machines/:machineId/manual` | Manual reader | Machines visibility |
| `/chat` | General AI assistant | Assistant visibility |
| `/alarms` | Alarm history | Operational visibility |
| `/tickets` | Maintenance tickets | Operational visibility |
| `/orders` | Orders overview | Commercial visibility |
| `/scanner` | QR scanner | Scanner visibility |
| `/profile` | User profile | Authenticated |

Unknown routes redirect to `/`. The `DocumentsPage` and `DocumentViewerPage` source files exist but are **not currently registered in `App.jsx`**; their presence should not be interpreted as active application routes.

---

## Backend integration

The shared HTTP client is `src/api/httpClient.js`. It reads the API base URL from `VITE_API_BASE_URL`, defaults to `http://localhost:8000`, and adds the stored JWT to requests.

| Module | HTTP endpoint | Purpose |
| --- | --- | --- |
| `authApi.js` | `POST /auth/jwt/login` | Sign in |
| `authApi.js` | `GET /users/me` | Current user and visibility |
| `chatApi.js` | `POST /assistant/` | Send AI chat message |
| `chatApi.js` | `GET /assistant/{conversationId}` | Retrieve conversation history helper |
| `machinesApi.js` | `GET /machines/` | List accessible machines |
| `machinesApi.js` | `GET /machines/{id}` | Machine overview |
| `machinesApi.js` | `GET /machines/{id}/telemetry/latest` | Latest telemetry |
| `machinesApi.js` | `GET /machines/{id}/alarms` | Machine alarms; accepts query parameters |
| `machinesApi.js` | `GET /machines/{id}/maintenance` | Machine maintenance records |
| `ticketsApi.js` | `GET /maintenance-tickets/` | Maintenance tickets with query filters |
| `ordersApi.js` | `GET /orders/overview` | Orders overview |
| `ordersApi.js` | `GET /orders/{id}` | Order details helper |
| `ordersApi.js` | `GET /orders/{id}/lines` | Order lines helper |
| `manualsApi.js` | `GET /manuals/{machineId}` | Machine manual and URL |

The table describes endpoints **referenced by the frontend source**, not independent verification of the deployed backend's OpenAPI schema. Confirm server availability, response shapes, CORS configuration, and filter support against the running API documentation.

### Example: authentication request

```http
POST /auth/jwt/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=YOUR_PASSWORD
```

### Example: assistant request

```http
POST /assistant/
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "machine_id": null,
  "message": "What machines are available to my company?",
  "conversation_id": null
}
```

A machine-specific conversation uses a machine ID instead of `null`.

---

## Environment configuration

Create or update `frontend/.env` with the backend address:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Vite exposes variables beginning with `VITE_` to client-side JavaScript. **Do not put passwords, JWT signing keys, database credentials, or other secrets in `VITE_` variables.**

The backend and any supporting services (database, AI orchestrator, MCP, model runtime, and manual storage) must be configured and running separately according to their own documentation. This README does not assume a specific Docker Compose layout or start command for those services.

---

## Running the project

Run these commands **from the actual `frontend/` directory** (the one containing `package.json`):

```bash
cd /path/to/project/frontend
npm install
npm run dev
```

Open the local address printed by Vite (commonly `http://localhost:5173`).

Other scripts defined in `package.json`:

```bash
npm run build      # Generate production bundle
npm run preview    # Preview production build
npm run lint       # Run oxlint
```


## Known implementation boundaries

- Frontend service visibility must be complemented by backend authorization and company-level filtering.
- Unknown visibility values currently fall back to `full` in frontend code; consider changing to deny-by-default.
- Orders filters operate on the loaded overview response rather than requesting server-filtered pages.
- Alarms and Tickets dropdown options are discovered from returned records and may not represent every possible value in the database.
- QR camera scanning depends on `BarcodeDetector` support; manual entry is the fallback.
- Manual links may expire; the open-in-new-tab action fetches a new link.
- Documents pages and mock documents remain in the repository but are not part of the active route configuration.
- The legacy `server/` directory and associated scripts are separate from the current external-backend authentication path.

---

## Architecture overview

```text
User / Browser
     |
     v
React + Vite Frontend
     |
     +-- AuthContext / ProtectedRoute / VisibilityRoute
     |
     +-- Pages + reusable components
     |
     v
src/api/* + httpClient.js
     |
     | Authorization: Bearer <JWT>
     v
External Backend API
     |
     +-- Authentication / company-scoped data
     +-- Machines / telemetry / alarms / tickets / orders
     +-- Manuals / signed document URLs
     +-- AI assistant and its downstream services
```
