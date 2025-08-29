/**
 * CyberGuard AI Chatbot Configuration
 * 
 * IMPORTANT: Replace YOUR_GEMINI_API_KEY_HERE with your actual Google Gemini API key
 * 
 * To get your API key:
 * 1. Visit https://makersuite.google.com/app/apikey
 * 2. Sign in with your Google account
 * 3. Create a new API key
 * 4. Replace the placeholder below with your actual key
 */

const CYBERGUARD_CONFIG = {
    // Replace this with your actual Gemini API key
    GEMINI_API_KEY: 'AIzaSyCEQ4yPSWL-_Tb-eHMEnMHSbC7LYEu4n68',	

    
    // API Configuration
    API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    
    // Model Configuration
    MODEL_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    },
    
    // Safety Settings
    SAFETY_SETTINGS: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
    ],
    
    // Chatbot Settings
    CHATBOT_SETTINGS: {
        maxConversationHistory: 10,
        typingDelay: 100,
        autoSaveInterval: 30000, // 30 seconds
        welcomeMessage: "👋 Hello! I'm your CyberGuard AI Assistant. I'm here to help you with cybersecurity questions, threat analysis, and security best practices. How can I assist you today?"
    }
};

// Validate configuration
if (CYBERGUARD_CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('⚠️ CONFIGURATION WARNING: Gemini API key not configured. Please update js/config.js with your actual API key.');
}

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CYBERGUARD_CONFIG;
}