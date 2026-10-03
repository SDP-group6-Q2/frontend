import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';

import { sendChatMessage } from '../api/chatApi';

export default function MachineChatPage() {
  const { machineId } = useParams();

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `I’m ready to assist you with machine ${machineId}.`,
    },
  ]);

  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function send(content) {
    const message = content.trim();

    if (!message || loading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
      },
    ]);

    setLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(
        message,
        machineId,
        conversationId,
      );

      setConversationId(response.conversationId);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.reply,
        },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-page">
      <section className="page-header">
        <div className="page-container">
          <Link
            to={`/machines/${machineId}`}
            className="text-link"
          >
            ← Machine overview
          </Link>

          <p className="page-eyebrow">
            Machine assistant
          </p>

          <h1>{machineId}</h1>

          <p>
            This conversation is scoped to this machine.
          </p>
        </div>
      </section>

      <section className="chat-section">
        <div className="page-container chat-page-container">
          <div className="chat-container">
            <MessageList
              messages={messages}
              isLoading={loading}
            />

            {error && (
              <p className="chat-error">
                {error}
              </p>
            )}

            <ChatInput
              onSend={send}
              disabled={loading}
            />
          </div>
        </div>
      </section>
    </div>
  );
}