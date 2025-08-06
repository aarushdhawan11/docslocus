import React from 'react';

export default function NavBar({ onLogout }) {
  return (
    <div className="navbar">
      <span>Collab Platform</span>
      <button className="logout-btn" onClick={() => {
        localStorage.removeItem('token');
        onLogout && onLogout();
      }}>Logout</button>
    </div>
  );
}
