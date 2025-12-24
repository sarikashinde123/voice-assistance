const { getDeepgramClient, deepgramConfig } = require('../config/deepgram');
const { processCommand } = require('../services/commandProcessor');
const { interpretCommand } = require('../services/groqProcessor');

/**
 * Transcribe audio file to text using Deepgram
 */
const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }

    console.log('Processing audio file:', req.file.originalname);

    // Get Deepgram client
    const deepgram = getDeepgramClient();

    // Read the audio file buffer
    const audioBuffer = req.file.buffer;

    // Transcribe using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      deepgramConfig.prerecorded
    );

    if (error) {
      throw error;
    }

    // Extract transcription
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const confidence = result.results.channels[0].alternatives[0].confidence;
    const words = result.results.channels[0].alternatives[0].words;

    console.log('Transcription successful:', transcript);

    // Process command with Groq LLM for natural language understanding (FREE & FAST!)
    const commandResult = await interpretCommand(transcript);

    res.json({
      success: true,
      data: {
        transcript,
        confidence,
        words,
        command: commandResult
      }
    });

  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
      details: error.message
    });
  }
};

/**
 * Transcribe audio from URL
 */
const transcribeAudioUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'No audio URL provided'
      });
    }

    console.log('Processing audio from URL:', url);

    // Get Deepgram client
    const deepgram = getDeepgramClient();

    // Transcribe using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url },
      deepgramConfig.prerecorded
    );

    if (error) {
      throw error;
    }

    // Extract transcription
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const confidence = result.results.channels[0].alternatives[0].confidence;
    const words = result.results.channels[0].alternatives[0].words;

    console.log('Transcription successful:', transcript);

    // Process command with Groq LLM for natural language understanding (FREE & FAST!)
    const commandResult = await interpretCommand(transcript);

    res.json({
      success: true,
      data: {
        transcript,
        confidence,
        words,
        command: commandResult
      }
    });

  } catch (error) {
    console.error('Error transcribing audio URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio from URL',
      details: error.message
    });
  }
};

/**
 * Process text command directly
 */
const processTextCommand = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'No text provided'
      });
    }

    console.log('Processing text command:', text);

    // Process the command
    const commandResult = processCommand(text);

    res.json({
      success: true,
      data: {
        transcript: text,
        command: commandResult
      }
    });

  } catch (error) {
    console.error('Error processing text command:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process text command',
      details: error.message
    });
  }
};

module.exports = {
  transcribeAudio,
  transcribeAudioUrl,
  processTextCommand
};

