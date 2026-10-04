import { apiFetch } from './httpClient';

async function read(response, fallback) {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail ?? fallback);
  return data;
}

export async function getMachines() {
  return read(await apiFetch('/machines/'), 'Unable to retrieve machines');
}
export async function getMachine(id) {
  return read(await apiFetch(`/machines/${encodeURIComponent(id)}`), 'Unable to retrieve machine');
}
export async function getLatestTelemetry(id) {
  return read(await apiFetch(`/machines/${encodeURIComponent(id)}/telemetry/latest`), 'Unable to retrieve telemetry');
}
export async function getMachineAlarms(id, params = '') {
  return read(await apiFetch(`/machines/${encodeURIComponent(id)}/alarms${params ? `?${params}` : ''}`), 'Unable to retrieve alarms');
}
export async function getMachineTickets(id) {
  return read(await apiFetch(`/machines/${encodeURIComponent(id)}/maintenance`), 'Unable to retrieve maintenance history');
}
