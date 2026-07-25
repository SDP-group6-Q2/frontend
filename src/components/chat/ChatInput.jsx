import { useState } from 'react';

function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    onSend(trimmedValue);
    setValue('');
  }

  function handleKeyDown(event) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <form
      className="chat-input-form"
      onSubmit={handleSubmit}
    >
      <label
        className="sr-only"
        htmlFor="chat-message"
      >
        Write a message
      </label>

      <textarea
        id="chat-message"
        className="chat-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask something about your machine..."
        rows={1}
        disabled={disabled}
      />

      <button
        className="send-button"
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;