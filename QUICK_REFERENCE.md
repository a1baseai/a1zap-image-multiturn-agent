# Quick Reference Card

## 🎯 The Simple Answer

**The file is attached to the webhook endpoint `/webhook/claude`, NOT to a specific agent.**

**The agent ID comes FROM A1Zap** when they send messages to your webhook.

## 📋 Environment Variables You Need

```bash
# In your .env file:
CLAUDE_API_KEY=sk-ant-your-key-here          # From Anthropic Console
A1ZAP_API_KEY=your-a1zap-key-here            # From A1Zap
A1ZAP_AGENT_ID=your-agent-id-here            # From A1Zap
```

## 🔗 Webhook URL to Use in A1Zap

```
Production: https://your-server.com/webhook/claude
Local:      http://localhost:3000/webhook/claude
```

## ✅ Setup Checklist

- [ ] Get Claude API key from [console.anthropic.com](https://console.anthropic.com)
- [ ] Get A1Zap API key from A1Zap → Make → Agent API
- [ ] Get A1Zap Agent ID from A1Zap → Make → Agent API
- [ ] Add all three to `.env` file
- [ ] Upload CSV: `npm run upload files/brandoneats.csv` ✅ (Done!)
- [ ] Configure A1Zap webhook to `/webhook/claude`
- [ ] Start server: `npm start`

## 🚀 Quick Commands

```bash
# Check configuration
npm run check

# Upload a file
npm run upload path/to/file.csv

# Start server
npm start

# Check current file
curl http://localhost:3000/files/base
```

## 🌐 Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/claude` | POST | Chat with agent (use this in A1Zap) |
| `/files/base` | GET | Check current base file |
| `/files/list` | GET | List all uploaded files |
| `/health` | GET | Server health check |

## 💡 Key Concepts

### One File, Multiple Agents
```
Agent 1 (Sales)     ─┐
Agent 2 (Support)   ─┼──> /webhook/claude ──> brandoneats.csv
Agent 3 (Technical) ─┘
```

All three agents can use the same webhook and access the same file!

### Message Flow
```
User → A1Zap → Your Server (/webhook/claude) → Claude API
                    ↓
              brandoneats.csv
                    ↓
              Claude Response
                    ↓
              Back to A1Zap → User
```

### Where Agent ID is Used
- **Set in:** A1Zap platform
- **Sent by:** A1Zap in webhook payload
- **Received in:** `webhooks/claude-webhook.js` (line 33: `const agentId = agent?.id`)
- **Used for:** Sending responses back to correct agent via A1Zap API

## 📖 Documentation Files

- `A1ZAP_SETUP_GUIDE.md` - Complete A1Zap setup
- `YOUR_CSV_IS_READY.md` - CSV upload confirmation
- `CLAUDE_SETUP.md` - Claude API setup
- `QUICK_START.md` - 5-minute setup
- `README.md` - Full documentation

## 🆘 Quick Troubleshooting

**"A1Zap API Key not configured"**
→ Add `A1ZAP_API_KEY` to `.env`

**"Agent not responding"**
→ Check webhook URL in A1Zap matches your server

**"Agent not mentioning CSV"**
→ Verify you're using `/webhook/claude` not `/webhook/text`

**"Cannot read properties of undefined"**
→ Already fixed! Was using wrong API method.

## 📞 Current Status

✅ Claude API: Configured  
✅ CSV File: `brandoneats.csv` uploaded  
❌ A1Zap: Need to add API Key & Agent ID to `.env`

## 🎯 Next Action

Add to your `.env` file:
```bash
A1ZAP_API_KEY=get-from-a1zap
A1ZAP_AGENT_ID=get-from-a1zap
```

Then run: `npm run check`

