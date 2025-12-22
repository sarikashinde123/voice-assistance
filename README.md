# 🎤 Voice-Driven Command Assistant

An AI-powered Voice Command Assistant that enables users to interact with applications through natural speech using Deepgram's speech-to-text technology.

![Technology Stack](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Deepgram](https://img.shields.io/badge/Deepgram-13EF93?style=for-the-badge&logo=deepgram&logoColor=black)

## 🌟 Features

- 🎙️ **Voice Recognition**: Real-time speech-to-text using Deepgram AI
- 🎯 **Natural Language Processing**: Intelligent command parsing and recognition
- 📊 **Visual Feedback**: Real-time audio level visualization
- 📜 **Command History**: Track all executed commands
- 📋 **Command Reference**: Complete list of available voice commands
- 🔄 **WebSocket Support**: Real-time streaming capabilities
- 🎨 **Modern UI**: Beautiful, responsive React interface
- 🚀 **RESTful API**: Well-structured Express.js backend

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Voice Commands](#available-voice-commands)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 💻 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Deepgram SDK** - Speech-to-text AI
- **WebSocket (ws)** - Real-time communication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **Web Audio API** - Audio recording
- **MediaRecorder API** - Audio capture
- **CSS3** - Modern styling with animations

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express Server │◄───────►│  Deepgram API   │
│                 │  HTTP/WS│                 │  HTTPS  │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
  ┌──────────┐              ┌──────────────┐
  │ Browser  │              │   Command    │
  │  Media   │              │  Processor   │
  │   API    │              │              │
  └──────────┘              └──────────────┘
```

## ⚙️ Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Deepgram API Key** ([Get one free here](https://console.deepgram.com/signup))
- Modern web browser with microphone support

## 📦 Installation

### 1. Clone or Navigate to Project

```bash
cd C:\@Projects\ChallangeHub\VoiceDrivenCommandAssistant
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 🔧 Configuration

### Backend Configuration

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file (or copy from `.env.example`):
```bash
# Copy the example file
copy .env.example .env
```

3. Add your Deepgram API key to `.env`:
```env
DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
PORT=5000
NODE_ENV=development
```

**Get Your Deepgram API Key:**
- Visit https://console.deepgram.com/signup
- Sign up for a free account (includes $200 credit)
- Create a new API key
- Copy and paste it into your `.env` file

### Frontend Configuration

The frontend is already configured to connect to `http://localhost:5000`. If you need to change this:

1. Create `.env` in the client directory (copy from `.env.example`)
2. Update the API URL if needed:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## 🚀 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend will open at `http://localhost:3000`

### Option 2: Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
# Serve the build folder with your preferred method
```

## 🎯 Available Voice Commands

The system recognizes 12 categories of commands:

| Command | Patterns | Example Usage |
|---------|----------|---------------|
| **Open** | open, launch, start | "open settings", "launch dashboard" |
| **Close** | close, exit, quit | "close window", "exit application" |
| **Navigate** | go to, navigate to, switch to, show | "go to home", "navigate to profile" |
| **Search** | search, find, look for | "search for users", "find documents" |
| **Create** | create, add, new | "create new task", "add user" |
| **Delete** | delete, remove, erase | "delete item", "remove user" |
| **Update** | update, edit, modify, change | "update profile", "edit settings" |
| **Save** | save, store, keep | "save changes", "store data" |
| **Cancel** | cancel, discard, abort | "cancel changes", "discard edits" |
| **Help** | help, assist, guide | "help me", "assist with navigation" |
| **Scroll** | scroll up, scroll down, page up/down | "scroll down", "page up" |
| **Refresh** | refresh, reload, update page | "refresh page", "reload data" |

## 📚 API Documentation

### REST API Endpoints

#### Voice Transcription

**POST** `/api/voice/transcribe`
- Upload and transcribe audio file
- Request: `multipart/form-data` with `audio` field
- Response: Transcript + Command result

**POST** `/api/voice/transcribe-url`
- Transcribe audio from URL
- Body: `{ "url": "audio-url" }`

**POST** `/api/voice/command`
- Process text command directly
- Body: `{ "text": "command text" }`

#### Commands

**GET** `/api/commands`
- Get list of available commands

**GET** `/api/commands/history?limit=50`
- Get command execution history

**GET** `/health`
- Server health check

### WebSocket API

Connect to `ws://localhost:5000` for real-time streaming:

**Start Recording:**
```json
{ "type": "start" }
```

**Send Audio:**
```json
{ "type": "audio", "audio": "base64_encoded_audio" }
```

**Stop Recording:**
```json
{ "type": "stop" }
```

## 📁 Project Structure

```
VoiceDrivenCommandAssistant/
├── server/                          # Backend Node.js application
│   ├── config/
│   │   └── deepgram.js             # Deepgram client configuration
│   ├── controllers/
│   │   ├── voiceController.js      # Voice transcription logic
│   │   ├── streamController.js     # WebSocket streaming
│   │   └── commandController.js    # Command management
│   ├── routes/
│   │   ├── voiceRoutes.js          # Voice API routes
│   │   └── commandRoutes.js        # Command API routes
│   ├── services/
│   │   └── commandProcessor.js     # Command processing engine
│   ├── .env.example                # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                   # Main server file
│   └── README.md
│
├── client/                          # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceAssistant.js   # Main voice recording component
│   │   │   ├── VoiceAssistant.css
│   │   │   ├── CommandHistory.js   # Command history display
│   │   │   ├── CommandHistory.css
│   │   │   ├── AvailableCommands.js # Command reference
│   │   │   └── AvailableCommands.css
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.js                  # Main app component
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── SETUP.md                         # Setup instructions
└── README.md                        # This file
```

## 📖 Usage Guide

### For Users

1. **Open the Application**
   - Navigate to `http://localhost:3000` in your browser

2. **Grant Microphone Permission**
   - Click the microphone button
   - Allow microphone access when prompted

3. **Record Your Command**
   - Click the microphone button (it will turn pink)
   - Speak your command clearly
   - Watch the audio level indicator for feedback

4. **Stop Recording**
   - Click the microphone button again
   - Wait for processing (button turns blue)

5. **View Results**
   - See the transcript of your speech
   - View the recognized command and action
   - Check the command target (if applicable)

6. **Explore Features**
   - Click "Show Available Commands" to see all commands
   - Click "Show Command History" to view past commands

### For Developers

#### Adding New Commands

Edit `server/services/commandProcessor.js`:

```javascript
{
  id: 'your_command',
  name: 'Your Command',
  patterns: ['pattern1', 'pattern2'],
  examples: ['example 1', 'example 2'],
  action: 'YOUR_ACTION',
  description: 'What this command does'
}
```

#### Customizing the UI

- Modify `client/src/App.css` for overall styling
- Edit component-specific CSS files for individual components
- Update colors in the gradient backgrounds

#### Extending API Functionality

Add new routes in `server/routes/` and controllers in `server/controllers/`

## 🔧 Troubleshooting

### Backend Issues

**Error: "DEEPGRAM_API_KEY is not set"**
- Solution: Add your API key to `server/.env`

**Port 5000 already in use**
- Solution: Change `PORT` in `server/.env`

**Dependencies not found**
- Solution: Run `npm install` in the server directory

### Frontend Issues

**Cannot connect to backend**
- Check if backend server is running
- Verify API URL in `.env` or default configuration
- Check browser console for CORS errors

**Microphone not working**
- Grant microphone permissions in browser
- Use HTTPS in production (HTTP works on localhost)
- Check if another app is using the microphone

**Recording not starting**
- Refresh the page
- Clear browser cache
- Try a different browser (Chrome recommended)

### Common Errors

**"Failed to transcribe audio"**
- Check Deepgram API key validity
- Verify internet connection
- Check Deepgram API status

**"No audio file provided"**
- Recording may have failed
- Try recording again
- Check browser console for errors

## 🎨 Features Demo

### Voice Recording Interface
- Large, animated microphone button
- Real-time audio level visualization
- Color-coded states (ready/recording/processing)

### Command Display
- Clear transcript display
- Command recognition status
- Action and target information
- Confidence scores

### Command History
- Chronological list of all commands
- Color-coded by recognition status
- Expandable details for each command

### Available Commands Reference
- Categorized command list
- Pattern examples for each command
- Click to expand for more examples

## 🔒 Security Notes

- Never commit `.env` files with actual API keys
- Use HTTPS in production
- Implement rate limiting for production use
- Add authentication/authorization as needed
- Sanitize user inputs
- Validate file uploads

## 🚀 Future Enhancements

- [ ] Add user authentication
- [ ] Implement command customization
- [ ] Add multi-language support
- [ ] Create mobile app version
- [ ] Add voice feedback (text-to-speech)
- [ ] Implement command macros
- [ ] Add command analytics dashboard
- [ ] Create command templates
- [ ] Integrate with third-party applications

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Deepgram documentation: https://developers.deepgram.com
3. Check browser console for errors

## 🙏 Acknowledgments

- **Deepgram** for providing excellent speech-to-text AI
- **React** team for the amazing framework
- **Express.js** community
- **Node.js** foundation

---

**Built with ❤️ using React, Node.js, and Deepgram AI**

