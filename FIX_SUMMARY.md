# File Reference Error Fix - RESOLVED

## Problem
The Brandon Eats webhook was failing with the following error:

```
messages.10.content.0.document.source: Input tag 'file' found using 'type' does not match any of the expected tags: 'base64', 'content', 'text', 'url'
```

## Root Cause
According to the [official Anthropic Files API documentation](https://docs.claude.com/en/docs/build-with-claude/files#working-with-other-file-formats):

> **CSV files are NOT supported as `document` blocks**

The documentation explicitly states:
> "For file types that are not supported as `document` blocks (.csv, .txt, .md, .docx, .xlsx), convert the files to plain text, and include the content directly in your message"

The `document` block with `file_id` reference is ONLY supported for:
- PDF files (`application/pdf`)
- Plain text files with MIME type `text/plain`

Our `brandoneats.csv` file (MIME type: `text/csv`) cannot be referenced via the Files API document block format, which is why the API was rejecting it.

## Solution
Changed the implementation to follow the official docs recommendation for CSV files:

1. Read the CSV file content from disk (using the file registry's `originalPath`)
2. Include the content directly as text in the message
3. No special beta headers or document blocks needed for CSV files

### Implementation Details

**File:** `/Users/pasha/a1base/brandytest/services/claude-service.js`

Changed from:
```javascript
{
  type: 'document',
  source: {
    type: 'file',
    file_id: options.fileId
  }
}
```

To:
```javascript
const fileContent = fs.readFileSync(fileInfo.originalPath, 'utf-8');
content = `Here's the data file (${fileInfo.filename}):\n\n${fileContent}\n\n---\n\n${prompt}`;
```

## Files Modified

### 1. `/Users/pasha/a1base/brandytest/services/claude-service.js`
- **Lines 31-45**: Updated `generateText()` to read and include CSV content as text
- **Lines 77-95**: Updated `chat()` to read and include CSV content as text
- **Added**: `fs` and `path` imports for file reading

### 2. `/Users/pasha/a1base/brandytest/config.js`
- **Line 34**: Kept `betaHeaders: ['files-api-2025-04-14']` for future PDF/document support

### 3. `/Users/pasha/a1base/brandytest/webhooks/brandoneats-webhook.js`
- **Lines 74-78**: Added handling to skip complex content structures in message history

## How It Works Now

1. File is uploaded via Files API and stored in registry (keeps the `file_id` for reference)
2. When generating a response:
   - Look up file metadata using `file_id`
   - Read actual file content from `originalPath`
   - Include content directly in the message as plain text
3. Claude processes the CSV data as part of the message content

## Benefits of This Approach

- ✅ **Works reliably** - Uses the documented approach for CSV files
- ✅ **No beta limitations** - Doesn't rely on beta features for CSV handling
- ✅ **Full content access** - Claude gets the complete CSV data
- ✅ **Flexible** - Easy to format or preprocess CSV before sending
- ✅ **Future-proof** - Can easily switch to document blocks if/when CSV support is added

## Files API Usage Notes

The Files API upload is still useful for:
- Storing file metadata
- Managing multiple files
- Future use with PDFs and supported document types
- Potential use with code execution tool

For now, we read the original file from disk rather than downloading it back from the Files API.

## Testing

To verify the fix:
1. Send a message to the Brandon Eats bot
2. The bot should successfully process the message with the CSV data included
3. Claude will have access to the full restaurant/food data from the CSV
4. Check logs for any warnings or errors
