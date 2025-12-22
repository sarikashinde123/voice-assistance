/**
 * Command Processor Service
 * Processes natural language commands and extracts actions
 */

// Command history storage (in-memory for now)
const commandHistory = [];

// Define available commands with patterns and actions
const availableCommands = [
  {
    id: 'open',
    name: 'Open',
    patterns: ['open', 'launch', 'start'],
    examples: ['open settings', 'launch dashboard', 'start application'],
    action: 'OPEN',
    description: 'Opens a page or application'
  },
  {
    id: 'close',
    name: 'Close',
    patterns: ['close', 'exit', 'quit'],
    examples: ['close window', 'exit application', 'quit'],
    action: 'CLOSE',
    description: 'Closes current page or application'
  },
  {
    id: 'navigate',
    name: 'Navigate',
    patterns: ['go to', 'navigate to', 'switch to', 'show'],
    examples: ['go to home', 'navigate to profile', 'show dashboard'],
    action: 'NAVIGATE',
    description: 'Navigates to a specific page'
  },
  {
    id: 'search',
    name: 'Search',
    patterns: ['search', 'find', 'look for'],
    examples: ['search for users', 'find documents', 'look for settings'],
    action: 'SEARCH',
    description: 'Searches for content'
  },
  {
    id: 'create',
    name: 'Create',
    patterns: ['create', 'add', 'new'],
    examples: ['create new task', 'add user', 'new document'],
    action: 'CREATE',
    description: 'Creates new items'
  },
  {
    id: 'delete',
    name: 'Delete',
    patterns: ['delete', 'remove', 'erase'],
    examples: ['delete item', 'remove user', 'erase data'],
    action: 'DELETE',
    description: 'Deletes items'
  },
  {
    id: 'update',
    name: 'Update',
    patterns: ['update', 'edit', 'modify', 'change'],
    examples: ['update profile', 'edit settings', 'change password'],
    action: 'UPDATE',
    description: 'Updates or edits items'
  },
  {
    id: 'save',
    name: 'Save',
    patterns: ['save', 'store', 'keep'],
    examples: ['save changes', 'store data', 'keep settings'],
    action: 'SAVE',
    description: 'Saves changes'
  },
  {
    id: 'cancel',
    name: 'Cancel',
    patterns: ['cancel', 'discard', 'abort'],
    examples: ['cancel changes', 'discard edits', 'abort operation'],
    action: 'CANCEL',
    description: 'Cancels current operation'
  },
  {
    id: 'help',
    name: 'Help',
    patterns: ['help', 'assist', 'guide'],
    examples: ['help me', 'assist with', 'guide me'],
    action: 'HELP',
    description: 'Shows help information'
  },
  {
    id: 'scroll',
    name: 'Scroll',
    patterns: ['scroll up', 'scroll down', 'page up', 'page down'],
    examples: ['scroll up', 'scroll down', 'page down'],
    action: 'SCROLL',
    description: 'Scrolls the page'
  },
  {
    id: 'refresh',
    name: 'Refresh',
    patterns: ['refresh', 'reload', 'update page'],
    examples: ['refresh page', 'reload data', 'update page'],
    action: 'REFRESH',
    description: 'Refreshes the page'
  }
];

/**
 * Process voice command and extract action
 */
const processCommand = (transcript) => {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // Find matching command
  let matchedCommand = null;
  let matchedPattern = '';
  let target = '';

  for (const command of availableCommands) {
    for (const pattern of command.patterns) {
      if (lowerTranscript.includes(pattern)) {
        matchedCommand = command;
        matchedPattern = pattern;
        
        // Extract target (text after the pattern)
        const patternIndex = lowerTranscript.indexOf(pattern);
        target = lowerTranscript.substring(patternIndex + pattern.length).trim();
        
        break;
      }
    }
    if (matchedCommand) break;
  }

  // Prepare result
  const result = {
    recognized: !!matchedCommand,
    action: matchedCommand ? matchedCommand.action : 'UNKNOWN',
    command: matchedCommand ? matchedCommand.name : 'Unknown',
    commandId: matchedCommand ? matchedCommand.id : null,
    target: target || null,
    transcript,
    timestamp: new Date().toISOString()
  };

  // Add to history
  addToHistory(result);

  return result;
};

/**
 * Get list of available commands
 */
const getAvailableCommands = () => {
  return availableCommands.map(cmd => ({
    id: cmd.id,
    name: cmd.name,
    patterns: cmd.patterns,
    examples: cmd.examples,
    description: cmd.description,
    action: cmd.action
  }));
};

/**
 * Add command to history
 */
const addToHistory = (commandResult) => {
  commandHistory.unshift(commandResult);
  
  // Keep only last 100 commands
  if (commandHistory.length > 100) {
    commandHistory.pop();
  }
};

/**
 * Get command history
 */
const getCommandHistory = (limit = 50) => {
  return commandHistory.slice(0, limit);
};

module.exports = {
  processCommand,
  getAvailableCommands,
  getCommandHistory,
  addToHistory
};

