import { useState } from 'react';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import { sendChatMessage } from '../api/chatApi';

const initialMessages = [
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Hello! How can I help you with your AROL machine?',
  },
];

function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSendMessage(content) {
    const trimmedContent = content.trim();

    if (!trimmedContent || isLoading) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedContent,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setIsLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(trimmedContent);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (requestError) {
      console.error(requestError);

      setError(
        'The assistant is temporarily unavailable. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="chat-page">
      <section className="chat-container">
        <header className="chat-header">
          <div>
            <p className="chat-eyebrow">AROL Customer Platform</p>
            <h1>AI Assistant</h1>
          </div>

          <span className="status-badge">
            <span className="status-dot" />
            Online
          </span>
        </header>

        <MessageList
          messages={messages}
          isLoading={isLoading}
        />

        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </section>
    </main>
  );
}

export default ChatPage;