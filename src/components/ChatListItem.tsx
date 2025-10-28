import React from 'react';
import type { Chat } from '../pages/HomePage';

const ChatListItem: React.FC<{
  chat: Chat;
  active?: boolean;
  onClick?: () => void;
}> = ({ chat, active, onClick }) => {
  return (
    <button
      className={`cc-chat-item ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
    >
      <div className="cc-avatar" aria-hidden>
        {chat.title.charAt(0).toUpperCase()}
      </div>
      <div className="cc-chat-meta">
        <div className="cc-chat-title-row">
          <div className="cc-chat-title">{chat.title}</div>
          {chat.unread ? <div className="cc-badge">{chat.unread}</div> : null}
        </div>
        <div className="cc-chat-snippet">{chat.snippet || ''}</div>
      </div>
    </button>
  );
};

export default ChatListItem;