const { getAvailableCommands, getCommandHistory, addToHistory } = require('../services/commandProcessor');

/**
 * Get list of available voice commands
 */
const getCommands = (req, res) => {
  try {
    const commands = getAvailableCommands();
    
    res.json({
      success: true,
      data: {
        commands,
        count: commands.length
      }
    });
  } catch (error) {
    console.error('Error getting commands:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get commands',
      details: error.message
    });
  }
};

/**
 * Get command execution history
 */
const getHistory = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = getCommandHistory(limit);
    
    res.json({
      success: true,
      data: {
        history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get history',
      details: error.message
    });
  }
};

module.exports = {
  getCommands,
  getHistory
};

