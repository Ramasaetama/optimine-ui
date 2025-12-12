/**
 * LanguageManager - Handles multi-language functionality
 * Uses localStorage for persistence
 * Supports dynamic DOM updates via data-i18n attributes
 */

import { translations } from './translations.js';

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getSavedLanguage();
        this.listeners = [];
        this.isInitialized = false;
    }

    /**
     * Get saved language from localStorage or default to 'id'
     */
    getSavedLanguage() {
        const saved = localStorage.getItem('optimine-language');
        if (saved && (saved === 'en' || saved === 'id')) {
            return saved;
        }
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('id')) {
            return 'id';
        }
        return 'id'; // Default to Indonesian
    }

    /**
     * Initialize language manager
     */
    init() {
        if (this.isInitialized) return this;
        
        this.setLanguage(this.currentLanguage, false); // Don't notify on init
        this.setupLanguageSwitcher();
        this.isInitialized = true;
        
        console.log('LanguageManager initialized. Current language:', this.currentLanguage);
        return this;
    }

    /**
     * Get current translations object
     */
    get t() {
        return translations[this.currentLanguage] || translations['id'];
    }

    /**
     * Get specific translation by dot notation path
     * @param {string} path - e.g., 'nav.home', 'features.simulator.title'
     * @returns {string} Translation or path if not found
     */
    translate(path) {
        const keys = path.split('.');
        let result = this.t;
        
        for (const key of keys) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                console.warn(`Translation not found: ${path}`);
                return path;
            }
        }
        
        return result;
    }

    /**
     * Set language and update all elements
     * @param {string} lang - 'en' or 'id'
     * @param {boolean} notify - Whether to notify listeners (default: true)
     */
    setLanguage(lang, notify = true) {
        if (lang !== 'en' && lang !== 'id') {
            console.error('Invalid language:', lang);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('optimine-language', lang);
        
        // Update document language attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Update all elements with data-i18n attribute
        this.updateAllTranslations();
        
        // Update language indicator
        this.updateLanguageIndicator();
        
        // Notify listeners
        if (notify) {
            this.notifyListeners();
        }
    }

    /**
     * Toggle between languages
     */
    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'id' : 'en';
        this.setLanguage(newLang);
        return newLang;
    }

    /**
     * Update all DOM elements with data-i18n attribute
     */
    updateAllTranslations() {
        // Elements with text content
        const textElements = document.querySelectorAll('[data-i18n]');
        textElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });

        // Elements with placeholder
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.translate(key);
            if (translation !== key) {
                element.setAttribute('placeholder', translation);
            }
        });

        // Elements with title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.translate(key);
            if (translation !== key) {
                element.setAttribute('title', translation);
            }
        });

        // Elements with aria-label
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.translate(key);
            if (translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });
    }

    /**
     * Update language indicator in UI
     */
    updateLanguageIndicator() {
        // Update text indicators
        const indicators = document.querySelectorAll('[data-language-indicator]');
        indicators.forEach(indicator => {
            indicator.textContent = this.currentLanguage.toUpperCase();
        });

        // Update active state on language buttons
        const langButtons = document.querySelectorAll('[data-lang-button]');
        langButtons.forEach(button => {
            const lang = button.getAttribute('data-lang-button');
            const isActive = lang === this.currentLanguage;
            
            // Toggle classes
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-primary-foreground', isActive);
            button.classList.toggle('shadow-lg', isActive);
        });
        
        // Update .lang-option buttons (legacy support)
        document.querySelectorAll('.lang-option').forEach(btn => {
            const lang = btn.dataset.lang;
            const isActive = lang === this.currentLanguage;
            
            btn.classList.toggle('bg-primary', isActive);
            btn.classList.toggle('text-primary-foreground', isActive);
            btn.classList.toggle('shadow-lg', isActive);
        });
    }

    /**
     * Setup language switcher click handlers
     */
    setupLanguageSwitcher() {
        // Use event delegation for language buttons
        document.addEventListener('click', (e) => {
            // Language toggle button (toggles between en/id)
            const toggleBtn = e.target.closest('[data-language-toggle]');
            if (toggleBtn) {
                e.preventDefault();
                this.toggleLanguage();
                return;
            }

            // Specific language button with data-lang-button
            const langBtn = e.target.closest('[data-lang-button]');
            if (langBtn) {
                e.preventDefault();
                const lang = langBtn.getAttribute('data-lang-button');
                this.setLanguage(lang);
                return;
            }
            
            // Legacy .lang-option buttons
            const langOption = e.target.closest('.lang-option');
            if (langOption) {
                e.preventDefault();
                const lang = langOption.dataset.lang;
                if (lang) {
                    this.setLanguage(lang);
                }
            }
        });
    }

    /**
     * Subscribe to language changes
     * @param {Function} callback - Called when language changes with (lang, translations)
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify all subscribers of language change
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentLanguage, this.t);
            } catch (error) {
                console.error('Language listener error:', error);
            }
        });
    }

    /**
     * Get translation for use in templates
     * Shorthand for translate()
     */
    $(path) {
        return this.translate(path);
    }
}

// Singleton instance
const languageManager = new LanguageManager();

export { languageManager, LanguageManager };
export default languageManager;
