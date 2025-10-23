# A1Zap Agent API Example Template 🤖

Multi-AI webhook agent powered by **Google Gemini AI** and **Claude AI** - ready for Replit deployment.

Create custom AI agents that run on A1Zap webhooks, with support for document-aware responses using Claude's Files API.

## 🚀 Quick Start

### 1. Get Your API Keys

**Gemini API Key:**
- Visit [Google AI Studio](https://aistudio.google.com/apikey)
- Create and copy your API key

**Claude API Key:**
- Visit [Anthropic Console](https://console.anthropic.com/)
- Create an account and get your API key

**A1Zap Credentials:**
- Go to A1Zap app → Make → Agent API
- Create your agent → Copy your API Key and Agent ID

### 2. Deploy to Replit

1. Import this project to Replit
2. Add to Secrets (🔒 in sidebar):
```
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key
A1ZAP_API_KEY=your_a1zap_key
A1ZAP_AGENT_ID=your_agent_id
BASE_URL=https://your-repl.repl.co
```
3. Click **Run**

### 3. Configure A1Zap Webhook

In A1Zap app → Select your agent:
- For Gemini agents: `https://your-repl.repl.co/webhook/text`
- For Claude agents with file support: `https://your-repl.repl.co/webhook/claude`

### 4. Test It

Start chatting with your agent - your agent responds!

---

## 📄 Claude Files API - Document-Aware Agents

### Upload Files to Claude

Use the standalone file upload utility to upload documents (PDF, TXT, CSV, etc.) to Claude:

```javascript
const { uploadFileToClaude } = require('./services/file-upload');

// Upload a file
const result = await uploadFileToClaude('/path/to/document.pdf', {
  setAsBase: true  // Set this file as the base file for all agent responses
});

console.log('File ID:', result.fileId);
```

### Setting Up Document-Aware Agent

1. **Upload your base document:**
```javascript
const { uploadFileToClaude } = require('./services/file-upload');

// This will upload and set as base file
await uploadFileToClaude('./my-knowledge-base.pdf', { setAsBase: true });
```

2. **Configure A1Zap webhook:**
- Use the Claude webhook: `https://your-repl.repl.co/webhook/claude`

3. **Start chatting:**
- All responses will reference the uploaded document
- The agent will answer questions based on the document content

### File Management Endpoints

- `GET /files/base` - Get current base file information
- `GET /files/list` - List all uploaded files

Example:
```bash
# Check current base file
curl http://localhost:3000/files/base

# List all uploaded files
curl http://localhost:3000/files/list
```

### Supported File Types

- PDF (`.pdf`)
- Text files (`.txt`)
- CSV (`.csv`)
- JSON (`.json`)
- Markdown (`.md`)
- HTML (`.html`)
- XML (`.xml`)

### Example Usage Script

Create a file `upload-doc.js`:
```javascript
const { uploadFileToClaude } = require('./services/file-upload');

async function uploadDocument() {
  try {
    const result = await uploadFileToClaude('./my-document.pdf', {
      setAsBase: true
    });
    
    console.log('✅ Document uploaded successfully!');
    console.log('File ID:', result.fileId);
    console.log('Now your Claude agent will reference this document in all responses.');
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

uploadDocument();
```

Run it:
```bash
node upload-doc.js
```

### Quick Commands

Convenient npm scripts for common tasks:

```bash
# Check configuration status
npm run check

# Upload a file (provide path as argument)
npm run upload /path/to/file.pdf

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

---

## 🛠️ Create Your Own Agent

### Text Agent Example

Edit `agents/poker-coach.js`:

```javascript
module.exports = {
  name: 'Your Agent Name',
  role: 'Your Agent Role',

  systemPrompt: `You are [name], [role].

Your Purpose:
- What your agent does
- How it helps users

Communication Style:
- How it talks
- Personality traits`,

  generationOptions: {
    temperature: 0.7,        // 0.3 = focused, 0.9 = creative
    maxOutputTokens: 65565   // Response length
  }
};
```

### Image Agent Example

Edit `agents/logo-designer.js`:

```javascript
module.exports = {
  name: 'Image Analyst',

  systemPrompt: `You analyze images and provide insights...`,

  imageAnalysisPrompt: (userMessage) =>
    `${module.exports.systemPrompt}\n\nUser: ${userMessage}\n\nAnalyze this image and provide...`,

  generationOptions: {
    temperature: 0.8,
    maxOutputTokens: 65565
  }
};
```

That's it! Your agent configuration controls how it behaves.

---

## 📁 Project Structure

```
agents/          # Agent personalities (edit these!)
  ├── poker-coach.js           # Gemini poker coach
  ├── logo-designer.js         # Gemini image analyzer
  └── file-reference-agent.js  # Claude document-aware agent

webhooks/        # Webhook handlers (usually no changes needed)
  ├── text-webhook.js          # Gemini text handler
  ├── image-webhook.js         # Gemini image handler
  └── claude-webhook.js        # Claude with file reference

services/        # Core functionality
  ├── gemini-service.js        # Gemini API integration
  ├── claude-service.js        # Claude API integration
  ├── a1zap-client.js          # A1Zap messaging
  ├── file-upload.js           # File upload utility
  └── file-registry.js         # File storage manager

config.js        # Environment configuration
server.js        # Main server
files-registry.json  # Uploaded files metadata (auto-created)
```

**To customize:** Edit files in `agents/` folder only.

---

## 🎯 Agent Ideas

### Gemini Agents
- **Fitness Coach**: Workout plans and motivation
- **Language Tutor**: Practice conversations
- **Recipe Chef**: Cooking instructions
- **Study Buddy**: Homework help
- **Code Reviewer**: Review code snippets
- **Fashion Stylist**: Outfit recommendations (image)
- **Plant Doctor**: Plant care advice (image)

### Claude Document-Aware Agents
- **Company Policy Bot**: Upload company handbook, answer employee questions
- **Product Support**: Upload product manual, help customers
- **Legal Assistant**: Upload contracts/documents, answer legal questions
- **Research Assistant**: Upload research papers, answer questions
- **Course Tutor**: Upload course materials, help students learn
- **Recipe Book**: Upload cookbook, suggest recipes and cooking tips
- **Technical Documentation**: Upload API docs, help developers

---

## 🐛 Quick Fixes

**Agent not responding?**
- Check Replit logs for errors
- Verify all Secrets are set
- Test: `https://your-repl.repl.co/health`

**Gemini errors?**
- Verify API key at [Google AI Studio](https://aistudio.google.com/apikey)

**Claude errors?**
- Verify API key at [Anthropic Console](https://console.anthropic.com/)
- Ensure you have Files API access (currently in beta)

**File upload not working?**
- Check file type is supported (PDF, TXT, CSV, JSON, MD, HTML, XML)
- Verify Claude API key is set
- Check file size (Claude has file size limits)

**Agent not using document context?**
- Verify base file is set: `GET /files/base`
- Ensure you uploaded with `setAsBase: true`
- Check that you're using the Claude webhook (`/webhook/claude`)

**A1Zap webhook not working?**
- Check webhook URL in A1Zap dashboard
- Ensure BASE_URL matches your Replit URL

---

## 📚 Learn More

- [Gemini API Docs](https://ai.google.dev/docs)
- [Claude API Docs](https://docs.anthropic.com/)
- [Claude Files API](https://docs.anthropic.com/en/api/files-create)
- [A1Zap Documentation](https://a1zap.com/docs)

---

**Ready to build? Just edit the agent files and deploy!** 🚀
