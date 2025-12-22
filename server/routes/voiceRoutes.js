const express = require('express');
const multer = require('multer');
const {
  transcribeAudio,
  transcribeAudioUrl,
  processTextCommand
} = require('../controllers/voiceController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimes = [
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/webm',
      'audio/ogg',
      'audio/flac',
      'audio/x-m4a'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

/**
 * POST /api/voice/transcribe
 * Transcribe audio file to text
 */
router.post('/transcribe', upload.single('audio'), transcribeAudio);

/**
 * POST /api/voice/transcribe-url
 * Transcribe audio from URL
 */
router.post('/transcribe-url', transcribeAudioUrl);

/**
 * POST /api/voice/command
 * Process text command directly
 */
router.post('/command', processTextCommand);

module.exports = router;

