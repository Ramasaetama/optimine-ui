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
        profile: () => api.get('/auth/profile'),

        // Password Reset
        forgotPassword: (email) => api.post('/forgot-password', { email }),
        resetPassword: (token, newPassword) => api.post('/reset-password', { token, newPassword })
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

    // AI Assistant endpoints - Connected to Backend AI Service
    ai: {
        chat: async (message) => {
            // Use backend proxy to AI Service (Docker container on port 8000)
            const token = localStorage.getItem(Config.storage.token);

            console.log('🚀 Sending to Backend AI Service:', `${BASE_URL}/ai/chat`);
            console.log('Message:', message);

            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                // Add Authorization header if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${BASE_URL}/ai/chat`, {
                    method: 'POST',
                    headers: headers,
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

                console.log('✅ AI Service response status:', response.status);
                console.log('✅ AI Service response data:', data);

                // Check if this is an error message
                if (data.error) {
                    throw new Error(data.message || 'AI Service Error');
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Return response in expected format
                // Backend returns: { success: true, data: { response: "...", model_used: "..." } }
                const aiResponse = data.data?.response || data.response || data.output || data.text || data.message || 'No response';

                return {
                    success: true,
                    data: {
                        response: aiResponse
                    }
                };
            } catch (error) {
                console.error('❌ Error connecting to AI Service:', error);
                throw error;
            }
        },

        // AI Planning - Auto Recommend endpoint
        plan: async (payload) => {
            const token = localStorage.getItem(Config.storage.token);

            console.log('🚀 Sending to AI Plan Service:', `${BASE_URL}/ai/plan`);
            console.log('Payload:', payload);

            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${BASE_URL}/ai/plan`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                let data;
                try {
                    const responseText = await response.text();
                    console.log('📦 Raw plan response:', responseText);
                    data = responseText ? JSON.parse(responseText) : {};
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    data = {};
                }

                console.log('✅ AI Plan response status:', response.status);
                console.log('✅ AI Plan response data:', data);

                if (data.error) {
                    throw new Error(data.message || 'AI Plan Service Error');
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return data;
            } catch (error) {
                console.error('❌ Error connecting to AI Plan Service:', error);
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
