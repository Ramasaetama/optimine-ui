/**
 * OptiMine SPA - Home Page
 */

import { App } from '../../app.js';
import { t, getSection } from '../../utils/translations.js';
import { animate } from '../../utils/index.js';

/**
 * Get user name from localStorage
 * @returns {string} User name or empty string
 */
const getUserName = () => {
    try {
        const userData = localStorage.getItem('optimine-user');
        if (userData) {
            const user = JSON.parse(userData);
            return user.name || user.nama || '';
        }
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
    return '';
};

/**
 * Check if user is logged in
 */
const isLoggedIn = () => {
    return localStorage.getItem('optimine-logged-in') === 'true';
};

/**
 * Initialize typewriter effect for welcome message
 */
const initTypewriter = () => {
    const welcomeElement = document.getElementById('welcome-title');
    if (!welcomeElement) return;
    
    const userName = getUserName();
    
    if (isLoggedIn() && userName) {
        animate.typewriterWelcome(welcomeElement, 'Welcome Back, ', userName, 70);
    } else {
        animate.typewriterWelcome(welcomeElement, 'Welcome to ', 'OptiMine', 70);
    }
};

const template = () => {
    const lang = App.Model.getState('language') || 'id';
    const home = getSection(lang, 'home');
    
    return `
<div class="min-h-[calc(100vh-4rem)] pt-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <!-- ========================================
             WELCOME SECTION
        ======================================== -->
        <section class="mb-8 animate-fade-in stagger-1">
            <div class="glass border border-border rounded-2xl p-6 md:p-8 border-glow">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <!-- Left: Title & Subtitle -->
                    <div>
                        <h1 id="welcome-title" class="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 welcome-typewriter">
                            <!-- Typewriter effect will be inserted here -->
                        </h1>
                        <p class="text-muted-foreground">
                            ${home.subtitle}
                        </p>
                    </div>
                    
                    <!-- Right: Stats Cards -->
                    <div class="flex flex-wrap gap-3 lg:gap-4">
                        <!-- Active Sites -->
                        <div class="stat-card rounded-xl bg-secondary/50 border border-border px-5 py-3 text-center min-w-[100px]">
                            <p class="stat-value text-2xl lg:text-3xl font-bold text-primary" data-target="24" data-suffix="" data-duration="2000">0</p>
                            <p class="text-xs text-muted-foreground uppercase tracking-wide">${home.activeSites}</p>
                        </div>
                        <!-- Fleet Units -->
                        <div class="stat-card rounded-xl bg-secondary/50 border border-border px-5 py-3 text-center min-w-[100px]">
                            <p class="stat-value text-2xl lg:text-3xl font-bold text-emerald-400" data-target="156" data-suffix="" data-duration="2000">0</p>
                            <p class="text-xs text-muted-foreground uppercase tracking-wide">${home.fleetUnits}</p>
                        </div>
                        <!-- Efficiency -->
                        <div class="stat-card rounded-xl bg-secondary/50 border border-border px-5 py-3 text-center min-w-[100px]">
                            <p class="stat-value text-2xl lg:text-3xl font-bold text-orange-400" data-target="98" data-suffix="%" data-duration="2000">0%</p>
                            <p class="text-xs text-muted-foreground uppercase tracking-wide">${home.efficiency}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================
             QUICK ACCESS SECTION
        ======================================== -->
        <section class="mb-8">
            <h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                ${home.quickAccess}
            </h2>
            <div class="grid md:grid-cols-3 gap-4">
                
                <!-- Card 1: AI Scenario Simulator -->
                <a href="#planning" class="glass border border-border rounded-xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group animate-fade-in stagger-2">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h3 class="font-semibold text-foreground mb-2">${home.aiScenario}</h3>
                    <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
                        ${home.aiScenarioDesc}
                    </p>
                    <span class="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        ${home.accessDashboard}
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </a>

                <!-- Card 2: AI Assistant Chatbot -->
                <a href="#ai-tools" class="glass border border-border rounded-xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group animate-fade-in stagger-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 class="font-semibold text-foreground mb-2">${home.aiChatbot}</h3>
                    <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
                        ${home.aiChatbotDesc}
                    </p>
                    <span class="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        ${home.accessDashboard}
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </a>

                <!-- Card 3: Operations Dashboard -->
                <a href="#dashboard" class="glass border border-border rounded-xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group animate-fade-in stagger-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 class="font-semibold text-foreground mb-2">${home.opsDashboard}</h3>
                    <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
                        ${home.opsDashboardDesc}
                    </p>
                    <span class="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        ${home.accessDashboard}
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </a>
            </div>
        </section>

        <!-- ========================================
             CAPABILITIES SECTION
        ======================================== -->
        <section class="mb-8 animate-fade-in stagger-5">
            <div class="flex flex-wrap justify-center gap-3">
                <!-- AI-Powered Analysis -->
                <div class="rounded-full bg-secondary/30 border border-border px-4 py-2 flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span class="text-sm text-muted-foreground">${home.aiPoweredAnalysis}</span>
                </div>
                
                <!-- Real-time Monitoring -->
                <div class="rounded-full bg-secondary/30 border border-border px-4 py-2 flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-muted-foreground">${home.realtimeMonitoring}</span>
                </div>
                
                <!-- Risk Mitigation -->
                <div class="rounded-full bg-secondary/30 border border-border px-4 py-2 flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default">
                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="text-sm text-muted-foreground">${home.riskMitigation}</span>
                </div>
                
                <!-- Cost Optimization -->
                <div class="rounded-full bg-secondary/30 border border-border px-4 py-2 flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="text-sm text-muted-foreground">${home.costOptimization}</span>
                </div>
            </div>
        </section>
        
    </div>
</div>
`;
};

/**
 * Home page handler
 */
export const homePage = async () => {
    await App.View.render(template(), 'home');
    // Initialize typewriter effect after render
    setTimeout(initTypewriter, 100);
    // Initialize stat counter animation
    animate.initStatCounters(800);
};
