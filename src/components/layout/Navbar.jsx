import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-mark">A</span>

          <div>
            <span className="navbar-brand-name">AROL</span>
            <span className="navbar-brand-subtitle">
              Customer Platform
            </span>
          </div>
        </NavLink>

        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'navbar-link active' : 'navbar-link'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              isActive ? 'navbar-link active' : 'navbar-link'
            }
          >
            Documents
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? 'navbar-link active' : 'navbar-link'
            }
          >
            AI Assistant
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;