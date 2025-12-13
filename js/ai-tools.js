/**
 * OptiMine AI Tools / Chatbot Page JavaScript
 * Handles chat functionality, message sending, and n8n AI integration
 * Last updated: 2025-12-12 - CORS Fixed, Direct n8n connection
 */

console.log('🔄 AI Tools Script Loaded - Version: 2025-12-12');

// ========================================
// AI TOOLS PAGE MODULE
// ========================================

const AIToolsPage = (() => {
    // ========================================
    // CONFIGURATION - Backend AI Service
    // ========================================
    const CONFIG = {
        // Use backend proxy to AI Service Docker (port 8000)
        USE_BACKEND_PROXY: true,
        BACKEND_PROXY_URL: 'http://139.59.224.58:5000/ai/chat',

        // n8n URLs disabled - using backend AI Service instead
        N8N_WEBHOOK_URL: null,
        N8N_WEBHOOK_TEST_URL: null,
        USE_TEST_URL: false,

        // Fallback ke response lokal jika AI Service gagal
        USE_FALLBACK: true,
        // Timeout untuk request (ms)
        REQUEST_TIMEOUT: 30000,
        // Max message length
        MAX_MESSAGE_LENGTH: 2000
    };

    // State
    const state = {
        isTyping: false,
        messages: [],
        conversationId: null,
        isConnected: false,
    };

    // DOM Elements
    let chatMessages;
    let chatInput;
    let sendBtn;
    let typingIndicator;
    let suggestedPrompts;

    // ========================================
    // TRANSLATION HELPER
    // ========================================

    const t = (key) => {
        if (window.OptiMine && window.OptiMine.LanguageManager) {
            return window.OptiMine.LanguageManager.t(key);
        }
        return key;
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    const init = () => {
        // Get DOM elements
        chatMessages = document.getElementById('chat-messages');
        chatInput = document.getElementById('chat-input');
        sendBtn = document.getElementById('send-btn');
        typingIndicator = document.getElementById('typing-indicator');
        suggestedPrompts = document.querySelectorAll('.suggested-prompt');

        if (!chatMessages || !chatInput || !sendBtn) {
            console.warn('AI Tools: Required elements not found');
            return;
        }

        // Setup event listeners
        setupEventListeners();

        // Setup language change listener
        setupLanguageListener();

        // Update welcome message based on current language
        updateWelcomeMessage();

        // Focus on input
        chatInput.focus();

        // Generate conversation ID
        state.conversationId = generateConversationId();

        console.log('AI Tools Page initialized');
    };

    // ========================================
    // LANGUAGE CHANGE HANDLER
    // ========================================

    const setupLanguageListener = () => {
        window.addEventListener('languagechange', (e) => {
            updateWelcomeMessage();
            updateSuggestedPrompts();
        });
    };

    const updateWelcomeMessage = () => {
        const welcomeMessageEl = chatMessages.querySelector('.ai-message:first-child .message-bubble p');
        if (welcomeMessageEl) {
            welcomeMessageEl.textContent = t('aiTools.welcomeMessage');
        }
    };

    const updateSuggestedPrompts = () => {
        const prompts = document.querySelectorAll('.suggested-prompt');
        const promptKeys = ['aiTools.prompt1', 'aiTools.prompt2', 'aiTools.prompt3'];
        prompts.forEach((prompt, index) => {
            if (promptKeys[index]) {
                prompt.textContent = t(promptKeys[index]);
            }
        });
    };

    // ========================================
    // EVENT LISTENERS
    // ========================================

    const setupEventListeners = () => {
        // Send button click
        sendBtn.addEventListener('click', handleSendMessage);

        // Enter key press
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Input change - enable/disable send button
        chatInput.addEventListener('input', () => {
            sendBtn.disabled = chatInput.value.trim() === '';
        });

        // Suggested prompts click
        suggestedPrompts.forEach(prompt => {
            prompt.addEventListener('click', () => {
                const promptText = prompt.textContent.trim();
                chatInput.value = promptText;
                chatInput.focus();
                sendBtn.disabled = false;
            });
        });

        // Initialize send button state
        sendBtn.disabled = true;
    };

    // ========================================
    // MESSAGE HANDLING
    // ========================================

    const handleSendMessage = () => {
        const message = chatInput.value.trim();

        if (!message || state.isTyping) return;

        // Check message length
        if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
            alert(`Pesan terlalu panjang. Maksimal ${CONFIG.MAX_MESSAGE_LENGTH} karakter.`);
            return;
        }

        // Add user message
        addMessage(message, 'user');

        // Clear input
        chatInput.value = '';
        sendBtn.disabled = true;

        // Send to n8n AI (async)
        handleAIResponse(message);
    };

    const addMessage = (content, type, isHtml = false) => {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${type}-message flex items-start gap-3`;

        const timestamp = getCurrentTime();

        if (type === 'ai') {
            messageEl.innerHTML = `
                <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="message-bubble ai-bubble bg-secondary/50 border border-border rounded-2xl rounded-bl-sm p-4 max-w-[85%]">
                        <div class="text-sm text-foreground">${isHtml ? content : escapeHtml(content)}</div>
                    </div>
                    <span class="text-xs text-muted-foreground mt-1 block">${timestamp}</span>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="flex-1 flex justify-end">
                    <div>
                        <div class="message-bubble user-bubble p-4 max-w-[85%]">
                            <p class="text-sm">${escapeHtml(content)}</p>
                        </div>
                        <span class="text-xs text-muted-foreground mt-1 block text-right">${timestamp}</span>
                    </div>
                </div>
                <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            `;
        }

        chatMessages.appendChild(messageEl);

        // Store message
        state.messages.push({ content, type, timestamp });

        // Scroll to bottom
        scrollToBottom();
    };

    // ========================================
    // AI RESPONSE - n8n INTEGRATION
    // ========================================

    const getWebhookUrl = () => {
        // Jika gunakan backend proxy, return URL proxy
        if (CONFIG.USE_BACKEND_PROXY) {
            return CONFIG.BACKEND_PROXY_URL;
        }
        // Jika langsung ke n8n
        return CONFIG.USE_TEST_URL ? CONFIG.N8N_WEBHOOK_TEST_URL : CONFIG.N8N_WEBHOOK_URL;
    };

    const sendToN8N = async (userMessage) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        const webhookUrl = getWebhookUrl();
        console.log('🚀 Sending to AI Service:', webhookUrl);
        console.log('Message:', userMessage);

        // Get JWT token for authentication
        const token = localStorage.getItem('optimine-token');

        // Build headers with Authorization
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    chatInput: userMessage,  // AI Service expects 'chatInput'
                    message: userMessage,     // Keep as fallback
                    conversationId: state.conversationId,
                    timestamp: new Date().toISOString(),
                    userId: getUserId(),
                    language: document.documentElement.lang || 'id'
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            state.isConnected = true;
            updateConnectionStatus(true);

            console.log('✅ n8n response received:', data); // Debug log
            console.log('Response keys:', Object.keys(data)); // Debug: lihat field apa saja

            // Handle berbagai format response dari n8n
            // n8n dengan Groq/LLM Chain mengembalikan format: { output: "..." } atau { text: "..." }
            if (data.output) {
                console.log('Using data.output');
                return data.output;
            }
            if (data.text) {
                console.log('Using data.text');
                return data.text;
            }
            if (data.response) {
                console.log('Using data.response');
                return data.response;
            }
            if (data.message) {
                console.log('Using data.message');
                return data.message;
            }
            if (typeof data === 'string') {
                console.log('Data is string');
                return data;
            }

            // Fallback: cari field yang berisi response panjang
            const possibleFields = ['content', 'result', 'answer', 'reply', 'chatResponse'];
            for (const field of possibleFields) {
                if (data[field] && typeof data[field] === 'string') {
                    return data[field];
                }
            }

            // If still nothing found, check nested structures
            if (data.body && typeof data.body === 'object') {
                if (data.body.output) return data.body.output;
                if (data.body.text) return data.body.text;
            }

            return JSON.stringify(data);
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ Error sending to n8n:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                url: getWebhookUrl()
            });
            state.isConnected = false;
            updateConnectionStatus(false);
            throw error;
        }
    };

    const getUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.id || user.email || 'anonymous';
        } catch {
            return 'anonymous';
        }
    };

    const updateConnectionStatus = (isConnected) => {
        const statusIndicator = document.querySelector('.ai-status-indicator');
        const statusText = document.querySelector('.ai-status-text');

        if (statusIndicator) {
            if (isConnected) {
                statusIndicator.classList.remove('bg-red-500');
                statusIndicator.classList.add('bg-green-500');
            } else {
                statusIndicator.classList.remove('bg-green-500');
                statusIndicator.classList.add('bg-red-500');
            }
        }

        if (statusText) {
            statusText.textContent = isConnected ? 'AI Online' : 'AI Offline';
        }
    };

    const handleAIResponse = async (userMessage) => {
        state.isTyping = true;
        showTypingIndicator();

        try {
            // Coba kirim ke n8n
            const response = await sendToN8N(userMessage);
            hideTypingIndicator();
            state.isTyping = false;
            addMessage(formatAIResponse(response), 'ai', true);
        } catch (error) {
            hideTypingIndicator();
            state.isTyping = false;

            if (CONFIG.USE_FALLBACK) {
                // Gunakan fallback response lokal
                console.log('Using fallback response');
                const fallbackResponse = generateFallbackResponse(userMessage);
                addMessage(fallbackResponse, 'ai');
            } else {
                addMessage('Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.', 'ai');
            }
        }
    };

    const formatAIResponse = (text) => {
        if (!text) return '';
        // Format markdown sederhana
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary/50 p-2 rounded mt-2 mb-2 text-xs overflow-x-auto whitespace-pre-wrap">$1</pre>')
            .replace(/`(.*?)`/g, '<code class="bg-secondary/50 px-1 rounded text-xs">$1</code>')
            .replace(/\n/g, '<br>');
    };

    // ========================================
    // FALLBACK RESPONSE (when n8n is unavailable)
    // ========================================

    const generateFallbackResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Weather/Rainfall related
        if (message.includes('rainfall') || message.includes('rain') || message.includes('weather') || message.includes('curah hujan')) {
            return `Based on current weather data analysis:

📊 **Current Conditions:**
- Rainfall intensity: Moderate (15mm/hour)
- 24-hour forecast: Light to moderate rain expected

⚠️ **Operational Impact:**
- Pit road conditions may be affected
- Recommend reducing hauling speed by 20%
- Consider postponing blasting operations

✅ **Recommendations:**
1. Activate water pumping systems in low-lying areas
2. Deploy additional graders for road maintenance
3. Monitor stockpile moisture levels`;
        }

        // Fleet related
        if (message.includes('fleet') || message.includes('hauler') || message.includes('truck') || message.includes('armada')) {
            return `Fleet optimization analysis complete:

🚛 **Current Fleet Status:**
- Total units: 24 active, 3 in maintenance
- Average utilization: 78%
- Fuel efficiency: 92% of target

📈 **Optimization Opportunities:**
- Route A-B shows 15% idle time - suggest rerouting
- Night shift has 2 excess units

✅ **Recommended Actions:**
1. Redistribute 2 units from Pit C to Pit A
2. Schedule preventive maintenance for Unit #17
3. Optimize crusher queue assignments`;
        }

        // Shipping/Wave related
        if (message.includes('ship') || message.includes('wave') || message.includes('port') || message.includes('kapal') || message.includes('gelombang')) {
            return `Shipping and port analysis:

🌊 **Wave Conditions:**
- Current wave height: 1.8m
- Forecast (next 12h): 2.0-2.5m
- Wind: 15 knots, NW direction

🚢 **Shipping Impact:**
- MV Coal Star loading: On schedule
- MV Pacific bulk: Delayed 6 hours (wave threshold)

✅ **Recommendations:**
1. Prioritize MV Coal Star loading completion
2. Prepare for potential 12-hour port closure
3. Coordinate with stockpile management for buffer`;
        }

        // Production/Planning related
        if (message.includes('production') || message.includes('planning') || message.includes('produksi') || message.includes('target')) {
            return `Production planning summary:

📊 **Today's Status:**
- Target: 45,000 tonnes
- Achieved: 32,500 tonnes (72%)
- Projected EOD: 44,200 tonnes

⚡ **Key Factors:**
- Morning shift exceeded target by 8%
- Afternoon slowdown due to weather
- Evening shift optimization in progress

✅ **Action Items:**
1. Increase crusher throughput by 5%
2. Optimize truck cycle times
3. Coordinate with pit supervisors for catch-up plan`;
        }

        // Default response
        return `Saya memahami pertanyaan Anda tentang "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}". 

Saat ini AI sedang dalam mode offline. Saya dapat membantu Anda dengan:

📊 **Analisis Dampak Cuaca** - Pengaruh curah hujan terhadap operasi
🚛 **Optimasi Armada** - Alokasi truk dan rute
🌊 **Koordinasi Pengiriman** - Kondisi gelombang dan penjadwalan pelabuhan
⚡ **Perencanaan Produksi** - Tracking target dan prakiraan

Silakan ajukan pertanyaan spesifik tentang area-area tersebut.

*[Mode Fallback - Koneksi ke AI server sedang tidak tersedia]*`;
    };

    // ========================================
    // TYPING INDICATOR
    // ========================================

    const showTypingIndicator = () => {
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
        }
    };

    const hideTypingIndicator = () => {
        if (typingIndicator) {
            typingIndicator.classList.add('hidden');
        }
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    const scrollToBottom = () => {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const generateConversationId = () => {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // ========================================
    // PUBLIC API
    // ========================================

    return {
        init,
        addMessage,
        getState: () => ({ ...state }),
    };
})();

// ========================================
// INITIALIZE ON DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the AI Tools page
    if (document.getElementById('chat-messages')) {
        AIToolsPage.init();
    }
});
