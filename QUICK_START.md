# Quick Start Guide - Claude Files API

## 🚀 5-Minute Setup

### Step 1: Get Claude API Key (2 minutes)
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Go to API Keys → Create Key
4. Copy your key (starts with `sk-ant-`)

### Step 2: Set Environment Variable (30 seconds)
```bash
export CLAUDE_API_KEY=sk-ant-your-key-here
```

Or add to `.env` file:
```
CLAUDE_API_KEY=sk-ant-your-key-here
```

### Step 3: Check Configuration (30 seconds)
```bash
npm run check
```

Should show: ✅ Claude API: Configured

### Step 4: Upload a Document (1 minute)
```bash
npm run upload sample-document.txt
```

Or upload your own:
```bash
npm run upload /path/to/your/document.pdf
```

### Step 5: Start the Server (30 seconds)
```bash
npm start
```

## ✅ You're Done!

Your document-aware agent is now running at:
- **Webhook:** `http://localhost:3000/webhook/claude`

---

## 🧪 Test It Locally

Send a test message:
```bash
curl -X POST http://localhost:3000/webhook/claude \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What is the vacation policy?"},
    "agent": {"id": "agent-123"}
  }'
```

Should return a response based on the uploaded document!

---

## 🔗 Connect to A1Zap

1. Go to A1Zap → Make → Agent API
2. Select your agent
3. Set webhook URL: `https://your-server.com/webhook/claude`
4. Save

Now users can chat with your document-aware agent!

---

## 📄 Manage Files

### Check Current Base File
```bash
curl http://localhost:3000/files/base
```

### List All Files
```bash
curl http://localhost:3000/files/list
```

### Upload New File
```bash
node example-upload.js new-document.pdf
```

---

## 💡 Quick Tips

### Change Base File
```javascript
const fileRegistry = require('./services/file-registry');
fileRegistry.setBaseFile('file_xyz789');
```

### Upload from Code
```javascript
const { uploadFileToClaude } = require('./services/file-upload');

await uploadFileToClaude('./document.pdf', { setAsBase: true });
```

### Use Claude Directly
```javascript
const claudeService = require('./services/claude-service');

const response = await claudeService.generateWithBaseFile(
  'What are the company values?'
);
```

---

## 🐛 Troubleshooting

### "Not configured" Error
➡️ Set `CLAUDE_API_KEY` environment variable

### "File not found" Error
➡️ Check file path is correct

### "Unsupported file type" Error
➡️ Use: PDF, TXT, CSV, JSON, MD, HTML, or XML

### Agent Not Using Document
➡️ Verify base file is set: `npm run check`

---

## 📚 More Help

- **Full guide:** `README.md`
- **Detailed setup:** `CLAUDE_SETUP.md`
- **Implementation details:** `IMPLEMENTATION_SUMMARY.md`
- **Check config:** `npm run check`

---

## 🎯 Common Use Cases

| Use Case | Document Type | Example Questions |
|----------|--------------|-------------------|
| HR Assistant | Employee Handbook | "How many vacation days do I get?" |
| Product Support | User Manual | "How do I reset my device?" |
| Legal Q&A | Contract/Policy | "What is the refund policy?" |
| Study Buddy | Course Materials | "Explain the concept of X" |
| API Helper | API Documentation | "How do I authenticate?" |

---

**That's it! You're ready to build document-aware AI agents.** 🎉

