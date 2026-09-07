import { useState } from 'react';
import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import { sendChatMessage } from '../api/chatApi';

const initialMessages = [
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      'Hello! How can I help you with your AROL machine today?',
  },
];

function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);

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
      // TODO: replace with the machine actually selected by the user once a
      // machine picker exists -- there is no such UI yet.
      const machineId =
        localStorage.getItem('machine_id') ?? 'MCH-0001';

      const response = await sendChatMessage(
        trimmedContent,
        machineId,
        conversationId,
      );

      setConversationId(response.conversationId);

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
    <div className="chat-page">
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">AI support</p>
          <h1>AROL AI Assistant</h1>

          <p>
            Ask questions about your machine, manuals and technical
            procedures.
          </p>
        </div>
      </section>

      <section className="chat-section">
        <div className="page-container chat-page-container">
          <div className="chat-container">
            <header className="chat-header">
              <div>
                <p className="chat-eyebrow">AROL Customer Platform</p>
                <h2>AI Assistant</h2>
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChatPage;