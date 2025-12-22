const express = require('express');
const {
  getCommands,
  getHistory
} = require('../controllers/commandController');

const router = express.Router();

/**
 * GET /api/commands
 * Get list of available voice commands
 */
router.get('/', getCommands);

/**
 * GET /api/commands/history
 * Get command execution history
 */
router.get('/history', getHistory);

module.exports = router;

