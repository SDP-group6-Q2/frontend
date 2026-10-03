import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import VisibilityRoute from './components/auth/VisibilityRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MachinesPage from './pages/MachinesPage.jsx';
import MachinePage from './pages/MachinePage.jsx';
import MachineChatPage from './pages/MachineChatPage.jsx';
import ManualPage from './pages/ManualPage.jsx';
import AlarmsPage from './pages/AlarmsPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import QrScannerPage from './pages/QrScannerPage.jsx';

const gated = (service, element) => <VisibilityRoute service={service}>{element}</VisibilityRoute>;

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/" element={<HomePage />} />
      <Route path="/machines" element={gated('machines', <MachinesPage />)} />
      <Route path="/machines/:machineId" element={gated('machines', <MachinePage />)} />
      <Route path="/machines/:machineId/assistant" element={gated('assistant', <MachineChatPage />)} />
      <Route path="/machines/:machineId/manual" element={gated('machines', <ManualPage />)} />
      <Route path="/chat" element={gated('assistant', <ChatPage />)} />
      <Route path="/alarms" element={gated('operations', <AlarmsPage />)} />
      <Route path="/tickets" element={gated('operations', <TicketsPage />)} />
      <Route path="/orders" element={gated('commercial', <OrdersPage />)} />
      <Route path="/scanner" element={gated('scanner', <QrScannerPage />)} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
