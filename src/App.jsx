import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import DocumentViewerPage from './pages/DocumentViewerPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/chat"
            element={<ChatPage />}
          />

          <Route
            path="/documents"
            element={<DocumentsPage />}
          />

          <Route
            path="/documents/:documentId"
            element={<DocumentViewerPage />}
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;