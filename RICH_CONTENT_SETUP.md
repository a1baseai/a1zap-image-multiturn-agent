# ✅ Rich Content Setup Complete

## What's Been Added

Your BrandyEats agent now supports the new A1Zap Rich Messages API! 🎉

## Changes Made

### 1. Updated BrandyEats Client (`services/brandoneats-client.js`)

**Added:**
- ✅ `richContentBlocks` parameter to `sendMessage()` method (optional, backward compatible)
- ✅ `sendSocialShareMessage()` helper method for easy social media embeds
- ✅ Enhanced error handling with validation error display

**Example Usage:**
```javascript
// Method 1: Direct rich content blocks
await brandonEatsClient.sendMessage(chatId, content, richContentBlocks);

// Method 2: Helper for social shares
await brandonEatsClient.sendSocialShareMessage(chatId, content, socialLinks);

// Method 3: Text only (still works as before)
await brandonEatsClient.sendMessage(chatId, content);
```

### 2. Quick Test Script (`test-social-shares-quick.js`)

A simple script to test the exact social share blocks you specified:
- Instagram: https://www.instagram.com/reel/DQI4QE8jHiL/
- TikTok: https://www.tiktok.com/@brandneweats/video/7546112444503035144
- YouTube: https://www.youtube.com/shorts/ToobPQS6_ZI

**Run it:**
```bash
TEST_CHAT_ID=your_chat_id node test-social-shares-quick.js
```

### 3. Full Test Suite (`test-rich-content.js`)

Comprehensive test suite with 4 tests:
1. ✅ Social share blocks (Instagram + TikTok + YouTube)
2. ✅ Single social share (Instagram only)
3. ✅ Social shares + CTA button
4. ✅ Text-only message (backward compatibility)

**Run all tests:**
```bash
# Edit file to set TEST_CHAT_ID, then:
node test-rich-content.js

# Or run individual tests:
node test-rich-content.js social
node test-rich-content.js button
node test-rich-content.js text
```

### 4. Documentation

- **`RICH_CONTENT_GUIDE.md`** - Complete usage guide
- **`RICH_CONTENT_SETUP.md`** - This setup summary

## How to Test Right Now

### Step 1: Get a Test Chat ID

You need a valid A1Zap chat ID to send messages to. This is typically in the format: `j123abc456def`

### Step 2: Run the Quick Test

```bash
TEST_CHAT_ID=j123abc456def node test-social-shares-quick.js
```

Or edit `test-social-shares-quick.js` and change this line:
```javascript
const TEST_CHAT_ID = 'j123abc456def';  // Your actual chat ID
```

Then run:
```bash
node test-social-shares-quick.js
```

### Step 3: Check WhatsApp

Open WhatsApp and check the chat. You should see:
- Your text message
- 3 embedded social media posts (Instagram, TikTok, YouTube)

## Your Social Share Blocks (Ready to Use)

```javascript
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
```

## Integration with Your Webhook

You can now use rich content in your BrandyEats webhook responses:

```javascript
// In webhooks/brandoneats-webhook.js
const brandonEatsClient = require('../services/brandoneats-client');

// Example: User asks about viral content
if (userMessage.includes('viral') || userMessage.includes('popular')) {
  const socialLinks = [
    { platform: 'instagram', url: 'https://www.instagram.com/reel/DQI4QE8jHiL/' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144' },
    { platform: 'youtube', url: 'https://www.youtube.com/shorts/ToobPQS6_ZI' }
  ];
  
  await brandonEatsClient.sendSocialShareMessage(
    chatId,
    '🔥 Check out our most viral content!',
    socialLinks
  );
}
```

## What Else Can You Do?

The Rich Messages API supports 17+ content types:

### Social Media Embeds
- Instagram, TikTok, YouTube, Vimeo, Twitter, Twitch

### Interactive Elements
- **Buttons** - Call-to-action buttons with URL/message/workflow actions
- **Polls** - Interactive voting and surveys
- **Quick Replies** - Fast response buttons

### Rich Cards
- **Product Cards** - Showcase products with pricing
- **Event Cards** - Event information and RSVP
- **Location Cards** - Maps and addresses
- **Contact Cards** - vCard information

### Media Galleries
- **Carousels** - Swipeable image galleries
- **Image Galleries** - Grid layouts

See the Rich Messages Migration Guide for complete documentation.

## Example: Social + Button

```javascript
const richContentBlocks = [
  // Instagram embed
  {
    type: 'social_share',
    data: {
      platform: 'instagram',
      url: 'https://www.instagram.com/reel/DQI4QE8jHiL/'
    },
    order: 0
  },
  // Call-to-action
  {
    type: 'button_card',
    data: {
      title: 'Love what you see?',
      buttons: [
        {
          id: 'btn_follow',
          label: '📸 Follow Us',
          action: 'url',
          value: 'https://www.instagram.com/brandneweats',
          variant: 'primary'
        }
      ]
    },
    order: 1
  }
];

await brandonEatsClient.sendMessage(
  chatId,
  '🍕 Check this out!',
  richContentBlocks
);
```

## Backward Compatibility

**Good news:** All your existing code continues to work unchanged!

```javascript
// This still works exactly as before
await brandonEatsClient.sendMessage(chatId, 'Hello!');
```

The `richContentBlocks` parameter is optional. If you don't provide it, the message sends as plain text.

## API Validation

The API validates all rich content blocks:

✅ **Valid platforms:** instagram, tiktok, youtube, vimeo, twitter, twitch
✅ **Required fields:** Each block type has specific required fields
✅ **Unique IDs:** Button/poll/reply IDs must be unique within a block
✅ **Limits:** Max 10 blocks per message, max 6 buttons per card, etc.

Validation errors are logged to console with helpful details:
```javascript
Error: Validation failed for 1 block(s)
   Validation Errors: [
     {
       "index": 0,
       "type": "social_share",
       "error": "Invalid platform. Must be one of: youtube, tiktok, instagram, vimeo, twitter, twitch"
     }
   ]
```

## Troubleshooting

### Error: "Please set TEST_CHAT_ID"
**Fix:** You need a valid chat ID. Get one from A1Zap or use an existing chat.

### Error: "Invalid platform"
**Fix:** Use only: instagram, tiktok, youtube, vimeo, twitter, or twitch

### Error: "Missing required field"
**Fix:** Check the Rich Messages Migration Guide for required fields per block type

### Message sends but no rich content appears
**Check:**
1. Is the chat platform supported? (Rich content works on WhatsApp)
2. Are the URLs valid and accessible?
3. Check the API response for validation errors

## Next Steps

1. ✅ Get a test chat ID
2. ✅ Run `test-social-shares-quick.js`
3. ✅ Verify rich content appears in WhatsApp
4. ✅ Integrate into your webhook handlers
5. ✅ Experiment with other content types (buttons, polls, etc.)

## Files Reference

```
brandytest/
├── services/
│   └── brandoneats-client.js         # Updated client (rich content support)
├── test-social-shares-quick.js       # Quick test script
├── test-rich-content.js              # Full test suite
├── RICH_CONTENT_GUIDE.md            # Usage guide
└── RICH_CONTENT_SETUP.md            # This file
```

## Support

- 📖 Read `RICH_CONTENT_GUIDE.md` for detailed usage
- 🧪 Check test files for working examples
- 📋 See Rich Messages Migration Guide for full API docs

---

**Ready to test?** Run this now:

```bash
TEST_CHAT_ID=your_chat_id_here node test-social-shares-quick.js
```

🎉 Enjoy your new rich content capabilities!

