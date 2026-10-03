import { useEffect, useState } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  ['Dashboard', '/'],
  ['Machines', '/machines'],
  ['Alarms', '/alarms'],
  ['Tickets', '/tickets'],
  ['Orders', '/orders'],
  ['QR Scanner', '/scanner'],
  ['AI Assistant', '/chat'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    close();
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  async function signOut() {
    await logout();

    close();

    navigate('/login', {
      replace: true,
    });
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink
          to="/"
          className="navbar-brand"
          onClick={close}
        >
          <span className="navbar-brand-mark">
            A
          </span>

          <div className="navbar-brand-text">
            <span className="navbar-brand-name">
              AROL
            </span>

            <span className="navbar-brand-subtitle">
              Customer Platform
            </span>
          </div>
        </NavLink>

        <button
          className={`nav-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={
            open
              ? 'Close navigation'
              : 'Open navigation'
          }
        >
          <span />
          <span />
          <span />
        </button>

        <button
          className={`nav-overlay ${open ? 'open' : ''}`}
          onClick={close}
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
        />

        <div className={`nav-drawer ${open ? 'open' : ''}`}>
          <nav className="navbar-links">
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `navbar-link${isActive ? ' active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-account">
            <NavLink
              to="/profile"
              onClick={close}
              className="navbar-profile"
            >
              <span className="navbar-profile-avatar">
                {user?.firstName?.[0] ??
                  user?.email?.[0]?.toUpperCase()}
              </span>

              <span className="navbar-profile-text">
                <span className="navbar-profile-label">
                  Profile
                </span>

                <span className="navbar-profile-name">
                  {user?.firstName || user?.email}
                </span>
              </span>
            </NavLink>

            <button
              className="navbar-logout"
              onClick={signOut}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}