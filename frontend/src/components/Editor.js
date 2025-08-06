import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../api/api';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function Editor({ doc, onBack }) {
  const [content, setContent] = useState(doc.content || '');
  const [isRemote, setIsRemote] = useState(false);
  const docId = doc._id;
  const timeout = useRef();

  useEffect(() => {
    socket.emit('join-doc', docId);

    // Receive document updates from other users
    socket.on('doc-updated', (newContent) => {
      setIsRemote(true);         // Mark update as remote to prevent feedback loop
      setContent(newContent);    // Update textarea instantly for all users
    });

    return () => {
      socket.off('doc-updated');
      socket.emit('leave-doc', docId);
    };
  }, [docId]);

  // Instantly emit every keystroke (no or minimal debounce)
  const handleChange = (e) => {
    const value = e.target.value;

    setContent(value);
    setIsRemote(false);

    // Emit to other users: Google Docs style
    socket.emit('edit-doc', { docId, content: value });

    // Save to DB but only if not from another user's update
    clearTimeout(timeout.current);
    if (!isRemote) {
      timeout.current = setTimeout(() => {
        API.put(`/docs/${docId}`, { content: value }).catch(() => {});
      }, 500); // Some debounce for DB efficiency
    }
  };

  return (
    <div className="editor">
      <button style={{ marginBottom: 10 }} onClick={onBack}>← Back to Docs</button>
      <h2>{doc.title}</h2>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Start collaborating..."
        style={{
          width: "100%", minHeight: 340, fontSize: "1.1rem",
          fontFamily: "'Fira Mono', monospace"
        }}
      />
    </div>
  );
}
