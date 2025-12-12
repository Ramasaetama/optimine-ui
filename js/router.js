/**
 * OptiMine - Router & Navigation System
 * Handles page navigation, active states, and auth protection
 */

// ============================================
// ROUTER CLASS
// ============================================
class Router {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.protectedPages = ['profile'];
        this.authPage = 'auth';
        this.init();
    }

    /**
     * Detect current page from URL
     * @returns {string} Current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');

        const pageMap = {
            '': 'home',
            'index': 'home',
            'planning': 'planning',
            'ai-tools': 'ai-tools',
            'dashboard': 'dashboard',
            'auth': 'auth',
            'profile': 'profile'
        };

        return pageMap[page] || 'home';
    }

    /**
     * Set active state on navbar links
     */
    setActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[data-page]');

        // Desktop nav links
        navLinks.forEach(link => {
            const page = link.dataset.page;
            if (page === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile nav links
        mobileNavLinks.forEach(link => {
            const page = link.dataset.page;
            if (page === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Navigate to URL with smooth transition
     * @param {string} url - Target URL
     */
    navigateTo(url) {
        const overlay = document.getElementById('page-transition-overlay');
        
        // Activate overlay for smooth transition
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Also fade out body
        document.body.classList.add('page-transition-out');

        // Navigate after transition
        setTimeout(() => {
            window.location.href = url;
        }, 250);
    }

    /**
     * Check authentication state and update UI
     */
    checkAuth() {
        const isLoggedIn = localStorage.getItem('optimine-logged-in') === 'true';
        const loginBtn = document.getElementById('loginBtn');
        const profileBtn = document.getElementById('profileBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const mobileProfileBtn = document.getElementById('mobileProfileBtn');

        if (isLoggedIn) {
            // Load user data
            const userData = JSON.parse(localStorage.getItem('optimine-user') || '{}');
            const userInitial = (userData.name || 'User').charAt(0).toUpperCase();
            const userName = userData.name || 'User';

            // Desktop nav - hide login, show profile
            if (loginBtn) {
                loginBtn.classList.add('hidden');
                loginBtn.classList.remove('sm:flex');
            }
            if (profileBtn) {
                profileBtn.classList.remove('hidden');
                profileBtn.classList.add('flex');
                const userNameEl = profileBtn.querySelector('.user-name');
                const userInitialEl = profileBtn.querySelector('.user-initial');
                if (userNameEl) userNameEl.textContent = userName;
                if (userInitialEl) userInitialEl.textContent = userInitial;
            }

            // Mobile nav - hide login, show profile
            if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
            if (mobileProfileBtn) {
                mobileProfileBtn.classList.remove('hidden');
                mobileProfileBtn.classList.add('flex');
                const mobileUserName = mobileProfileBtn.querySelector('.user-name');
                if (mobileUserName) mobileUserName.textContent = userName;
            }
        } else {
            // Desktop nav - show login, hide profile
            if (loginBtn) {
                loginBtn.classList.remove('hidden');
                loginBtn.classList.add('sm:flex');
            }
            if (profileBtn) {
                profileBtn.classList.add('hidden');
                profileBtn.classList.remove('flex');
            }
            
            // Mobile nav - show login, hide profile
            if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
            if (mobileProfileBtn) {
                mobileProfileBtn.classList.add('hidden');
                mobileProfileBtn.classList.remove('flex');
            };
        }
    }

    /**
     * Protect routes that require authentication
     * @param {string} redirectTo - URL to redirect if not authenticated
     */
    protectRoute(redirectTo = 'auth.html') {
        const isLoggedIn = localStorage.getItem('optimine-logged-in') === 'true';

        if (this.protectedPages.includes(this.currentPage) && !isLoggedIn) {
            // Save intended destination
            localStorage.setItem('optimine-redirect', window.location.href);
            window.location.href = redirectTo;
        }
    }

    /**
     * Redirect if already logged in (for auth page)
     */
    redirectIfLoggedIn() {
        const isLoggedIn = localStorage.getItem('optimine-logged-in') === 'true';

        if (this.currentPage === this.authPage && isLoggedIn) {
            window.location.href = 'index.html';
        }
    }

    /**
     * Get stored redirect URL after login
     * @returns {string} Redirect URL or default
     */
    getRedirectUrl() {
        const redirect = localStorage.getItem('optimine-redirect');
        localStorage.removeItem('optimine-redirect');
        return redirect || 'index.html';
    }

    /**
     * Update page title based on current page
     */
    updatePageTitle() {
        const titles = {
            'home': 'OptiMine - Mining Value Chain Optimization',
            'planning': 'Production Planning - OptiMine',
            'ai-tools': 'AI Assistant - OptiMine',
            'dashboard': 'Operations Dashboard - OptiMine',
            'auth': 'Login / Register - OptiMine',
            'profile': 'Profile Settings - OptiMine'
        };

        document.title = titles[this.currentPage] || titles['home'];
    }

    /**
     * Create transition overlay element
     */
    createTransitionOverlay() {
        if (!document.getElementById('page-transition-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'page-transition-overlay';
            overlay.className = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }
    }

    /**
     * Initialize router
     */
    init() {
        // Handle page visibility immediately
        document.addEventListener('DOMContentLoaded', () => {
            this.createTransitionOverlay();
            this.setActiveNav();
            this.checkAuth();
            this.protectRoute();
            this.redirectIfLoggedIn();
            this.updatePageTitle();
            
            // Add page enter animation
            document.body.classList.add('page-transition-in');
            setTimeout(() => {
                document.body.classList.remove('page-transition-in');
            }, 350);
        });

        // Fallback: If DOMContentLoaded already fired
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.createTransitionOverlay();
            this.setActiveNav();
            this.checkAuth();
            this.updatePageTitle();
        }
    }
}

// ============================================
// NAVIGATION HELPERS
// ============================================

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isAuthenticated() {
    return localStorage.getItem('optimine-logged-in') === 'true';
}

/**
 * Get current user data
 * @returns {object}
 */
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('optimine-user') || '{}');
    } catch {
        return {};
    }
}

/**
 * Navigate with optional auth check
 * @param {string} url - Target URL
 * @param {boolean} requireAuth - Require authentication
 */
function navigateTo(url, requireAuth = false) {
    if (requireAuth && !isAuthenticated()) {
        localStorage.setItem('optimine-redirect', url);
        window.location.href = 'auth.html';
        return;
    }
    
    if (window.router) {
        window.router.navigateTo(url);
    } else {
        window.location.href = url;
    }
}

// ============================================
// INITIALIZE ROUTER
// ============================================
const router = new Router();

// ============================================
// SMOOTH LINK TRANSITION HANDLER
// ============================================

/**
 * Setup smooth transitions for internal navigation links
 */
function setupSmoothNavigation() {
    document.addEventListener('click', (e) => {
        // Find closest anchor tag
        const link = e.target.closest('a');
        
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Skip if no href, external link, hash link, or special protocols
        if (!href || 
            href.startsWith('http') || 
            href.startsWith('//') || 
            href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            link.target === '_blank' ||
            link.hasAttribute('download')) {
            return;
        }
        
        // Check if it's an internal HTML page
        if (href.endsWith('.html') || href === '' || href === '/') {
            e.preventDefault();
            
            // Don't navigate if clicking the current page
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const targetPath = href || 'index.html';
            
            if (currentPath === targetPath) {
                return;
            }
            
            // Use router for smooth transition
            if (window.router) {
                window.router.navigateTo(href);
            } else {
                window.location.href = href;
            }
        }
    });
}

// Initialize smooth navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSmoothNavigation);
} else {
    setupSmoothNavigation();
}

// Export for global use
window.router = router;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.navigateTo = navigateTo;
