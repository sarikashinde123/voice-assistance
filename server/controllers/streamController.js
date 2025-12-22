const { getDeepgramClient, deepgramConfig } = require('../config/deepgram');
const { processCommand } = require('../services/commandProcessor');

/**
 * Handle WebSocket connection for real-time audio streaming
 */
const handleWebSocketConnection = (ws) => {
  console.log('New WebSocket connection established');

  let deepgramLive = null;
  let isDeepgramReady = false;

  ws.on('message', async (message) => {
    try {
      // Parse the message
      const data = JSON.parse(message.toString());

      // Handle different message types
      if (data.type === 'start') {
        console.log('Starting Deepgram live transcription');

        // Initialize Deepgram live connection
        const deepgram = getDeepgramClient();
        deepgramLive = deepgram.listen.live(deepgramConfig.live);

        // Handle Deepgram events
        deepgramLive.on('open', () => {
          console.log('Deepgram live connection opened');
          isDeepgramReady = true;
          ws.send(JSON.stringify({
            type: 'status',
            message: 'Deepgram connection ready'
          }));
        });

        deepgramLive.on('Results', (data) => {
          const transcript = data.channel.alternatives[0].transcript;
          const isFinal = data.is_final;
          const confidence = data.channel.alternatives[0].confidence;

          if (transcript && transcript.length > 0) {
            console.log(`Transcript (${isFinal ? 'final' : 'interim'}):`, transcript);

            // Send transcription result to client
            ws.send(JSON.stringify({
              type: 'transcript',
              transcript,
              isFinal,
              confidence
            }));

            // Process command if final
            if (isFinal) {
              const commandResult = processCommand(transcript);
              ws.send(JSON.stringify({
                type: 'command',
                command: commandResult
              }));
            }
          }
        });

        deepgramLive.on('error', (error) => {
          console.error('Deepgram live error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Deepgram connection error'
          }));
        });

        deepgramLive.on('close', () => {
          console.log('Deepgram live connection closed');
          isDeepgramReady = false;
        });

      } else if (data.type === 'audio' && isDeepgramReady && deepgramLive) {
        // Send audio data to Deepgram
        const audioData = Buffer.from(data.audio, 'base64');
        deepgramLive.send(audioData);

      } else if (data.type === 'stop') {
        console.log('Stopping Deepgram live transcription');
        if (deepgramLive) {
          deepgramLive.finish();
          deepgramLive = null;
          isDeepgramReady = false;
        }
      }

    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (deepgramLive) {
      deepgramLive.finish();
      deepgramLive = null;
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (deepgramLive) {
      deepgramLive.finish();
      deepgramLive = null;
    }
  });
};

module.exports = {
  handleWebSocketConnection
};

