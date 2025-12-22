#!/usr/bin/env node

/**
 * Simple test script to verify server setup
 * Run: node test-setup.js
 */

const http = require('http');

console.log('🧪 Testing Voice Command Assistant Setup\n');

// Test 1: Health Check
console.log('Test 1: Health Check');
http.get('http://localhost:5000/health', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.status === 'ok') {
        console.log('✅ Health check passed');
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.message}\n`);
        
        // Test 2: Get Commands
        testGetCommands();
      } else {
        console.log('❌ Health check failed\n');
      }
    } catch (e) {
      console.log('❌ Health check failed - Invalid response\n');
    }
  });
}).on('error', (err) => {
  console.log('❌ Cannot connect to server');
  console.log('   Make sure the server is running on port 5000');
  console.log('   Run: cd server && npm run dev\n');
  process.exit(1);
});

// Test 2: Get Commands
function testGetCommands() {
  console.log('Test 2: Get Available Commands');
  http.get('http://localhost:5000/api/commands', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success && response.data.commands) {
          console.log('✅ Commands endpoint working');
          console.log(`   Found ${response.data.count} commands\n`);
          
          // Test 3: Process Text Command
          testTextCommand();
        } else {
          console.log('❌ Commands endpoint failed\n');
        }
      } catch (e) {
        console.log('❌ Commands endpoint failed - Invalid response\n');
      }
    });
  }).on('error', (err) => {
    console.log('❌ Commands endpoint failed\n');
  });
}

// Test 3: Process Text Command
function testTextCommand() {
  console.log('Test 3: Process Text Command');
  
  const postData = JSON.stringify({
    text: 'open settings'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/voice/command',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success && response.data.command) {
          console.log('✅ Text command processing working');
          console.log(`   Input: "${response.data.transcript}"`);
          console.log(`   Recognized: ${response.data.command.recognized}`);
          console.log(`   Action: ${response.data.command.action}`);
          if (response.data.command.target) {
            console.log(`   Target: ${response.data.command.target}`);
          }
          console.log('\n✅ All tests passed! Server is working correctly.\n');
          console.log('Next steps:');
          console.log('1. Make sure you have added your Deepgram API key to server/.env');
          console.log('2. Start the frontend: cd client && npm start');
          console.log('3. Open http://localhost:3000 in your browser\n');
        } else {
          console.log('❌ Text command processing failed\n');
        }
      } catch (e) {
        console.log('❌ Text command processing failed - Invalid response\n');
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Text command processing failed\n');
  });
  
  req.write(postData);
  req.end();
}

