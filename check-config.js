/**
 * Configuration checker script
 * Checks if all API keys are properly configured
 */

const config = require('./config');
const { getBaseFileInfo, listUploadedFiles } = require('./services/file-upload');

console.log('\n🔍 Configuration Check\n');
console.log('='.repeat(50));

// Check Gemini API
console.log('\n📡 Gemini API:');
if (config.gemini.apiKey && !config.gemini.apiKey.includes('your_')) {
  console.log('  ✅ Configured');
  console.log(`  Model: ${config.gemini.defaultModel}`);
} else {
  console.log('  ❌ Not configured');
  console.log('  Set GEMINI_API_KEY environment variable');
}

// Check Claude API
console.log('\n🤖 Claude API:');
if (config.claude.apiKey && !config.claude.apiKey.includes('your_')) {
  console.log('  ✅ Configured');
  console.log(`  Model: ${config.claude.defaultModel}`);
} else {
  console.log('  ❌ Not configured');
  console.log('  Set CLAUDE_API_KEY environment variable');
}

// Check A1Zap API (General)
console.log('\n📨 A1Zap API (General):');
if (config.a1zap.apiKey && !config.a1zap.apiKey.includes('your_')) {
  console.log('  ✅ API Key configured');
} else {
  console.log('  ❌ API Key not configured');
  console.log('  Set A1ZAP_API_KEY environment variable');
}

if (config.a1zap.agentId && !config.a1zap.agentId.includes('your_')) {
  console.log('  ✅ Agent ID configured');
} else {
  console.log('  ❌ Agent ID not configured');
  console.log('  Set A1ZAP_AGENT_ID environment variable');
}

// Check Brandon Eats specific config
console.log('\n🍕 Brandon Eats A1Zap:');
if (config.brandonEats.apiKey && !config.brandonEats.apiKey.includes('your_')) {
  console.log('  ✅ API Key configured');
  console.log(`  Agent ID: ${config.brandonEats.agentId}`);
  console.log(`  API URL: ${config.brandonEats.apiUrl}`);
} else {
  console.log('  ❌ API Key not configured');
  console.log('  Using hardcoded defaults in config.js');
}

// Check Files
console.log('\n📄 Claude Files:');
const baseFile = getBaseFileInfo();
if (baseFile) {
  console.log('  ✅ Base file set');
  console.log(`  File: ${baseFile.filename}`);
  console.log(`  ID: ${baseFile.id}`);
  console.log(`  Size: ${baseFile.sizeBytes} bytes`);
  console.log(`  Uploaded: ${baseFile.uploadedAt}`);
} else {
  console.log('  ⚠️  No base file set');
  console.log('  Upload a file: node example-upload.js /path/to/file.pdf');
}

const files = listUploadedFiles();
console.log(`  Total files uploaded: ${files.length}`);

// Check Server
console.log('\n🚀 Server:');
console.log(`  Port: ${config.server.port}`);
console.log(`  Base URL: ${config.server.baseUrl}`);

// Endpoints
console.log('\n🔗 Available Endpoints:');
console.log('  POST /webhook/text   - Gemini text responses');
console.log('  POST /webhook/image  - Gemini image responses');
console.log('  POST /webhook/claude - Claude with file references');
console.log('  GET  /health         - Health check');
console.log('  GET  /files/base     - Get base file info');
console.log('  GET  /files/list     - List uploaded files');

// Summary
console.log('\n' + '='.repeat(50));
const geminiOk = config.gemini.apiKey && !config.gemini.apiKey.includes('your_');
const claudeOk = config.claude.apiKey && !config.claude.apiKey.includes('your_');
const a1zapOk = config.a1zap.apiKey && !config.a1zap.apiKey.includes('your_') && 
                config.a1zap.agentId && !config.a1zap.agentId.includes('your_');

console.log('\n📊 Summary:');
if (geminiOk && claudeOk && a1zapOk) {
  console.log('  ✅ All APIs configured! Ready to go!\n');
} else {
  console.log('  ⚠️  Some configurations missing. Check above for details.\n');
  
  if (!geminiOk) console.log('  - Set GEMINI_API_KEY');
  if (!claudeOk) console.log('  - Set CLAUDE_API_KEY');
  if (!a1zapOk) console.log('  - Set A1ZAP_API_KEY and A1ZAP_AGENT_ID');
  console.log();
}

if (claudeOk && !baseFile) {
  console.log('💡 Tip: Upload a base file to enable document-aware responses:');
  console.log('   node example-upload.js /path/to/your/document.pdf\n');
}

console.log('📚 Documentation:');
console.log('   - Main guide: README.md');

