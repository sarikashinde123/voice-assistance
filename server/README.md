# Voice Command Assistant - Backend Server

AI-powered Voice Command Assistant backend using Deepgram for speech-to-text processing.

## Features

- 🎤 Speech-to-Text using Deepgram SDK
- 📡 Real-time audio streaming with WebSocket
- 🎯 Natural language command processing
- 📝 Command history tracking
- 🔄 REST API endpoints
- 🚀 Express.js server

## Prerequisites

- Node.js (v14 or higher)
- Deepgram API Key ([Get one here](https://deepgram.com))

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Add your Deepgram API key to `.env`:
```
DEEPGRAM_API_KEY=your_deepgram_api_key_here
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Voice Transcription

#### POST `/api/voice/transcribe`
Transcribe an audio file to text and process as command.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: audio file (field name: `audio`)

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "open settings",
    "confidence": 0.98,
    "words": [...],
    "command": {
      "recognized": true,
      "action": "OPEN",
      "command": "Open",
      "target": "settings",
      "transcript": "open settings"
    }
  }
}
```

#### POST `/api/voice/transcribe-url`
Transcribe audio from a URL.

**Request:**
```json
{
  "url": "https://example.com/audio.wav"
}
```

#### POST `/api/voice/command`
Process text command directly (without audio).

**Request:**
```json
{
  "text": "open dashboard"
}
```

### Commands

#### GET `/api/commands`
Get list of available voice commands.

**Response:**
```json
{
  "success": true,
  "data": {
    "commands": [
      {
        "id": "open",
        "name": "Open",
        "patterns": ["open", "launch", "start"],
        "examples": ["open settings", "launch dashboard"],
        "description": "Opens a page or application",
        "action": "OPEN"
      }
    ],
    "count": 12
  }
}
```

#### GET `/api/commands/history?limit=50`
Get command execution history.

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [...],
    "count": 10
  }
}
```

### Health Check

#### GET `/health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "message": "Voice Command Assistant Server is running",
  "timestamp": "2025-12-22T10:30:00.000Z"
}
```

## WebSocket Connection

Connect to `ws://localhost:5000` for real-time audio streaming.

### WebSocket Message Types

#### Start Streaming
```json
{
  "type": "start"
}
```

#### Send Audio Data
```json
{
  "type": "audio",
  "audio": "base64_encoded_audio_data"
}
```

#### Stop Streaming
```json
{
  "type": "stop"
}
```

### WebSocket Response Types

#### Transcript Result
```json
{
  "type": "transcript",
  "transcript": "hello world",
  "isFinal": true,
  "confidence": 0.95
}
```

#### Command Result
```json
{
  "type": "command",
  "command": {
    "action": "OPEN",
    "target": "settings"
  }
}
```

## Available Voice Commands

The system recognizes the following command patterns:

- **Open**: open, launch, start
- **Close**: close, exit, quit
- **Navigate**: go to, navigate to, switch to, show
- **Search**: search, find, look for
- **Create**: create, add, new
- **Delete**: delete, remove, erase
- **Update**: update, edit, modify, change
- **Save**: save, store, keep
- **Cancel**: cancel, discard, abort
- **Help**: help, assist, guide
- **Scroll**: scroll up, scroll down, page up, page down
- **Refresh**: refresh, reload, update page

## Project Structure

```
server/
├── config/
│   └── deepgram.js         # Deepgram client configuration
├── controllers/
│   ├── voiceController.js   # Voice transcription logic
│   ├── streamController.js  # WebSocket streaming logic
│   └── commandController.js # Command management logic
├── routes/
│   ├── voiceRoutes.js       # Voice API routes
│   └── commandRoutes.js     # Command API routes
├── services/
│   └── commandProcessor.js  # Command processing service
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main server file
└── README.md
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Security Notes

- Never commit your `.env` file with actual API keys
- Use HTTPS in production
- Implement rate limiting for production use
- Add authentication/authorization as needed

## License

ISC

