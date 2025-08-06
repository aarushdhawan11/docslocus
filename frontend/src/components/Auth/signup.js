import React, { useState } from 'react';
import API from '../../api/api';

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/signup', { email, username, password });
      localStorage.setItem('token', res.data.token);
      onSignup();
    } catch {
      setError('Error: Email may already exist');
    }
  };

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Create Account</h2>
      {error && <div style={{ color: "#d6002f" }}>{error}</div>}
      <input
        required
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        required
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        autoComplete="email"
      />
      <input
        required
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        autoComplete="new-password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
