const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000';


export async function loginUser(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ?? 'Unable to sign in',
    );
  }

  return data;
}


export async function getCurrentUser() {
  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: 'GET',
      credentials: 'include',
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
  const response = await fetch(
    `${API_BASE_URL}/auth/logout`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to logout',
    );
  }

  return response.json();
}