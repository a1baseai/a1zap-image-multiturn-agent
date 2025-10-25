const fs = require('fs').promises;
const path = require('path');
const claudeService = require('./claude-service');

/**
 * Social Link Extractor Service
 * Parses CSV file and uses Claude AI to intelligently match restaurants mentioned
 * in responses to their TikTok/social media links
 */

class SocialLinkExtractor {
  constructor() {
    this.socialLinksCache = null;
    this.csvPath = path.join(__dirname, '../files/brandoneats.csv');
  }

  /**
   * Parse CSV line handling quoted fields with commas
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Load and parse the Brandon Eats CSV file
   * Returns array of objects with name, type, city, tiktokLink, transcript, available
   */
  async loadSocialLinks() {
    try {
      // Return cached data if available
      if (this.socialLinksCache) {
        return this.socialLinksCache;
      }

      console.log('📊 Loading social links from CSV...');
      const csvContent = await fs.readFile(this.csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        console.warn('⚠️  CSV file is empty');
        return [];
      }

      // Parse header
      const header = this.parseCSVLine(lines[0]);
      console.log('CSV Headers:', header);

      // Parse data rows
      const socialLinks = [];
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        
        // Skip if not enough columns or no TikTok link
        if (values.length < 4 || !values[3] || !values[3].startsWith('http')) {
          continue;
        }

        socialLinks.push({
          name: values[0] || '',
          type: values[1] || '',
          city: values[2] || '',
          tiktokLink: values[3] || '',
          transcript: values[4] || '',
          available: values[5] || ''
        });
      }

      console.log(`✅ Loaded ${socialLinks.length} social links from CSV`);
      
      // Cache the results
      this.socialLinksCache = socialLinks;
      return socialLinks;

    } catch (error) {
      console.error('❌ Error loading social links:', error.message);
      return [];
    }
  }

  /**
   * Use Claude AI to intelligently detect which restaurants/places from the CSV
   * are actually mentioned in the bot's response.
   * 
   * This is Stage 2B of the social link filtering process (Stage 2A happens in webhook).
   * 
   * How it works:
   * 1. Takes the bot's response and the list of all restaurants from the CSV
   * 2. Uses Claude AI to analyze which restaurants are ACTUALLY DISCUSSED (not just mentioned)
   * 3. Returns only restaurants that are key subjects of the response
   * 
   * The AI is trained to be strict:
   * - "You should try Pho 24" → Include "Pho 24" ✓
   * - "Brandon has reviewed many places" → Return empty array (no specific place) ✗
   * - "What would you like to know?" → Return empty array (clarification) ✗
   * 
   * @param {string} responseText - The text response from the bot
   * @param {Array} allLinks - Array of all social link objects from CSV
   * @returns {Object} - Object with mentionedNames array and suggestAlternatives boolean
   */
  async detectMentionedRestaurants(responseText, allLinks) {
    try {
      if (!allLinks || allLinks.length === 0) {
        return { mentionedNames: [], suggestAlternatives: false };
      }

      // Extract just the names for Claude to analyze
      const restaurantNames = allLinks.map(link => link.name).filter(name => name);
      
      if (restaurantNames.length === 0) {
        return { mentionedNames: [], suggestAlternatives: false };
      }

      console.log('🤖 Using Claude to detect mentioned restaurants...');

      // Create a prompt for Claude to analyze
      const analysisPrompt = `You are analyzing a response about restaurants and places in Vietnam.

RESPONSE TEXT:
${responseText}

AVAILABLE RESTAURANT/PLACE NAMES:
${restaurantNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Task: Analyze this response and provide two pieces of information:

1. Which restaurants/places are ACTUALLY DISCUSSED OR RECOMMENDED?
2. Does the response say "I don't have what you're looking for" but could benefit from suggesting alternatives?

Rules for MENTIONED restaurants:
- ONLY include names that are specifically mentioned, discussed, or recommended
- The restaurant/place must be a key subject of the response, not just a passing mention
- Match names even if slightly misspelled or abbreviated in the response
- DO NOT include names from generic statements

Rules for SUGGESTING ALTERNATIVES:
- If the response says something like "Brandon doesn't cover that type of place" or "I don't have high-end restaurants"
- BUT there ARE potentially relevant alternatives in the data that could be helpful
- Set this to true so we can suggest related options with context

Format your response as:
MENTIONED: [list restaurant names, one per line, or "NONE"]
SUGGEST_ALTERNATIVES: [YES or NO]

Examples:
- "Brandon loved the pho at Pho 24" 
  MENTIONED: Pho 24
  SUGGEST_ALTERNATIVES: NO

- "You should try Banh Mi 25"
  MENTIONED: Banh Mi 25
  SUGGEST_ALTERNATIVES: NO

- "Brandon doesn't cover high-end fine dining, he focuses on street food"
  MENTIONED: NONE
  SUGGEST_ALTERNATIVES: YES

- "What restaurants do you want to know about?"
  MENTIONED: NONE
  SUGGEST_ALTERNATIVES: NO

- "I can help you find information"
  MENTIONED: NONE
  SUGGEST_ALTERNATIVES: NO

Analyze the response above:`;

      // Call Claude for analysis
      const claudeResponse = await claudeService.generateText(analysisPrompt, {
        temperature: 0.3, // Lower temperature for more consistent extraction
        maxTokens: 500
      });

      // Parse Claude's response
      const lines = claudeResponse.split('\n').map(line => line.trim());
      
      // Extract mentioned restaurants
      const mentionedSection = [];
      let inMentioned = false;
      let suggestAlternatives = false;
      
      for (const line of lines) {
        if (line.startsWith('MENTIONED:')) {
          inMentioned = true;
          const restOfLine = line.replace('MENTIONED:', '').trim();
          if (restOfLine && restOfLine !== 'NONE') {
            mentionedSection.push(restOfLine);
          }
        } else if (line.startsWith('SUGGEST_ALTERNATIVES:')) {
          inMentioned = false;
          suggestAlternatives = line.includes('YES');
        } else if (inMentioned && line && line !== 'NONE') {
          mentionedSection.push(line);
        }
      }
      
      // Filter to only valid restaurant names
      const mentionedNames = mentionedSection.filter(name => restaurantNames.includes(name));

      console.log(`✅ Claude identified ${mentionedNames.length} mentioned restaurants:`, mentionedNames);
      console.log(`   Suggest alternatives: ${suggestAlternatives}`);
      
      return { mentionedNames, suggestAlternatives };

    } catch (error) {
      console.error('❌ Error detecting mentioned restaurants:', error.message);
      return { mentionedNames: [], suggestAlternatives: false };
    }
  }

  /**
   * Find alternative suggestions when the exact request can't be fulfilled
   * For example: user asks for "$100+ restaurants" but Brandon only covers street food
   * This method finds the closest alternatives that might still be helpful
   * 
   * @param {string} responseText - The bot's response explaining the limitation
   * @param {Array} allLinks - All available restaurants
   * @returns {Object} - Object with alternatives array and contextMessage string
   */
  async findAlternativeSuggestions(responseText, allLinks) {
    try {
      console.log('🔍 Finding alternative suggestions for unmet request...');

      const alternativePrompt = `A user asked for restaurant recommendations, but the response indicates Brandon doesn't cover that exact type.

RESPONSE TEXT:
${responseText}

AVAILABLE RESTAURANTS:
${allLinks.slice(0, 50).map((link, i) => `${i + 1}. ${link.name} (${link.type}, ${link.city})`).join('\n')}

Task: Suggest 2-3 restaurants from the list that are the CLOSEST match to what the user wanted, even if not perfect.

Also write a short context message (1 sentence) explaining why these alternatives might still be relevant.

Rules:
- Pick restaurants that are as close as possible to the user's request
- Prioritize quality, popular spots, or interesting alternatives
- If the user wanted "high-end" but we only have street food, suggest the nicest street food spots
- If the user wanted a specific cuisine we don't have, suggest similar cuisines

Format your response as:
CONTEXT: [One sentence explaining why these alternatives are suggested]
ALTERNATIVES:
[Restaurant name 1]
[Restaurant name 2]
[Restaurant name 3]

Example:
CONTEXT: These are Brandon's most upscale dining spots, though they're still casual and under $50
ALTERNATIVES:
Restaurant A
Restaurant B
Restaurant C

Analyze and suggest:`;

      const claudeResponse = await claudeService.generateText(alternativePrompt, {
        temperature: 0.4,
        maxTokens: 500
      });

      // Parse response
      const lines = claudeResponse.split('\n').map(line => line.trim());
      let contextMessage = '';
      const alternativeNames = [];
      let inAlternatives = false;

      for (const line of lines) {
        if (line.startsWith('CONTEXT:')) {
          contextMessage = line.replace('CONTEXT:', '').trim();
        } else if (line.startsWith('ALTERNATIVES:')) {
          inAlternatives = true;
        } else if (inAlternatives && line) {
          // Extract restaurant name (might have number prefix)
          const cleanName = line.replace(/^\d+\.\s*/, '').trim();
          if (cleanName) {
            alternativeNames.push(cleanName);
          }
        }
      }

      // Find matching restaurants from allLinks
      const alternatives = allLinks
        .filter(link => alternativeNames.some(name => link.name.includes(name) || name.includes(link.name)))
        .slice(0, 3); // Limit to 3

      console.log(`✅ Found ${alternatives.length} alternative suggestions`);
      console.log(`   Context: ${contextMessage}`);

      return {
        alternatives,
        contextMessage: contextMessage || "Here are some related places Brandon has reviewed that might interest you"
      };

    } catch (error) {
      console.error('❌ Error finding alternative suggestions:', error.message);
      return { alternatives: [], contextMessage: '' };
    }
  }

  /**
   * Extract relevant social links based on the bot's response
   * Uses Claude AI to intelligently match mentioned restaurants
   * 
   * @param {string} responseText - The bot's response text
   * @returns {Array} - Array of relevant social link objects with name, url, and optional contextMessage
   */
  async extractRelevantSocialLinks(responseText) {
    try {
      if (!responseText || typeof responseText !== 'string') {
        return [];
      }

      // Load all social links from CSV
      const allLinks = await this.loadSocialLinks();
      
      if (allLinks.length === 0) {
        console.log('ℹ️  No social links available in CSV');
        return [];
      }

      // Use Claude to detect which restaurants are mentioned and if we should suggest alternatives
      const { mentionedNames, suggestAlternatives } = await this.detectMentionedRestaurants(responseText, allLinks);

      // If no restaurants mentioned but we should suggest alternatives
      if (mentionedNames.length === 0 && suggestAlternatives) {
        console.log('💡 No specific restaurants mentioned, but suggesting relevant alternatives...');
        const { alternatives, contextMessage } = await this.findAlternativeSuggestions(responseText, allLinks);
        
        if (alternatives.length > 0) {
          const alternativeLinks = alternatives
            .map(link => ({
              name: link.name,
              url: link.tiktokLink,
              type: link.type,
              city: link.city,
              contextMessage // Add context to explain why we're showing these
            }))
            .filter(link => link.url);

          console.log(`✅ Found ${alternativeLinks.length} relevant alternatives to suggest`);
          return alternativeLinks;
        }
      }

      if (mentionedNames.length === 0) {
        console.log('ℹ️  No restaurants mentioned in response');
        return [];
      }

      // Find the corresponding links for mentioned restaurants
      const relevantLinks = allLinks
        .filter(link => mentionedNames.includes(link.name))
        .map(link => ({
          name: link.name,
          url: link.tiktokLink,
          type: link.type,
          city: link.city
        }))
        .filter(link => link.url); // Ensure URL exists

      // Deduplicate by URL - keep only the first occurrence of each unique URL
      const seenUrls = new Set();
      const uniqueLinks = relevantLinks.filter(link => {
        if (seenUrls.has(link.url)) {
          console.log(`   ℹ️  Skipping duplicate URL for ${link.name}: ${link.url}`);
          return false;
        }
        seenUrls.add(link.url);
        return true;
      });

      // Limit to max 5 links to avoid overwhelming the user
      const limitedLinks = uniqueLinks.slice(0, 5);

      if (limitedLinks.length > 0) {
        console.log(`✅ Found ${limitedLinks.length} relevant social links`);
        limitedLinks.forEach(link => {
          console.log(`   - ${link.name}: ${link.url}`);
        });
      }

      return limitedLinks;

    } catch (error) {
      console.error('❌ Error extracting relevant social links:', error.message);
      return [];
    }
  }

  /**
   * Clear the cache (useful for testing or when CSV is updated)
   */
  clearCache() {
    this.socialLinksCache = null;
    console.log('🗑️  Social links cache cleared');
  }
}

// Export singleton instance
module.exports = new SocialLinkExtractor();

