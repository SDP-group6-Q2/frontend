export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    },
  );

  if (response.status === 401 && token) {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('arol:session-expired'));
  }

  return response;
}
