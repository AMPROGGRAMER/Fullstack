import React, { useState } from "react";

// Local-only chat UI; for real chat, add a messages collection or websockets.
const initialThreads = [
  { id: 1, name: "Sunita Didi Cleaning", last: "See you tomorrow!", time: "2h" },
  { id: 2, name: "Ramesh Kumar Plumbers", last: "I will reach by 3 PM.", time: "1d" }
];

const ChatPage = () => {
  const [threads] = useState(initialThreads);
  const [activeId, setActiveId] = useState(initialThreads[0]?.id || null);
  const [messages, setMessages] = useState([
    { id: 1, fromMe: false, text: "Namaste! How can I help you?", time: "10:00" },
    { id: 2, fromMe: true, text: "Need deep cleaning for 2 BHK.", time: "10:02" }
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, fromMe: true, text: input.trim(), time: "now" }
    ]);
    setInput("");
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Chat</h1>
        <p>Coordinate details with your providers.</p>
      </div>

      <div className="chat-window">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="text-sm font-semibold">Conversations</div>
          </div>
          <div className="chat-list">
            {threads.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`chat-item ${t.id === activeId ? "active" : ""}`}
                onClick={() => setActiveId(t.id)}
              >
                <div className="chat-item-info">
                  <div className="chat-item-name">{t.name}</div>
                  <div className="chat-item-msg">{t.last}</div>
                </div>
                <div className="chat-item-time">{t.time}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-main">
          <header className="chat-header">
            <div className="text-sm font-semibold">
              {threads.find((t) => t.id === activeId)?.name || "Select a chat"}
            </div>
          </header>
          <div className="chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-msg ${m.fromMe ? "me" : ""}`}
              >
                <div className="chat-msg-bubble">{m.text}</div>
                <div className="chat-msg-time">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <textarea
              className="chat-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary btn-sm" type="button" onClick={send}>
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatPage;

