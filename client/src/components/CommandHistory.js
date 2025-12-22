import React from 'react';
import './CommandHistory.css';

const CommandHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="command-history">
        <h2>📜 Command History</h2>
        <div className="empty-state">
          <p>No commands yet. Start speaking to see your command history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="command-history">
      <h2>📜 Command History</h2>
      <div className="history-list">
        {history.map((item, index) => (
          <div 
            key={index} 
            className={`history-item ${item.recognized ? 'recognized' : 'unrecognized'}`}
          >
            <div className="history-header">
              <span className="history-icon">
                {item.recognized ? '✅' : '❓'}
              </span>
              <span className="history-transcript">{item.transcript}</span>
            </div>
            
            {item.recognized && (
              <div className="history-details">
                <span className="history-badge action">{item.action}</span>
                {item.target && (
                  <span className="history-badge target">
                    Target: {item.target}
                  </span>
                )}
              </div>
            )}
            
            <div className="history-timestamp">
              {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandHistory;

