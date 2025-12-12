/**
 * OptiMine SPA - Main Entry Point
 * Using Webpack bundler with MVP Architecture
 */

import { App } from './scripts/app.js';
import { Router } from './scripts/routes/routes.js';
import { EventBus, LanguageManager } from './scripts/utils/index.js';
import { t, getSection } from './scripts/utils/translations.js';
import './styles/styles.css';

/**
 * Update UI text based on current language
 */
const updateLanguageUI = (lang) => {
    const nav = getSection(lang, 'nav');
    
    // Update Desktop Navigation Links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        const page = link.dataset.page;
        const span = link.querySelector('span');
        if (span) {
            if (page === 'home') span.textContent = nav.home;
            if (page === 'planning') span.textContent = nav.planning;
            if (page === 'ai-tools') span.textContent = nav.aiTools;
            if (page === 'dashboard') span.textContent = nav.dashboard;
        }
    });
    
    // Update Mobile Navigation Links
    document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
        const page = link.dataset.page;
        const span = link.querySelector('span');
        if (span) {
            if (page === 'home') span.textContent = nav.home;
            if (page === 'planning') span.textContent = nav.planning;
            if (page === 'ai-tools') span.textContent = nav.aiTools;
            if (page === 'dashboard') span.textContent = nav.dashboard;
        }
    });
    
    // Update Login/Profile button text
    const loginBtnText = document.querySelector('#loginBtn span');
    const mobileLoginBtnText = document.querySelector('#mobileLoginBtn span');
    if (loginBtnText) loginBtnText.textContent = nav.login;
    if (mobileLoginBtnText) mobileLoginBtnText.textContent = nav.login;
    
    // Update active language indicator in dropdown
    document.querySelectorAll('.lang-option').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('text-primary-foreground', isActive);
        btn.classList.toggle('shadow-lg', isActive);
        // Remove hover effect for active
        if (isActive) {
            btn.classList.remove('hover:bg-primary/10');
        } else {
            btn.classList.add('hover:bg-primary/10');
        }
    });
    
    document.querySelectorAll('.lang-option-mobile').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('text-primary-foreground', isActive);
        btn.classList.toggle('bg-secondary/50', !isActive);
    });
};

/**
 * Setup Navbar Event Handlers
 */
const setupNavbarHandlers = () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        App.Model.toggleTheme();
    });
    
    // Language Dropdown
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    
    langToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown?.classList.toggle('hidden');
    });
    
    // Language Options (Desktop)
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            App.Model.setLanguage(lang);
            langDropdown?.classList.add('hidden');
            updateLanguageUI(lang);
            // Re-render current page to apply translations
            Router.handleRouteChange();
        });
    });
    
    // Mobile Language Options
    document.querySelectorAll('.lang-option-mobile').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            App.Model.setLanguage(lang);
            updateLanguageUI(lang);
            // Re-render current page to apply translations
            Router.handleRouteChange();
        });
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = !mobileMenu?.classList.contains('hidden');
        mobileMenu?.classList.toggle('hidden', isOpen);
        menuIcon?.classList.toggle('hidden', !isOpen);
        closeIcon?.classList.toggle('hidden', isOpen);
    });
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
        });
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langToggle?.contains(e.target) && !langDropdown?.contains(e.target)) {
            langDropdown?.classList.add('hidden');
        }
    });
    
    // Apply initial language
    const currentLang = App.Model.getState('language') || 'id';
    updateLanguageUI(currentLang);
};

/**
 * Update Navigation Active State
 */
const updateNavActiveState = (route) => {
    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.dataset.page;
        link.classList.toggle('active', page === route);
    });
    
    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        const page = link.dataset.page;
        link.classList.toggle('active', page === route);
    });
};

/**
 * Update Auth UI State
 */
const updateAuthUI = () => {
    const isLoggedIn = App.Model.getState('isAuthenticated');
    const user = App.Model.getState('user');
    
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    
    if (isLoggedIn && user) {
        loginBtn?.classList.add('hidden');
        profileBtn?.classList.remove('hidden');
        profileBtn?.classList.add('flex');
        mobileLoginBtn?.classList.add('hidden');
        mobileProfileBtn?.classList.remove('hidden');
        mobileProfileBtn?.classList.add('flex');
        
        // Update user info
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        document.querySelectorAll('.user-initial').forEach(el => el.textContent = initial);
        document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name || 'User');
    } else {
        loginBtn?.classList.remove('hidden');
        loginBtn?.classList.add('flex');
        profileBtn?.classList.add('hidden');
        profileBtn?.classList.remove('flex');
        mobileLoginBtn?.classList.remove('hidden');
        mobileLoginBtn?.classList.add('flex');
        mobileProfileBtn?.classList.add('hidden');
        mobileProfileBtn?.classList.remove('flex');
    }
};

/**
 * Show Toast Notification
 */
const showToast = (message, type = 'info', duration = 3000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        error: `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        info: `<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

// Make showToast globally available
window.showToast = showToast;

// Make translation function globally available
window.t = t;
window.getSection = getSection;
window.updateLanguageUI = updateLanguageUI;

// Make LanguageManager globally available
window.LanguageManager = LanguageManager;

// Initialize app when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize App FIRST (before Router)
    App.init();
    
    // Initialize LanguageManager
    LanguageManager.init();
    
    // Setup Navbar Handlers
    setupNavbarHandlers();
    
    // Update Auth UI
    updateAuthUI();
    
    // Listen for route changes
    EventBus.on('routeChanged', updateNavActiveState);
    
    // Listen for auth changes
    EventBus.on('authChanged', updateAuthUI);
    
    // Listen for language changes - re-render current page
    EventBus.on('languageChanged', (lang) => {
        updateLanguageUI(lang);
        // Re-render current page to update content
        const currentRoute = Router.getCurrentRoute();
        if (currentRoute) {
            Router.navigate(currentRoute);
        }
    });
    
    // Subscribe LanguageManager to re-render on language change
    LanguageManager.subscribe((lang) => {
        const currentRoute = Router.getCurrentRoute();
        if (currentRoute) {
            Router.navigate(currentRoute);
        }
    });
    
    // Initialize Router LAST (so it can render initial route)
    Router.init();
    
    console.log('OptiMine SPA initialized');
});

// Export for global access if needed
window.OptiMine = {
    App,
    Router,
    showToast
};
