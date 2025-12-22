# Environment Configuration

## Backend Environment Variables

Create a file named `.env` in the `server/` directory with the following content:

```env
# Deepgram API Key (REQUIRED)
# Get your free API key from: https://console.deepgram.com/signup
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Frontend Environment Variables (Optional)

Create a file named `.env` in the `client/` directory if you need to change the default API URL:

```env
# API Configuration (optional - defaults shown below)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## Getting Your Deepgram API Key

1. Visit https://console.deepgram.com/signup
2. Sign up for a free account
3. You'll receive $200 in free credits
4. Navigate to API Keys section
5. Create a new API key
6. Copy the key and paste it in your `.env` file

## Important Notes

⚠️ **NEVER commit `.env` files to version control**
- `.env` files are already in `.gitignore`
- Never share your API keys publicly
- Rotate keys if accidentally exposed

✅ **Required for the app to work:**
- Backend MUST have `DEEPGRAM_API_KEY` set
- Without it, transcription will fail

📝 **Optional configurations:**
- Change `PORT` if 5000 is already in use
- Set `NODE_ENV=production` for production deployments
- Frontend `.env` only needed if backend URL changes

## Verification

After creating your `.env` file, you can verify it's working:

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see:
   ```
   🚀 Server running on port 5000
   🎤 Voice Command Assistant API ready
   📡 WebSocket server ready for streaming
   ```

3. If you see API key errors, check your `.env` file.

## Environment File Locations

```
VoiceDrivenCommandAssistant/
├── server/
│   └── .env          <-- Create this file
└── client/
    └── .env          <-- Optional
```

## Sample .env File (Backend)

Copy this and replace with your actual API key:

```env
DEEPGRAM_API_KEY=abc123def456ghi789jkl012mno345pqr678stu
PORT=5000
NODE_ENV=development
```

## Testing Your Configuration

Run the test script after setting up your `.env`:

```bash
node test-setup.js
```

This will verify:
- Server is running
- Endpoints are working
- Configuration is correct

