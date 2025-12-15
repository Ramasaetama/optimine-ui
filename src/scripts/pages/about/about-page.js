/**
 * OptiMine SPA - About/Generic Page
 * Used as placeholder for routes under development
 */

import { App } from '../../app.js';
import { Router } from '../../routes/routes.js';
import { getSection } from '../../utils/translations.js';
import { API } from '../../data/api.js';

const templates = {
    planning: () => {
        const lang = App.Model.getState('language') || 'id';
        const p = getSection(lang, 'planning');

        return `
    <div class="min-h-[calc(100vh-4rem)] pt-6 relative">
        <!-- Background Effects -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <div class="radial-gradient absolute inset-0"></div>
            <div class="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    ${p.title}
                </h1>
                <p class="text-muted-foreground mt-2">
                    ${p.subtitle}
                </p>
            </div>

            <!-- Main Grid: 2/3 Input, 1/3 Status -->
            <div class="grid lg:grid-cols-3 gap-6">
                
                <!-- LEFT: Input Section (2/3) -->
                <div class="lg:col-span-2 space-y-6">
                    
                    <!-- Weather Conditions Card -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-1">
                        <h2 class="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            ${p.weatherConditions}
                        </h2>
                        
                        <div class="space-y-6">
                            <!-- Rainfall Level Slider -->
                            <div>
                                <label class="block text-sm font-medium text-muted-foreground mb-3">${p.rainfallLevel}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value="50"
                                    class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-primary"
                                >
                                <div class="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>${p.low}</span>
                                    <span>${p.high}</span>
                                </div>
                            </div>
                            
                            <!-- Wave Height Slider -->
                            <div>
                                <label class="block text-sm font-medium text-muted-foreground mb-3">${p.waveHeight}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value="35"
                                    class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-primary"
                                >
                                <div class="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>${p.calm}</span>
                                    <span>${p.rough}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fleet Status Card -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-2">
                        <h2 class="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            ${p.fleetStatus}
                        </h2>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-muted-foreground mb-2">${p.activeVehicles}</label>
                                <input 
                                    type="number" 
                                    value="25"
                                    class="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-muted-foreground mb-2">${p.maintenanceStatus}</label>
                                <input 
                                    type="number" 
                                    value="3"
                                    class="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ship Schedule Card -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-3">
                        <h2 class="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h2m-2 4h2m-2-8h2m4 8v-2a2 2 0 012-2h6a2 2 0 012 2v2M7 9V7a2 2 0 012-2h6a2 2 0 012 2v2m-4 4h.01M12 17h.01" />
                            </svg>
                            ${p.shipSchedule}
                        </h2>
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded-lg">
                                <span class="text-foreground">Vessel A - 08:00</span>
                                <span class="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">${p.active}</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded-lg">
                                <span class="text-foreground">Vessel B - 14:00</span>
                                <span class="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">${p.active}</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded-lg">
                                <span class="text-foreground">Vessel C - 20:00</span>
                                <span class="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">${p.active}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Generate Button -->
                    <button class="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 glow-hover animate-fade-in stagger-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        ${p.generatePlan}
                    </button>
                </div>
                
                <!-- RIGHT: Status Panel (1/3) -->
                <div class="lg:col-span-1 space-y-6">
                    
                    <!-- System Status Card -->
                    <div class="glass border border-border rounded-xl p-6 border-glow animate-fade-in stagger-2">
                        <h2 class="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            ${p.systemStatus}
                        </h2>
                        
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                <span class="relative flex h-3 w-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span class="text-emerald-400 font-medium">${p.aiSystemOnline}</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                <span class="relative flex h-3 w-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                <span class="text-primary font-medium">${p.n8nReady}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Active Alerts Card -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-3">
                        <h2 class="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            ${p.activeAlerts}
                        </h2>
                        
                        <div class="space-y-3">
                            <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <p class="text-amber-400 text-sm">${p.alertRainfall}</p>
                            </div>
                            <div class="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                <p class="text-orange-400 text-sm">${p.alertMaintenance}</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    `;
    },

    'ai-tools': () => {
        const lang = App.Model.getState('language') || 'id';
        const ai = getSection(lang, 'aiTools');

        return `
    <div class="h-[calc(100vh-4rem)] pt-6">
        <div class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <!-- Header -->
            <div class="mb-6 animate-fade-in">
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground">${ai.title}</h1>
                <p class="text-muted-foreground mt-1">${ai.subtitle}</p>
            </div>
            
            <!-- Main Grid: Chat 3/4, Sidebar 1/4 -->
            <div class="grid lg:grid-cols-4 gap-6 h-[calc(100%-6rem)]">
                
                <!-- CHAT AREA (3/4) -->
                <div class="lg:col-span-3 flex flex-col glass border border-border rounded-xl overflow-hidden animate-fade-in stagger-1">
                    
                    <!-- Messages Area -->
                    <div class="flex-1 overflow-y-auto p-6 space-y-4" id="chat-messages">
                        
                        <!-- AI Message -->
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex-1 max-w-[85%]">
                                <div class="bg-secondary/50 border border-border rounded-2xl rounded-bl-sm p-4">
                                    <p class="text-foreground">${ai.greeting}</p>
                                </div>
                                <span class="text-xs text-muted-foreground mt-1 block">12:29 PM</span>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Input Area -->
                    <div class="border-t border-border p-4">
                        <div class="flex gap-3">
                            <input 
                                type="text" 
                                id="chat-input"
                                placeholder="${ai.placeholder}" 
                                class="flex-1 px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                            <button id="send-btn" class="px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 glow-hover flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- SIDEBAR (1/4) -->
                <div class="lg:col-span-1 space-y-4">
                    
                    <!-- AI Status Card -->
                    <div class="glass border border-border rounded-xl p-4 border-glow animate-fade-in stagger-2">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="relative flex h-3 w-3">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span class="text-emerald-400 font-semibold">${ai.aiOnline}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>${ai.responseTime}: &lt;2s</span>
                        </div>
                    </div>
                    
                    <!-- Suggested Prompts Card -->
                    <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-3">
                        <h3 class="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            ${ai.suggestedPrompts}
                        </h3>
                        <div class="space-y-2">
                            <button class="suggested-prompt w-full text-left p-3 text-xs text-muted-foreground bg-secondary/30 border border-border rounded-lg hover:border-primary/30 hover:text-foreground transition-all">
                                ${ai.prompt1}
                            </button>
                            <button class="suggested-prompt w-full text-left p-3 text-xs text-muted-foreground bg-secondary/30 border border-border rounded-lg hover:border-primary/30 hover:text-foreground transition-all">
                                ${ai.prompt2}
                            </button>
                            <button class="suggested-prompt w-full text-left p-3 text-xs text-muted-foreground bg-secondary/30 border border-border rounded-lg hover:border-primary/30 hover:text-foreground transition-all">
                                ${ai.prompt3}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Integration Info Card -->
                    <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-4">
                        <h3 class="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            ${ai.integration}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            ${ai.integrationDesc}
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    `;
    },

    dashboard: () => {
        const lang = App.Model.getState('language') || 'id';
        const d = getSection(lang, 'dashboard');

        return `
    <div class="min-h-screen pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="mb-8 animate-fade-in">
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    ${d.title}
                </h1>
                <p class="text-muted-foreground mt-2">
                    ${d.subtitle}
                </p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-muted-foreground">${d.totalProduction}</span>
                        <i data-lucide="trending-up" class="w-4 h-4 text-green-500"></i>
                    </div>
                    <p class="text-2xl font-bold text-foreground">24,580</p>
                    <p class="text-xs text-green-500">+12.5% ${d.fromLastMonth}</p>
                </div>
                
                <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-2">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-muted-foreground">${d.activeEquipment}</span>
                        <i data-lucide="truck" class="w-4 h-4 text-primary"></i>
                    </div>
                    <p class="text-2xl font-bold text-foreground">42</p>
                    <p class="text-xs text-muted-foreground">${d.outOfTotal}</p>
                </div>
                
                <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-muted-foreground">${d.efficiencyRate}</span>
                        <i data-lucide="gauge" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <p class="text-2xl font-bold text-foreground">94.2%</p>
                    <p class="text-xs text-amber-500">${d.target}: 95%</p>
                </div>
                
                <div class="glass border border-border rounded-xl p-4 animate-fade-in stagger-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-muted-foreground">${d.costSavings}</span>
                        <i data-lucide="dollar-sign" class="w-4 h-4 text-green-500"></i>
                    </div>
                    <p class="text-2xl font-bold text-foreground">$1.2M</p>
                    <p class="text-xs text-green-500">${d.thisQuarter}</p>
                </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6">
                <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-5">
                    <h3 class="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <i data-lucide="line-chart" class="w-5 h-5 text-primary"></i>
                        ${d.productionTrends}
                    </h3>
                    <div class="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
                        <p class="text-muted-foreground">${d.chartPlaceholder}</p>
                    </div>
                </div>
                
                <div class="glass border border-border rounded-xl p-6 animate-fade-in stagger-5">
                    <h3 class="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <i data-lucide="truck" class="w-5 h-5 text-primary"></i>
                        ${d.equipmentStatus}
                    </h3>
                    <div class="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
                        <p class="text-muted-foreground">${d.statusPlaceholder}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    },

    auth: () => {
        const lang = localStorage.getItem('optimine-language') || 'id';
        const a = getSection(lang, 'auth');

        return `
    <div class="min-h-screen flex items-center justify-center px-4 pt-6 pb-8">
        <div class="w-full max-w-md">
            <!-- Main Auth Card -->
            <div id="auth-card" class="glass border border-border rounded-2xl p-6 sm:p-8 animate-scale-in">
                <!-- Header with Logo -->
                <div class="text-center mb-6">
                    <img 
                        src="assets/images/b (192 x 192 piksel) (1).png" 
                        alt="OptiMine Logo" 
                        class="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-amber-500/50 shadow-lg"
                    >
                    <h1 class="font-heading text-2xl font-bold">
                        <span class="text-primary">Opti</span><span class="text-foreground">Mine</span>
                    </h1>
                    <p class="text-sm text-muted-foreground mt-1">Mining Value Chain Optimization Platform</p>
                </div>
                
                <!-- Tab Navigation -->
                <div class="grid grid-cols-2 bg-secondary/50 border border-border rounded-lg p-1 mb-6">
                    <button id="login-tab" class="auth-tab active py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300">
                        ${a.login}
                    </button>
                    <button id="register-tab" class="auth-tab py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300">
                        ${a.register}
                    </button>
                </div>
                
                <!-- LOGIN FORM -->
                <form id="login-form" class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.email}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input 
                                type="email" 
                                id="login-email" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="email@example.com"
                            >
                        </div>
                    </div>
                    
                    <!-- Password -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-sm font-medium text-foreground">${a.password}</label>
                            <button type="button" id="forgot-password-btn" class="text-xs text-primary hover:text-primary/80 transition-colors">
                                ${a.forgotPassword}
                            </button>
                        </div>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                type="password" 
                                id="login-password" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="••••••••"
                            >
                        </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        class="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 glow-hover mt-6"
                    >
                        ${a.signIn}
                    </button>
                </form>
                
                <!-- REGISTER FORM -->
                <form id="register-form" class="space-y-4 hidden">
                    <!-- Full Name -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.fullName}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="register-name" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="John Doe"
                            >
                        </div>
                    </div>
                    
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.email}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input 
                                type="email" 
                                id="register-email" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="email@example.com"
                            >
                        </div>
                    </div>
                    
                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.password}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                type="password" 
                                id="register-password" 
                                required 
                                minlength="6"
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="••••••••"
                            >
                        </div>
                        <!-- Password Strength Container (hidden by default) -->
                        <div id="password-info-container" class="hidden mt-3 p-3 bg-secondary/30 border border-border rounded-lg animate-fade-in">
                            <!-- Password Strength Indicator -->
                            <div id="password-strength-container" class="hidden mb-3">
                                <div class="flex gap-1 mb-1">
                                    <div id="strength-bar-1" class="h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300"></div>
                                    <div id="strength-bar-2" class="h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300"></div>
                                    <div id="strength-bar-3" class="h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300"></div>
                                    <div id="strength-bar-4" class="h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300"></div>
                                </div>
                                <p id="password-strength-text" class="text-xs font-medium"></p>
                            </div>
                            <!-- Password Requirements -->
                            <div id="password-requirements" class="space-y-1.5 text-xs">
                                <p id="req-title" class="text-muted-foreground font-medium mb-2"></p>
                                <p id="req-length" class="flex items-center gap-2 text-muted-foreground">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                    </svg>
                                    <span></span>
                                </p>
                                <p id="req-uppercase" class="flex items-center gap-2 text-muted-foreground">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                    </svg>
                                    <span></span>
                                </p>
                                <p id="req-number" class="flex items-center gap-2 text-muted-foreground">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                    </svg>
                                    <span></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Confirm Password -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.confirmPassword}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                type="password" 
                                id="register-confirm-password" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="••••••••"
                            >
                        </div>
                    </div>
                    
                    <!-- Role Dropdown -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.role}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <select 
                                id="register-role" 
                                required 
                                class="w-full pl-10 pr-10 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="mine_planner">${a.miningPlanner}</option>
                                <option value="shipping_planner">${a.shippingPlanner}</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        class="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 glow-hover mt-2"
                    >
                        ${a.createAccount}
                    </button>
                </form>
            </div>
            
            <!-- FORGOT PASSWORD CARD -->
            <div id="forgot-password-card" class="glass border border-border rounded-2xl p-6 sm:p-8 animate-scale-in hidden">
                <!-- Header -->
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 class="font-heading text-xl font-bold text-foreground">${a.resetPassword}</h2>
                    <p class="text-sm text-muted-foreground mt-2">${a.resetDesc}</p>
                </div>
                
                <form id="forgot-password-form" class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${a.email}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input 
                                type="email" 
                                id="forgot-email" 
                                required 
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="email@example.com"
                            >
                        </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        class="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 glow-hover"
                    >
                        ${a.sendResetLink}
                    </button>
                    
                    <!-- Back to Login -->
                    <button 
                        type="button" 
                        id="back-to-login-btn"
                        class="w-full py-3 bg-secondary/50 hover:bg-secondary/70 text-foreground border border-border rounded-lg font-medium transition-all duration-300"
                    >
                        ${a.backToLogin}
                    </button>
                </form>
            </div>
        </div>
    </div>
    `;
    },

    profile: () => {
        const user = JSON.parse(localStorage.getItem('optimine-user') || '{}');
        const theme = localStorage.getItem('optimine-theme') || 'dark';
        const lang = localStorage.getItem('optimine-language') || 'id';
        const pr = getSection(lang, 'profile');

        return `
        <div class="min-h-screen pt-6 pb-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl mx-auto">
                <div class="mb-8 animate-fade-in">
                    <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground">
                        ${pr.title}
                    </h1>
                    <p class="text-muted-foreground mt-2">
                        ${pr.subtitle}
                    </p>
                </div>

                <div class="glass border border-border rounded-xl p-6 mb-6 animate-fade-in stagger-1">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            ${(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 class="text-xl font-semibold text-foreground">${user.name || 'User'}</h2>
                            <p class="text-muted-foreground">${user.email || 'user@example.com'}</p>
                            <span class="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">${user.role || 'member'}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1">${pr.displayName}</label>
                            <input type="text" value="${user.name || ''}" class="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1">${pr.email}</label>
                            <input type="email" value="${user.email || ''}" disabled class="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-muted-foreground">
                        </div>
                    </div>
                </div>

                <div class="glass border border-border rounded-xl p-6 mb-6 animate-fade-in stagger-2">
                    <h3 class="font-semibold text-foreground mb-4">${pr.preferences}</h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-foreground">${pr.darkMode}</p>
                                <p class="text-sm text-muted-foreground">${pr.useDarkTheme}</p>
                            </div>
                            <button id="profile-theme-toggle" class="relative w-12 h-6 bg-secondary rounded-full transition-colors ${theme === 'dark' ? 'bg-primary/30' : ''}">
                                <span class="absolute left-1 top-1 w-4 h-4 bg-foreground rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6 bg-primary' : ''}"></span>
                            </button>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-foreground">${pr.language}</p>
                                <p class="text-sm text-muted-foreground">${pr.selectLanguage}</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="profile-lang-btn px-3 py-1.5 text-sm rounded-md transition-colors ${lang === 'en' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/50'}" data-lang="en">🇬🇧 EN</button>
                                <button class="profile-lang-btn px-3 py-1.5 text-sm rounded-md transition-colors ${lang === 'id' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/50'}" data-lang="id">🇮🇩 ID</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button id="logout-btn" class="w-full py-2.5 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 animate-fade-in stagger-3">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    ${pr.signOut}
                </button>
            </div>
        </div>
        `;
    }
};

/**
 * Setup auth form handlers
 */
const setupAuthHandlers = () => {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    let loginForm = document.getElementById('login-form');
    let registerForm = document.getElementById('register-form');
    const authCard = document.getElementById('auth-card');
    const forgotPasswordCard = document.getElementById('forgot-password-card');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    // Clone forms to remove all previous event listeners (prevent duplicate handlers)
    if (loginForm) {
        const loginFormClone = loginForm.cloneNode(true);
        loginForm.replaceWith(loginFormClone);
        loginForm = loginFormClone;
    }
    if (registerForm) {
        const registerFormClone = registerForm.cloneNode(true);
        registerForm.replaceWith(registerFormClone);
        registerForm = registerFormClone;
    }

    // Tab switching - Login
    loginTab?.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab?.classList.remove('active');
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
    });

    // Tab switching - Register
    registerTab?.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab?.classList.remove('active');
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
    });

    // Password Strength Checker
    const registerPassword = document.getElementById('register-password');
    const passwordInfoContainer = document.getElementById('password-info-container');
    const strengthContainer = document.getElementById('password-strength-container');
    const strengthText = document.getElementById('password-strength-text');
    const strengthBars = [
        document.getElementById('strength-bar-1'),
        document.getElementById('strength-bar-2'),
        document.getElementById('strength-bar-3'),
        document.getElementById('strength-bar-4')
    ];
    const reqTitle = document.getElementById('req-title');
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');

    // Get current language translations
    const getAuthTranslations = () => {
        const lang = localStorage.getItem('optimine-language') || 'id';
        return window.getSection ? window.getSection(lang, 'auth') : {
            passwordRequirements: lang === 'en' ? 'Password Requirements:' : 'Persyaratan Password:',
            minLength: lang === 'en' ? 'Minimum 6 characters' : 'Minimal 6 karakter',
            uppercase: lang === 'en' ? 'Uppercase letter (A-Z)' : 'Huruf kapital (A-Z)',
            number: lang === 'en' ? 'Number (0-9)' : 'Angka (0-9)',
            weak: lang === 'en' ? 'Weak' : 'Lemah',
            medium: lang === 'en' ? 'Medium' : 'Sedang',
            fair: lang === 'en' ? 'Fair' : 'Cukup Kuat',
            strong: lang === 'en' ? 'Strong' : 'Kuat',
            passwordError: lang === 'en' ? 'Password must be at least 6 characters, contain uppercase letter and number!' : 'Password harus minimal 6 karakter, mengandung huruf kapital dan angka!',
            passwordMismatch: lang === 'en' ? 'Passwords do not match!' : 'Password tidak cocok!'
        };
    };

    // Initialize requirement texts
    const initPasswordRequirements = () => {
        const t = getAuthTranslations();
        if (reqTitle) reqTitle.textContent = t.passwordRequirements;
        if (reqLength) reqLength.querySelector('span').textContent = t.minLength;
        if (reqUppercase) reqUppercase.querySelector('span').textContent = t.uppercase;
        if (reqNumber) reqNumber.querySelector('span').textContent = t.number;
    };

    const checkPasswordStrength = (password) => {
        const t = getAuthTranslations();
        let strength = 0;
        const checks = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            lowercase: /[a-z]/.test(password)
        };

        // Update requirement indicators
        updateRequirement(reqLength, checks.length, t.minLength);
        updateRequirement(reqUppercase, checks.uppercase, t.uppercase);
        updateRequirement(reqNumber, checks.number, t.number);

        // Calculate strength
        if (checks.length) strength++;
        if (checks.uppercase) strength++;
        if (checks.number) strength++;
        if (checks.special || (checks.lowercase && password.length >= 8)) strength++;

        return { strength, checks };
    };

    const updateRequirement = (element, isValid, text) => {
        if (!element) return;
        if (isValid) {
            element.classList.remove('text-muted-foreground');
            element.classList.add('text-green-500');
            element.innerHTML = `
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>${text}</span>
            `;
        } else {
            element.classList.add('text-muted-foreground');
            element.classList.remove('text-green-500');
            element.innerHTML = `
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                </svg>
                <span>${text}</span>
            `;
        }
    };

    const updateStrengthUI = (strength) => {
        const t = getAuthTranslations();
        const colors = {
            0: { bar: 'bg-secondary', text: '', label: '' },
            1: { bar: 'bg-red-500', text: 'text-red-500', label: t.weak },
            2: { bar: 'bg-orange-500', text: 'text-orange-500', label: t.medium },
            3: { bar: 'bg-yellow-500', text: 'text-yellow-500', label: t.fair },
            4: { bar: 'bg-green-500', text: 'text-green-500', label: t.strong }
        };

        const config = colors[strength];

        // Update bars
        strengthBars.forEach((bar, index) => {
            if (!bar) return;
            bar.className = 'h-1.5 flex-1 rounded-full transition-colors duration-300';
            if (index < strength) {
                bar.classList.add(config.bar);
            } else {
                bar.classList.add('bg-secondary');
            }
        });

        // Update text
        if (strengthText) {
            strengthText.textContent = config.label;
            strengthText.className = `text-xs font-medium ${config.text}`;
        }
    };

    // Show password info on focus
    registerPassword?.addEventListener('focus', () => {
        initPasswordRequirements();
        passwordInfoContainer?.classList.remove('hidden');
    });

    // Hide password info on blur (only if empty)
    registerPassword?.addEventListener('blur', () => {
        if (!registerPassword.value) {
            passwordInfoContainer?.classList.add('hidden');
            strengthContainer?.classList.add('hidden');
        }
    });

    registerPassword?.addEventListener('input', (e) => {
        const password = e.target.value;
        const t = getAuthTranslations();

        // Always show container when typing
        passwordInfoContainer?.classList.remove('hidden');

        if (password.length > 0) {
            strengthContainer?.classList.remove('hidden');
            const { strength } = checkPasswordStrength(password);
            updateStrengthUI(strength);
        } else {
            strengthContainer?.classList.add('hidden');
            updateStrengthUI(0);
            // Reset requirements with translations
            updateRequirement(reqLength, false, t.minLength);
            updateRequirement(reqUppercase, false, t.uppercase);
            updateRequirement(reqNumber, false, t.number);
        }
    });

    // Show Forgot Password
    forgotPasswordBtn?.addEventListener('click', () => {
        authCard?.classList.add('hidden');
        forgotPasswordCard?.classList.remove('hidden');
    });

    // Back to Login from Forgot Password
    backToLoginBtn?.addEventListener('click', () => {
        forgotPasswordCard?.classList.add('hidden');
        authCard?.classList.remove('hidden');
        // Reset to login tab
        loginTab?.classList.add('active');
        registerTab?.classList.remove('active');
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
    });

    // Login Form Submit
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        // Add loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;
            submitBtn.disabled = true;
        }

        await App.Presenter.handleLogin(email, password);

        // Reset button
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Register Form Submit
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;
        const role = document.getElementById('register-role')?.value;

        // Get translations for error messages
        const t = getAuthTranslations();

        // Validate password requirements
        const hasMinLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasMinLength || !hasUppercase || !hasNumber) {
            // Don't show toast here - let Presenter handle it
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            // Don't show toast here - let Presenter handle it
            return;
        }

        // Add loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;
            submitBtn.disabled = true;
        }

        await App.Presenter.handleRegister(name, email, password, role);

        // Reset button
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Forgot Password Form Submit
    forgotPasswordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email')?.value;
        const lang = localStorage.getItem('optimine-language') || 'id';

        if (!email) {
            App.View.showToast(lang === 'en' ? 'Please enter your email' : 'Silakan masukkan email Anda', 'error');
            return;
        }

        // Add loading state
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;
            submitBtn.disabled = true;
        }

        try {
            // Call backend API to send reset password email
            await API.auth.forgotPassword(email);

            // Show success message
            App.View.showToast(
                lang === 'en'
                    ? 'Password reset link has been sent to your email'
                    : 'Link reset password telah dikirim ke email Anda',
                'success'
            );

            // Clear form and go back to login
            document.getElementById('forgot-email').value = '';
            forgotPasswordCard?.classList.add('hidden');
            authCard?.classList.remove('hidden');

        } catch (error) {
            console.error('Forgot password error:', error);
            App.View.showToast(
                error.message || (lang === 'en' ? 'Failed to send reset link' : 'Gagal mengirim link reset'),
                'error'
            );
        } finally {
            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
};

/**
 * Setup profile handlers
 */
const setupProfileHandlers = () => {
    let logoutBtn = document.getElementById('logout-btn');
    let themeToggle = document.getElementById('profile-theme-toggle');
    const langBtns = document.querySelectorAll('.profile-lang-btn');

    // Clone buttons to remove all previous event listeners (prevent duplicate handlers)
    if (logoutBtn) {
        const logoutBtnClone = logoutBtn.cloneNode(true);
        logoutBtn.replaceWith(logoutBtnClone);
        logoutBtn = logoutBtnClone;
    }
    if (themeToggle) {
        const themeToggleClone = themeToggle.cloneNode(true);
        themeToggle.replaceWith(themeToggleClone);
        themeToggle = themeToggleClone;
    }

    logoutBtn?.addEventListener('click', () => {
        App.Presenter.handleLogout();
    });

    themeToggle?.addEventListener('click', () => {
        App.Model.toggleTheme();
        const dot = themeToggle.querySelector('span');
        const isDark = App.Model.getState('theme') === 'dark';
        dot?.classList.toggle('translate-x-6', isDark);
        dot?.classList.toggle('bg-primary', isDark);
        themeToggle.classList.toggle('bg-primary/30', isDark);
    });

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            App.Model.setLanguage(lang);
            // Re-render profile page to apply translations
            Router.handleRouteChange();
        });
    });
};

/**
 * Setup AI Chat handlers
 */
const setupChatHandlers = () => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('chat-messages');
    const suggestedPrompts = document.querySelectorAll('.suggested-prompt');

    // Function to add a message to chat
    const addMessage = (content, isUser = false) => {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const messageHTML = isUser ? `
            <div class="flex items-start gap-3 justify-end">
                <div class="flex-1 max-w-[85%] flex flex-col items-end">
                    <div class="bg-primary text-primary-foreground rounded-2xl rounded-br-sm p-4">
                        <p>${content}</p>
                    </div>
                    <span class="text-xs text-muted-foreground mt-1">${time}</span>
                </div>
                <div class="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        ` : `
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div class="flex-1 max-w-[85%]">
                    <div class="bg-secondary/50 border border-border rounded-2xl rounded-bl-sm p-4">
                        <p class="text-foreground">${content}</p>
                    </div>
                    <span class="text-xs text-muted-foreground mt-1 block">${time}</span>
                </div>
            </div>
        `;

        messagesContainer?.insertAdjacentHTML('beforeend', messageHTML);

        // Auto-scroll to bottom
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // Function to send message
    const sendMessage = () => {
        const message = chatInput?.value?.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);

        // Clear input
        if (chatInput) chatInput.value = '';

        // Simulate AI response (in real app, this would call an API)
        setTimeout(() => {
            const responses = [
                "Based on current weather conditions and fleet status, I recommend adjusting the mining schedule to avoid peak rainfall hours.",
                "I've analyzed your query. The current conditions suggest optimal production can be achieved by reallocating 3 vehicles from Site A to Site B.",
                "According to the latest data, shipping delays are expected to be minimal today. I recommend proceeding with the scheduled departures.",
                "I've processed your request. The AI analysis indicates that maintenance should be scheduled during low-activity periods to minimize operational impact."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, false);
        }, 1000);
    };

    // Send button click
    sendBtn?.addEventListener('click', sendMessage);

    // Enter key to send
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Suggested prompts click
    suggestedPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const promptText = btn.textContent?.trim();
            if (chatInput && promptText) {
                chatInput.value = promptText;
                chatInput.focus();
            }
        });
    });
};

/**
 * About page handler - generic page renderer
 */
export const aboutPage = async (params) => {
    const route = Router.getCurrentRoute();
    const template = templates[route] || templates.planning;

    await App.View.render(typeof template === 'function' ? template() : template, route);

    // Setup handlers based on route
    if (route === 'auth') {
        setupAuthHandlers();
    } else if (route === 'profile') {
        setupProfileHandlers();
    } else if (route === 'ai-tools') {
        setupChatHandlers();
    }
};
