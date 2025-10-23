# Webhook Message Deduplication

## Overview
The Brandon Eats webhook now includes message deduplication to prevent processing the same message multiple times if the webhook is called repeatedly.

## How It Works

### 1. Message ID Tracking
- Each incoming webhook includes a unique `message.id`
- Processed message IDs are stored in an in-memory Map
- Before processing, the webhook checks if the message ID has already been seen

### 2. Duplicate Detection
If a duplicate message is detected:
- The webhook immediately returns a success response
- No AI processing occurs
- No message is sent to A1Zap
- A log message indicates the duplicate was skipped

Response format for duplicates:
```json
{
  "success": true,
  "skipped": true,
  "reason": "duplicate_message",
  "messageId": "js74x8hz6n8dnb8wwbaw2cq8997t01hp"
}
```

### 3. Automatic Cleanup
- Message IDs are stored with timestamps
- Entries older than 5 minutes are automatically cleaned up
- Cleanup runs every 60 seconds
- This prevents memory buildup over time

## Why This Matters

Webhooks can be called multiple times for the same message due to:
1. **Network retries** - If the server is slow to respond, the webhook sender may retry
2. **Server restarts** - Nodemon restarts during development can cause retries
3. **Webhook configuration** - Some webhook systems retry on timeouts
4. **Race conditions** - Multiple webhook calls arriving simultaneously

Without deduplication, the bot would:
- ❌ Send multiple identical responses
- ❌ Waste AI API credits
- ❌ Confuse the user with duplicate messages

With deduplication:
- ✅ Only processes each message once
- ✅ Saves API costs
- ✅ Better user experience
- ✅ Faster responses to duplicate calls (immediate skip)

## Configuration

### Timing Constants
```javascript
const MESSAGE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
```
- Adjust this value to change how long message IDs are remembered
- Longer = more memory usage, better deduplication
- Shorter = less memory usage, risk of missing some duplicates

### Cleanup Interval
```javascript
setInterval(() => { /* cleanup */ }, 60 * 1000); // Every minute
```
- Adjust to change how often old entries are purged
- More frequent = more CPU usage, less memory usage
- Less frequent = less CPU usage, more memory usage

## Limitations

### In-Memory Storage
- Message IDs are stored in memory (not persisted to disk)
- If the server restarts, the deduplication cache is cleared
- This is usually fine since webhook retries happen within seconds

### Per-Instance Only
- Each server instance has its own deduplication cache
- If running multiple server instances (load balancing), you may need a shared cache (Redis, etc.)
- For single-instance deployments (like Replit), this works perfectly

## Testing

To test deduplication:
1. Send a message to the bot
2. Look for the log: `"message": { "id": "..." }`
3. If the webhook is called again with the same ID, you'll see:
   ```
   ⚠️  Duplicate message detected: [message_id] - skipping processing
   ```

## Future Enhancements

If needed, this could be upgraded to:
- Persistent storage (database/Redis) for multi-instance deployments
- Configurable expiry times per environment
- Metrics tracking (how many duplicates are prevented)
- Advanced retry detection (exponential backoff)

