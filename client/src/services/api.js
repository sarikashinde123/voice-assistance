import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Transcribe audio file
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    const response = await axios.post(`${API_BASE_URL}/voice/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Process text command
 */
export const processTextCommand = async (text) => {
  try {
    const response = await api.post('/voice/command', { text });
    return response.data;
  } catch (error) {
    console.error('Error processing text command:', error);
    throw error;
  }
};

/**
 * Get available commands
 */
export const getAvailableCommands = async () => {
  try {
    const response = await api.get('/commands');
    return response.data;
  } catch (error) {
    console.error('Error getting commands:', error);
    throw error;
  }
};

/**
 * Get command history
 */
export const getCommandHistory = async (limit = 50) => {
  try {
    const response = await api.get(`/commands/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
};

/**
 * Create WebSocket connection for streaming
 */
export const createWebSocketConnection = () => {
  return new WebSocket(WS_URL);
};

export default api;

