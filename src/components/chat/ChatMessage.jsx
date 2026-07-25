function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <article
      className={`message-row ${
        isUser ? 'message-row-user' : 'message-row-assistant'
      }`}
    >
      {!isUser && (
        <div className="message-avatar" aria-hidden="true">
          AI
        </div>
      )}

      <div
        className={`message-bubble ${
          isUser
            ? 'message-bubble-user'
            : 'message-bubble-assistant'
        }`}
      >
        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default ChatMessage;