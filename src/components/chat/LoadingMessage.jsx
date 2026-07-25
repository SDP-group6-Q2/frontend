function LoadingMessage() {
  return (
    <div className="message-row message-row-assistant">
      <div className="message-avatar" aria-hidden="true">
        AI
      </div>

      <div
        className="message-bubble message-bubble-assistant loading-bubble"
        aria-label="Assistant is writing"
      >
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default LoadingMessage;