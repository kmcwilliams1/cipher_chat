import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import '../CSS/HomePage.css';

export type Message = {
  id: string;
  from: string;
  text: string;
  ts: number;
  me?: boolean;
};

export type Chat = {
  id: string;
  title: string;
  snippet?: string;
  unread?: number;
  messages: Message[];
};

const sampleChats: Chat[] = [
  {
    id: 'c1',
    title: 'Alice',
    snippet: 'See you tomorrow!',
    unread: 2,
    messages: [
      { id: 'm1', from: 'Alice', text: 'Hey — are we still on for tomorrow?', ts: Date.now() - 1000 * 60 * 60 },
      { id: 'm2', from: 'me', text: "Yes — 10am works", ts: Date.now() - 1000 * 60 * 30, me: true },
    ],
  },
  {
    id: 'c2',
    title: 'Work Group',
    snippet: 'Docs updated',
    messages: [
      { id: 'm3', from: 'Sam', text: 'I pushed the latest draft.', ts: Date.now() - 1000 * 60 * 60 * 5 },
    ],
  },
];

const HomePage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(sampleChats);
  const [selectedChatId, setSelectedChatId] = useState<string>(sampleChats[0].id);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || chats[0];

  function sendMessage(chatId: string, text: string) {
    if (!text.trim()) return;
    const msg: Message = {
      id: 'm' + Math.random().toString(36).slice(2, 9),
      from: 'me',
      text,
      ts: Date.now(),
      me: true,
    };
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg], snippet: text } : c))
    );
  }

  return (
    <div className="cc-homepage">
      <aside className="cc-sidebar">
        <ChatSidebar
          chats={chats}
          selectedId={selectedChatId}
          onSelect={(id) => setSelectedChatId(id)}
        />
      </aside>

      <main className="cc-main">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onSend={(text) => sendMessage(selectedChat.id, text)} />
        ) : (
          <div className="cc-empty">Select a chat to start messaging</div>
        )}
      </main>
    </div>
  );
};

export default HomePage;