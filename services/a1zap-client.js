const axios = require('axios');
const config = require('../config');

class A1ZapClient {
  constructor() {
    this.apiKey = config.a1zap.apiKey;
    this.agentId = config.a1zap.agentId;
    this.apiUrl = config.a1zap.apiUrl;
  }

  /**
   * Send a text message to A1Zap
   * @param {string} chatId - Chat ID to send message to
   * @param {string} content - Message content
   * @returns {Promise<Object>} API response
   */
  async sendMessage(chatId, content) {
    try {
      const url = `${this.apiUrl}/${this.agentId}/send`;

      const response = await axios.post(
        url,
        {
          chatId,
          content,
          metadata: {
            source: 'gemini-webhook-agent'
          }
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Message sent to A1Zap:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending message to A1Zap:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a message with media (image) to A1Zap
   * @param {string} chatId - Chat ID to send message to
   * @param {string} content - Message content
   * @param {string} mediaUrl - URL of the media to send
   * @returns {Promise<Object>} API response
   */
  async sendMediaMessage(chatId, content, mediaUrl) {
    try {
      const url = `${this.apiUrl}/${this.agentId}/send`;

      const response = await axios.post(
        url,
        {
          chatId,
          content,
          media: {
            url: mediaUrl,
            contentType: 'image/png'
          },
          metadata: {
            source: 'gemini-webhook-agent',
            messageType: 'image'
          }
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Media message sent to A1Zap:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending media message to A1Zap:', error.response?.data || error.message);
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

      const response = await axios.get(url, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      return response.data.messages || [];
    } catch (error) {
      console.error('❌ Error fetching message history:', error.response?.data || error.message);
      return [];
    }
  }
}

module.exports = new A1ZapClient();
