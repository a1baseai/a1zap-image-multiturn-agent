/**
 * Example script to upload a file to Claude's Files API
 * 
 * Usage:
 *   node example-upload.js /path/to/your/file.pdf
 * 
 * This will upload the file and set it as the base file for all Claude agent responses.
 */

const { uploadFileToClaude, getBaseFileInfo } = require('./services/file-upload');
const path = require('path');

async function main() {
  // Get file path from command line argument
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('\n❌ Please provide a file path as an argument');
    console.log('\nUsage:');
    console.log('  node example-upload.js /path/to/your/file.pdf\n');
    console.log('Supported file types: PDF, TXT, CSV, JSON, MD, HTML, XML\n');
    process.exit(1);
  }

  // Resolve to absolute path
  const absolutePath = path.resolve(filePath);

  console.log('\n📤 Starting file upload...');
  console.log(`File: ${absolutePath}\n`);

  try {
    // Upload the file and set as base file
    const result = await uploadFileToClaude(absolutePath, {
      setAsBase: true
    });

    console.log('\n✅ SUCCESS! File uploaded and set as base file.');
    console.log('\nFile Details:');
    console.log(`  ID: ${result.fileId}`);
    console.log(`  Name: ${result.filename}`);
    console.log(`  Type: ${result.mimeType}`);
    console.log(`  Size: ${result.sizeBytes} bytes`);
    console.log(`  Uploaded: ${result.uploadedAt}`);

    console.log('\n🤖 Your Claude agent will now reference this file in all responses!');
    console.log('\nNext steps:');
    console.log('  1. Configure A1Zap webhook: POST /webhook/claude');
    console.log('  2. Start chatting with your agent');
    console.log('  3. Ask questions about the document\n');

    // Show current base file
    const baseFile = getBaseFileInfo();
    if (baseFile) {
      console.log('📄 Current base file:', baseFile.filename);
    }

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  - Check that the file exists');
    console.log('  - Verify file type is supported (PDF, TXT, CSV, JSON, MD, HTML, XML)');
    console.log('  - Ensure CLAUDE_API_KEY is set in environment variables');
    console.log('  - Check file size (Claude has limits on file size)\n');
    process.exit(1);
  }
}

// Run the script
main();

