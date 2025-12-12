/**
 * OptiMine SPA - Utilities
 * Common utility functions
 */

// ============================================
// EVENT BUS - Pub/Sub Pattern
// ============================================
export const EventBus = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.off(event, callback);
    },

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },

    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
};

// ============================================
// DOM HELPERS
// ============================================
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('on')) {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
};

// ============================================
// STORAGE HELPERS
// ============================================
export const Storage = {
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return localStorage.getItem(key) || defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// ============================================
// DEBOUNCE & THROTTLE
// ============================================
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// FORMAT HELPERS
// ============================================
export const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

export const formatCurrency = (num, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency
    }).format(num);
};

export const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

// ============================================
// ANIMATION HELPERS
// ============================================
export const animate = {
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = progress;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    },

    fadeOut(element, duration = 300) {
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = 1 - progress;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.style.display = 'none';
            }
        };
        requestAnimationFrame(step);
    },

    slideDown(element, duration = 300) {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.height = `${targetHeight * progress}px`;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        requestAnimationFrame(step);
    },

    slideUp(element, duration = 300) {
        const startHeight = element.scrollHeight;
        element.style.height = `${startHeight}px`;
        element.style.overflow = 'hidden';
        
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.height = `${startHeight * (1 - progress)}px`;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        requestAnimationFrame(step);
    },

    // Typewriter Effect
    typewriter(element, text, speed = 100, callback = null) {
        element.textContent = '';
        element.style.borderRight = '2px solid currentColor';
        element.style.animation = 'blink-caret 0.75s step-end infinite';
        
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                    if (callback) callback();
                }, 500);
            }
        };
        
        type();
    },

    // Typewriter with welcome message and username
    typewriterWelcome(element, welcomeText, userName, speed = 80) {
        element.innerHTML = '';
        
        const welcomeSpan = document.createElement('span');
        welcomeSpan.className = 'typewriter-welcome';
        
        const userSpan = document.createElement('span');
        userSpan.className = 'typewriter-username text-primary';
        
        element.appendChild(welcomeSpan);
        element.appendChild(userSpan);
        
        element.classList.add('typewriter-active');
        
        let welcomeIndex = 0;
        let userIndex = 0;
        
        const typeWelcome = () => {
            if (welcomeIndex < welcomeText.length) {
                welcomeSpan.textContent += welcomeText.charAt(welcomeIndex);
                welcomeIndex++;
                setTimeout(typeWelcome, speed);
            } else {
                setTimeout(typeUser, 200);
            }
        };
        
        const typeUser = () => {
            if (userIndex < userName.length) {
                userSpan.textContent += userName.charAt(userIndex);
                userIndex++;
                setTimeout(typeUser, speed);
            } else {
                setTimeout(() => {
                    element.classList.remove('typewriter-active');
                    element.classList.add('typewriter-complete');
                }, 500);
            }
        };
        
        setTimeout(typeWelcome, 300);
    },

    // Counter Animation - Count up from 0 to target number
    countUp(element, target, duration = 2000, suffix = '') {
        const startTime = performance.now();
        const startValue = 0;
        
        // Easing function for smooth animation
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + suffix;
                element.classList.add('complete');
            }
        };
        
        requestAnimationFrame(updateCount);
    },

    // Initialize all stat counters on page
    initStatCounters(delay = 800) {
        setTimeout(() => {
            const statElements = document.querySelectorAll('.stat-value[data-target]');
            
            statElements.forEach((element, index) => {
                const target = parseInt(element.getAttribute('data-target')) || 0;
                const suffix = element.getAttribute('data-suffix') || '';
                const duration = parseInt(element.getAttribute('data-duration')) || 2000;
                
                // Set initial value to 0
                element.textContent = '0' + suffix;
                
                // Stagger animation for each stat
                setTimeout(() => {
                    animate.countUp(element, target, duration, suffix);
                }, index * 200);
            });
        }, delay);
    }
};

// ============================================
// DELAY HELPER
// ============================================
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// LANGUAGE MANAGER
// ============================================
export { default as LanguageManager } from './LanguageManager.js';
