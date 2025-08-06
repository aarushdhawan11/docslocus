import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import DocumentList from './components/DocumentList';
import Editor from './components/Editor';
import NavBar from './components/Navbar';
import Chat from './components/Chat';

function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [doc, setDoc] = useState(null);
  const [view, setView] = useState('docs'); // 'docs', 'editor', or 'chat'
  const [username, setUsername] = useState('');

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Adjust the below line depending on your JWT payload structure
        setUsername(decoded.user?.id || decoded.user?.username || 'User');
      } catch (e) {
        console.error('Failed to decode JWT', e);
      }
    } else {
      setUsername('');
    }
  }, [authed]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthed(false);
    setDoc(null);
    setUsername('');
    setView('docs');
  };

  // When not logged in: show signup and login
  if (!authed)
    return (
      <div>
        <Signup onSignup={() => setAuthed(true)} />
        <hr style={{ width: 140, margin: '2rem auto', border: 'none', borderTop: '1.5px solid #dde' }} />
        <Login onLogin={() => setAuthed(true)} />
      </div>
    );

  return (
    <div>
      <NavBar onLogout={handleLogout} />
      
      {/* Navigation Buttons to switch between Document List, Chat, and Editor */}
      {!doc && (
        <div style={{ maxWidth: 430, margin: '1rem auto', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => setView('docs')} disabled={view === 'docs'}>
            Documents
          </button>
          <button onClick={() => setView('chat')} disabled={view === 'chat'}>
            Chat
          </button>
        </div>
      )}

      {/* Conditionally render components based on view */}
      {view === 'docs' && !doc && <DocumentList selectDoc={setDoc} />}
      {view === 'chat' && !doc && <Chat user={username || 'Anonymous'} />}
      {doc && <Editor doc={doc} onBack={() => { setDoc(null); setView('docs') }} />}
    </div>
  );
}

export default App;
