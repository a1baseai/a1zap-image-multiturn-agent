# Brandon Eats Credentials Configuration ✅

## 🎯 Credentials Added Successfully!

Your Brandon Eats agent now has its own dedicated A1Zap credentials hardcoded in the configuration.

## 📋 Configuration Details

### Brandon Eats A1Zap Credentials:
```
Agent ID:  j972wdq9j43c6wda1gga784gxn7qwpzs
API Key:   oWcnoLaWyz6Essuc3doElcHCSSfgsJ
Base URL:  https://api.a1zap.com
Full URL:  https://api.a1zap.com/v1/messages/individual
```

### Where It's Configured:

**File:** `config.js` (lines 20-25)
```javascript
brandonEats: {
  apiKey: process.env.BRANDONEATS_API_KEY || 'oWcnoLaWyz6Essuc3doElcHCSSfgsJ',
  agentId: process.env.BRANDONEATS_AGENT_ID || 'j972wdq9j43c6wda1gga784gxn7qwpzs',
  apiUrl: process.env.BRANDONEATS_API_URL || 'https://api.a1zap.com/v1/messages/individual'
}
```

## 🔧 How It Works

### Dedicated Client
A separate A1Zap client was created specifically for Brandon Eats:

**File:** `services/brandoneats-client.js`
- Uses Brandon Eats specific credentials
- Independent from the general A1Zap client
- Handles messaging for `/webhook/brandoneats` endpoint only

### Webhook Integration
**File:** `webhooks/brandoneats-webhook.js`
- Uses `brandonEatsClient` instead of `a1zapClient`
- Sends responses using Brandon Eats agent credentials
- Fetches message history from Brandon Eats conversations

## 🆚 Separation of Credentials

You now have **two separate A1Zap configurations**:

| Configuration | Purpose | Status |
|---------------|---------|--------|
| **General A1Zap** | For `/webhook/text`, `/webhook/image`, `/webhook/claude` | ❌ Not configured (optional) |
| **Brandon Eats** | For `/webhook/brandoneats` only | ✅ Configured & ready |

This means:
- ✅ Brandon Eats agent works independently
- ✅ No need to set general A1Zap credentials if only using Brandon Eats
- ✅ Can add general credentials later for other agents

## 🔗 Your Brandon Eats Endpoint

### Webhook URL to Configure in A1Zap:
```
https://your-server.com/webhook/brandoneats
```

**Local:**
```
http://localhost:3000/webhook/brandoneats
```

## 🧪 Testing

### Test Locally:
```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What restaurants are in the data?"},
    "agent": {"id": "test-agent"}
  }'
```

This will:
1. ✅ Load brandoneats.csv
2. ✅ Use Brandon Eats system prompt
3. ✅ Generate response with Claude
4. ✅ (In production) Send back via A1Zap using your credentials

## 📱 A1Zap Configuration

### In A1Zap Dashboard:
1. Go to your Brandon Eats agent (ID: `j972wdq9j43c6wda1gga784gxn7qwpzs`)
2. Set webhook URL to: `https://your-server.com/webhook/brandoneats`
3. Save

**That's it!** The credentials are already in the code.

## 🔒 Security Notes

### Current Setup:
- Credentials are hardcoded in `config.js` with fallback to environment variables
- If you set environment variables, they will override the hardcoded values

### To Use Environment Variables (Optional):
Add to your `.env` file:
```bash
BRANDONEATS_API_KEY=oWcnoLaWyz6Essuc3doElcHCSSfgsJ
BRANDONEATS_AGENT_ID=j972wdq9j43c6wda1gga784gxn7qwpzs
BRANDONEATS_API_URL=https://api.a1zap.com/v1/messages/individual
```

### Recommendation:
For production deployments (Replit, etc.), use environment variables instead of hardcoded values for better security.

## ✅ Verification

Run the config checker:
```bash
npm run check
```

You should see:
```
🍕 Brandon Eats A1Zap:
  ✅ API Key configured
  Agent ID: j972wdq9j43c6wda1gga784gxn7qwpzs
  API URL: https://api.a1zap.com/v1/messages/individual
```

## 🚀 Ready to Go!

### Your Brandon Eats agent is fully configured:
- ✅ A1Zap credentials set
- ✅ Agent ID configured
- ✅ CSV file uploaded (brandoneats.csv)
- ✅ Dedicated client created
- ✅ Webhook handler ready
- ✅ Endpoint active: `/webhook/brandoneats`

### Next Steps:
1. **Start server:** `npm start`
2. **Deploy** (if not local)
3. **Configure webhook in A1Zap:** Set to `/webhook/brandoneats`
4. **Start chatting!** Ask questions about your food data

## 📊 Flow Diagram

```
User sends message via A1Zap
        ↓
A1Zap uses your agent (j972wdq9j43c6wda1gga784gxn7qwpzs)
        ↓
Webhook: POST /webhook/brandoneats
        ↓
Brandon Eats Client (uses your credentials)
        ↓
Load brandoneats.csv + Brandon Eats system prompt
        ↓
Send to Claude API
        ↓
Claude analyzes with food-focused instructions
        ↓
Response sent back via A1Zap
   (using your API key: oWcnoLaWyz6Essuc3doElcHCSSfgsJ)
        ↓
User receives response
```

## 🔧 Files Modified/Created

### Created:
- `services/brandoneats-client.js` - Dedicated A1Zap client

### Modified:
- `config.js` - Added Brandon Eats configuration
- `webhooks/brandoneats-webhook.js` - Updated to use brandonEatsClient
- `check-config.js` - Added Brandon Eats status check

## 💡 Advantages

✅ **Independent:** Brandon Eats works independently of other agents  
✅ **Isolated:** Credentials don't conflict with general A1Zap config  
✅ **Flexible:** Can easily add more specialized agents with their own credentials  
✅ **Clean:** Each agent has its own client and configuration  
✅ **Ready:** Works out of the box with hardcoded values  

## 🎉 Summary

Your Brandon Eats agent now has:
- Dedicated A1Zap credentials
- Separate client service
- Independent webhook endpoint
- Custom system prompt for food data
- Access to brandoneats.csv

**Ready to analyze food data!** 🍕📊

---

**Need help?** Check `BRANDONEATS_AGENT_GUIDE.md` for usage examples.

