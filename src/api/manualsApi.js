import { apiFetch } from './httpClient';
export async function getManual(machineId) { const response = await apiFetch(`/manuals/${encodeURIComponent(machineId)}`); const data = await response.json().catch(() => null); if (!response.ok) throw new Error(data?.detail ?? 'Manual not available'); return data; }
