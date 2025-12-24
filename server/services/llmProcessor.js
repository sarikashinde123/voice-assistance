const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Interpret voice command using OpenAI GPT-4o-mini
 * Converts natural language to structured command format
 * 
 * @param {string} transcript - The transcribed text from Deepgram
 * @returns {Promise<Object>} Command object with action, target, and params
 */
async function interpretCommand(transcript) {
  try {
    console.log('🧠 LLM Processing:', transcript);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an intelligent voice assistant for a web application. 
Convert user voice commands into structured JSON commands.

Available Actions:
- NAVIGATE: Navigate to a page/section
- OPEN: Open a modal/dialog/page
- CLOSE: Close a modal/dialog
- SEARCH: Search for content
- CREATE: Create new items
- DELETE: Remove items
- REFRESH: Reload/refresh content
- HELP: Show help information

Available Targets:
- home: Main/landing page
- dashboard: Analytics/stats/overview page
- users: People/team/members page
- tasks: Todo/work items page
- profile: User account/profile page
- settings: Configuration/preferences

ALWAYS return valid JSON in this exact format:
{
  "action": "ACTION_NAME",
  "target": "target_name",
  "params": {},
  "recognized": true
}

Examples:
"go to dashboard" → {"action":"NAVIGATE","target":"dashboard","params":{},"recognized":true}
"show me people" → {"action":"NAVIGATE","target":"users","params":{},"recognized":true}
"I want to see stats" → {"action":"NAVIGATE","target":"dashboard","params":{},"recognized":true}
"take me to my profile" → {"action":"NAVIGATE","target":"profile","params":{},"recognized":true}
"open settings" → {"action":"OPEN","target":"settings","params":{},"recognized":true}
"show preferences" → {"action":"OPEN","target":"settings","params":{},"recognized":true}
"search for documents" → {"action":"SEARCH","target":"dashboard","params":{"query":"documents"},"recognized":true}
"find Sarah" → {"action":"SEARCH","target":"users","params":{"query":"Sarah"},"recognized":true}
"looking for John" → {"action":"SEARCH","target":"users","params":{"query":"John"},"recognized":true}
"what's happening today" → {"action":"NAVIGATE","target":"dashboard","params":{},"recognized":true}
"show me the team" → {"action":"NAVIGATE","target":"users","params":{},"recognized":true}
"where can I see analytics" → {"action":"NAVIGATE","target":"dashboard","params":{},"recognized":true}
"landing page" → {"action":"NAVIGATE","target":"home","params":{},"recognized":true}
"main page" → {"action":"NAVIGATE","target":"home","params":{},"recognized":true}
"close settings" → {"action":"CLOSE","target":"settings","params":{},"recognized":true}

If the command is unclear or cannot be mapped, return:
{"action":"UNKNOWN","target":"","params":{},"recognized":false}

Be flexible and understand natural variations. Focus on user intent, not exact words.`
        },
        {
          role: "user",
          content: transcript
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent responses
      max_tokens: 150
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    console.log('✅ LLM Result:', result);
    
    return result;

  } catch (error) {
    console.error('❌ LLM Processing Error:', error.message);
    
    // Fallback to unrecognized if LLM fails
    return {
      action: 'UNKNOWN',
      target: '',
      params: {},
      recognized: false,
      error: error.message
    };
  }
}

/**
 * Hybrid approach: Try pattern matching first, fallback to LLM
 * This saves costs and improves speed for simple commands
 * 
 * @param {string} transcript - The transcribed text
 * @param {Function} patternMatcher - The original pattern matching function
 * @returns {Promise<Object>} Command object
 */
async function interpretCommandHybrid(transcript, patternMatcher) {
  // Try pattern matching first (fast and free)
  const patternResult = patternMatcher(transcript);
  
  if (patternResult.recognized) {
    console.log('⚡ Pattern matched (fast path)');
    return patternResult;
  }
  
  // Fallback to LLM for complex queries
  console.log('🧠 Pattern failed, using LLM (smart path)');
  return await interpretCommand(transcript);
}

module.exports = {
  interpretCommand,
  interpretCommandHybrid
};

