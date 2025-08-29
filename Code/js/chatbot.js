/**
 * CyberGuard AI Chatbot - Powered by Google Gemini
 * Real-time cybersecurity threat guidance and assistance
 */

class CyberGuardChatbot {
    constructor() {
        // Use API key from configuration
        this.apiKey = CYBERGUARD_CONFIG.GEMINI_API_KEY;
        this.conversationHistory = [];
        this.isTyping = false;
        this.chatContainer = null;
        this.chatInput = null;
        this.sendButton = null;
        
        // Cybersecurity-focused system prompt
        this.systemPrompt = `You are CyberGuard AI, an expert cybersecurity assistant specializing in real-time threat guidance. Your role is to:

1. Provide accurate, up-to-date cybersecurity advice
2. Help users identify and respond to security threats
3. Offer practical guidance for incident response
4. Share cybersecurity best practices
5. Analyze potential security risks
6. Provide clear, actionable recommendations

Guidelines:
- Always prioritize user safety and security
- Provide specific, actionable advice
- Use clear, non-technical language when possible
- Ask clarifying questions when needed
- Stay current with cybersecurity trends
- Be concise but thorough
- Include relevant examples when helpful

Focus areas include:
- Phishing and social engineering attacks
- Malware and ransomware threats
- Password security and authentication
- Network security best practices
- Incident response procedures
- Security awareness training
- Risk assessment and mitigation
- Compliance and regulatory guidance

Always start responses with relevant context and end with clear next steps.`;
    }

    // Initialize the chatbot
    init() {
        this.setupElements();
        this.loadConversationHistory();
        this.setupEventListeners();
        
        // Check if API key is configured
        if (this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            this.updateConnectionStatus(false, 'API Key Not Configured');
            this.addMessage('⚠️ API key not configured. Please contact administrator to set up the Gemini API key in js/config.js', 'error');
        } else {
            this.updateConnectionStatus(true, 'AI Assistant Online');
            // Add welcome message using configuration
            setTimeout(() => {
                if (this.chatContainer.querySelectorAll('.chat-message').length === 0) {
                    this.addMessage(CYBERGUARD_CONFIG.CHATBOT_SETTINGS.welcomeMessage, 'assistant', false);
                }
            }, 500);
        }
        
        console.log('CyberGuard AI Chatbot initialized');
    }

    // Setup DOM elements
    setupElements() {
        this.chatContainer = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    // Load conversation history
    loadConversationHistory() {
        try {
            const history = localStorage.getItem('cyberguard_chat_history');
            if (history) {
                this.conversationHistory = JSON.parse(history);
                this.renderConversationHistory();
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
            this.conversationHistory = [];
        }
    }

    // Save conversation history
    saveConversationHistory() {
        try {
            localStorage.setItem('cyberguard_chat_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    }

    // Render conversation history
    renderConversationHistory() {
        // Skip the welcome message when loading history
        const messages = this.chatContainer.querySelectorAll('.chat-message');
        if (messages.length > 1) {
            messages.forEach((msg, index) => {
                if (index > 0) msg.remove(); // Keep welcome message
            });
        }

        this.conversationHistory.forEach(entry => {
            if (entry.role === 'user') {
                this.addMessage(entry.content, 'user', false);
            } else {
                this.addMessage(entry.content, 'assistant', false);
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Send button click
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Enter key press
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    // Send message to AI
    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message) return;
        
        if (this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            this.addMessage('⚠️ API key not configured. Please contact administrator to set up the Gemini API key.', 'error');
            return;
        }

        // Clear input and disable send button
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        this.updateCharCount(0);
        this.sendButton.disabled = true;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.callGeminiAPI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessage(response, 'assistant');
            
            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });
            
            // Save conversation
            this.saveConversationHistory();
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error calling Gemini API:', error);
            
            let errorMessage = 'Sorry, I encountered an error while processing your request. ';
            
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key configuration.';
                this.updateConnectionStatus(false, 'API Key Error');
            } else if (error.message.includes('rate limit')) {
                errorMessage += 'Rate limit exceeded. Please try again in a moment.';
            } else {
                errorMessage += 'Please try again or check your internet connection.';
            }
            
            this.addMessage(errorMessage, 'error');
        }
        
        // Re-enable send button
        this.sendButton.disabled = false;
    }

    // Call Gemini API
    async callGeminiAPI(userMessage) {
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            throw new Error('API key not configured');
        }

        const apiUrl = `${CYBERGUARD_CONFIG.API_BASE_URL}?key=${this.apiKey}`;
        
        // Prepare conversation context
        const conversationContext = this.conversationHistory
            .slice(-CYBERGUARD_CONFIG.CHATBOT_SETTINGS.maxConversationHistory)
            .map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`)
            .join('\n');

        const fullPrompt = `${this.systemPrompt}

Previous conversation context:
${conversationContext}

Current user question: ${userMessage}

Please provide a helpful, accurate response focused on cybersecurity guidance:`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: CYBERGUARD_CONFIG.MODEL_CONFIG,
            safetySettings: CYBERGUARD_CONFIG.SAFETY_SETTINGS
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    }

    // Add message to chat
    addMessage(content, sender, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 chat-message';

        let avatarClass, bgClass, textClass;
        let avatarIcon = '';

        switch (sender) {
            case 'user':
                messageDiv.classList.add('justify-end');
                avatarClass = 'bg-blue-600';
                bgClass = 'bg-blue-600';
                textClass = 'text-white';
                avatarIcon = 'ri-user-line';
                break;
            case 'error':
                avatarClass = 'bg-red-600';
                bgClass = 'bg-red-900 border border-red-600';
                textClass = 'text-red-200';
                avatarIcon = 'ri-error-warning-line';
                break;
            default: // assistant
                avatarClass = 'bg-gradient-to-r from-blue-500 to-purple-600';
                bgClass = 'bg-slate-700';
                textClass = 'text-white';
                avatarIcon = 'ri-robot-line';
        }

        messageDiv.innerHTML = `
            ${sender === 'user' ? '' : `
                <div class="w-8 h-8 ${avatarClass} rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="${avatarIcon} text-white text-sm"></i>
                </div>
            `}
            <div class="${bgClass} rounded-lg p-4 max-w-2xl ${sender === 'user' ? 'ml-auto' : ''}">
                <div class="${textClass} whitespace-pre-wrap">${this.formatMessage(content)}</div>
                <div class="text-xs ${sender === 'user' ? 'text-blue-200' : 'text-gray-400'} mt-2">
                    ${new Date().toLocaleTimeString()}
                </div>
            </div>
            ${sender === 'user' ? `
                <div class="w-8 h-8 ${avatarClass} rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="${avatarIcon} text-white text-sm"></i>
                </div>
            ` : ''}
        `;

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add typing animation for assistant messages
        if (sender === 'assistant') {
            this.animateMessageAppearance(messageDiv);
        }
    }

    // Format message content
    formatMessage(content) {
        // Basic markdown-style formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-600 px-1 rounded">$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Animate message appearance
    animateMessageAppearance(messageElement) {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 100);
    }

    // Show typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }

    // Hide typing indicator
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.add('hidden');
    }

    // Scroll to bottom of chat
    scrollToBottom() {
        setTimeout(() => {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }, 100);
    }

    // Ask quick question
    askQuickQuestion(question) {
        this.chatInput.value = question;
        this.updateCharCount(question.length);
        this.sendMessage();
    }

    // Update character count
    updateCharCount(count) {
        const charCountElement = document.getElementById('char-count');
        if (charCountElement) {
            charCountElement.textContent = `${count}/1000`;
            
            if (count > 900) {
                charCountElement.classList.add('text-red-400');
            } else {
                charCountElement.classList.remove('text-red-400');
            }
        }
    }

    // Update connection status
    updateConnectionStatus(isOnline, statusText) {
        const statusIndicator = document.getElementById('connection-status');
        const statusTextElement = document.getElementById('status-text');
        
        if (statusIndicator && statusTextElement) {
            if (isOnline) {
                statusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full animate-pulse';
                statusTextElement.textContent = statusText;
                statusTextElement.className = 'text-sm text-gray-300';
            } else {
                statusIndicator.className = 'w-3 h-3 bg-red-500 rounded-full';
                statusTextElement.textContent = statusText;
                statusTextElement.className = 'text-sm text-red-400';
            }
        }
    }

    // Clear chat
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            // Keep only the welcome message
            const messages = this.chatContainer.querySelectorAll('.chat-message');
            messages.forEach((msg, index) => {
                if (index > 0) msg.remove(); // Keep first (welcome) message
            });
            
            // Clear conversation history
            this.conversationHistory = [];
            this.saveConversationHistory();
            
            this.showNotification('Chat history cleared', 'success');
        }
    }

    // Export chat
    exportChat() {
        if (this.conversationHistory.length === 0) {
            this.showNotification('No conversation to export', 'info');
            return;
        }

        const chatData = {
            exportDate: new Date().toISOString(),
            totalMessages: this.conversationHistory.length,
            conversation: this.conversationHistory
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cyberguard-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Chat exported successfully', 'success');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full`;
        
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-600');
                break;
            case 'error':
                notification.classList.add('bg-red-600');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-600');
                break;
            default:
                notification.classList.add('bg-blue-600');
        }
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="ri-information-line"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global chatbot instance
let cyberGuardChatbot;

// Global functions for HTML onclick handlers
function initializeChatbot() {
    cyberGuardChatbot = new CyberGuardChatbot();
    cyberGuardChatbot.init();
}

function sendMessage() {
    if (cyberGuardChatbot) {
        cyberGuardChatbot.sendMessage();
    }
}

function askQuickQuestion(question) {
    if (cyberGuardChatbot) {
        cyberGuardChatbot.askQuickQuestion(question);
    }
}

function clearChat() {
    if (cyberGuardChatbot) {
        cyberGuardChatbot.clearChat();
    }
}

function exportChat() {
    if (cyberGuardChatbot) {
        cyberGuardChatbot.exportChat();
    }
}

// Auto-resize textarea and character count
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const charCount = document.getElementById('char-count');
    
    if (chatInput && charCount) {
        chatInput.addEventListener('input', function() {
            // Auto-resize
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
            
            // Update character count
            if (cyberGuardChatbot) {
                cyberGuardChatbot.updateCharCount(this.value.length);
            }
        });
    }
});

console.log('CyberGuard Chatbot script loaded');