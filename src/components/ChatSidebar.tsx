import React, { useState } from 'react';
import ChatListItem from './ChatListItem';
import type { Chat } from '../pages/HomePage';

const ChatSidebar: React.FC<{
  chats: Chat[];
  selectedId?: string;
  onSelect: (id: string) => void;
}> = ({ chats, selectedId, onSelect }) => {
  const [query, setQuery] = useState('');

  const filtered = chats.filter((c) =>
    (c.title + ' ' + (c.snippet || '')).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cc-sidebar-inner">
      <div className="cc-sidebar-header">
        <h3>Cipher_Chat</h3>
        <input
          className="cc-search"
          placeholder="Search chats"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      <div className="cc-chat-list" role="list">
        {filtered.map((c) => (
          <ChatListItem key={c.id} chat={c} active={c.id === selectedId} onClick={() => onSelect(c.id)} />
        ))}
        {filtered.length === 0 && <div className="cc-muted">No chats</div>}
      </div>
    </div>
  );
};

export default ChatSidebar;