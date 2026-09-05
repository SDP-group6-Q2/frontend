import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* BRAND */}
        <NavLink
          to="/"
          className="navbar-brand"
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

        {/* NAVIGATION */}
        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'navbar-link active'
                : 'navbar-link'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              isActive
                ? 'navbar-link active'
                : 'navbar-link'
            }
          >
            Documents
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive
                ? 'navbar-link active'
                : 'navbar-link'
            }
          >
            AI Assistant
          </NavLink>
        </nav>

        {/* ACCOUNT */}
        <div className="navbar-account">

          {isAuthenticated && user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'navbar-profile active'
                    : 'navbar-profile'
                }
              >
                <span className="navbar-profile-avatar">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>

                <span className="navbar-profile-text">
                  <span className="navbar-profile-label">
                    Profile
                  </span>

                  <span className="navbar-profile-name">
                    {user.firstName}
                  </span>
                </span>
              </NavLink>

              <button
                type="button"
                className="navbar-logout"
                onClick={async function handleLogout() {
  try {
    await logout();

    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="navbar-login"
            >
              Login
            </NavLink>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;