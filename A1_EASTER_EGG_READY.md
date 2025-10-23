# 🎉 A1 Easter Egg is Live!

## What Just Happened?

Your BrandyEats webhook now has a **fun Easter egg** built in! When anyone sends the message **"a1"** to your bot, it instantly responds with rich social share content showing your viral Instagram, TikTok, and YouTube posts.

---

## Try It Now! (3 Steps)

### 1. Make sure your server is running
```bash
npm start
```

### 2. Send "a1" in WhatsApp
Open your BrandyEats bot chat and type:
```
a1
```

### 3. Watch the magic! ✨
You'll instantly receive:
- 🔥 The message: "Check out our viral content across all platforms!"
- 📸 An embedded Instagram reel
- 🎵 An embedded TikTok video
- 🎬 An embedded YouTube short

---

## How It Works

**Location:** `webhooks/brandoneats-webhook.js` (lines 63-121)

When a message comes in:
1. ✅ Check if message is exactly "a1" (case-insensitive, trimmed)
2. ✅ If yes → Send rich content blocks immediately
3. ✅ If no → Process normally with Claude

**Features:**
- ⚡ **Instant response** - No AI processing needed
- 🔄 **Deduplicated** - Won't trigger twice for same message
- 🛡️ **Error handling** - Falls back to normal processing if fails
- 📝 **Logged** - Clear console output when triggered

---

## The Social Content

The Easter egg sends these three social media embeds:

| Platform | URL |
|----------|-----|
| Instagram | https://www.instagram.com/reel/DQI4QE8jHiL/ |
| TikTok | https://www.tiktok.com/@brandneweats/video/7546112444503035144 |
| YouTube | https://www.youtube.com/shorts/ToobPQS6_ZI |

---

## Testing

### Test Locally (Webhook Simulation)

```bash
# Run all tests (6 test cases)
node test-a1-easter-egg.js

# Test with real WhatsApp chat (sends actual message!)
node test-a1-easter-egg.js real j123abc456def

# Show example payload
node test-a1-easter-egg.js example
```

### Test via cURL

```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {"id": "test-123"},
    "message": {"content": "a1", "id": "msg-123"},
    "agent": {"id": "j972wdq9j43c6wda1gga784gxn7qwpzs"}
  }'
```

Expected response:
```json
{
  "success": true,
  "agent": "Brandon Eats Assistant",
  "response": "🔥 Check out our viral content across all platforms!",
  "richContent": true,
  "easterEgg": "a1",
  "messageId": "km..."
}
```

---

## Console Output

When triggered, you'll see:
```
Processing Brandon Eats query from chat j123abc: "a1"
🎉 A1 Easter egg triggered! Sending social share rich content...
📤 Sending Brandon Eats response to chat j123abc
   URL: https://api.a1zap.com/v1/messages/individual/.../send
   Rich Content Blocks: 3 blocks
✅ Brandon Eats message sent successfully
✅ A1 Easter egg: Social shares sent successfully!
```

---

## Variations That Work

All of these trigger the Easter egg:
- `a1` (lowercase)
- `A1` (uppercase)
- `a1 ` (with spaces)
- ` a1` (leading spaces)

These do NOT trigger:
- `a1 test` (extra text)
- `hello a1` (not alone)
- `a11` (extra character)

---

## Files

```
📄 webhooks/brandoneats-webhook.js   # Main webhook with Easter egg (updated)
📄 services/brandoneats-client.js    # Client with rich content support
📄 test-a1-easter-egg.js            # Test script for Easter egg
📄 A1_EASTER_EGG.md                 # Full documentation
📄 A1_EASTER_EGG_READY.md          # This file (quick start)
```

---

## Customization

### Change the Trigger Word

Edit `webhooks/brandoneats-webhook.js` line 64:
```javascript
if (userMessage.toLowerCase().trim() === 'viral') {  // Changed from 'a1'
```

### Change the Message

Edit line 103:
```javascript
'🚀 Your custom message here!',
```

### Change the Social Links

Edit the `richContentBlocks` array (lines 67-92):
```javascript
{
  type: 'social_share',
  data: {
    platform: 'instagram',
    url: 'https://instagram.com/your-link-here'
  },
  order: 0
}
```

### Add More Content (e.g., Buttons)

```javascript
const richContentBlocks = [
  // Your 3 social shares...
  {
    type: 'social_share',
    data: { platform: 'instagram', url: '...' },
    order: 0
  },
  {
    type: 'social_share',
    data: { platform: 'tiktok', url: '...' },
    order: 1
  },
  {
    type: 'social_share',
    data: { platform: 'youtube', url: '...' },
    order: 2
  },
  // Add a button!
  {
    type: 'button_card',
    data: {
      title: 'Want more?',
      buttons: [
        {
          id: 'btn_follow',
          label: '📸 Follow Us',
          action: 'url',
          value: 'https://instagram.com/brandneweats',
          variant: 'primary'
        }
      ]
    },
    order: 3
  }
];
```

---

## What This Demonstrates

✅ **Real-time Rich Content** - Send interactive content instantly  
✅ **Social Media Embeds** - Instagram, TikTok, YouTube all in one message  
✅ **Multiple Content Blocks** - Combine different types of rich content  
✅ **Webhook Integration** - Trigger rich content from incoming messages  
✅ **Error Handling** - Graceful fallback if something fails  
✅ **Production Ready** - Deduplication, logging, validation

---

## Real-World Use Cases

This pattern can be used for:

- **"menu"** → Send product cards with food items
- **"poll"** → Send an interactive poll for feedback
- **"special"** → Send today's special offers
- **"location"** → Send restaurant address with map
- **"hours"** → Send business hours with quick reply options
- **"viral"** → What we just built! Social media showcase

---

## Next Steps

1. ✅ **Test it**: Send "a1" in WhatsApp
2. ✅ **Customize it**: Change the trigger word or content
3. ✅ **Add more**: Create Easter eggs for other keywords
4. ✅ **Share it**: Show off your rich content capabilities!

---

## Commands Reference

```bash
# Start server
npm start

# Test Easter egg (all tests)
node test-a1-easter-egg.js

# Test with real WhatsApp chat
node test-a1-easter-egg.js real YOUR_CHAT_ID

# Show example payload
node test-a1-easter-egg.js example

# Test other rich content
node test-social-shares-quick.js
node test-rich-content.js
node example-social-shares.js YOUR_CHAT_ID
```

---

## Documentation

- 📖 **A1_EASTER_EGG.md** - Full Easter egg documentation
- 📖 **RICH_CONTENT_GUIDE.md** - Complete rich content usage guide
- 📖 **RICH_CONTENT_SETUP.md** - Setup and implementation details
- 📖 **TEST_NOW.md** - Quick start guide

---

## Support

**It's not working?**

1. Make sure server is running: `npm start`
2. Check console for error messages
3. Verify webhook is configured in A1Zap
4. Try the test script: `node test-a1-easter-egg.js`
5. Check the logs for "🎉 A1 Easter egg triggered!"

**Want to add more content types?**

See `RICH_CONTENT_GUIDE.md` for 17+ content types including:
- Buttons
- Polls
- Quick Replies
- Carousels
- Product Cards
- And more!

---

## 🎉 Ready to Go!

**Try it now:**
1. Open WhatsApp
2. Open your BrandyEats bot chat
3. Send: `a1`
4. Watch the rich content appear! ✨

**That's it!** You now have a working Easter egg that demonstrates the power of the new Rich Messages API. 🚀

---

*Made with ❤️ for A1Zap Rich Content API*

