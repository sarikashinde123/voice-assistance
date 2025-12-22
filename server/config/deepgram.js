const { createClient } = require('@deepgram/sdk');

// Initialize Deepgram client
const getDeepgramClient = () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
  }

  return createClient(apiKey);
};

// Deepgram configuration options
const deepgramConfig = {
  // Pre-recorded audio options
  prerecorded: {
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
    punctuate: true,
    diarize: false,
    utterances: true,
    detect_language: false,
  },
  
  // Live streaming options
  live: {
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
    punctuate: true,
    interim_results: true,
    encoding: 'linear16',
    sample_rate: 16000,
    channels: 1,
  }
};

module.exports = {
  getDeepgramClient,
  deepgramConfig
};

