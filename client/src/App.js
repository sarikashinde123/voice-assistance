import React from 'react';
import './App.css';
import VoiceAssistant from './components/VoiceAssistant';
import CommandHistory from './components/CommandHistory';
import AvailableCommands from './components/AvailableCommands';
import DemoApp from './components/DemoApp';

function App() {
  const [commandHistory, setCommandHistory] = React.useState([]);
  const [showCommands, setShowCommands] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [lastCommand, setLastCommand] = React.useState(null);

  const handleNewCommand = (command) => {
    setCommandHistory(prev => [command, ...prev]);
    setLastCommand(command);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🎤 Voice Command Assistant</h1>
            <p className="subtitle">Powered by Deepgram AI</p>
          </div>
          <div className="header-voice">
            <VoiceAssistant onCommandProcessed={handleNewCommand} compact={true} />
          </div>
        </div>
      </header>

      <main className="App-main">
        <div className="main-layout">
          {/* Sidebar - 20% */}
          <aside className="sidebar">
            <div className="sidebar-controls">
              <button 
                className="sidebar-button"
                onClick={() => {
                  setShowCommands(!showCommands);
                  setShowHistory(false);
                }}
              >
                {showCommands ? '✕ Hide' : '📋 Commands'}
              </button>
              <button 
                className="sidebar-button"
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowCommands(false);
                }}
              >
                {showHistory ? '✕ Hide' : '📜 History'}
              </button>
            </div>

            {showCommands && (
              <div className="sidebar-content">
                <AvailableCommands />
              </div>
            )}
            {showHistory && (
              <div className="sidebar-content">
                <CommandHistory history={commandHistory} />
              </div>
            )}

            {!showCommands && !showHistory && (
              <div className="sidebar-placeholder">
                <p>👆 Click buttons above to view available commands or command history</p>
              </div>
            )}
          </aside>

          {/* Main Content - 80% */}
          <div className="main-content">
            <DemoApp lastCommand={lastCommand} />
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>🎙️ Click the microphone and try: "Go to dashboard" • "Open settings" • "Create new task" • "Search for users"</p>
      </footer>
    </div>
  );
}

export default App;
