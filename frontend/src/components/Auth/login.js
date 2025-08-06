import React, { useState } from 'react';
import API from '../../api/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch {
      setError('Invalid email or password!');
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Sign In</h2>
      {error && <div style={{ color: "#d6002f" }}>{error}</div>}
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
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        autoComplete="current-password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
