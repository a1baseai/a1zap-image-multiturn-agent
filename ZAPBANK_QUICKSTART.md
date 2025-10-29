# Zap Bank Agent - Quick Start ⚡

Get the Zap Bank Representative Agent up and running in 5 minutes!

## 1️⃣ Add Environment Variables

Add to your `.env` file:

```bash
ZAPBANK_REP_AGENT_ID=your_agent_id_here
ZAPBANK_REP_API_KEY=your_api_key_here
```

Get these from your [A1Zap Dashboard](https://a1zap.com/dashboard).

## 2️⃣ Start the Server

```bash
npm start
```

Look for:
```
✅ Registered agent: zapbank-rep (Zap Bank Advisor)
POST /webhook/zapbank-rep - Zap Bank Rep (sales advisor)
```

## 3️⃣ Test It

```bash
node tests/test-zapbank-rep.js
```

Should see 7 tests pass with various responses.

## 4️⃣ Configure Webhook

In A1Zap Dashboard:
- Webhook URL: `https://your-domain.com/webhook/zapbank-rep`
- For local: Use [ngrok](https://ngrok.com/) to create public URL

## 🎉 Done!

Your Zap Bank agent is live! Try these messages:

- "Tell me about Zap Bank" → **Product carousel**
- "Tell me about Treasury" → **Product card**  
- "How do I get started?" → **CTA buttons**

## 📚 Full Documentation

- **Complete Guide**: [`docs/ZAPBANK_REP_AGENT.md`](docs/ZAPBANK_REP_AGENT.md)
- **Environment Setup**: [`docs/ZAPBANK_ENV_SETUP.md`](docs/ZAPBANK_ENV_SETUP.md)
- **Implementation Summary**: [`ZAPBANK_IMPLEMENTATION_SUMMARY.md`](ZAPBANK_IMPLEMENTATION_SUMMARY.md)

## ⚡ Key Features

- 💬 Modern fintech personality
- 🏦 9 banking products with deep knowledge
- 🎨 Rich content (carousels, product cards, CTA buttons)
- 🎯 Proactive product recommendations
- 📱 Mobile-optimized responses

## 🆘 Having Issues?

```bash
# Check if agent is registered
curl http://localhost:3000/

# Test webhook directly
curl -X POST http://localhost:3000/webhook/zapbank-rep \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message.received",
    "chat": {"id": "test", "type": "individual"},
    "message": {
      "id": "msg-1",
      "content": "Hi",
      "sender": {"id": "user-1", "name": "Test"}
    }
  }'
```

Check server logs for detailed error messages!

