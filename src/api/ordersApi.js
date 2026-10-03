import { apiFetch } from './httpClient';
async function read(response, fallback) { const data = await response.json().catch(() => null); if (!response.ok) throw new Error(data?.detail ?? fallback); return data; }
export async function getOrdersOverview() { return read(await apiFetch('/orders/overview'), 'Unable to retrieve orders'); }
export async function getOrder(id) { return read(await apiFetch(`/orders/${encodeURIComponent(id)}`), 'Unable to retrieve order'); }
export async function getOrderLines(id) { return read(await apiFetch(`/orders/${encodeURIComponent(id)}/lines`), 'Unable to retrieve order lines'); }
