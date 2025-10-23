const axios = require('axios');
const config = require('../config');

/**
 * Brandon Eats specific A1Zap client
 * Uses dedicated API credentials for the Brandon Eats agent
 */
class BrandonEatsClient {
  constructor() {
    this.apiKey = config.brandonEats.apiKey;
    this.agentId = config.brandonEats.agentId;
    this.apiUrl = config.brandonEats.apiUrl;

    console.log('🍕 Brandon Eats Client initialized');
    console.log(`   Agent ID: ${this.agentId}`);
    console.log(`   API URL: ${this.apiUrl}`);
  }

  /**
   * Send a text message to A1Zap for Brandon Eats agent
   * @param {string} chatId - Chat ID to send message to
   * @param {string} content - Message content
   * @param {Array} richContentBlocks - Optional rich content blocks (social shares, buttons, etc.)
   * @returns {Promise<Object>} API response
   */
  async sendMessage(chatId, content, richContentBlocks = null) {
    try {
      const url = `${this.apiUrl}/${this.agentId}/send`;

      console.log(`📤 Sending Brandon Eats response to chat ${chatId}`);
      console.log(`   URL: ${url}`);
      if (richContentBlocks) {
        console.log(`   Rich Content Blocks: ${richContentBlocks.length} blocks`);
      }

      const payload = {
        chatId,
        content,
        metadata: {
          source: 'brandoneats-agent',
          agent: 'Brandon Eats Assistant'
        }
      };

      // Add rich content blocks if provided
      if (richContentBlocks && richContentBlocks.length > 0) {
        payload.richContentBlocks = richContentBlocks;
      }

      const response = await axios.post(
        url,
        payload,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Brandon Eats message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending Brandon Eats message to A1Zap:', error.response?.data || error.message);
      if (error.response?.data?.validationErrors) {
        console.error('   Validation Errors:', JSON.stringify(error.response.data.validationErrors, null, 2));
      }
      throw error;
    }
  }

  /**
   * Get message history for a chat
   * @param {string} chatId - Chat ID
   * @param {number} limit - Number of messages to retrieve (default: 20)
   * @returns {Promise<Array>} Array of messages
   */
  async getMessageHistory(chatId, limit = 20) {
    try {
      const url = `${this.apiUrl}/${this.agentId}/chat/${chatId}?limit=${limit}`;

      console.log(`📥 Fetching Brandon Eats message history for chat ${chatId}`);

      const response = await axios.get(url, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      console.log(`✅ Retrieved ${response.data.messages?.length || 0} messages`);
      return response.data.messages || [];
    } catch (error) {
      console.error('❌ Error fetching Brandon Eats message history:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Send a message with social share blocks
   * Helper method for easily sending social media embeds
   * @param {string} chatId - Chat ID to send message to
   * @param {string} content - Message content
   * @param {Array<{platform: string, url: string}>} socialLinks - Array of social media links
   * @returns {Promise<Object>} API response
   */
  async sendSocialShareMessage(chatId, content, socialLinks) {
    const richContentBlocks = socialLinks.map((link, index) => ({
      type: 'social_share',
      data: {
        platform: link.platform,
        url: link.url
      },
      order: index
    }));

    return this.sendMessage(chatId, content, richContentBlocks);
  }

  /**
   * Get the agent configuration details
   * @returns {Object} Agent configuration
   */
  getConfig() {
    return {
      agentId: this.agentId,
      apiUrl: this.apiUrl,
      hasApiKey: !!this.apiKey && !this.apiKey.includes('your_')
    };
  }
}

module.exports = new BrandonEatsClient();

