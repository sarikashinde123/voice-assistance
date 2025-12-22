# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

From the root directory:
```bash
npm run install-all
```

Or manually:
```bash
cd server
npm install
cd ../client
npm install
```

### Step 2: Configure Deepgram API Key

1. Get your free API key from https://console.deepgram.com/signup
2. Navigate to `server` directory
3. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
4. Edit `.env` and add your Deepgram API key:
   ```
   DEEPGRAM_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

### Step 3: Run the Application

Open TWO terminal windows:

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
✅ Backend running at http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
✅ Frontend will open at http://localhost:3000

## 🎤 How to Use

1. Click the microphone button
2. Allow microphone access when prompted
3. Speak your command (e.g., "open settings")
4. Click the microphone again to stop
5. View your transcribed command and results!

## 📋 Example Commands

Try saying:
- "Open dashboard"
- "Navigate to settings"
- "Search for users"
- "Create new task"
- "Help me"

## ⚡ Quick Commands

### Install everything:
```bash
npm run install-all
```

### Run backend in dev mode:
```bash
npm run dev-server
```

### Run frontend:
```bash
npm run client
```

### Build frontend for production:
```bash
npm run build-client
```

## ❓ Need Help?

- Check `README.md` for full documentation
- Visit `server/README.md` for backend API details
- Visit `client/README.md` for frontend details
- Troubleshooting section in main README

## 🔑 Important Notes

1. **You MUST have a Deepgram API key** - Get one free at https://console.deepgram.com
2. **Microphone permission required** - Your browser will ask for permission
3. **Use modern browser** - Chrome, Firefox, Edge, or Safari recommended
4. **Backend must run on port 5000** - Frontend expects this (configurable)

## 🎯 What's Next?

After setup:
1. Click "Show Available Commands" to see all voice commands
2. Click "Show Command History" to track your commands
3. Experiment with different phrases
4. Check the console for detailed logs

---

**Ready? Let's go! 🚀**

