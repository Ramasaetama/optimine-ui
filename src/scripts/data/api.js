/**
 * OptiMine SPA - API Service
 * Handle all API calls to backend
 */

import { Config } from '../../config.js';

const BASE_URL = Config.api.baseUrl;

/**
 * API Helper
 */
const api = {
    /**
     * Make HTTP request
     * @param {string} endpoint 
     * @param {Object} options 
     * @returns {Promise}
     */
    async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const token = localStorage.getItem(Config.storage.token);
        
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * GET request
     */
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    /**
     * POST request
     */
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    /**
     * PUT request
     */
    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

/**
 * API Endpoints
 */
export const API = {
    // Auth endpoints
    auth: {
        login: (credentials) => api.post('/auth/login', credentials),
        register: (userData) => api.post('/auth/register', userData),
        logout: () => api.post('/auth/logout'),
        profile: () => api.get('/auth/profile')
    },

    // Mining data endpoints
    mining: {
        getAll: () => api.get('/mining'),
        getById: (id) => api.get(`/mining/${id}`),
        create: (data) => api.post('/mining', data),
        update: (id, data) => api.put(`/mining/${id}`, data),
        delete: (id) => api.delete(`/mining/${id}`)
    },

    // Production endpoints
    production: {
        getStats: () => api.get('/production/stats'),
        getPlan: (params) => api.get(`/production/plan?${new URLSearchParams(params)}`),
        optimize: (data) => api.post('/production/optimize', data)
    },

    // AI Assistant endpoints - Connected to n8n
    ai: {
        chat: async (message) => {
            // Direct n8n webhook integration - Production URL (workflow must be Active)
            const N8N_WEBHOOK_URL = 'https://n8n.optiminev.site/webhook/chatbot123';
            
            console.log('🚀 Sending to n8n:', N8N_WEBHOOK_URL);
            console.log('Message:', message);
            
            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatInput: message,
                        message: message,
                        timestamp: new Date().toISOString(),
                        userId: localStorage.getItem('user') || 'anonymous',
                        language: document.documentElement.lang || 'id'
                    })
                });
                
                // Try to get response body even if status is not ok
                let data;
                try {
                    const responseText = await response.text();
                    console.log('📦 Raw response:', responseText);
                    data = responseText ? JSON.parse(responseText) : {};
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    data = {};
                }
                
                console.log('✅ n8n response status:', response.status);
                console.log('✅ n8n response data:', data);
                
                // Check if this is an n8n error message
                if (data.code === 0 && data.message) {
                    throw new Error(`n8n Error: ${data.message}`);
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Return response in expected format
                return {
                    success: true,
                    data: {
                        response: data.output || data.text || data.response || data.message || JSON.stringify(data)
                    }
                };
            } catch (error) {
                console.error('❌ Error connecting to n8n:', error);
                throw error;
            }
        },
        recommend: (context) => api.post('/ai/recommend', context)
    },

    // Dashboard endpoints
    dashboard: {
        getSummary: () => api.get('/dashboard/summary'),
        getCharts: () => api.get('/dashboard/charts'),
        getAlerts: () => api.get('/dashboard/alerts')
    }
};

export default API;
