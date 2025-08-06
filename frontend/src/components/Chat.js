import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function Chat({ user }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join-chat', user);

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up on unmount
    return () => {
      socket.emit('leave-chat', user);
      socket.off('chat-message');
    };
  }, [user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('send-message', { user, text: input });
    setInput('');
  };

  return (
    <div className="chatbox" style={{
      maxWidth: 430, margin: '2rem auto', background: "#fff", borderRadius: 16,
      boxShadow: '0 6px 36px 8px #dde6f6', padding: '1.5rem'
    }}>
      <h2>Live Chat</h2>
      <div style={{ minHeight: 200, maxHeight: 250, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.user === user ? 'right' : 'left',
            color: msg.user === user ? '#2948ff' : '#232340', margin: '6px 0'
          }}>
            {msg.user !== 'System' && <b>{msg.user}: </b>}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
               placeholder="Type a message..." style={{ flex: 1, borderRadius: 8, border: '1px solid #d1d5db' }} />
        <button type="submit" style={{ marginLeft: 10 }}>Send</button>
      </form>
    </div>
  );
}
