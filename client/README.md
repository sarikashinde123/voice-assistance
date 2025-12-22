# Voice Command Assistant - Frontend

React-based frontend for the AI-powered Voice Command Assistant.

## Features

- 🎤 Voice recording with visual feedback
- 🎨 Modern and responsive UI
- 📊 Real-time audio level visualization
- 📝 Transcript display
- 🎯 Command recognition results
- 📜 Command history
- 📋 Available commands reference

## Prerequisites

- Node.js (v14 or higher)
- Running backend server

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` if your backend is running on a different URL:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## Running the Application

### Development mode:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production build:
```bash
npm run build
```

## How to Use

1. **Grant Microphone Permission**: When you first click the microphone button, your browser will ask for microphone permission.

2. **Start Recording**: Click the microphone button to start recording your voice command.

3. **Speak Your Command**: Say any of the available voice commands (e.g., "open settings", "navigate to dashboard").

4. **Stop Recording**: Click the microphone button again to stop recording.

5. **View Results**: The app will display:
   - The transcript of what you said
   - The recognized command and action
   - The target of the command (if applicable)

6. **Explore Features**:
   - Click "Show Available Commands" to see all supported commands
   - Click "Show Command History" to view your recent commands

## Available Voice Commands

Examples of commands you can say:
- "Open settings"
- "Navigate to dashboard"
- "Search for users"
- "Create new task"
- "Update profile"
- "Delete item"
- "Scroll down"
- "Refresh page"
- "Help me"

Click "Show Available Commands" in the app for a complete list!

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── VoiceAssistant.js       # Main voice recording component
│   │   ├── VoiceAssistant.css
│   │   ├── CommandHistory.js        # Command history display
│   │   ├── CommandHistory.css
│   │   ├── AvailableCommands.js     # Commands reference
│   │   └── AvailableCommands.css
│   ├── services/
│   │   └── api.js                   # API service layer
│   ├── App.js                       # Main app component
│   ├── App.css
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

## Browser Compatibility

This application requires:
- Modern browser with Web Audio API support
- Microphone access
- MediaRecorder API support

Recommended browsers:
- Chrome 49+
- Firefox 25+
- Edge 79+
- Safari 14+

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Make sure you're using HTTPS (required for microphone access)
- Try a different browser

### Cannot connect to backend
- Ensure the backend server is running on port 5000
- Check the `.env` file for correct API URL
- Check browser console for CORS errors

### Audio not recording
- Check if another application is using the microphone
- Try refreshing the page
- Clear browser cache and reload

## License

ISC

