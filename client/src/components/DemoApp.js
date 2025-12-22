import React, { useState } from 'react';
import './DemoApp.css';

const DemoApp = ({ lastCommand }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Sample Task 1', completed: false },
    { id: 2, title: 'Sample Task 2', completed: true }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Sample data for search results and users list
  const sampleData = {
    users: [
      { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', phone: '+1 234-567-8900', status: 'Active', joinDate: '2023-05-12' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'User', phone: '+1 234-567-8901', status: 'Active', joinDate: '2023-08-20' },
      { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'Manager', phone: '+1 234-567-8902', status: 'Active', joinDate: '2023-03-15' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', phone: '+1 234-567-8903', status: 'Inactive', joinDate: '2023-11-01' },
      { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'User', phone: '+1 234-567-8904', status: 'Active', joinDate: '2024-01-05' },
    ],
    documents: [
      { id: 1, name: 'Project Proposal.pdf', size: '2.3 MB', date: '2024-01-15' },
      { id: 2, name: 'User Manual.docx', size: '1.1 MB', date: '2024-01-20' },
      { id: 3, name: 'Financial Report.xlsx', size: '854 KB', date: '2024-01-22' },
    ],
    reports: [
      { id: 1, name: 'Monthly Sales Report', status: 'Complete', date: '2024-01-30' },
      { id: 2, name: 'Q1 Analytics Report', status: 'In Progress', date: '2024-02-05' },
      { id: 3, name: 'Customer Feedback Report', status: 'Complete', date: '2024-01-28' },
    ]
  };

  // Filter search results based on query
  const getSearchResults = () => {
    if (!searchQuery) return null;

    const query = searchQuery.toLowerCase();
    const results = {
      users: sampleData.users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      ),
      documents: sampleData.documents.filter(d => 
        d.name.toLowerCase().includes(query)
      ),
      reports: sampleData.reports.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.status.toLowerCase().includes(query)
      )
    };

    return results;
  };

  // Process voice commands
  React.useEffect(() => {
    if (!lastCommand || !lastCommand.recognized) return;

    const action = lastCommand.action;
    const target = (lastCommand.target || '').toLowerCase().trim();

    // Log for debugging
    console.log('Voice Command Received:', { action, target, lastCommand });
    console.log('Current showSettings state:', showSettings);

    showNotification(`Command: ${action} ${target || ''}`);

    switch (action) {
      case 'OPEN':
      case 'LAUNCH':
      case 'START':
      case 'SHOW':
        console.log('Checking target for settings:', target);
        if (target.includes('setting')) {
          console.log('Match found! Opening settings modal');
          setShowSettings(true);
        }
        else if (target.includes('home')) setActiveTab('home');
        else if (target.includes('dashboard')) setActiveTab('dashboard');
        else if (target.includes('task')) setActiveTab('tasks');
        else if (target.includes('profile')) setActiveTab('profile');
        else if (target.includes('user')) setActiveTab('users');
        break;

      case 'CLOSE':
      case 'EXIT':
      case 'QUIT':
        if (target.includes('setting')) {
          setShowSettings(false);
          console.log('Closing settings');
        }
        break;

      case 'NAVIGATE':
      case 'GOTO':
        if (target.includes('home')) setActiveTab('home');
        else if (target.includes('dashboard')) setActiveTab('dashboard');
        else if (target.includes('task')) setActiveTab('tasks');
        else if (target.includes('profile')) setActiveTab('profile');
        else if (target.includes('user')) setActiveTab('users');
        break;

      case 'SEARCH':
      case 'FIND':
        setSearchQuery(target);
        setActiveTab('dashboard');
        break;

      case 'CREATE':
      case 'ADD':
        if (target.includes('task') || target.includes('item')) {
          setTasks(prevTasks => {
            const newTask = {
              id: prevTasks.length + 1,
              title: target || `New Task ${prevTasks.length + 1}`,
              completed: false
            };
            return [...prevTasks, newTask];
          });
          setActiveTab('tasks');
        }
        break;

      case 'DELETE':
      case 'REMOVE':
        if (target.includes('task') || target.includes('item')) {
          setTasks(prevTasks => prevTasks.slice(0, -1));
        }
        break;

      case 'REFRESH':
      case 'RELOAD':
        window.location.reload();
        break;

      case 'HELP':
        showNotification('Try: "Go to dashboard", "Open settings", "Create new task", "Search for users"');
        break;

      default:
        console.log('Unhandled action:', action);
        break;
    }
  }, [lastCommand]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="tab-content">
            <h2>🏠 Home</h2>
            <p>Welcome to the Voice-Driven Demo App!</p>
            <div className="card-grid">
              <div className="card">
                <h3>📊 Dashboard</h3>
                <p>View your analytics</p>
              </div>
              <div className="card">
                <h3>✅ Tasks</h3>
                <p>Manage your tasks</p>
              </div>
              <div className="card">
                <h3>👤 Profile</h3>
                <p>Update your profile</p>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        const searchResults = getSearchResults();
        const hasResults = searchResults && (
          searchResults.users.length > 0 || 
          searchResults.documents.length > 0 || 
          searchResults.reports.length > 0
        );

        return (
          <div className="tab-content">
            <h2>📊 Dashboard</h2>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search for users, documents, reports..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="search-results">
                {hasResults ? (
                  <>
                    {searchResults.users.length > 0 && (
                      <div className="result-section">
                        <h3>👥 Users ({searchResults.users.length})</h3>
                        <div className="result-list">
                          {searchResults.users.map(user => (
                            <div key={user.id} className="result-item">
                              <div className="result-icon">👤</div>
                              <div className="result-details">
                                <div className="result-name">{user.name}</div>
                                <div className="result-meta">{user.email} • {user.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.documents.length > 0 && (
                      <div className="result-section">
                        <h3>📄 Documents ({searchResults.documents.length})</h3>
                        <div className="result-list">
                          {searchResults.documents.map(doc => (
                            <div key={doc.id} className="result-item">
                              <div className="result-icon">📄</div>
                              <div className="result-details">
                                <div className="result-name">{doc.name}</div>
                                <div className="result-meta">{doc.size} • {doc.date}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.reports.length > 0 && (
                      <div className="result-section">
                        <h3>📊 Reports ({searchResults.reports.length})</h3>
                        <div className="result-list">
                          {searchResults.reports.map(report => (
                            <div key={report.id} className="result-item">
                              <div className="result-icon">📊</div>
                              <div className="result-details">
                                <div className="result-name">{report.name}</div>
                                <div className="result-meta">
                                  <span className={`status-badge ${report.status.toLowerCase().replace(' ', '-')}`}>
                                    {report.status}
                                  </span>
                                  • {report.date}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>No matches for "{searchQuery}"</p>
                    <p className="hint">Try: users, documents, reports, john, sales</p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>42</h3>
                  <p>Total Users</p>
                </div>
                <div className="stat-card">
                  <h3>{tasks.length}</h3>
                  <p>Active Tasks</p>
                </div>
                <div className="stat-card">
                  <h3>87%</h3>
                  <p>Completion Rate</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'tasks':
        return (
          <div className="tab-content">
            <h2>✅ Tasks</h2>
            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-state">No tasks yet. Say "Create new task" to add one!</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <span>{task.title}</span>
                    <span className="task-status">{task.completed ? '✅' : '⏳'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="tab-content">
            <h2>👥 Users ({sampleData.users.length})</h2>
            <div className="users-header">
              <div className="user-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">{sampleData.users.filter(u => u.status === 'Active').length}</span>
                  <span className="mini-stat-label">Active</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">{sampleData.users.filter(u => u.role === 'Admin').length}</span>
                  <span className="mini-stat-label">Admins</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">{sampleData.users.filter(u => u.role === 'Manager').length}</span>
                  <span className="mini-stat-label">Managers</span>
                </div>
              </div>
            </div>
            <div className="users-grid">
              {sampleData.users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-card-header">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <span className={`user-status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="user-card-body">
                    <div className="user-detail">
                      <span className="detail-label">Role:</span>
                      <span className="detail-value">{user.role}</span>
                    </div>
                    <div className="user-detail">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{user.phone}</span>
                    </div>
                    <div className="user-detail">
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">{user.joinDate}</span>
                    </div>
                  </div>
                  <div className="user-card-footer">
                    <button className="btn-user-action">View Details</button>
                    <button className="btn-user-action">Send Message</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="tab-content">
            <h2>👤 Profile</h2>
            <div className="profile-card">
              <div className="avatar">👤</div>
              <h3>John Doe</h3>
              <p>john.doe@example.com</p>
              <button className="btn-primary">Edit Profile</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="demo-app">
      {notification && (
        <div className="notification">
          🎤 {notification}
        </div>
      )}

      {/* Debug Panel */}
      <div className="debug-panel">
        <button 
          className="debug-btn"
          onClick={() => {
            console.log('Manual settings toggle. Current:', showSettings);
            setShowSettings(!showSettings);
          }}
          title="Toggle Settings (Debug)"
        >
          🐛 Test Settings
        </button>
        <span className="debug-status">Settings: {showSettings ? 'OPEN' : 'CLOSED'}</span>
      </div>

      <nav className="demo-nav">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({sampleData.users.length})
        </button>
        <button 
          className={activeTab === 'tasks' ? 'active' : ''} 
          onClick={() => setActiveTab('tasks')}
        >
          ✅ Tasks ({tasks.length})
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`settings-btn ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          ⚙️
        </button>
      </nav>

      <main className="demo-content">
        {renderContent()}
      </main>

      {showSettings && (
        <div className="settings-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            <h2>⚙️ Settings</h2>
            <div className="setting-item">
              <label>Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-item">
              <label>Dark Mode</label>
              <input type="checkbox" />
            </div>
            <div className="setting-item">
              <label>Sound Effects</label>
              <input type="checkbox" defaultChecked />
            </div>
            <p className="hint">Say "Close settings" to dismiss</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoApp;

