# 🎉 A1 Easter Egg - Social Share Demo

## What Is It?

A fun Easter egg built into the BrandyEats webhook that demonstrates the new Rich Content API! When a user sends the message **"a1"**, the bot automatically responds with rich social share content blocks.

## How It Works

1. User sends: `a1` (case-insensitive)
2. Webhook detects the trigger
3. Bot responds with: "🔥 Check out our viral content across all platforms!"
4. Three social media embeds are sent:
   - 📸 **Instagram** reel
   - 🎵 **TikTok** video
   - 🎬 **YouTube** short

## Try It Now!

### In WhatsApp:
1. Open your BrandyEats agent chat
2. Send the message: `a1`
3. Watch the magic happen! ✨

The bot will instantly reply with three embedded social media posts.

## Implementation Details

**Location:** `webhooks/brandoneats-webhook.js`

**Code:**
```javascript
// Easter egg: Check if user sent "a1" - respond with social share rich content
if (userMessage.toLowerCase().trim() === 'a1') {
  console.log('🎉 A1 Easter egg triggered! Sending social share rich content...');
  
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

  const sendResult = await brandonEatsClient.sendMessage(
    chatId,
    '🔥 Check out our viral content across all platforms!',
    richContentBlocks
  );
}
```

## The Content

The Easter egg showcases three BrandNewEats social media posts:

1. **Instagram Reel**
   - URL: https://www.instagram.com/reel/DQI4QE8jHiL/
   - Platform: Instagram

2. **TikTok Video**
   - URL: https://www.tiktok.com/@brandneweats/video/7546112444503035144
   - Platform: TikTok

3. **YouTube Short**
   - URL: https://www.youtube.com/shorts/ToobPQS6_ZI
   - Platform: YouTube

## Features

✅ **Instant Response** - Bypasses Claude generation for fast reply
✅ **Message Deduplication** - Won't trigger twice for the same message
✅ **Error Handling** - Falls through to normal processing if rich content fails
✅ **Console Logging** - Clear logs when Easter egg is triggered

## Response Format

When triggered, the webhook returns:
```json
{
  "success": true,
  "agent": "Brandon Eats Assistant",
  "response": "🔥 Check out our viral content across all platforms!",
  "richContent": true,
  "easterEgg": "a1",
  "messageId": "km123abc456def"
}
```

## Use Cases

This Easter egg demonstrates:
- ✅ Real-time rich content messaging
- ✅ Social media embedding (Instagram, TikTok, YouTube)
- ✅ Multiple content blocks in one message
- ✅ Instant webhook responses without AI processing
- ✅ Clean error handling and fallback

## Customization

Want to change the trigger or content?

### Change the Trigger Word
Edit line 64 in `webhooks/brandoneats-webhook.js`:
```javascript
if (userMessage.toLowerCase().trim() === 'yourword') {
```

### Change the Message
Edit line 103:
```javascript
'Your custom message here!',
```

### Change the Social Links
Edit the `richContentBlocks` array (lines 67-92) with your URLs:
```javascript
{
  type: 'social_share',
  data: {
    platform: 'instagram',  // or tiktok, youtube, etc.
    url: 'your-url-here'
  },
  order: 0
}
```

### Add More Content Types

You can add buttons, polls, or other content types:
```javascript
const richContentBlocks = [
  // Social shares
  { type: 'social_share', data: { platform: 'instagram', url: '...' }, order: 0 },
  
  // Add a button
  {
    type: 'button_card',
    data: {
      title: 'Follow Us!',
      buttons: [
        {
          id: 'btn_follow',
          label: '📸 Follow on Instagram',
          action: 'url',
          value: 'https://instagram.com/yourhandle',
          variant: 'primary'
        }
      ]
    },
    order: 1
  }
];
```

## Testing

### Test via Webhook Directly

```bash
curl -X POST http://localhost:3000/webhook/brandoneats \
  -H "Content-Type: application/json" \
  -d '{
    "chat": { "id": "test-123" },
    "message": { "content": "a1", "id": "msg-test-123" },
    "agent": { "id": "j972wdq9j43c6wda1gga784gxn7qwpzs" }
  }'
```

### Test via WhatsApp

1. Make sure your webhook is running: `npm start`
2. Make sure your webhook URL is configured in A1Zap
3. Send `a1` in your WhatsApp chat
4. Receive instant rich content! 🎉

## Console Output

When triggered, you'll see:
```
Processing Brandon Eats query from chat j123abc: "a1"
🎉 A1 Easter egg triggered! Sending social share rich content...
📤 Sending Brandon Eats response to chat j123abc
   URL: https://api.a1zap.com/v1/messages/individual/j972wdq9j43c6wda1gga784gxn7qwpzs/send
   Rich Content Blocks: 3 blocks
✅ Brandon Eats message sent successfully: { success: true, messageId: 'km...' }
✅ A1 Easter egg: Social shares sent successfully!
```

## Why "a1"?

It's a playful reference to A1Zap and A1 (number one/first-rate) quality! Plus it's short, easy to type, and memorable. 😄

## Related Files

- `webhooks/brandoneats-webhook.js` - Main webhook with Easter egg
- `services/brandoneats-client.js` - Client with rich content support
- `RICH_CONTENT_GUIDE.md` - Full rich content documentation
- `test-social-shares-quick.js` - Test script for rich content

## More Ideas

Want to add more Easter eggs? Here are some ideas:

- `menu` - Send product cards with menu items
- `poll` - Send an interactive poll
- `feedback` - Send quick reply buttons for feedback
- `special` - Send a carousel of daily specials
- `location` - Send location card for restaurant address

The possibilities are endless! 🚀

---

**Try it now:** Send `a1` to your BrandyEats bot and see the magic! ✨

