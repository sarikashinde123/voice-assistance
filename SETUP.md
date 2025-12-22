# Voice Command Assistant - Setup Instructions

## Backend Setup

1. Navigate to the server directory and copy the environment variables:
   - Copy `.env.example` to `.env`
   - Add your Deepgram API key to `.env`

2. Get your Deepgram API Key:
   - Visit https://console.deepgram.com/signup
   - Sign up for a free account
   - Create a new API key
   - Copy the key to your `.env` file

3. Start the server:
   ```
   cd server
   npm run dev
   ```

The server will be available at http://localhost:5000

## Important: Environment Variables

Your `.env` file should look like this:

```
DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
PORT=5000
NODE_ENV=development
```

Replace `your_actual_deepgram_api_key_here` with your actual Deepgram API key.

