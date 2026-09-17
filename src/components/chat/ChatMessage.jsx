import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownTable({ children }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div className="message-table-wrapper">
      <button
        type="button"
        className="message-table-expand-btn"
        onClick={() => setIsFullscreen(true)}
        aria-label="Expand table to fullscreen"
        title="Expand table"
      >
        ⤢
      </button>

      <table>{children}</table>

      {isFullscreen &&
        createPortal(
          <div
            className="message-table-overlay"
            onClick={() => setIsFullscreen(false)}
          >
            <div
              className="message-table-overlay-content"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="message-table-overlay-close"
                onClick={() => setIsFullscreen(false)}
                aria-label="Close fullscreen table"
              >
                ✕
              </button>

              <div className="message-table-overlay-scroll message-markdown">
                <table>{children}</table>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

const markdownComponents = {
  table: MarkdownTable,
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