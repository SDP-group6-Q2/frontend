import { useState } from 'react';
import {
  Navigate,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="auth-loading">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-visual">
          <div className="login-visual-content">
            <div className="login-brand-large">
              <div className="login-brand-mark">
                A
              </div>

              <div>
                <span className="login-brand-name">
                  AROL
                </span>

                <span className="login-brand-subtitle">
                  Customer Platform
                </span>
              </div>
            </div>

            <div className="login-visual-copy">
              <p className="page-eyebrow">
                Digital customer experience
              </p>

              <h1>
                Your AROL information,
                always available.
              </h1>

              <p>
                Access documentation, machine information
                and AI-powered support from a single platform.
              </p>
            </div>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-form-wrapper">
            <div className="login-heading">
              <p className="page-eyebrow">
                Customer access
              </p>

              <h2>Welcome back</h2>

              <p>
                Sign in with your company account.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="form-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p
                  className="login-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Signing in...'
                  : 'Sign in'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;