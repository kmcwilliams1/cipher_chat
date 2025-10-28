import React, { useRef, useEffect } from 'react';
import type { Chat, Message } from '../pages/HomePage';
import MessageComposer from './MessageComposer';

const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatWindow: React.FC<{ chat: Chat; onSend: (text: string) => void }> = ({ chat, onSend }) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat.messages.length]);

  return (
    <div className="cc-chat-window">
      <header className="cc-chat-header">
        <div className="cc-header-title">{chat.title}</div>
        <div className="cc-header-sub">Encrypted · {chat.messages.length} messages</div>
      </header>

      <div className="cc-messages" ref={listRef}>
        {chat.messages.map((m: Message) => (
          <div key={m.id} className={`cc-message ${m.me ? 'me' : 'them'}`}>
            <div className="cc-message-body">
              <div className="cc-message-text">{m.text}</div>
              <div className="cc-message-time">{formatTime(m.ts)}</div>
            </div>
          </div>
        ))}
      </div>

      <MessageComposer onSend={onSend} />
    </div>
  );
};

export default ChatWindow;