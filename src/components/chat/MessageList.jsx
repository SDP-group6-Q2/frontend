import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import LoadingMessage from './LoadingMessage';

function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  return (
    <div
      className="message-list"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {isLoading && <LoadingMessage />}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;