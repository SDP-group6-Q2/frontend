import { apiFetch } from './httpClient';

export async function getDocuments() {
  const response = await apiFetch('/documents');

  if (!response.ok) {
    throw new Error(
      `Documents request failed with status ${response.status}`,
    );
  }

  return response.json();
}