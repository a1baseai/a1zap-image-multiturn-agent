const geminiService = require('../services/gemini-service');
const a1zapClient = require('../services/a1zap-client');
const logoDesigner = require('../agents/logo-designer');

/**
 * Image webhook handler
 * Example: Team Logo Designer
 */
async function imageWebhookHandler(req, res) {
  try {
    console.log('\n=== Image Webhook Received ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Extract webhook data
    const { chat, message } = req.body;

    if (!chat?.id) {
      return res.status(400).json({
        success: false,
        error: 'Missing chat.id in webhook payload'
      });
    }

    if (!message?.media?.url) {
      return res.status(400).json({
        success: false,
        error: 'Missing message.media.url in webhook payload'
      });
    }

    const chatId = chat.id;
    const imageUrl = message.media.url;
    const userMessage = message.content || 'Please analyze this image and suggest logo designs.';

    console.log(`Processing image from chat ${chatId}`);
    console.log(`Image URL: ${imageUrl}`);
    console.log(`User message: "${userMessage}"`);

    // Build analysis prompt
    const analysisPrompt = logoDesigner.imageAnalysisPrompt(userMessage);

    // Analyze image using Gemini
    console.log('Analyzing image with Gemini...');
    const response = await geminiService.analyzeImage(
      imageUrl,
      analysisPrompt,
      logoDesigner.generationOptions
    );

    console.log('Generated response:', response);

    // Send response back to A1Zap
    await a1zapClient.sendMessage(chatId, response);

    // Return success
    res.json({
      success: true,
      agent: logoDesigner.name,
      response: response
    });

  } catch (error) {
    console.error('\n=== Image Webhook Error ===');
    console.error('Error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = imageWebhookHandler;
