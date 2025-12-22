import React, { useState, useEffect } from 'react';
import { getAvailableCommands } from '../services/api';
import './AvailableCommands.css';

const AvailableCommands = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCommand, setExpandedCommand] = useState(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const result = await getAvailableCommands();
      if (result.success) {
        setCommands(result.data.commands);
      } else {
        setError('Failed to load commands');
      }
    } catch (err) {
      console.error('Error fetching commands:', err);
      setError('Failed to load commands');
    } finally {
      setLoading(false);
    }
  };

  const toggleCommand = (commandId) => {
    setExpandedCommand(expandedCommand === commandId ? null : commandId);
  };

  if (loading) {
    return (
      <div className="available-commands">
        <h2>📋 Available Commands</h2>
        <div className="loading">Loading commands...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="available-commands">
        <h2>📋 Available Commands</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="available-commands">
      <h2>📋 Available Commands</h2>
      <p className="commands-intro">
        Click on any command to see examples of how to use it
      </p>
      
      <div className="commands-grid">
        {commands.map((command) => (
          <div 
            key={command.id}
            className={`command-card ${expandedCommand === command.id ? 'expanded' : ''}`}
            onClick={() => toggleCommand(command.id)}
          >
            <div className="command-header">
              <h3>{command.name}</h3>
              <span className="action-badge">{command.action}</span>
            </div>
            
            <p className="command-description">{command.description}</p>
            
            <div className="command-patterns">
              <strong>Say:</strong>
              <div className="pattern-tags">
                {command.patterns.map((pattern, idx) => (
                  <span key={idx} className="pattern-tag">
                    "{pattern}"
                  </span>
                ))}
              </div>
            </div>

            {expandedCommand === command.id && (
              <div className="command-examples">
                <strong>Examples:</strong>
                <ul>
                  {command.examples.map((example, idx) => (
                    <li key={idx}>💬 "{example}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCommands;

