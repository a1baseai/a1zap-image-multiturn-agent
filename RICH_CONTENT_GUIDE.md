# 🎨 BrandyEats Rich Content Guide

## Overview

The BrandyEats agent now supports **rich content messages** using the A1Zap Rich Messages API. This allows you to send interactive social media embeds, buttons, polls, and more alongside your text messages.

## Quick Start - Social Shares

### The Social Share Blocks

Here are the three social share blocks ready to use:

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

## Testing

### Quick Test (Recommended)

Use the quick test script to send social shares immediately:

```bash
# Set your test chat ID and run
TEST_CHAT_ID=j123abc456def node test-social-shares-quick.js
```

Or edit `test-social-shares-quick.js` and set `TEST_CHAT_ID` at the top, then:

```bash
node test-social-shares-quick.js
```

### Full Test Suite

Run all tests including buttons, polls, and more:

```bash
# Edit test-rich-content.js and set TEST_CHAT_ID first
node test-rich-content.js

# Or run specific tests:
node test-rich-content.js social    # Social share blocks
node test-rich-content.js button    # Social shares + CTA button
node test-rich-content.js text      # Text only (backward compatibility)
```

## Using in Your Code

### Method 1: Using the sendMessage() method

```javascript
const brandonEatsClient = require('./services/brandoneats-client');

// Send message with rich content blocks
const result = await brandonEatsClient.sendMessage(
  chatId,
  'Check out our viral content!',
  [
    {
      type: 'social_share',
      data: {
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DQI4QE8jHiL/'
      },
      order: 0
    }
  ]
);
```

### Method 2: Using the helper method

```javascript
const brandonEatsClient = require('./services/brandoneats-client');

// Simpler syntax for social shares
const socialLinks = [
  { platform: 'instagram', url: 'https://www.instagram.com/reel/DQI4QE8jHiL/' },
  { platform: 'tiktok', url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144' },
  { platform: 'youtube', url: 'https://www.youtube.com/shorts/ToobPQS6_ZI' }
];

const result = await brandonEatsClient.sendSocialShareMessage(
  chatId,
  'Check out our latest content!',
  socialLinks
);
```

### Method 3: Text-only (backward compatible)

```javascript
// Still works exactly as before - no changes needed
const result = await brandonEatsClient.sendMessage(
  chatId,
  'This is a simple text message'
);
```

## Integration with BrandyEats Webhook

You can now use rich content in your webhook responses:

```javascript
// In webhooks/brandoneats-webhook.js
const brandonEatsClient = require('../services/brandoneats-client');

// When responding to a user query about social content
const socialLinks = [
  { platform: 'instagram', url: 'https://www.instagram.com/reel/DQI4QE8jHiL/' },
  { platform: 'tiktok', url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144' }
];

await brandonEatsClient.sendSocialShareMessage(
  chatId,
  '🔥 Here are our most popular posts this week!',
  socialLinks
);
```

## Supported Rich Content Types

The A1Zap Rich Messages API supports 17+ content types:

### Social Media
- `social_share` - Instagram, TikTok, YouTube, Vimeo, Twitter, Twitch

### Interactive
- `button_card` - Call-to-action buttons
- `quick_replies` - Fast response options
- `poll` - Interactive voting/surveys

### Media
- `carousel` - Image sliders
- `gallery` - Image grids

### Cards
- `product_card` - E-commerce items
- `event_card` - Event information
- `profile_card` - User profiles
- `location_card` - Geographic locations
- `contact_card` - Contact details
- `link_preview` - URL previews

See the full Rich Messages Migration Guide for details on all types.

## Example: Social Shares + CTA Button

Combine multiple content types for powerful messages:

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
  // TikTok embed
  {
    type: 'social_share',
    data: {
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@brandneweats/video/7546112444503035144'
    },
    order: 1
  },
  // Call-to-action button
  {
    type: 'button_card',
    data: {
      title: 'Love what you see?',
      description: 'Follow us for more delicious content!',
      buttons: [
        {
          id: 'btn_follow_ig',
          label: '📸 Follow on Instagram',
          action: 'url',
          value: 'https://www.instagram.com/brandneweats',
          variant: 'primary'
        },
        {
          id: 'btn_follow_tiktok',
          label: '🎵 Follow on TikTok',
          action: 'url',
          value: 'https://www.tiktok.com/@brandneweats',
          variant: 'secondary'
        }
      ]
    },
    order: 2
  }
];

await brandonEatsClient.sendMessage(
  chatId,
  '🍕 Check out our viral content!',
  richContentBlocks
);
```

## Validation

The API validates all rich content blocks. Common errors:

### Invalid Platform
```javascript
// ❌ Wrong
{ platform: 'facebook', url: '...' }

// ✅ Correct
{ platform: 'instagram', url: '...' }  // Must be: instagram, tiktok, youtube, vimeo, twitter, or twitch
```

### Missing Required Fields
```javascript
// ❌ Wrong
{
  type: 'button_card',
  data: {
    buttons: [...]  // Missing 'title' field
  }
}

// ✅ Correct
{
  type: 'button_card',
  data: {
    title: 'Choose an option',
    buttons: [...]
  }
}
```

### Duplicate IDs
```javascript
// ❌ Wrong
buttons: [
  { id: 'btn_1', label: 'Option 1' },
  { id: 'btn_1', label: 'Option 2' }  // Duplicate ID!
]

// ✅ Correct
buttons: [
  { id: 'btn_1', label: 'Option 1' },
  { id: 'btn_2', label: 'Option 2' }
]
```

## Limits

- **Maximum blocks per message:** 10
- **Maximum buttons per card:** 6
- **Maximum poll options:** 10
- **Maximum carousel items:** 10
- **Maximum gallery items:** 20
- **Maximum quick replies:** 12

## Files

- **`services/brandoneats-client.js`** - Updated client with rich content support
- **`test-social-shares-quick.js`** - Quick test script for social shares
- **`test-rich-content.js`** - Full test suite with all examples
- **`RICH_CONTENT_GUIDE.md`** - This guide

## API Reference

### sendMessage(chatId, content, richContentBlocks)

Send a message with optional rich content blocks.

**Parameters:**
- `chatId` (string) - The chat ID to send to
- `content` (string) - The text message content
- `richContentBlocks` (Array, optional) - Array of rich content block objects

**Returns:** Promise<Object> - API response with messageId and timestamp

**Example:**
```javascript
const result = await brandonEatsClient.sendMessage(
  'j123abc456def',
  'Hello!',
  [{ type: 'social_share', data: { platform: 'instagram', url: '...' }, order: 0 }]
);
```

### sendSocialShareMessage(chatId, content, socialLinks)

Helper method for sending social media embeds.

**Parameters:**
- `chatId` (string) - The chat ID to send to
- `content` (string) - The text message content
- `socialLinks` (Array) - Array of `{ platform, url }` objects

**Returns:** Promise<Object> - API response

**Example:**
```javascript
const result = await brandonEatsClient.sendSocialShareMessage(
  'j123abc456def',
  'Check this out!',
  [
    { platform: 'instagram', url: 'https://www.instagram.com/reel/...' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@user/video/...' }
  ]
);
```

## Need Help?

- Check the full Rich Messages Migration Guide in your documentation
- Look at the test files for working examples
- Check console output for detailed error messages and validation errors

## Next Steps

1. Get a test chat ID from A1Zap
2. Run `TEST_CHAT_ID=your_chat_id node test-social-shares-quick.js`
3. Check WhatsApp to see your rich content!
4. Integrate into your webhook handlers
5. Experiment with other content types (buttons, polls, carousels)

🎉 Happy coding!

