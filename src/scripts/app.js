/**
 * OptiMine SPA - Main Application
 * MVP Architecture: Presenter Layer
 */

import { Config } from '../config.js';
import { Router } from './routes/routes.js';
import { EventBus } from './utils/index.js';

// ============================================
// MODEL - State Management
// ============================================
const Model = {
    state: {
        user: null,
        isAuthenticated: false,
        theme: Config.defaults.theme,
        language: Config.defaults.language,
        currentRoute: null,
        isLoading: false
    },

    init() {
        // Load persisted state
        this.state.theme = localStorage.getItem(Config.storage.theme) || Config.defaults.theme;
        this.state.language = localStorage.getItem(Config.storage.language) || Config.defaults.language;
        this.state.isAuthenticated = localStorage.getItem(Config.storage.isLoggedIn) === 'true';
        
        const savedUser = localStorage.getItem(Config.storage.user);
        if (savedUser) {
            try {
                this.state.user = JSON.parse(savedUser);
            } catch (e) {
                this.state.user = null;
            }
        }
        
        return this;
    },

    getState(key) {
        return key ? this.state[key] : this.state;
    },

    setState(key, value) {
        this.state[key] = value;
        EventBus.emit('stateChanged', { key, value });
        return this;
    },

    // Auth methods
    login(user) {
        this.state.user = user;
        this.state.isAuthenticated = true;
        localStorage.setItem(Config.storage.user, JSON.stringify(user));
        localStorage.setItem(Config.storage.isLoggedIn, 'true');
        EventBus.emit('authChanged', { isAuthenticated: true, user });
        return this;
    },

    logout() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        localStorage.removeItem(Config.storage.user);
        localStorage.removeItem(Config.storage.token);
        localStorage.setItem(Config.storage.isLoggedIn, 'false');
        EventBus.emit('authChanged', { isAuthenticated: false, user: null });
        return this;
    },

    // Theme methods
    setTheme(theme) {
        this.state.theme = theme;
        localStorage.setItem(Config.storage.theme, theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        EventBus.emit('themeChanged', theme);
        return this;
    },

    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        return this.setTheme(newTheme);
    },

    // Language methods
    setLanguage(lang) {
        this.state.language = lang;
        localStorage.setItem(Config.storage.language, lang);
        EventBus.emit('languageChanged', lang);
        return this;
    }
};

// ============================================
// VIEW - DOM Manipulation
// ============================================
const View = {
    elements: {
        content: null,
        navbar: null,
        toastContainer: null
    },

    init() {
        this.elements.content = document.getElementById('spa-content');
        this.elements.navbar = document.getElementById('header');
        this.elements.toastContainer = document.getElementById('toast-container');
        
        // Apply initial theme
        document.documentElement.classList.toggle('dark', Model.getState('theme') === 'dark');
        
        return this;
    },

    // Render content with smooth CSS animation (no overlay)
    async render(html, routeName) {
        // Ensure content element is available
        if (!this.elements.content) {
            this.elements.content = document.getElementById('spa-content');
        }
        
        const { content } = this.elements;
        
        if (!content) {
            console.error('SPA content element not found');
            return;
        }
        
        // Check if this is initial render (content is empty)
        const isInitialRender = content.innerHTML.trim() === '';
        
        if (!isInitialRender) {
            // Start exit animation (fade out) only if not initial render
            content.classList.add('page-exit');
            content.classList.add('page-exit-active');
            
            await this.delay(200); // Exit animation duration
        }
        
        // Update content
        content.innerHTML = html;
        
        // Remove exit classes
        content.classList.remove('page-exit', 'page-exit-active');
        
        // Start enter animation (fade in + slide up)
        content.classList.add('page-enter');
        
        // Force reflow
        void content.offsetWidth;
        
        content.classList.add('page-enter-active');
        
        // Notify route changed
        EventBus.emit('routeChanged', routeName);
        
        await this.delay(500); // Enter animation duration
        
        // Cleanup
        content.classList.remove('page-enter', 'page-enter-active');
        
        // Re-init icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Update auth UI
    updateAuthUI(isAuthenticated, user) {
        const authBtn = document.getElementById('nav-auth-btn');
        const userMenu = document.getElementById('nav-user-menu');
        const userInitial = document.getElementById('nav-user-initial');
        const userName = document.getElementById('nav-user-name');
        const userEmail = document.getElementById('nav-user-email');

        if (isAuthenticated && user) {
            authBtn?.classList.add('hidden');
            userMenu?.classList.remove('hidden');
            if (userInitial) userInitial.textContent = (user.name || 'U').charAt(0).toUpperCase();
            if (userName) userName.textContent = user.name || 'User';
            if (userEmail) userEmail.textContent = user.email || '';
        } else {
            authBtn?.classList.remove('hidden');
            userMenu?.classList.add('hidden');
        }
    },

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const container = this.elements.toastContainer;
        if (!container) return;

        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `spa-toast ${type}`;
        toast.innerHTML = `
            <i data-lucide="${icons[type]}" class="spa-toast-icon"></i>
            <span class="spa-toast-message">${message}</span>
        `;

        container.appendChild(toast);
        
        if (window.lucide) {
            window.lucide.createIcons();
        }

        setTimeout(() => {
            toast.classList.add('exiting');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Utility delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ============================================
// PRESENTER - Business Logic
// ============================================
const Presenter = {
    init() {
        this.setupEventListeners();
        return this;
    },

    setupEventListeners() {
        // Auth state changes
        EventBus.on('authChanged', ({ isAuthenticated, user }) => {
            View.updateAuthUI(isAuthenticated, user);
            if (!isAuthenticated) {
                Router.navigate('home');
            }
        });

        // Theme changes
        EventBus.on('themeChanged', (theme) => {
            console.log('Theme changed:', theme);
        });
    },

    // Handle login
    async handleLogin(email, password) {
        try {
            // Call real API
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.message || 'Login gagal');
            }

            const user = {
                id: result.data.id,
                name: result.data.nama,
                email: email,
                role: result.data.role,
                token: result.data.token
            };
            
            // Save token to localStorage
            localStorage.setItem('optimine-token', result.data.token);
            
            Model.login(user);
            View.showToast('Login berhasil!', 'success');
            
            setTimeout(() => {
                Router.navigate('home');
            }, 500);
            
            return true;
        } catch (error) {
            View.showToast('Login gagal: ' + error.message, 'error');
            return false;
        }
    },

    // Handle register
    async handleRegister(name, email, password, role) {
        try {
            // Call real API for registration
            const registerResponse = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nama: name, 
                    email, 
                    password, 
                    role: role || 'admin'
                })
            });

            const registerResult = await registerResponse.json();
            console.log('Register response:', registerResult);

            if (!registerResponse.ok || registerResult.error) {
                throw new Error(registerResult.message || 'Registrasi gagal');
            }

            // Auto login after successful registration
            const loginResponse = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const loginResult = await loginResponse.json();

            if (loginResponse.ok && !loginResult.error) {
                const user = {
                    id: loginResult.data.id,
                    name: loginResult.data.nama,
                    email: email,
                    role: loginResult.data.role,
                    token: loginResult.data.token
                };
                
                // Save token to localStorage
                localStorage.setItem('optimine-token', loginResult.data.token);
                
                Model.login(user);
            } else {
                // If auto-login fails, just create user object from registration data
                const user = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    role: role || 'admin'
                };
                Model.login(user);
            }
            
            View.showToast('Registrasi berhasil!', 'success');
            
            setTimeout(() => {
                Router.navigate('home');
            }, 500);
            
            return true;
        } catch (error) {
            View.showToast('Registrasi gagal: ' + error.message, 'error');
            return false;
        }
    },

    // Handle logout
    handleLogout() {
        Model.logout();
        View.showToast('Logout berhasil', 'info');
    }
};

// ============================================
// APP - Main Application
// ============================================
export const App = {
    Model,
    View,
    Presenter,

    init() {
        Model.init();
        View.init();
        Presenter.init();
        
        // Update auth UI on init
        View.updateAuthUI(Model.getState('isAuthenticated'), Model.getState('user'));
        
        console.log('App initialized');
        return this;
    }
};

// Export individual modules
export { Model, View, Presenter };
