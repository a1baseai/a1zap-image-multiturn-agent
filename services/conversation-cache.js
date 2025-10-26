/**
 * Conversation Cache Service
 * 
 * Stores recent images and makeup requests per chat to handle cases where:
 * 1. Message history API is unavailable or slow
 * 2. Users send images after text requests
 * 3. Users reference previous images/styles
 * 
 * This provides a fallback when the A1Zap history API fails or doesn't include media.
 */

// In-memory cache: chatId -> { images: [], requests: [] }
const conversationCache = new Map();

// Cache settings
const MAX_IMAGES_PER_CHAT = 5;  // Store last 5 images
const MAX_REQUESTS_PER_CHAT = 10;  // Store last 10 makeup requests
const CACHE_EXPIRY_MS = 30 * 60 * 1000;  // 30 minutes

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [chatId, cache] of conversationCache.entries()) {
    if (cache.lastActivity && (now - cache.lastActivity > CACHE_EXPIRY_MS)) {
      conversationCache.delete(chatId);
      console.log(`🗑️  Expired conversation cache for chat: ${chatId}`);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

/**
 * Get or create cache for a chat
 * @param {string} chatId - The chat ID
 * @returns {Object} - Cache object with images and requests arrays
 */
function getOrCreateCache(chatId) {
  if (!conversationCache.has(chatId)) {
    conversationCache.set(chatId, {
      images: [],
      requests: [],
      lastActivity: Date.now()
    });
  }
  return conversationCache.get(chatId);
}

/**
 * Store an image in the cache
 * @param {string} chatId - The chat ID
 * @param {string} imageUrl - The image URL
 * @param {string} userMessage - Optional associated message
 */
function storeImage(chatId, imageUrl, userMessage = null) {
  const cache = getOrCreateCache(chatId);
  
  cache.images.push({
    url: imageUrl,
    message: userMessage,
    timestamp: Date.now()
  });
  
  // Keep only the last N images
  if (cache.images.length > MAX_IMAGES_PER_CHAT) {
    cache.images.shift();
  }
  
  cache.lastActivity = Date.now();
  
  console.log(`💾 Cached image for chat ${chatId} (total: ${cache.images.length})`);
}

/**
 * Store a makeup request in the cache
 * @param {string} chatId - The chat ID
 * @param {string} request - The makeup request text
 */
function storeRequest(chatId, request) {
  const cache = getOrCreateCache(chatId);
  
  // Filter out trivial messages
  const lowerRequest = request.toLowerCase();
  const isTrivial = 
    request.length < 3 ||
    lowerRequest === 'yes' ||
    lowerRequest === 'no' ||
    lowerRequest === 'ok' ||
    lowerRequest === 'okay' ||
    request === '[Image]';
  
  if (isTrivial) {
    return; // Don't cache trivial messages
  }
  
  cache.requests.push({
    text: request,
    timestamp: Date.now()
  });
  
  // Keep only the last N requests
  if (cache.requests.length > MAX_REQUESTS_PER_CHAT) {
    cache.requests.shift();
  }
  
  cache.lastActivity = Date.now();
  
  console.log(`💾 Cached makeup request for chat ${chatId}: "${request.substring(0, 50)}..."`);
}

/**
 * Get the most recent image from cache
 * @param {string} chatId - The chat ID
 * @param {number} lookbackLimit - How many images to consider (default: 5)
 * @returns {string|null} - Most recent image URL or null
 */
function getRecentImage(chatId, lookbackLimit = 5) {
  const cache = conversationCache.get(chatId);
  if (!cache || cache.images.length === 0) {
    return null;
  }
  
  const recentImages = cache.images.slice(-lookbackLimit);
  if (recentImages.length > 0) {
    const mostRecent = recentImages[recentImages.length - 1];
    console.log(`💾 Retrieved cached image from ${cache.images.length - cache.images.indexOf(mostRecent)} image(s) ago`);
    return mostRecent.url;
  }
  
  return null;
}

/**
 * Get the most recent makeup request from cache
 * @param {string} chatId - The chat ID
 * @param {number} lookbackLimit - How many requests to consider (default: 5)
 * @returns {string|null} - Most recent request text or null
 */
function getRecentRequest(chatId, lookbackLimit = 5) {
  const cache = conversationCache.get(chatId);
  if (!cache || cache.requests.length === 0) {
    return null;
  }
  
  const recentRequests = cache.requests.slice(-lookbackLimit);
  if (recentRequests.length > 0) {
    const mostRecent = recentRequests[recentRequests.length - 1];
    console.log(`💾 Retrieved cached request: "${mostRecent.text.substring(0, 50)}..."`);
    return mostRecent.text;
  }
  
  return null;
}

/**
 * Get all recent images and requests for a chat
 * @param {string} chatId - The chat ID
 * @returns {Object} - { images: [], requests: [] }
 */
function getChatContext(chatId) {
  const cache = conversationCache.get(chatId);
  if (!cache) {
    return { images: [], requests: [] };
  }
  
  return {
    images: [...cache.images],
    requests: [...cache.requests]
  };
}

/**
 * Clear cache for a specific chat
 * @param {string} chatId - The chat ID
 */
function clearChatCache(chatId) {
  conversationCache.delete(chatId);
  console.log(`🗑️  Cleared cache for chat: ${chatId}`);
}

/**
 * Get cache statistics
 * @returns {Object} - Stats about the cache
 */
function getCacheStats() {
  let totalImages = 0;
  let totalRequests = 0;
  
  for (const cache of conversationCache.values()) {
    totalImages += cache.images.length;
    totalRequests += cache.requests.length;
  }
  
  return {
    totalChats: conversationCache.size,
    totalImages,
    totalRequests,
    expiryMs: CACHE_EXPIRY_MS
  };
}

module.exports = {
  storeImage,
  storeRequest,
  getRecentImage,
  getRecentRequest,
  getChatContext,
  clearChatCache,
  getCacheStats
};

