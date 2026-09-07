const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000';


function getAuthHeaders() {
  const token = localStorage.getItem('access_token');

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


export async function sendChatMessage(message, machineId, conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/assistant/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },

      body: JSON.stringify({
        machine_id: machineId,
        message,
        conversation_id: conversationId ?? null,
      }),
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ?? 'Unable to send message',
    );
  }

  return {
    reply: data.answer,
    conversationId: data.conversation_id,
  };
}


export async function getChatHistory(conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/assistant/${conversationId}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ?? 'Unable to retrieve chat history',
    );
  }

  return {
    conversationId: data.conversation_id,
    machineId: data.machine_id,
    messages: data.messages,
  };
}
