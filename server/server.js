const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const WebSocket = require('ws');

// Load environment variables
dotenv.config();

// Import routes
const voiceRoutes = require('./routes/voiceRoutes');
const commandRoutes = require('./routes/commandRoutes');

// Initialize Express app
const app = express();
const server = createServer(app);

// WebSocket server for real-time audio streaming
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Voice Command Assistant Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/voice', voiceRoutes);
app.use('/api/commands', commandRoutes);

// WebSocket connection handler for real-time streaming
const { handleWebSocketConnection } = require('./controllers/streamController');
wss.on('connection', handleWebSocketConnection);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎤 Voice Command Assistant API ready`);
  console.log(`📡 WebSocket server ready for streaming`);
});

module.exports = { app, server, wss };

