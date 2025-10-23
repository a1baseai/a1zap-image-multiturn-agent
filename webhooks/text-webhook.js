const geminiService = require('../services/gemini-service');
const a1zapClient = require('../services/a1zap-client');
const pokerCoach = require('../agents/poker-coach');

/**
 * Text webhook handler
 * Example: Ace Poker Coach
 */
async function textWebhookHandler(req, res) {
  try {
    console.log('\n=== Text Webhook Received ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Extract webhook data
    const { chat, message, agent } = req.body;

    if (!chat?.id) {
      return res.status(400).json({
        success: false,
        error: 'Missing chat.id in webhook payload'
      });
    }

    if (!message?.content) {
      return res.status(400).json({
        success: false,
        error: 'Missing message.content in webhook payload'
      });
    }

    const chatId = chat.id;
    const agentId = agent?.id;
    const userMessage = message.content;

    console.log(`Processing message from chat ${chatId}: "${userMessage}"`);

    // Build conversation array starting with system prompt
    const conversation = [];

    // Fetch message history (last 10 messages like OpenAI version)
    let messageHistory = [];
    if (chatId && agentId) {
      try {
        console.log('Fetching message history for chatId:', chatId);
        const history = await a1zapClient.getMessageHistory(chatId, 10);

        if (history && history.length > 0) {
          messageHistory = history;
          console.log(`Retrieved ${messageHistory.length} messages from history`);

          // Convert message history to conversation format
          messageHistory.forEach(msg => {
            if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
              const role = msg.isAgent || msg.senderId === agentId ? 'assistant' : 'user';
              const content = msg.senderName && !msg.isAgent
                ? `${msg.senderName}: ${msg.content}`
                : msg.content;

              conversation.push({
                role: role,
                content: String(content)
              });
            }
          });
        }
      } catch (error) {
        console.warn('Failed to fetch message history:', error.message);
        // Continue without history - don't fail the entire request
      }
    }

    // Add the current message to conversation
    conversation.push({ role: 'user', content: String(userMessage) });

    // Generate response using Gemini with conversation context
    console.log('Generating response with Gemini...');
    const response = conversation.length > 1
      ? await geminiService.chat(conversation, {
          ...pokerCoach.generationOptions,
          systemInstruction: pokerCoach.systemPrompt
        })
      : await geminiService.generateText(
          `${pokerCoach.systemPrompt}\n\nUser: ${userMessage}\n\nAdvice:`,
          pokerCoach.generationOptions
        );

    console.log('Generated response:', response);

    // Send response back to A1Zap (skip for test chats)
    let sendResult = null;
    if (!chatId.startsWith('test-')) {
      try {
        sendResult = await a1zapClient.sendMessage(chatId, response);
      } catch (sendError) {
        console.error('Failed to send message to A1Zap:', sendError.message);
        // Don't fail the request if sending fails
      }
    } else {
      console.log('⚠️  Test mode: Skipping A1Zap send');
    }

    // Return success
    res.json({
      success: true,
      agent: pokerCoach.name,
      response: response,
      testMode: chatId.startsWith('test-')
    });

  } catch (error) {
    console.error('\n=== Text Webhook Error ===');
    console.error('Error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = textWebhookHandler;
