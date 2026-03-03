import React from 'react';

const ActivityLog = ({ log, onClear, onClose }) => (
  <div className="log-panel">
    <div className="log-header">
      <span className="log-title">Activity Log</span>
      <div style={{ display:'flex', gap:8 }}>
        <button className="log-clear" onClick={onClear}>Clear</button>
        <button className="log-close" onClick={onClose}>✕</button>
      </div>
    </div>
    {log.length === 0
      ? <p className="log-empty">No activity yet.</p>
      : <ul className="log-list">
          {log.map((l, i) => (
            <li key={i} className="log-item">
              <span className={`log-action log-${l.action.toLowerCase().replace(/\s+/g,'-')}`}>{l.action}</span>
              <span className="log-details">{l.details}</span>
              <span className="log-meta">{l.user} · {l.time}</span>
            </li>
          ))}
        </ul>
    }
  </div>
);

export default ActivityLog;