import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function DocumentList({ selectDoc }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    const res = await API.get('/docs');
    setDocs(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const createDoc = async () => {
    if (!title.trim()) return setError('Title required');
    const res = await API.post('/docs', { title });
    setDocs(d => [...d, res.data]);
    setTitle('');
    setError('');
  };

  return (
    <div className="doc-list">
      <h2>Your Documents</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="New Document Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '70%', marginRight: '4%' }}
        />
        <button style={{width: '25%'}} onClick={createDoc}>Create</button>
      </div>
      {error && <div style={{color:"#d6002f"}}>{error}</div>}
      {loading ? (
        <div>Loading documents...</div>
      ) : !docs.length ? (
        <div style={{opacity:0.7}}>You have no documents yet</div>
      ) : (
        <ul>
          {docs.map(doc => (
            <li key={doc._id} onClick={() => selectDoc(doc)}>
              <b>{doc.title}</b><br/>
              <small style={{color:'#6e7eb8', fontSize:'0.98em'}}>{doc.updatedAt ? "Last edited " + new Date(doc.updatedAt).toLocaleString() : ""}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
