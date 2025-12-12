/**
 * OptiMine SPA Configuration
 */

export const Config = {
    // App Info
    appName: 'OptiMine',
    version: '1.0.0',
    
    // API Configuration
    api: {
        baseUrl: 'http://localhost:5000',
        timeout: 10000
    },
    
    // Routes Configuration
    routes: {
        default: 'home',
        protected: ['profile'],
        public: ['home', 'planning', 'ai-tools', 'dashboard', 'auth']
    },
    
    // Transition Configuration
    transition: {
        duration: 400,
        type: 'slide' // 'slide', 'fade', 'none'
    },
    
    // Storage Keys
    storage: {
        theme: 'optimine-theme',
        language: 'optimine-language',
        user: 'optimine-user',
        token: 'optimine-token',
        isLoggedIn: 'optimine-logged-in'
    },
    
    // Default Settings
    defaults: {
        theme: 'dark',
        language: 'id'
    }
};
