import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
  table({ children }) {
    return (
      <div className="message-table-wrapper">
        <table>{children}</table>
      </div>
    );
  },
};

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
        <div className="message-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

export default ChatMessage;