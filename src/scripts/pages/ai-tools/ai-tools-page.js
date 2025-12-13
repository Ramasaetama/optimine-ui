/**
 * OptiMine SPA - AI Tools Page Component
 * Chatbot interface integrated with n8n AI
 */

import { API } from '../../data/api.js';
import { LanguageManager } from '../../utils/LanguageManager.js';
import { App } from '../../app.js';

const template = () => {
    const t = (key) => LanguageManager.t(key);

    return `
            <div class="min-h-screen bg-background">
                <!-- AI Tools Content -->
                <div class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-3xl font-bold mb-2">Asisten AI</h1>
                        <p class="text-muted-foreground mb-8">
                            Ajukan pertanyaan tentang kondisi lapangan dan dapatkan rekomendasi AI
                        </p>

                        <!-- Chat Container -->
                        <div class="bg-card border border-border rounded-xl overflow-hidden">
                            <!-- Chat Messages -->
                            <div id="chat-messages" class="h-[500px] overflow-y-auto p-6 space-y-4">
                                <!-- Welcome Message -->
                                <div class="flex items-start gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <div class="bg-secondary/50 border border-border rounded-2xl rounded-bl-sm p-4">
                                            <p class="text-sm">Halo! Saya Asisten AI Operasi Tambang Anda. Bagaimana saya bisa membantu mengoptimalkan operasi Anda hari ini?</p>
                                        </div>
                                        <span class="text-xs text-muted-foreground mt-1 block">${new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Typing Indicator (hidden by default) -->
                            <div id="typing-indicator" class="hidden px-6 pb-4">
                                <div class="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div class="flex gap-1">
                                        <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></span>
                                        <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                                        <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                                    </div>
                                    <span>AI sedang mengetik...</span>
                                </div>
                            </div>

                            <!-- Input Area -->
                            <div class="border-t border-border p-4 bg-background/50">
                                <form id="chat-form" class="flex gap-2">
                                    <input
                                        type="text"
                                        id="chat-input"
                                        class="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tanyakan tentang dampak cuaca, optimasi armada, atau perencanaan produksi..."
                                        autocomplete="off"
                                    />
                                    <button
                                        type="submit"
                                        id="send-btn"
                                        class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <!-- Status Indicator -->
                        <div class="mt-4 flex items-center justify-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span class="text-muted-foreground">AI Online - Terhubung ke AI Service</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
};

const afterRender = () => {
    console.log('🤖 AI Tools Page - Initializing...');

    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    // Enable/disable send button based on input
    chatInput.addEventListener('input', () => {
        sendBtn.disabled = !chatInput.value.trim();
    });

    // Handle form submit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message
        addMessage(message, 'user');

        // Clear input
        chatInput.value = '';
        sendBtn.disabled = true;

        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            // Send to n8n via API
            const response = await API.ai.chat(message);

            // Hide typing indicator
            typingIndicator.classList.add('hidden');

            // Add AI response
            if (response.success && response.data.response) {
                addMessage(response.data.response, 'ai');
            } else {
                addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'ai');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            typingIndicator.classList.add('hidden');
            addMessage('Maaf, saya tidak dapat terhubung ke AI server. Silakan coba lagi nanti.', 'ai');
        }
    });

    // Focus input
    chatInput.focus();

    // Helper functions
    function addMessage(content, type) {
        const timestamp = new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' });
        const messageEl = document.createElement('div');
        messageEl.className = 'flex items-start gap-3 animate-fade-in';

        if (type === 'ai') {
            messageEl.innerHTML = `
                    <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="bg-secondary/50 border border-border rounded-2xl rounded-bl-sm p-4">
                            <p class="text-sm whitespace-pre-wrap">${escapeHtml(content)}</p>
                        </div>
                        <span class="text-xs text-muted-foreground mt-1 block">${timestamp}</span>
                    </div>
                `;
        } else {
            messageEl.innerHTML = `
                    <div class="flex-1"></div>
                    <div class="flex-shrink-0 max-w-[70%]">
                        <div class="bg-primary text-white rounded-2xl rounded-br-sm p-4">
                            <p class="text-sm whitespace-pre-wrap">${escapeHtml(content)}</p>
                        </div>
                        <span class="text-xs text-muted-foreground mt-1 block text-right">${timestamp}</span>
                    </div>
                    <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                `;
        }

        chatMessages.appendChild(messageEl);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    console.log('✅ AI Tools Page - Ready!');
};

export const aiToolsPage = async () => {
    console.log('🚀 AI Tools Page - Loading...');
    await App.View.render(template(), 'ai-tools');
    console.log('✅ AI Tools Page - Rendered, initializing...');
    afterRender();
};
