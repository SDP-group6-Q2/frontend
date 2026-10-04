import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './Navbar.jsx';

function MainLayout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-content">
        <div
          key={location.pathname}
          className="page-transition"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;