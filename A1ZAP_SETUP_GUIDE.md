# A1Zap Setup Guide for Claude File Agent

## 🎯 Understanding the Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   A1Zap     │ sends   │  Your Server │ uses    │   Claude    │
│   Agent     │ ──────> │  /webhook/   │ ──────> │     API     │
│             │         │   claude     │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      ├─ Agent ID              ├─ Base File ID         ├─ CSV Data
      ├─ API Key               └─ brandoneats.csv      └─ Analysis
      └─ Webhook URL                                   
```

**Key Point:** The **file is attached to the webhook endpoint** (`/webhook/claude`), not to a specific A1Zap agent. Any A1Zap agent that uses this webhook will have access to the uploaded file.

## 📝 Step-by-Step Setup

### Step 1: Get A1Zap Credentials

1. **Open A1Zap** app
2. Go to **Make** → **Agent API**
3. **Create a new agent** or select an existing one:
   - Give it a name (e.g., "CSV Data Assistant")
   - Set its personality/instructions
4. **Copy the credentials:**
   - **API Key**: Found in the agent settings
   - **Agent ID**: Found in the agent settings

### Step 2: Add Credentials to Your Environment

#### Option A: Using .env file (Recommended for local)

Add to your `.env` file:
```bash
# Claude API
CLAUDE_API_KEY=sk-ant-your-claude-api-key-here

# A1Zap Configuration
A1ZAP_API_KEY=your-a1zap-api-key-here
A1ZAP_AGENT_ID=your-agent-id-here

# Optional
PORT=3000
BASE_URL=http://localhost:3000
```

#### Option B: Using .env.local file

If you prefer `.env.local`:
```bash
A1ZAP_API_KEY=your-a1zap-api-key-here
A1ZAP_AGENT_ID=your-agent-id-here
```

#### Option C: Replit Secrets (for Replit deployment)

1. Click the lock icon 🔒 in Replit sidebar
2. Add secrets:
   - `CLAUDE_API_KEY` = your Claude key
   - `A1ZAP_API_KEY` = your A1Zap API key
   - `A1ZAP_AGENT_ID` = your A1Zap agent ID

### Step 3: Configure the Webhook in A1Zap

1. **In A1Zap**, go to your agent settings
2. Find the **Webhook URL** field
3. Set it to:
   ```
   https://your-server.com/webhook/claude
   ```
   
   **Examples:**
   - Local testing: `http://localhost:3000/webhook/claude`
   - Replit: `https://your-repl-name.repl.co/webhook/claude`
   - Custom domain: `https://yourdomain.com/webhook/claude`

4. **Save** the settings

### Step 4: Verify Configuration

Run the configuration checker:
```bash
npm run check
```

You should see:
```
📨 A1Zap API:
  ✅ API Key configured
  ✅ Agent ID configured

📄 Claude Files:
  ✅ Base file set
  File: brandoneats.csv
```

### Step 5: Start Your Server

```bash
npm start
```

You should see:
```
🚀 AI Webhook Agent running on http://localhost:3000

Configuration:
  Gemini API: ✅ Configured
  Claude API: ✅ Configured
  A1Zap API: ✅ Configured
```

### Step 6: Test It!

Send a message through A1Zap to your agent, and it will:
1. Receive the message via webhook
2. Load the base file (brandoneats.csv)
3. Send both to Claude
4. Get a response that references the CSV data
5. Send the response back through A1Zap

## 🔄 How It Works

### Message Flow:

1. **User sends message** through A1Zap
   ```
   User: "What's in this CSV?"
   ```

2. **A1Zap sends webhook** to your server:
   ```json
   POST /webhook/claude
   {
     "chat": {"id": "chat-abc123"},
     "message": {"content": "What's in this CSV?"},
     "agent": {"id": "agent-xyz789"}  ← A1Zap sends this
   }
   ```

3. **Your server processes it:**
   - Loads base file: `brandoneats.csv` (file_011CUPZvgxKDcNQUepYLmtYL)
   - Sends to Claude with file attached
   - Gets response from Claude

4. **Server sends response back** to A1Zap:
   ```javascript
   await a1zapClient.sendMessage(chatId, response);
   ```

5. **User receives response** in A1Zap

## 🔧 Configuration Location

The A1Zap configuration is used in these files:

### `config.js` (Lines 13-18)
```javascript
a1zap: {
  apiKey: process.env.A1ZAP_API_KEY,
  agentId: process.env.A1ZAP_AGENT_ID,
  apiUrl: 'https://api.a1zap.com/v1/messages/individual'
}
```

### `services/a1zap-client.js`
Used to send responses back to A1Zap:
```javascript
const a1zapClient = require('../services/a1zap-client');

// Send response
await a1zapClient.sendMessage(chatId, response);
```

### `webhooks/claude-webhook.js`
Receives webhook from A1Zap and extracts agent info:
```javascript
const { chat, message, agent } = req.body;
const agentId = agent?.id;  // Agent ID from A1Zap
```

## 📊 Multiple Agents, One File

**Important:** You can have **multiple A1Zap agents** all using the same file!

### Example Setup:

**Agent 1: "Sales Data Analyst"**
- Webhook: `https://your-server.com/webhook/claude`
- Personality: Professional data analyst
- Uses: brandoneats.csv

**Agent 2: "Friendly Assistant"**
- Webhook: `https://your-server.com/webhook/claude`
- Personality: Casual and friendly
- Uses: brandoneats.csv (same file!)

**Agent 3: "Technical Expert"**
- Webhook: `https://your-server.com/webhook/claude`
- Personality: Technical and detailed
- Uses: brandoneats.csv (same file!)

All three agents have access to the same CSV file, but with different personalities!

## 🔄 Changing the Base File

If you want to use a different CSV file:

```bash
npm run upload new-file.csv
```

This will set `new-file.csv` as the new base file, and **all agents** using `/webhook/claude` will now reference the new file.

## 🎭 Agent-Specific Personalities

The A1Zap agent's personality is set in **A1Zap**, not in your code. Your server just:
1. Receives the message
2. Adds the CSV context
3. Sends to Claude
4. Returns the response

The agent's personality/instructions are managed in A1Zap's agent settings.

## ✅ Verification Checklist

- [ ] Claude API key set in `.env`
- [ ] A1Zap API key set in `.env`
- [ ] A1Zap Agent ID set in `.env`
- [ ] CSV file uploaded (`brandoneats.csv`)
- [ ] Server running (`npm start`)
- [ ] Webhook URL configured in A1Zap: `/webhook/claude`
- [ ] Test message sent through A1Zap

## 🧪 Testing

### Local Test (Without A1Zap):
```bash
curl -X POST http://localhost:3000/webhook/claude \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What columns are in the CSV?"},
    "agent": {"id": "test-agent"}
  }'
```

### Production Test (Through A1Zap):
1. Open A1Zap
2. Message your agent
3. Ask: "What's in this CSV?"
4. Agent should respond with info about brandoneats.csv!

## 🆘 Troubleshooting

### Agent Not Responding
- Check server logs for errors
- Verify webhook URL in A1Zap matches your server
- Confirm A1Zap credentials are correct

### Agent Responding But Not Mentioning CSV
- Check base file is set: `curl http://localhost:3000/files/base`
- Verify you're using `/webhook/claude` not `/webhook/text`
- Check server logs for "Using base file" message

### A1Zap API Errors
- Verify A1ZAP_API_KEY is correct
- Verify A1ZAP_AGENT_ID matches the agent in A1Zap
- Check A1Zap dashboard for API status

## 📚 Summary

**Where things are configured:**

| What | Where to Set It |
|------|----------------|
| Agent personality | A1Zap agent settings |
| Agent ID | A1Zap (copy to .env) |
| A1Zap API Key | A1Zap (copy to .env) |
| Webhook URL | A1Zap agent settings → `/webhook/claude` |
| Claude API Key | Anthropic Console (copy to .env) |
| CSV File | Upload via `npm run upload file.csv` |
| Base File | Set automatically on upload |

**The file is NOT tied to an agent** - it's tied to the `/webhook/claude` endpoint. Any A1Zap agent that uses this webhook will have access to the uploaded file.

Ready to go! 🚀

