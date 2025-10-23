# ⚡ Quick Test: A1 Easter Egg

## Test It Right Now (30 seconds)

### Option 1: WhatsApp (Easiest)
```
1. Open WhatsApp
2. Open BrandyEats bot chat
3. Send: a1
4. See rich content appear! ✨
```

### Option 2: Test Script
```bash
node test-a1-easter-egg.js
```

### Option 3: cURL
```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{"chat":{"id":"test"},"message":{"content":"a1","id":"test123"},"agent":{"id":"j972wdq9j43c6wda1gga784gxn7qwpzs"}}'
```

---

## What You'll Get

**Message:** 🔥 Check out our viral content across all platforms!

**Rich Content:**
- 📸 Instagram reel embed
- 🎵 TikTok video embed
- 🎬 YouTube short embed

---

## The Code (webhooks/brandoneats-webhook.js)

```javascript
if (userMessage.toLowerCase().trim() === 'a1') {
  const richContentBlocks = [
    {
      type: 'social_share',
      data: {
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DQI4QE8jHiL/'
      },
      order: 0
    },
    {
      type: 'social_share',
      data: {
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144'
      },
      order: 1
    },
    {
      type: 'social_share',
      data: {
        platform: 'youtube',
        url: 'https://www.youtube.com/shorts/ToobPQS6_ZI'
      },
      order: 2
    }
  ];

  await brandonEatsClient.sendMessage(
    chatId,
    '🔥 Check out our viral content across all platforms!',
    richContentBlocks
  );
}
```

---

## Files Created

✅ `webhooks/brandoneats-webhook.js` - Updated with Easter egg  
✅ `services/brandoneats-client.js` - Rich content support  
✅ `test-a1-easter-egg.js` - Test script  
✅ `A1_EASTER_EGG.md` - Full documentation  
✅ `A1_EASTER_EGG_READY.md` - Quick start  
✅ `QUICK_TEST_A1.md` - This file  

---

## Quick Commands

```bash
# Start server
npm start

# Test Easter egg
node test-a1-easter-egg.js

# Test with real chat
node test-a1-easter-egg.js real j123abc456def

# All rich content tests
node test-rich-content.js
```

---

**Go try it!** Send `a1` in WhatsApp now! 🚀

