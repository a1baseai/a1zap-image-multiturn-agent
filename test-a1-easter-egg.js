/**
 * Test Script for A1 Easter Egg
 * 
 * Tests the "a1" trigger in the BrandyEats webhook that sends
 * social share rich content blocks automatically.
 */

const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook/brandoneats';
const TEST_CHAT_ID = process.env.TEST_CHAT_ID || 'test-a1-easter-egg';

/**
 * Test the A1 Easter egg
 */
async function testA1EasterEgg() {
  console.log('🧪 Testing A1 Easter Egg\n');
  console.log('=' .repeat(60));
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Test Chat ID: ${TEST_CHAT_ID}`);
  console.log('=' .repeat(60));

  const testCases = [
    { message: 'a1', shouldTrigger: true, description: 'Lowercase "a1"' },
    { message: 'A1', shouldTrigger: true, description: 'Uppercase "A1"' },
    { message: 'a1 ', shouldTrigger: true, description: 'With trailing space' },
    { message: ' a1', shouldTrigger: true, description: 'With leading space' },
    { message: 'a1 test', shouldTrigger: false, description: 'With extra text' },
    { message: 'hello', shouldTrigger: false, description: 'Normal message' }
  ];

  let passCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.description}`);
    console.log(`   Message: "${testCase.message}"`);
    console.log(`   Should trigger: ${testCase.shouldTrigger}`);

    try {
      const payload = {
        chat: { id: TEST_CHAT_ID },
        message: { 
          content: testCase.message,
          id: `msg-test-${Date.now()}-${Math.random()}`
        },
        agent: { id: 'j972wdq9j43c6wda1gga784gxn7qwpzs' }
      };

      const response = await axios.post(WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const isEasterEgg = response.data.easterEgg === 'a1';
      const hasRichContent = response.data.richContent === true;

      if (testCase.shouldTrigger) {
        // Should be Easter egg
        if (isEasterEgg && hasRichContent) {
          console.log('   ✅ PASS - Easter egg triggered correctly');
          console.log(`   Message ID: ${response.data.messageId}`);
          passCount++;
        } else {
          console.log('   ❌ FAIL - Easter egg did not trigger');
          console.log('   Response:', JSON.stringify(response.data, null, 2));
          failCount++;
        }
      } else {
        // Should NOT be Easter egg
        if (!isEasterEgg) {
          console.log('   ✅ PASS - Normal processing (Easter egg did not trigger)');
          passCount++;
        } else {
          console.log('   ❌ FAIL - Easter egg triggered when it should not');
          console.log('   Response:', JSON.stringify(response.data, null, 2));
          failCount++;
        }
      }

      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log('   ❌ FAIL - Request error');
      console.error('   Error:', error.message);
      if (error.response?.data) {
        console.error('   Response:', JSON.stringify(error.response.data, null, 2));
      }
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Summary');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${passCount}/${testCases.length}`);
  console.log(`❌ Failed: ${failCount}/${testCases.length}`);
  console.log('=' .repeat(60));

  if (failCount > 0) {
    console.log('\n⚠️  Some tests failed. Check the output above for details.\n');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!\n');
  }
}

/**
 * Test the Easter egg with a real chat ID (sends actual message)
 */
async function testWithRealChat(chatId) {
  console.log('🚀 Testing A1 Easter Egg with Real Chat\n');
  console.log('=' .repeat(60));
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Chat ID: ${chatId}`);
  console.log('=' .repeat(60));
  console.log('\n⚠️  This will send a real message to WhatsApp!\n');

  try {
    const payload = {
      chat: { id: chatId },
      message: { 
        content: 'a1',
        id: `msg-real-${Date.now()}`
      },
      agent: { id: 'j972wdq9j43c6wda1gga784gxn7qwpzs' }
    };

    console.log('📤 Sending "a1" message...');
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.success) {
      console.log('✅ SUCCESS!\n');
      console.log('Response:');
      console.log(`   Easter Egg: ${response.data.easterEgg}`);
      console.log(`   Rich Content: ${response.data.richContent}`);
      console.log(`   Message: ${response.data.response}`);
      console.log(`   Message ID: ${response.data.messageId}`);
      console.log('\n📱 Check WhatsApp to see the rich content blocks!\n');
    } else {
      console.log('❌ FAILED\n');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

/**
 * Show example payload
 */
function showExample() {
  console.log('📋 Example Webhook Payload for A1 Easter Egg\n');
  console.log('POST ' + WEBHOOK_URL);
  console.log('Content-Type: application/json\n');
  
  const examplePayload = {
    chat: { id: 'j123abc456def' },
    message: { 
      content: 'a1',
      id: 'msg-12345'
    },
    agent: { id: 'j972wdq9j43c6wda1gga784gxn7qwpzs' }
  };

  console.log(JSON.stringify(examplePayload, null, 2));
  console.log('\n');
}

// Command line handling
const args = process.argv.slice(2);
const command = args[0];

if (command === 'real') {
  // Test with real chat ID
  const chatId = args[1] || process.env.REAL_CHAT_ID;
  if (!chatId) {
    console.error('❌ Error: Please provide a real chat ID\n');
    console.error('Usage:');
    console.error('  node test-a1-easter-egg.js real j123abc456def');
    console.error('  REAL_CHAT_ID=j123abc node test-a1-easter-egg.js real\n');
    process.exit(1);
  }
  testWithRealChat(chatId);
} else if (command === 'example') {
  // Show example payload
  showExample();
} else if (command === 'help' || command === '-h' || command === '--help') {
  // Show help
  console.log('🧪 A1 Easter Egg Test Script\n');
  console.log('Usage:');
  console.log('  node test-a1-easter-egg.js              # Run all tests (default)');
  console.log('  node test-a1-easter-egg.js real CHAT   # Test with real chat ID');
  console.log('  node test-a1-easter-egg.js example     # Show example payload');
  console.log('  node test-a1-easter-egg.js help        # Show this help\n');
  console.log('Environment Variables:');
  console.log('  WEBHOOK_URL    - Webhook endpoint (default: http://localhost:3000/webhook/brandoneats)');
  console.log('  TEST_CHAT_ID   - Chat ID for tests (default: test-a1-easter-egg)');
  console.log('  REAL_CHAT_ID   - Real chat ID for "real" command\n');
  console.log('Examples:');
  console.log('  node test-a1-easter-egg.js');
  console.log('  node test-a1-easter-egg.js real j123abc456def');
  console.log('  WEBHOOK_URL=https://example.com/webhook node test-a1-easter-egg.js\n');
} else {
  // Run default tests
  testA1EasterEgg();
}

/**
 * Usage:
 * 
 * Run all tests:
 *   node test-a1-easter-egg.js
 * 
 * Test with real chat (sends actual message to WhatsApp):
 *   node test-a1-easter-egg.js real j123abc456def
 * 
 * Show example payload:
 *   node test-a1-easter-egg.js example
 * 
 * Show help:
 *   node test-a1-easter-egg.js help
 * 
 * Custom webhook URL:
 *   WEBHOOK_URL=https://myserver.com/webhook node test-a1-easter-egg.js
 */

