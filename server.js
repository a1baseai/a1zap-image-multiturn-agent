// Load configuration
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const textWebhookHandler = require('./webhooks/text-webhook');
const imageWebhookHandler = require('./webhooks/image-webhook');
const claudeWebhookHandler = require('./webhooks/claude-webhook');
const brandonEatsWebhookHandler = require('./webhooks/brandoneats-webhook');
const { getBaseFileInfo, listUploadedFiles } = require('./services/file-upload');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      hasGeminiApiKey: !!config.gemini.apiKey && !config.gemini.apiKey.includes('your_'),
      hasClaudeApiKey: !!config.claude.apiKey && !config.claude.apiKey.includes('your_'),
      hasA1ZapApiKey: !!config.a1zap.apiKey && !config.a1zap.apiKey.includes('your_')
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'AI Webhook Agent (Gemini + Claude)',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      textWebhook: 'POST /webhook/text',
      imageWebhook: 'POST /webhook/image',
      claudeWebhook: 'POST /webhook/claude',
      brandonEatsWebhook: 'POST /webhook/brandoneats',
      filesBase: 'GET /files/base',
      filesList: 'GET /files/list'
    }
  });
});

// Text webhook endpoint (e.g., Ace Poker Bot)
app.post('/webhook/text', textWebhookHandler);

// Image webhook endpoint (e.g., Team Logo Generator)
app.post('/webhook/image', imageWebhookHandler);

// Claude webhook endpoint (with file reference support)
app.post('/webhook/claude', claudeWebhookHandler);

// Brandon Eats specialized webhook endpoint
app.post('/webhook/brandoneats', brandonEatsWebhookHandler);

// File management endpoints
app.get('/files/base', (req, res) => {
  try {
    const baseFile = getBaseFileInfo();
    if (!baseFile) {
      return res.json({
        success: true,
        baseFile: null,
        message: 'No base file set'
      });
    }
    res.json({
      success: true,
      baseFile: baseFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/files/list', (req, res) => {
  try {
    const files = listUploadedFiles();
    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
const PORT = config.server.port;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`\n🚀 AI Webhook Agent running on http://${HOST}:${PORT}`);
  console.log(`\nWebhook Endpoints:`);
  console.log(`  POST /webhook/text        - Gemini text-based responses`);
  console.log(`  POST /webhook/image       - Gemini image-based responses`);
  console.log(`  POST /webhook/claude      - Claude with file references (generic)`);
  console.log(`  POST /webhook/brandoneats - Brandon Eats data analyst (specialized)`);
  console.log(`  GET  /health              - Health check`);
  console.log(`  GET  /files/base          - Get base file info`);
  console.log(`  GET  /files/list          - List all uploaded files\n`);
  console.log(`Configuration:`);
  console.log(`  Gemini API: ${config.gemini.apiKey.includes('your_') ? '❌ Not configured' : '✅ Configured'}`);
  console.log(`  Claude API: ${config.claude.apiKey.includes('your_') ? '❌ Not configured' : '✅ Configured'}`);
  console.log(`  A1Zap API: ${config.a1zap.apiKey.includes('your_') ? '❌ Not configured' : '✅ Configured'}\n`);
});

// Error handling
server.on('error', (error) => {
  console.error(`❌ Server error:`, error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📴 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
