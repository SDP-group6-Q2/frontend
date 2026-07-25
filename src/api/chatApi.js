const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000';

export async function sendChatMessage(message) {
  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Chat request failed with status ${response.status}`,
    );
  }

  const data = await response.json();

  return {
    reply:
      data.reply ??
      data.message ??
      'No response received from the assistant.',
  };
}