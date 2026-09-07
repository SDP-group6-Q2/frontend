const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000';


function getAuthHeaders() {
  const token = localStorage.getItem('access_token');

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


export async function loginUser(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/auth/jwt/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: new URLSearchParams({
        username: email,
        password,
      }),
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ?? 'Unable to sign in',
    );
  }

  localStorage.setItem('access_token', data.access_token);

  return getCurrentUser();
}


export async function getCurrentUser() {
  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      'Unable to retrieve current user',
    );
  }

  return response.json();
}


export async function logoutUser() {
  // The backend's JWT auth is stateless -- there is no server-side session to
  // invalidate, so "logging out" is just discarding the token client-side.
  localStorage.removeItem('access_token');
}
