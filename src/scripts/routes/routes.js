/**
 * OptiMine SPA - Router
 * Hash-based routing for SPA navigation
 */

import { Config } from '../../config.js';
import { EventBus } from '../utils/index.js';
import { homePage } from '../pages/home/home-page.js';
import { aboutPage } from '../pages/about/about-page.js';
import { aiToolsPage } from '../pages/ai-tools/ai-tools-page.js';

// Routes registry
const routes = {};

// Current route state
let currentRoute = null;

/**
 * Router module
 */
export const Router = {
    /**
     * Initialize router
     */
    init() {
        // Register default routes
        this.register('home', homePage);
        this.register('planning', aboutPage); // Temporary use aboutPage
        this.register('ai-tools', aiToolsPage);
        this.register('dashboard', aboutPage);
        this.register('auth', aboutPage);
        this.register('profile', aboutPage);
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        
        // Handle initial route
        this.handleRouteChange();
        
        return this;
    },

    /**
     * Register a route
     * @param {string} path - Route path
     * @param {Function} handler - Route handler function
     */
    register(path, handler) {
        routes[path] = handler;
        return this;
    },

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = path;
    },

    /**
     * Handle route change
     */
    async handleRouteChange() {
        const hash = window.location.hash.slice(1) || Config.routes.default;
        const [routePath, queryString] = hash.split('?');
        
        // Check if route is protected
        if (Config.routes.protected.includes(routePath)) {
            const isLoggedIn = localStorage.getItem(Config.storage.isLoggedIn) === 'true';
            if (!isLoggedIn) {
                this.navigate('auth');
                return;
            }
        }
        
        // Get route handler
        const handler = routes[routePath];
        
        if (handler) {
            currentRoute = routePath;
            
            // Parse query params
            const params = this.parseQuery(queryString);
            
            // Execute handler
            await handler(params);
            
            // Update active nav
            this.updateActiveNav(routePath);
        } else {
            // 404 - redirect to home
            this.navigate(Config.routes.default);
        }
    },

    /**
     * Parse query string
     * @param {string} queryString 
     * @returns {Object}
     */
    parseQuery(queryString) {
        if (!queryString) return {};
        
        const params = {};
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        
        return params;
    },

    /**
     * Update active navigation link
     * @param {string} route 
     */
    updateActiveNav(route) {
        // Desktop nav
        document.querySelectorAll('.spa-nav-link').forEach(link => {
            const linkRoute = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', linkRoute === route);
        });
        
        // Mobile nav
        document.querySelectorAll('.spa-mobile-nav-link').forEach(link => {
            const linkRoute = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', linkRoute === route);
        });
        
        // Close mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu?.classList.add('hidden');
        
        // Emit event
        EventBus.emit('routeChanged', route);
    },

    /**
     * Get current route
     * @returns {string}
     */
    getCurrentRoute() {
        return currentRoute;
    }
};
