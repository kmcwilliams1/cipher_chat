import React, { useState } from 'react';

const MessageComposer: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [text, setText] = useState('');

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <form className="cc-composer" onSubmit={submit}>
      <input
        className="cc-composer-input"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Type a message"
      />
      <button className="cc-composer-send" type="submit" aria-label="Send">
        Send
      </button>
    </form>
  );
};

export default MessageComposer;