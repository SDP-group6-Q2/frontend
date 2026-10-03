import { apiFetch } from './httpClient';
export async function getTickets(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== '' && value != null) params.set(key, value); });
  const response = await apiFetch(`/maintenance-tickets/${params.size ? `?${params}` : ''}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail ?? 'Unable to retrieve tickets');
  return data;
}
