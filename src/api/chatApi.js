import { apiFetch } from './httpClient';


export async function sendChatMessage(message, machineId, conversationId) {
  const response = await apiFetch(
    '/assistant/',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
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
  const response = await apiFetch(
    `/assistant/${conversationId}`,
    {
      method: 'GET',
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
