# 🚀 Ready to Test - BrandyEats Rich Content

## Quick Start (60 seconds)

### Step 1: Get Your Chat ID
You need a valid A1Zap/WhatsApp chat ID. It looks like: `j123abc456def`

### Step 2: Run the Test
```bash
TEST_CHAT_ID=j123abc456def node test-social-shares-quick.js
```

Replace `j123abc456def` with your actual chat ID.

### Step 3: Check WhatsApp
Open WhatsApp and look at the chat. You should see your message with 3 embedded social media posts:
- 📸 Instagram reel
- 🎵 TikTok video  
- 🎬 YouTube short

---

## What You Just Got

### ✅ Updated Client
`services/brandoneats-client.js` now supports rich content blocks:

```javascript
// Simple text (still works)
await brandonEatsClient.sendMessage(chatId, 'Hello!');

// With rich content
await brandonEatsClient.sendMessage(chatId, 'Check this out!', richContentBlocks);

// Helper for social shares
await brandonEatsClient.sendSocialShareMessage(chatId, content, socialLinks);
```

### ✅ Test Scripts

**Quick test** (what you just ran):
```bash
node test-social-shares-quick.js
```

**Full test suite** (4 tests including buttons):
```bash
node test-rich-content.js
```

**Examples** (6 real-world examples):
```bash
node example-social-shares.js YOUR_CHAT_ID
```

### ✅ Your Social Blocks (Ready to Use)

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

---

## Next: Use in Your Webhook

### Option 1: Simple Integration

In `webhooks/brandoneats-webhook.js`:

```javascript
const brandonEatsClient = require('../services/brandoneats-client');

// When user asks about viral content
if (userMessage.includes('viral') || userMessage.includes('popular')) {
  const socialLinks = [
    { platform: 'instagram', url: 'https://www.instagram.com/reel/DQI4QE8jHiL/' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144' }
  ];
  
  await brandonEatsClient.sendSocialShareMessage(
    chatId,
    '🔥 Check out our viral content!',
    socialLinks
  );
}
```

### Option 2: With Call-to-Action

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
    type: 'button_card',
    data: {
      title: 'Follow us for more!',
      buttons: [
        {
          id: 'btn_follow',
          label: '📸 Follow on Instagram',
          action: 'url',
          value: 'https://www.instagram.com/brandneweats',
          variant: 'primary'
        }
      ]
    },
    order: 1
  }
];

await brandonEatsClient.sendMessage(chatId, '🍕 Love food content?', richContentBlocks);
```

---

## More Content Types Available

Beyond social shares, you can use:

- **Buttons** - CTAs with URL/message/workflow actions
- **Polls** - Interactive surveys
- **Quick Replies** - Fast response options
- **Carousels** - Image galleries
- **Product Cards** - E-commerce items
- **Event Cards** - Event info
- And 11+ more types!

See `RICH_CONTENT_GUIDE.md` for full details.

---

## Files Created

```
📁 brandytest/
├── 🔧 services/brandoneats-client.js       # Updated (rich content support)
├── 🧪 test-social-shares-quick.js         # Quick test (run this!)
├── 🧪 test-rich-content.js                # Full test suite
├── 📚 example-social-shares.js            # 6 real-world examples
├── 📖 RICH_CONTENT_GUIDE.md              # Complete usage guide
├── 📖 RICH_CONTENT_SETUP.md              # Setup summary
└── 📖 TEST_NOW.md                        # This file
```

---

## Commands Reference

```bash
# Quick test - run this now!
TEST_CHAT_ID=j123abc node test-social-shares-quick.js

# Full test suite
node test-rich-content.js

# Run specific test
node test-rich-content.js social      # Social shares
node test-rich-content.js button      # With CTA button
node test-rich-content.js text        # Text only

# All examples
node example-social-shares.js j123abc
```

---

## Troubleshooting

### "Please set TEST_CHAT_ID"
**Fix:** Provide a valid chat ID via environment variable or edit the file

### "Invalid platform"  
**Fix:** Use only: `instagram`, `tiktok`, `youtube`, `vimeo`, `twitter`, `twitch`

### Message sends but no rich content
**Check:**
- Chat platform supports rich content (WhatsApp does)
- URLs are valid and accessible
- Check console for validation errors

---

## What's Different?

### Before (Text Only)
```javascript
await brandonEatsClient.sendMessage(chatId, 'Check out our content!');
```

### After (With Rich Content)
```javascript
// Still works the same way for text!
await brandonEatsClient.sendMessage(chatId, 'Hello!');

// Now you can also do this:
await brandonEatsClient.sendSocialShareMessage(
  chatId,
  'Check out our content!',
  [
    { platform: 'instagram', url: 'https://instagram.com/...' },
    { platform: 'tiktok', url: 'https://tiktok.com/...' }
  ]
);
```

**Fully backward compatible!** 🎉

---

## Ready to Go!

1. ✅ Client updated with rich content support
2. ✅ Test scripts ready
3. ✅ Examples provided
4. ✅ Documentation complete

**Run this now:**
```bash
TEST_CHAT_ID=your_chat_id node test-social-shares-quick.js
```

Then check WhatsApp to see your rich content! 📱✨

---

## Questions?

- 📖 Read `RICH_CONTENT_GUIDE.md` for detailed usage
- 🧪 Check test files for working examples  
- 📚 Look at `example-social-shares.js` for integration patterns
- 📋 See the Rich Messages Migration Guide for full API reference

**Happy coding!** 🚀

