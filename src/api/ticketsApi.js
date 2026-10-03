import { apiFetch } from './httpClient';
export async function getTickets() { const response = await apiFetch('/maintenance-tickets/'); const data = await response.json().catch(() => null); if (!response.ok) throw new Error(data?.detail ?? 'Unable to retrieve tickets'); return data; }
