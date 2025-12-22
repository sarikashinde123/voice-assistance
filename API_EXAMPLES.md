# API Examples and Testing

## Testing the Backend API

### 1. Health Check

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Voice Command Assistant Server is running",
  "timestamp": "2025-12-22T10:30:00.000Z"
}
```

### 2. Get Available Commands

```bash
curl http://localhost:5000/api/commands
```

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

### 3. Process Text Command

```bash
curl -X POST http://localhost:5000/api/voice/command \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"open settings\"}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "open settings",
    "command": {
      "recognized": true,
      "action": "OPEN",
      "command": "Open",
      "commandId": "open",
      "target": "settings",
      "transcript": "open settings",
      "timestamp": "2025-12-22T10:30:00.000Z"
    }
  }
}
```

### 4. Transcribe Audio File

```bash
curl -X POST http://localhost:5000/api/voice/transcribe \
  -F "audio=@path/to/audio.wav"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "open dashboard",
    "confidence": 0.98,
    "words": [...],
    "command": {
      "recognized": true,
      "action": "OPEN",
      "command": "Open",
      "target": "dashboard"
    }
  }
}
```

### 5. Get Command History

```bash
curl http://localhost:5000/api/commands/history?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "recognized": true,
        "action": "OPEN",
        "command": "Open",
        "target": "settings",
        "transcript": "open settings",
        "timestamp": "2025-12-22T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

## Testing with Postman

### Collection Setup

1. Create a new collection: "Voice Command Assistant"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:5000`

### Requests to Create

#### 1. Health Check
- **Method:** GET
- **URL:** `{{baseUrl}}/health`

#### 2. Get Commands
- **Method:** GET
- **URL:** `{{baseUrl}}/api/commands`

#### 3. Process Text Command
- **Method:** POST
- **URL:** `{{baseUrl}}/api/voice/command`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "text": "open settings"
}
```

#### 4. Transcribe Audio
- **Method:** POST
- **URL:** `{{baseUrl}}/api/voice/transcribe`
- **Body:** form-data
  - Key: `audio`
  - Type: File
  - Value: Select an audio file

## Testing WebSocket Connection

### Using JavaScript

```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  console.log('Connected to WebSocket');
  
  // Start streaming
  ws.send(JSON.stringify({ type: 'start' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  
  if (data.type === 'transcript') {
    console.log('Transcript:', data.transcript);
  }
  
  if (data.type === 'command') {
    console.log('Command:', data.command);
  }
};

// Send audio data
const sendAudio = (audioBuffer) => {
  const base64Audio = arrayBufferToBase64(audioBuffer);
  ws.send(JSON.stringify({
    type: 'audio',
    audio: base64Audio
  }));
};

// Stop streaming
const stopStreaming = () => {
  ws.send(JSON.stringify({ type: 'stop' }));
};
```

### Using wscat

Install wscat:
```bash
npm install -g wscat
```

Connect:
```bash
wscat -c ws://localhost:5000
```

Send messages:
```json
{"type": "start"}
```

## Sample Audio Files for Testing

You can create test audio files by:

1. Recording yourself saying commands
2. Using text-to-speech services
3. Using the frontend application

### Example Commands to Record:

- "Open settings"
- "Navigate to dashboard"
- "Search for users"
- "Create new task"
- "Update my profile"
- "Delete this item"
- "Save changes"
- "Help me"

## Error Response Examples

### Invalid Request
```json
{
  "success": false,
  "error": "No audio file provided"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Failed to transcribe audio",
  "details": "Deepgram API error message"
}
```

### Not Found
```json
{
  "success": false,
  "error": "Endpoint not found"
}
```

## Command Processing Examples

### Recognized Commands

**Input:** "open settings"
```json
{
  "recognized": true,
  "action": "OPEN",
  "command": "Open",
  "commandId": "open",
  "target": "settings"
}
```

**Input:** "navigate to dashboard"
```json
{
  "recognized": true,
  "action": "NAVIGATE",
  "command": "Navigate",
  "commandId": "navigate",
  "target": "dashboard"
}
```

**Input:** "search for users"
```json
{
  "recognized": true,
  "action": "SEARCH",
  "command": "Search",
  "commandId": "search",
  "target": "users"
}
```

### Unrecognized Commands

**Input:** "do something random"
```json
{
  "recognized": false,
  "action": "UNKNOWN",
  "command": "Unknown",
  "commandId": null,
  "target": null
}
```

## Performance Testing

### Load Testing with Apache Bench

Test the text command endpoint:
```bash
ab -n 100 -c 10 -p command.json -T application/json http://localhost:5000/api/voice/command
```

Where `command.json` contains:
```json
{"text": "open settings"}
```

## Monitoring

### Check Server Logs

The server logs all requests:
```
2025-12-22T10:30:00.000Z - POST /api/voice/command
Processing text command: open settings
```

### Check Deepgram API Usage

Visit https://console.deepgram.com to monitor:
- API usage
- Credit balance
- Request statistics

## Integration Testing

### Frontend Integration

1. Start backend server
2. Start frontend application
3. Test voice recording
4. Check browser console for API calls
5. Verify responses in Network tab

### Full Flow Test

1. Record voice command
2. Verify audio transcription
3. Check command recognition
4. Confirm command appears in history
5. Verify WebSocket connection (if used)

## Troubleshooting API Issues

### CORS Errors
- Ensure backend has CORS enabled (already configured)
- Check if frontend URL is allowed

### 404 Errors
- Verify endpoint URL is correct
- Check if server is running
- Confirm route is registered

### 500 Errors
- Check server logs
- Verify Deepgram API key
- Check request payload format

### Connection Refused
- Ensure backend server is running
- Verify port 5000 is not blocked
- Check firewall settings

