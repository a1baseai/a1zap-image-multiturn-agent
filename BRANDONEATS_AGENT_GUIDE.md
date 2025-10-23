# Brandon Eats Agent Guide 🍕

## ✅ What Was Created

You now have a **specialized agent** with its own:
- **Custom system prompt** (designed for food/restaurant data analysis)
- **Dedicated endpoint** (`/webhook/brandoneats`)
- **Agent configuration** that uses Claude + your CSV file

## 🆚 Two Agents Comparison

| Feature | DocuBot (Generic) | Brandon Eats (Specialized) |
|---------|-------------------|---------------------------|
| **Endpoint** | `/webhook/claude` | `/webhook/brandoneats` |
| **System Prompt** | Generic document Q&A | Food/restaurant data analysis |
| **Personality** | Professional assistant | Enthusiastic food analyst 🍔 |
| **Use Case** | Any document type | Brandon Eats CSV data |
| **Configuration** | `file-reference-agent.js` | `brandoneats-agent.js` |
| **Webhook** | `claude-webhook.js` | `brandoneats-webhook.js` |

## 🎯 Brandon Eats Agent Features

### Custom System Prompt Highlights:
- ✅ Specialized for restaurant and food data
- ✅ Analyzes trends and patterns
- ✅ Calculates statistics (averages, totals, etc.)
- ✅ Compares restaurants and menu items
- ✅ Enthusiastic about food (uses emojis!)
- ✅ Always grounds answers in actual CSV data

### What It Can Do:
- 📊 Analyze restaurant trends
- 🍽️ Provide insights about menu items and prices
- ⭐ Compare ratings and reviews
- 📈 Calculate statistics and trends
- 🔍 Find specific restaurants or items
- 💡 Identify patterns in the data

## 🔗 Your New Endpoint

### For A1Zap Configuration:
```
POST /webhook/brandoneats
```

**Full URL:**
- Production: `https://your-server.com/webhook/brandoneats`
- Local: `http://localhost:3000/webhook/brandoneats`

## 🧪 Testing the Brandon Eats Agent

### Test 1: Local Test
```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What restaurants are in this data?"},
    "agent": {"id": "test-agent"}
  }'
```

### Test 2: Ask for Analysis
```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What are the top 5 most popular items?"},
    "agent": {"id": "test-agent"}
  }'
```

### Test 3: Ask for Trends
```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "What trends do you see in the data?"},
    "agent": {"id": "test-agent"}
  }'
```

## 📱 A1Zap Setup

### Option 1: Single Agent
1. Go to A1Zap → Make → Agent API
2. Create agent: "Brandon Eats Assistant"
3. Set webhook URL: `https://your-server.com/webhook/brandoneats`
4. Save and start chatting!

### Option 2: Multiple Agents (Different Personalities)
You can create **multiple A1Zap agents** using the same endpoint:

**Agent 1: "Brandon Eats Expert"**
- Webhook: `/webhook/brandoneats`
- Personality: Professional food analyst

**Agent 2: "Foodie Friend"**
- Webhook: `/webhook/brandoneats`
- Personality: Casual and fun

**Agent 3: "Restaurant Consultant"**
- Webhook: `/webhook/brandoneats`
- Personality: Business-focused

All use the same specialized system prompt from your code!

## 💬 Example Conversations

### User: "What restaurants are in the data?"
**Brandon Eats Agent:** 
```
Based on the CSV data, here are the restaurants: 🍽️

• Restaurant A - Italian cuisine
• Restaurant B - Fast food
• Restaurant C - Fine dining
... (actual data from CSV)

Total restaurants: X
```

### User: "What's the most expensive item?"
**Brandon Eats Agent:**
```
According to the data, the most expensive item is:

🏆 [Item Name] at $XX.XX from [Restaurant Name]

Other top priced items:
• Item 2 - $XX.XX
• Item 3 - $XX.XX
```

### User: "Compare ratings for Restaurant A vs B"
**Brandon Eats Agent:**
```
Here's the comparison: ⭐

Restaurant A:
• Average rating: X.X/5
• Total reviews: XX
• Strengths: ...

Restaurant B:
• Average rating: X.X/5
• Total reviews: XX
• Strengths: ...

Winner: Restaurant [A/B] with X.X higher rating! 🎉
```

## 🛠️ Customizing the Agent

Want to change the personality or behavior? Edit the system prompt:

**File:** `agents/brandoneats-agent.js`

```javascript
systemPrompt: `You are the Brandon Eats Assistant...

Your personality:
- [Customize this]

Your capabilities:
- [Add or remove capabilities]

Response style:
- [Change the style]
`
```

Changes take effect immediately on next restart!

## 📊 Agent Configuration

### Current Settings:
- **Name:** Brandon Eats Assistant
- **Role:** Food & Restaurant Data Analyst
- **Model:** Claude Sonnet 4.5
- **Temperature:** 0.7 (balanced creativity/accuracy)
- **Max Tokens:** 4096 (detailed responses)
- **Data Source:** brandoneats.csv

### To Adjust:
Edit `agents/brandoneats-agent.js`:
```javascript
generationOptions: {
  temperature: 0.7,    // 0.0 = very focused, 1.0 = very creative
  maxTokens: 4096      // Maximum response length
}
```

## 🔄 Workflow

```
User asks question
       ↓
A1Zap sends to /webhook/brandoneats
       ↓
Server loads brandoneats-agent.js config
       ↓
Applies custom system prompt
       ↓
Loads brandoneats.csv file
       ↓
Sends to Claude API
       ↓
Claude analyzes with food-focused instructions
       ↓
Returns specialized response
       ↓
Sent back to user via A1Zap
```

## ⚙️ Files Involved

```
agents/
  └─ brandoneats-agent.js     ← Agent configuration & system prompt

webhooks/
  └─ brandoneats-webhook.js   ← Webhook handler

server.js                     ← Endpoint registration
  → POST /webhook/brandoneats

brandoneats.csv              ← Your data (via file registry)
```

## 🎨 Customization Ideas

### Make it More Technical:
```javascript
systemPrompt: `You are a Data Scientist specializing in restaurant analytics...
- Focus on statistical analysis
- Provide SQL-like queries
- Show data visualizations in text
`
```

### Make it More Fun:
```javascript
systemPrompt: `You are a Fun Food Guru! 🎉
- Use lots of emojis
- Make food puns
- Get excited about data
`
```

### Make it Business-Focused:
```javascript
systemPrompt: `You are a Restaurant Business Consultant...
- Focus on profitability
- Identify opportunities
- Provide actionable recommendations
`
```

## ✅ Advantages of This Approach

✅ **Specialized:** Custom prompt optimized for your data type  
✅ **Separate:** Different endpoint = different agents  
✅ **Reusable:** Same CSV file, different personalities  
✅ **Flexible:** Easy to modify prompt without affecting other agents  
✅ **Scalable:** Can create more specialized agents  

## 🆚 When to Use Which Agent?

**Use `/webhook/brandoneats`:**
- Questions about food, restaurants, menu items
- Data analysis and trends
- Comparisons and recommendations
- When you want enthusiastic food-focused responses

**Use `/webhook/claude`:**
- General document Q&A
- When you upload non-food documents
- Generic assistance
- Professional tone

**Use `/webhook/text` (Gemini):**
- General conversation
- No file context needed
- Faster responses

## 🚀 Quick Start

1. **Server already has the endpoint!**
   ```bash
   npm start
   ```

2. **Test it:**
   ```bash
   curl -X POST http://localhost:3000/webhook/brandoneats \
     -H "Content-Type: application/json" \
     -d '{"chat":{"id":"test-1"},"message":{"content":"Analyze this data"},"agent":{"id":"a1"}}'
   ```

3. **Configure A1Zap:**
   - Set webhook: `https://your-server.com/webhook/brandoneats`

4. **Start asking questions about your Brandon Eats data!** 🍕📊

## 📝 Summary

✅ **Created:** New specialized agent for Brandon Eats  
✅ **Endpoint:** `POST /webhook/brandoneats`  
✅ **System Prompt:** Food/restaurant data focused  
✅ **Uses:** Claude + brandoneats.csv  
✅ **Ready:** Just configure in A1Zap and go!  

The agent is live and ready to analyze your food data! 🎉

