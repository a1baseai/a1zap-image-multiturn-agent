# Claude Files API Integration - Setup Guide

## Overview

This project now supports **Claude AI with Files API**, allowing you to create document-aware agents that reference uploaded files in every response.

## What's New

### New Services
- **`services/claude-service.js`** - Claude API integration with Files API support
- **`services/file-upload.js`** - Standalone utility to upload files to Claude
- **`services/file-registry.js`** - JSON-based file metadata storage

### New Agent
- **`agents/file-reference-agent.js`** - DocuBot: A document-aware AI assistant

### New Webhook
- **`webhooks/claude-webhook.js`** - Webhook handler that uses Claude with file references

### New Endpoints
- `POST /webhook/claude` - Claude webhook with file reference support
- `GET /files/base` - Get current base file information
- `GET /files/list` - List all uploaded files

## Quick Start

### 1. Get Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key and copy it

### 2. Set Environment Variable

Add to your `.env` file or environment:
```bash
CLAUDE_API_KEY=sk-ant-your-api-key-here
```

For Replit, add to Secrets:
```
CLAUDE_API_KEY=sk-ant-your-api-key-here
```

### 3. Upload a Document

Use the example upload script:

```bash
node example-upload.js /path/to/your/document.pdf
```

Or use the utility function in your code:

```javascript
const { uploadFileToClaude } = require('./services/file-upload');

async function uploadDoc() {
  const result = await uploadFileToClaude('./my-document.pdf', {
    setAsBase: true  // This file will be referenced in all responses
  });
  
  console.log('File ID:', result.fileId);
}

uploadDoc();
```

### 4. Configure A1Zap Webhook

In your A1Zap agent settings:
- Set webhook URL to: `https://your-server.com/webhook/claude`

### 5. Start Chatting

Now when users chat with your agent:
- The agent will automatically reference the uploaded document
- Answers will be based on the document content
- Users can ask questions about the document

## File Management

### Check Current Base File

```bash
curl http://localhost:3000/files/base
```

Response:
```json
{
  "success": true,
  "baseFile": {
    "id": "file_abc123",
    "filename": "employee-handbook.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 153600,
    "uploadedAt": "2025-10-23T12:34:56.789Z"
  }
}
```

### List All Uploaded Files

```bash
curl http://localhost:3000/files/list
```

Response:
```json
{
  "success": true,
  "files": [
    {
      "id": "file_abc123",
      "filename": "employee-handbook.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 153600,
      "uploadedAt": "2025-10-23T12:34:56.789Z"
    }
  ],
  "count": 1
}
```

## Supported File Types

- **PDF** (`.pdf`)
- **Text** (`.txt`)
- **CSV** (`.csv`)
- **JSON** (`.json`)
- **Markdown** (`.md`)
- **HTML** (`.html`)
- **XML** (`.xml`)

## How It Works

1. **File Upload**: Files are uploaded to Claude's Files API and get a unique file ID
2. **File Registry**: File metadata is stored in `files-registry.json` for persistence
3. **Base File**: One file is designated as the "base file" for all agent responses
4. **Webhook Processing**: When a message comes in via `/webhook/claude`:
   - The agent retrieves the base file ID
   - Sends the message to Claude with the file attached
   - Claude references the file content in its response
5. **Response**: The agent responds with context from the uploaded document

## Code Examples

### Upload and Set Base File

```javascript
const { uploadFileToClaude } = require('./services/file-upload');

// Upload a company handbook
const result = await uploadFileToClaude('./company-handbook.pdf', {
  setAsBase: true
});

console.log('Uploaded:', result.fileId);
```

### Get Base File Info

```javascript
const { getBaseFileInfo } = require('./services/file-upload');

const baseFile = getBaseFileInfo();
if (baseFile) {
  console.log('Base file:', baseFile.filename);
} else {
  console.log('No base file set');
}
```

### List All Files

```javascript
const { listUploadedFiles } = require('./services/file-upload');

const files = listUploadedFiles();
files.forEach(file => {
  console.log(`${file.filename} (${file.id})`);
});
```

### Change Base File

```javascript
const fileRegistry = require('./services/file-registry');

// Set a different file as base
fileRegistry.setBaseFile('file_xyz789');
```

### Use Claude Service Directly

```javascript
const claudeService = require('./services/claude-service');

// Generate with base file
const response = await claudeService.generateWithBaseFile(
  'What is the vacation policy?',
  { systemPrompt: 'You are a helpful HR assistant.' }
);

console.log(response);
```

## File Registry Structure

The `files-registry.json` file stores metadata:

```json
{
  "baseFileId": "file_abc123",
  "files": [
    {
      "id": "file_abc123",
      "filename": "employee-handbook.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 153600,
      "uploadedAt": "2025-10-23T12:34:56.789Z",
      "originalPath": "./employee-handbook.pdf"
    }
  ]
}
```

## Testing the Integration

### Test with Sample Document

1. Upload the included sample document:
```bash
node example-upload.js sample-document.txt
```

2. Test the webhook locally:
```bash
curl -X POST http://localhost:3000/webhook/claude \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What is the vacation policy?"},
    "agent": {"id": "agent-123"}
  }'
```

3. Check the response - it should reference the document content!

## Troubleshooting

### File Upload Fails
- Verify Claude API key is set
- Check file type is supported
- Ensure file size is within Claude's limits
- Check network connectivity

### Agent Not Using Document
- Verify base file is set: `curl http://localhost:3000/files/base`
- Ensure you're using `/webhook/claude` not `/webhook/text`
- Check that the file uploaded successfully

### API Key Errors
- Verify Claude API key in environment
- Check key has Files API access (beta feature)
- Ensure key is not expired

## Use Cases

### Company Knowledge Base
Upload company handbook, policies, or procedures. Employees can ask questions and get instant answers.

### Product Documentation
Upload product manuals or API documentation. Support agents or customers can get accurate information.

### Educational Content
Upload course materials, textbooks, or study guides. Students can ask questions and get explanations.

### Legal Documents
Upload contracts, terms, or legal documents. Get quick answers about specific clauses.

### Research Papers
Upload research papers or technical documents. Ask questions about methodology, findings, or citations.

## API Reference

### uploadFileToClaude(filePath, options)

Uploads a file to Claude's Files API.

**Parameters:**
- `filePath` (string): Path to the file to upload
- `options.setAsBase` (boolean): Set this file as the base file (default: false)

**Returns:** Promise<Object>
```javascript
{
  success: true,
  fileId: 'file_abc123',
  filename: 'document.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 153600,
  uploadedAt: '2025-10-23T12:34:56.789Z'
}
```

### getBaseFileInfo()

Gets information about the current base file.

**Returns:** Object | null

### listUploadedFiles()

Lists all uploaded files in the registry.

**Returns:** Array<Object>

## Next Steps

1. ✅ Set up Claude API key
2. ✅ Upload your first document
3. ✅ Configure A1Zap webhook
4. ✅ Test with sample questions
5. 🚀 Deploy and go live!

---

**Need help?** Check the main README.md or contact support.

