/**
 * OptiMine SPA - Planning Page
 * Production Planning with AI-powered optimization
 */

import { App } from '../../app.js';

// ========================================
// API Configuration
// ========================================
// Always use VPS Backend URL
const API_BASE_URL = 'http://139.59.224.58:5000';
const PLAN_API_URL = `${API_BASE_URL}/ai/plan`;
const SHIPPING_API_URL = `${API_BASE_URL}/shipping-schedules`;

// ========================================
// Helper: Get User Role from LocalStorage
// ========================================
function getUserRole() {
    try {
        const user = JSON.parse(localStorage.getItem('optimine-user') || '{}');
        return user.role || 'shipping_planner'; // default to shipping_planner
    } catch {
        return 'shipping_planner';
    }
}

// ========================================
// Planning Page State
// ========================================
const PlanningState = {
    rainfall_mm: 0.5,
    wind_speed_kmh: 0.4,
    // Shipping Planner fields
    activeVehicles: 25,
    maintenanceStatus: 3,
    totalFleet: 40,
    vessels: [],
    // Mining Planner fields
    excavatorActive: 8,
    dumpTruckActive: 15,
    miningMaintenanceStatus: 2,
    selectedShift: 'pagi',
    // Common
    isLoading: false,
    result: null
};

// ========================================
// Loading Steps
// ========================================
const loadingSteps = [
    { icon: '📡', text: 'Mengirim data telemetri ke Server...', duration: 2000 },
    { icon: '🌩️', text: 'Menganalisis dampak cuaca & gelombang...', duration: 2000 },
    { icon: '🤖', text: 'AI menyusun strategi optimal...', duration: null }
];

/**
 * Planning Page Handler
 */
export const planningPage = async (params) => {
    const content = getPlanningTemplate();
    await App.View.render(content, 'planning');

    // Initialize after render
    setTimeout(() => {
        initPlanningPage();
    }, 100);
};

/**
 * Get Planning Page Template
 */
function getPlanningTemplate() {
    const role = getUserRole();
    const isMiningPlanner = role === 'mining_planner';

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Header -->
            <section id="page-header" class="mb-8 animate-fade-in">
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    ${isMiningPlanner ? 'Perencanaan Tambang' : 'Perencanaan Produksi'}
                </h1>
                <p class="text-muted-foreground">
                    ${isMiningPlanner
            ? 'Masukkan kondisi operasional tambang untuk menghasilkan rencana yang dioptimalkan'
            : 'Masukkan kondisi operasional untuk menghasilkan rencana yang dioptimalkan'}
                </p>
                <div class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isMiningPlanner ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}">
                    <span class="w-2 h-2 rounded-full ${isMiningPlanner ? 'bg-amber-400' : 'bg-cyan-400'}"></span>
                    ${isMiningPlanner ? 'Mining Planner' : 'Shipping Planner'}
                </div>
            </section>

            <!-- Main Grid Layout -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Input Section (2/3 width) -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Weather Conditions Card (Same for both roles) -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in" style="animation-delay: 0.1s;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <h2 class="font-heading font-semibold text-lg text-foreground">Kondisi Cuaca</h2>
                        </div>

                        <!-- Rainfall Slider -->
                        <div class="mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <label class="block text-sm text-muted-foreground">Curah Hujan</label>
                                <span id="rainfall-value" class="text-sm font-medium text-primary">0.5 mm</span>
                            </div>
                            <div class="slider-container">
                                <input type="range" id="rainfall-slider" class="slider-primary w-full" min="0" max="50" step="0.1" value="0.5">
                                <div class="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>0 mm</span>
                                    <span>50 mm</span>
                                </div>
                            </div>
                        </div>

                        <!-- Wind Speed Slider -->
                        <div>
                            <div class="flex justify-between items-center mb-3">
                                <label class="block text-sm text-muted-foreground">Kecepatan Angin</label>
                                <span id="wind-value" class="text-sm font-medium text-primary">0.4 km/h</span>
                            </div>
                            <div class="slider-container">
                                <input type="range" id="wave-slider" class="slider-primary w-full" min="0" max="10" step="0.1" value="0.4">
                                <div class="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>0 km/h</span>
                                    <span>10 km/h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fleet/Equipment Status Card (Role-based) -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in" style="animation-delay: 0.2s;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                ${isMiningPlanner ? `
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                ` : `
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                `}
                            </div>
                            <h2 class="font-heading font-semibold text-lg text-foreground">
                                ${isMiningPlanner ? 'Status Peralatan Tambang' : 'Status Armada'}
                            </h2>
                        </div>

                        ${isMiningPlanner ? `
                        <!-- Mining Planner: Equipment Status -->
                        <div class="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Excavator Aktif</label>
                                <input type="number" id="excavator-active" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="8" min="0">
                            </div>
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Dump Truck Aktif</label>
                                <input type="number" id="dump-truck-active" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="15" min="0">
                            </div>
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Status Perawatan</label>
                                <input type="number" id="mining-maintenance-status" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="2" min="0">
                            </div>
                        </div>
                        ` : `
                        <!-- Shipping Planner: Fleet Status -->
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Kendaraan Aktif</label>
                                <input type="number" id="active-vehicles" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="25" min="0">
                            </div>
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Status Perawatan</label>
                                <input type="number" id="maintenance-status" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="3" min="0">
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- Schedule Card (Role-based) -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in" style="animation-delay: 0.3s;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                ${isMiningPlanner ? `
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ` : `
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                `}
                            </div>
                            <h2 class="font-heading font-semibold text-lg text-foreground">
                                ${isMiningPlanner ? 'Jadwal Produksi' : 'Jadwal Kapal'}
                            </h2>
                        </div>

                        ${isMiningPlanner ? `
                        <!-- Mining Planner: Production Schedule -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm text-muted-foreground mb-3">Pilih Shift Produksi</label>
                                <div class="grid grid-cols-3 gap-3">
                                    <button type="button" id="shift-pagi" class="shift-btn active p-4 bg-primary/20 border-2 border-primary rounded-lg text-center transition-all hover:bg-primary/30" data-shift="pagi">
                                        <div class="text-2xl mb-1">🌅</div>
                                        <div class="text-sm font-medium text-foreground">Pagi</div>
                                        <div class="text-xs text-muted-foreground">06:00 - 14:00</div>
                                    </button>
                                    <button type="button" id="shift-siang" class="shift-btn p-4 bg-secondary/50 border-2 border-border rounded-lg text-center transition-all hover:bg-secondary" data-shift="siang">
                                        <div class="text-2xl mb-1">☀️</div>
                                        <div class="text-sm font-medium text-foreground">Siang</div>
                                        <div class="text-xs text-muted-foreground">14:00 - 22:00</div>
                                    </button>
                                    <button type="button" id="shift-malam" class="shift-btn p-4 bg-secondary/50 border-2 border-border rounded-lg text-center transition-all hover:bg-secondary" data-shift="malam">
                                        <div class="text-2xl mb-1">🌙</div>
                                        <div class="text-sm font-medium text-foreground">Malam</div>
                                        <div class="text-xs text-muted-foreground">22:00 - 06:00</div>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm text-muted-foreground mb-2">Target Produksi Harian (ton)</label>
                                <input type="number" id="target-production" class="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" value="5000" min="0" step="100">
                            </div>
                        </div>
                        ` : `
                        <!-- Shipping Planner: Vessel Schedule -->
                        <div id="vessels-container" class="space-y-3">
                            <div class="flex items-center justify-center p-4 text-muted-foreground text-sm">
                                <svg class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memuat jadwal kapal...
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- Generate Button -->
                    <button id="generate-btn" class="w-full h-14 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 glow-hover transition-all duration-300 animate-fade-in" style="animation-delay: 0.4s;">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>Hasilkan Rencana Optimal</span>
                    </button>

                    <!-- Loading Container (Hidden by default) -->
                    <div id="loading-container" class="hidden w-full">
                        <div class="glass border border-border rounded-xl p-8 animate-fade-in">
                            <div class="flex flex-col items-center justify-center gap-4">
                                <div class="relative">
                                    <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span id="loading-icon" class="text-3xl">📡</span>
                                    </div>
                                    <div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                                </div>
                                <p id="loading-text" class="text-lg font-medium text-foreground text-center">
                                    Mengirim data telemetri ke Server...
                                </p>
                                <div class="flex gap-2 mt-2">
                                    <div class="w-2 h-2 rounded-full bg-primary animate-pulse" style="animation-delay: 0ms;"></div>
                                    <div class="w-2 h-2 rounded-full bg-primary animate-pulse" style="animation-delay: 200ms;"></div>
                                    <div class="w-2 h-2 rounded-full bg-primary animate-pulse" style="animation-delay: 400ms;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Result Dashboard (Hidden by default) -->
                    <div id="result-dashboard" class="hidden w-full space-y-6 animate-fade-in">
                        <div class="flex items-center justify-between flex-wrap gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="font-heading font-bold text-xl text-foreground">Rencana Optimasi Operasional</h2>
                                    <p id="result-timestamp" class="text-sm text-muted-foreground"></p>
                                </div>
                            </div>
                            <button id="new-plan-btn" class="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Buat Rencana Baru
                            </button>
                        </div>
                        <div class="grid sm:grid-cols-3 gap-4" id="metrics-grid"></div>
                        <div id="recommendations-container" class="space-y-4"></div>
                    </div>
                </div>

                <!-- Status Panel (1/3 width) -->
                <div class="space-y-6">
                    <!-- System Status Card -->
                    <div class="glass border border-border rounded-xl p-6 border-glow animate-fade-in" style="animation-delay: 0.2s;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 class="font-heading font-semibold text-lg text-foreground">Status Sistem</h2>
                        </div>

                        <div class="space-y-3">
                            <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <div class="flex items-center gap-3">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span class="text-sm text-emerald-400 font-medium">Sistem AI Online</span>
                                </div>
                            </div>
                            <div class="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <div class="flex items-center gap-3">
                                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                                    <span class="text-sm text-primary font-medium">Integrasi RAG Siap</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Alerts Card -->
                    <div class="glass border border-border rounded-xl p-6 animate-fade-in" style="animation-delay: 0.3s;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 class="font-heading font-semibold text-lg text-foreground">Peringatan Aktif</h2>
                        </div>

                        <div class="space-y-3">
                            <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <span class="text-sm text-yellow-400">Curah hujan tinggi diperkirakan di Lokasi Tambang B</span>
                            </div>
                            <div class="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <span class="text-sm text-orange-400">2 kendaraan dijadwalkan untuk perawatan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize Planning Page
 */
function initPlanningPage() {
    const role = getUserRole();
    const isMiningPlanner = role === 'mining_planner';

    setupSliders();
    setupInputs();
    setupGenerateButton();

    if (isMiningPlanner) {
        setupMiningInputs();
    } else {
        loadVessels();
    }
}

/**
 * Setup Sliders
 */
function setupSliders() {
    const rainfallSlider = document.getElementById('rainfall-slider');
    const waveSlider = document.getElementById('wave-slider');

    if (rainfallSlider) {
        rainfallSlider.addEventListener('input', (e) => {
            PlanningState.rainfall_mm = parseFloat(e.target.value);
            updateSliderValueDisplays();
        });
    }

    if (waveSlider) {
        waveSlider.addEventListener('input', (e) => {
            PlanningState.wind_speed_kmh = parseFloat(e.target.value);
            updateSliderValueDisplays();
        });
    }
}

/**
 * Update Slider Value Displays
 */
function updateSliderValueDisplays() {
    const rainfallValue = document.getElementById('rainfall-value');
    const windValue = document.getElementById('wind-value');

    if (rainfallValue) {
        rainfallValue.textContent = `${PlanningState.rainfall_mm.toFixed(1)} mm`;
    }
    if (windValue) {
        windValue.textContent = `${PlanningState.wind_speed_kmh.toFixed(1)} km/h`;
    }
}

/**
 * Setup Inputs (Shipping Planner)
 */
function setupInputs() {
    const activeVehiclesInput = document.getElementById('active-vehicles');
    const maintenanceInput = document.getElementById('maintenance-status');

    if (activeVehiclesInput) {
        activeVehiclesInput.addEventListener('change', (e) => {
            PlanningState.activeVehicles = parseInt(e.target.value) || 0;
        });
    }

    if (maintenanceInput) {
        maintenanceInput.addEventListener('change', (e) => {
            PlanningState.maintenanceStatus = parseInt(e.target.value) || 0;
        });
    }
}

/**
 * Setup Mining Inputs (Mining Planner)
 */
function setupMiningInputs() {
    const excavatorInput = document.getElementById('excavator-active');
    const dumpTruckInput = document.getElementById('dump-truck-active');
    const miningMaintenanceInput = document.getElementById('mining-maintenance-status');
    const targetProductionInput = document.getElementById('target-production');
    const shiftButtons = document.querySelectorAll('.shift-btn');

    if (excavatorInput) {
        excavatorInput.addEventListener('change', (e) => {
            PlanningState.excavatorActive = parseInt(e.target.value) || 0;
        });
    }

    if (dumpTruckInput) {
        dumpTruckInput.addEventListener('change', (e) => {
            PlanningState.dumpTruckActive = parseInt(e.target.value) || 0;
        });
    }

    if (miningMaintenanceInput) {
        miningMaintenanceInput.addEventListener('change', (e) => {
            PlanningState.miningMaintenanceStatus = parseInt(e.target.value) || 0;
        });
    }

    if (targetProductionInput) {
        targetProductionInput.addEventListener('change', (e) => {
            PlanningState.targetProduction = parseInt(e.target.value) || 5000;
        });
    }

    // Shift button selection
    shiftButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            shiftButtons.forEach(b => {
                b.classList.remove('active', 'bg-primary/20', 'border-primary');
                b.classList.add('bg-secondary/50', 'border-border');
            });
            // Add active state to clicked button
            btn.classList.add('active', 'bg-primary/20', 'border-primary');
            btn.classList.remove('bg-secondary/50', 'border-border');
            PlanningState.selectedShift = btn.dataset.shift;
        });
    });
}

/**
 * Setup Generate Button
 */
function setupGenerateButton() {
    const generateBtn = document.getElementById('generate-btn');
    const newPlanBtn = document.getElementById('new-plan-btn');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => generateOptimizationPlan());
    }

    if (newPlanBtn) {
        newPlanBtn.addEventListener('click', () => resetToInput());
    }
}

/**
 * Load Vessels from API
 */
async function loadVessels() {
    const container = document.getElementById('vessels-container');
    if (!container) return;

    try {
        const token = localStorage.getItem('optimine-token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${SHIPPING_API_URL}?limit=5`, { headers });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const schedules = result.data || [];

        if (schedules.length === 0) {
            renderDefaultVessels(container);
            return;
        }

        PlanningState.vessels = schedules.map(s => ({
            id: s.shipment_id,
            name: s.vessel_name,
            etd: s.etd,
            status: s.status,
            destination: s.destination_port,
            tonnage: s.coal_tonnage
        }));

        renderVessels(container, schedules);

    } catch (error) {
        console.warn('Failed to load vessels, using defaults:', error.message);
        renderDefaultVessels(container);
    }
}

/**
 * Render Vessels
 */
function renderVessels(container, schedules) {
    container.innerHTML = schedules.map(s => {
        const etdDate = s.etd ? new Date(s.etd) : null;
        const timeStr = etdDate ? etdDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
        const statusClass = s.status?.toLowerCase() === 'scheduled' || s.status?.toLowerCase() === 'loading'
            ? 'bg-primary/20 text-primary'
            : 'bg-emerald-500/20 text-emerald-400';
        const statusText = s.status || 'Scheduled';

        return `
            <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                <div class="flex-1">
                    <span class="text-sm font-medium text-foreground">${s.vessel_name || 'Unknown Vessel'}</span>
                    <span class="text-xs text-muted-foreground ml-2">ETD: ${timeStr}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">${s.coal_tonnage?.toLocaleString() || '-'} ton</span>
                    <span class="px-2 py-1 text-xs font-medium ${statusClass} rounded">${statusText}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Default Vessels
 */
function renderDefaultVessels(container) {
    PlanningState.vessels = [
        { id: 'A', name: 'MV Samudera Jaya', time: '08:00', status: 'Scheduled' },
        { id: 'B', name: 'MV Nusantara', time: '14:00', status: 'Loading' },
        { id: 'C', name: 'MV Bahari Indah', time: '20:00', status: 'Scheduled' }
    ];

    container.innerHTML = PlanningState.vessels.map(v => `
        <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
            <span class="text-sm text-foreground">${v.name} - ${v.time}</span>
            <span class="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">${v.status}</span>
        </div>
    `).join('');
}

/**
 * Generate Optimization Plan
 */
async function generateOptimizationPlan() {
    if (PlanningState.isLoading) return;

    const generateBtn = document.getElementById('generate-btn');
    const loadingContainer = document.getElementById('loading-container');
    const resultDashboard = document.getElementById('result-dashboard');

    if (generateBtn) generateBtn.classList.add('hidden');
    if (resultDashboard) resultDashboard.classList.add('hidden');
    if (loadingContainer) loadingContainer.classList.remove('hidden');

    PlanningState.isLoading = true;

    const loadingPromise = runLoadingAnimation();

    try {
        const payload = buildPayload();
        console.log('📤 Sending payload to AI Plan:', payload);

        const response = await fetch(PLAN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📥 AI Plan response:', result);

        PlanningState.result = result;
        await loadingPromise;
        renderResultDashboard(result);

        App.View.showToast('Rencana optimasi berhasil dibuat!', 'success');

    } catch (error) {
        console.error('❌ Error generating plan:', error);
        console.log('🎭 Menggunakan Demo Mode karena API belum tersedia...');

        await loadingPromise;

        const demoResult = generateDemoResult();
        PlanningState.result = demoResult;
        renderResultDashboard(demoResult);

        App.View.showToast('Demo Mode: Menampilkan contoh hasil', 'info');
    } finally {
        PlanningState.isLoading = false;
    }
}

/**
 * Build Payload for API
 */
function buildPayload() {
    const role = getUserRole();
    const isMiningPlanner = role === 'mining_planner';

    const weather_input = {
        rainfall_mm: PlanningState.rainfall_mm,
        wind_speed_kmh: PlanningState.wind_speed_kmh,
        temperature_c: 30,
        humidity_pct: 80
    };

    let weather_condition = 'Mendung';
    if (PlanningState.rainfall_mm >= 1.0) {
        weather_condition = 'Hujan ringan';
    } else if (PlanningState.rainfall_mm < 0.1) {
        weather_condition = 'Berawan';
    }

    let road_condition = 'Good';
    if (PlanningState.rainfall_mm >= 1.0) {
        road_condition = 'Poor';
    } else if (PlanningState.rainfall_mm >= 0.3) {
        road_condition = 'Fair';
    }

    let capacity_input, production_input, additional_context;

    if (isMiningPlanner) {
        // Mining Planner payload
        const totalEquipment = PlanningState.excavatorActive + PlanningState.dumpTruckActive;
        const availability_pct = (totalEquipment / 30) * 100; // Assuming 30 total equipment capacity

        capacity_input = {
            availability_pct: parseFloat(availability_pct.toFixed(2)),
            road_condition: road_condition,
            weather_condition: weather_condition,
            mine_id: "MINE_1",
            equipment_type: "Mixed"
        };

        production_input = {
            planned_output_ton: PlanningState.targetProduction || 5000
        };

        const shiftLabels = { pagi: 'Pagi (06:00-14:00)', siang: 'Siang (14:00-22:00)', malam: 'Malam (22:00-06:00)' };

        additional_context =
            `[Mining Planner] Status cuaca: ${weather_condition}, curah hujan ${PlanningState.rainfall_mm.toFixed(1)}mm, angin ${PlanningState.wind_speed_kmh.toFixed(1)}km/h. ` +
            `Peralatan tambang: ${PlanningState.excavatorActive} Excavator aktif, ${PlanningState.dumpTruckActive} Dump Truck aktif, ${PlanningState.miningMaintenanceStatus} unit dalam perawatan. ` +
            `Kondisi jalan tambang: ${road_condition}. ` +
            `Shift produksi: ${shiftLabels[PlanningState.selectedShift] || 'Pagi'}. ` +
            `Target produksi harian: ${(PlanningState.targetProduction || 5000).toLocaleString()} ton.`;
    } else {
        // Shipping Planner payload
        const availability_pct = (PlanningState.activeVehicles / PlanningState.totalFleet) * 100;

        capacity_input = {
            availability_pct: parseFloat(availability_pct.toFixed(2)),
            road_condition: road_condition,
            weather_condition: weather_condition,
            mine_id: "MINE_1",
            equipment_type: "Excavator"
        };

        production_input = {
            planned_output_ton: 5000
        };

        const vesselInfo = PlanningState.vessels
            .map(v => v.name ? `${v.name} (${v.status})` : `Vessel ${v.id} - ${v.time} (${v.status})`)
            .join(', ');

        additional_context =
            `[Shipping Planner] Status cuaca: ${weather_condition}, curah hujan ${PlanningState.rainfall_mm.toFixed(1)}mm, angin ${PlanningState.wind_speed_kmh.toFixed(1)}km/h. ` +
            `Armada: ${PlanningState.activeVehicles} aktif dari ${PlanningState.totalFleet} total, ${PlanningState.maintenanceStatus} dalam perawatan. ` +
            `Kondisi jalan: ${road_condition}. ` +
            `Jadwal kapal: ${vesselInfo || 'Tidak ada data'}.`;
    }

    return {
        weather_input,
        capacity_input,
        production_input,
        additional_context
    };
}

/**
 * Run Loading Animation
 */
async function runLoadingAnimation() {
    const loadingIcon = document.getElementById('loading-icon');
    const loadingText = document.getElementById('loading-text');

    for (let i = 0; i < loadingSteps.length - 1; i++) {
        const step = loadingSteps[i];
        if (loadingIcon) loadingIcon.textContent = step.icon;
        if (loadingText) loadingText.textContent = step.text;
        await sleep(step.duration);
    }

    const finalStep = loadingSteps[loadingSteps.length - 1];
    if (loadingIcon) loadingIcon.textContent = finalStep.icon;
    if (loadingText) loadingText.textContent = finalStep.text;
}

/**
 * Sleep utility
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate Demo Result
 */
function generateDemoResult() {
    const role = getUserRole();
    const isMiningPlanner = role === 'mining_planner';
    const weatherClass = getWeatherClassFromRainfall(PlanningState.rainfall_mm);

    let capacity, narrative;

    if (isMiningPlanner) {
        const totalEquipment = PlanningState.excavatorActive + PlanningState.dumpTruckActive;
        capacity = Math.round((totalEquipment / 30) * (PlanningState.targetProduction || 5000));
        const shiftLabels = { pagi: 'Pagi', siang: 'Siang', malam: 'Malam' };

        narrative = `
**Strategi Utama:**
Berdasarkan analisis kondisi cuaca ${weatherClass} dengan curah hujan ${PlanningState.rainfall_mm.toFixed(1)}mm, disarankan untuk mengoptimalkan operasi penambangan pada shift ${shiftLabels[PlanningState.selectedShift] || 'Pagi'} dengan memaksimalkan utilisasi ${PlanningState.excavatorActive} unit Excavator dan ${PlanningState.dumpTruckActive} unit Dump Truck.

**Risiko Terdeteksi:**
- Curah hujan ${PlanningState.rainfall_mm >= 1.0 ? 'tinggi dapat mempengaruhi stabilitas pit dan kondisi jalan tambang' : 'rendah, kondisi operasional tambang optimal'}
- ${PlanningState.miningMaintenanceStatus} unit peralatan dalam perawatan perlu dijadwalkan kembali beroperasi
- Kecepatan angin ${PlanningState.wind_speed_kmh.toFixed(1)} km/h ${PlanningState.wind_speed_kmh > 5 ? 'perlu perhatian untuk operasi blasting' : 'dalam batas aman untuk semua operasi'}

**Tindakan Prioritas:**
1. Fokuskan Excavator pada front kerja dengan overburden ratio optimal
2. Koordinasikan Dump Truck untuk meminimalkan cycle time
3. Monitor kondisi pit dan jalan akses secara berkala
4. Target produksi harian: ${(PlanningState.targetProduction || 5000).toLocaleString()} ton
        `.trim();
    } else {
        capacity = Math.round((PlanningState.activeVehicles / PlanningState.totalFleet) * 5000);

        narrative = `
**Strategi Utama:**
Berdasarkan analisis kondisi cuaca ${weatherClass} dengan curah hujan ${PlanningState.rainfall_mm.toFixed(1)}mm, disarankan untuk mengoptimalkan jadwal operasional pada shift pagi ketika kondisi jalan masih optimal.

**Risiko Terdeteksi:**
- Curah hujan ${PlanningState.rainfall_mm >= 1.0 ? 'tinggi dapat menurunkan kapasitas hauling sebesar 15-20%' : 'rendah, kondisi operasional normal'}
- ${PlanningState.maintenanceStatus} unit kendaraan dalam perawatan perlu diprioritaskan untuk kembali beroperasi
- Kecepatan angin ${PlanningState.wind_speed_kmh.toFixed(1)} km/h ${PlanningState.wind_speed_kmh > 5 ? 'perlu monitoring untuk keamanan operasi crane' : 'dalam batas aman'}

**Tindakan Prioritas:**
1. Fokuskan operasi pada ${PlanningState.activeVehicles} unit kendaraan aktif
2. Koordinasi dengan jadwal kapal untuk optimasi loading
3. Monitor kondisi jalan secara berkala terutama area ramp
4. Siapkan contingency plan jika cuaca memburuk
        `.trim();
    }

    return {
        success: true,
        data: {
            ml_predictions: {
                weather_classification: weatherClass,
                effective_capacity_ton_per_day: capacity,
                confidence_score: 0.87,
                production_forecast: capacity * 0.9
            },
            narrative_recommendation: narrative
        }
    };
}

/**
 * Get Weather Class from Rainfall
 */
function getWeatherClassFromRainfall(rainfall) {
    if (rainfall >= 1.0) return 'Hujan ringan';
    if (rainfall >= 0.3) return 'Mendung';
    return 'Berawan';
}

/**
 * Get Weather Icon
 */
function getWeatherIcon(weatherClass) {
    const lower = weatherClass.toLowerCase();
    if (lower.includes('hujan')) return '🌧️';
    if (lower.includes('mendung')) return '☁️';
    return '⛅';
}

/**
 * Render Result Dashboard
 */
function renderResultDashboard(result) {
    const loadingContainer = document.getElementById('loading-container');
    const resultDashboard = document.getElementById('result-dashboard');
    const generateBtn = document.getElementById('generate-btn');

    if (loadingContainer) loadingContainer.classList.add('hidden');
    if (generateBtn) generateBtn.classList.add('hidden');
    if (resultDashboard) resultDashboard.classList.remove('hidden');

    const timestamp = document.getElementById('result-timestamp');
    if (timestamp) {
        const now = new Date();
        timestamp.textContent = `Dibuat pada ${now.toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })}`;
    }

    renderMetrics(result.data || result);
    renderRecommendations(result.data || result);
}

/**
 * Render Metrics
 */
function renderMetrics(data) {
    const metricsGrid = document.getElementById('metrics-grid');
    if (!metricsGrid) return;

    const predictions = data.ml_predictions || {};

    const weatherClass = predictions.weather_classification ||
        getWeatherClassFromRainfall(PlanningState.rainfall_mm);
    const weatherIcon = getWeatherIcon(weatherClass);

    const capacity = predictions.effective_capacity_ton_per_day ||
        predictions.capacity_forecast ||
        (PlanningState.activeVehicles * 50);

    const confidence = predictions.confidence_score ||
        predictions.model_confidence || 0.85;

    metricsGrid.innerHTML = `
        <div class="glass border border-border rounded-xl p-5 transition-all hover:border-primary/50">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">${weatherIcon}</span>
                <span class="text-sm text-muted-foreground">Kondisi Cuaca</span>
            </div>
            <p class="text-xl font-bold text-foreground">${weatherClass}</p>
            <p class="text-xs text-muted-foreground mt-1">
                ${PlanningState.rainfall_mm.toFixed(1)}mm curah hujan, ${PlanningState.wind_speed_kmh.toFixed(1)}km/h angin
            </p>
        </div>
        
        <div class="glass border border-border rounded-xl p-5 transition-all hover:border-primary/50">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">⚙️</span>
                <span class="text-sm text-muted-foreground">Kapasitas Efektif</span>
            </div>
            <p class="text-xl font-bold text-foreground">${Math.round(capacity).toLocaleString('id-ID')}</p>
            <p class="text-xs text-muted-foreground mt-1">Ton/Hari</p>
        </div>
        
        <div class="glass border border-border rounded-xl p-5 transition-all hover:border-primary/50">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">📊</span>
                <span class="text-sm text-muted-foreground">Confidence Score</span>
            </div>
            <p class="text-xl font-bold text-foreground">${(confidence * 100).toFixed(1)}%</p>
            <div class="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full" 
                     style="width: ${confidence * 100}%"></div>
            </div>
        </div>
    `;
}

/**
 * Render Recommendations
 */
function renderRecommendations(data) {
    const container = document.getElementById('recommendations-container');
    if (!container) return;

    const narrative = data.narrative_recommendation ||
        data.recommendation ||
        data.response ||
        'Tidak ada rekomendasi tersedia.';

    const sections = parseNarrativeToSections(narrative);

    let html = '';

    if (sections.strategy) {
        html += createRecommendationCard('📌', 'Strategi Utama', sections.strategy, 'from-primary/20 to-cyan-500/20');
    }
    if (sections.risks) {
        html += createRecommendationCard('⚠️', 'Risiko Terdeteksi', sections.risks, 'from-yellow-500/20 to-orange-500/20');
    }
    if (sections.actions) {
        html += createRecommendationCard('✅', 'Tindakan Prioritas', sections.actions, 'from-emerald-500/20 to-green-500/20');
    }

    if (!sections.strategy && !sections.risks && !sections.actions) {
        html = createRecommendationCard('💡', 'Rekomendasi AI', narrative, 'from-primary/20 to-blue-500/20');
    }

    container.innerHTML = html;
}

/**
 * Parse Narrative to Sections
 */
function parseNarrativeToSections(narrative) {
    const sections = { strategy: '', risks: '', actions: '' };

    const strategyMatch = narrative.match(/\*\*Strategi Utama:\*\*\s*([\s\S]*?)(?=\*\*Risiko|\*\*Tindakan|$)/i);
    const risksMatch = narrative.match(/\*\*Risiko Terdeteksi:\*\*\s*([\s\S]*?)(?=\*\*Strategi|\*\*Tindakan|$)/i);
    const actionsMatch = narrative.match(/\*\*Tindakan Prioritas:\*\*\s*([\s\S]*?)(?=\*\*Strategi|\*\*Risiko|$)/i);

    if (strategyMatch && strategyMatch[1]) {
        sections.strategy = strategyMatch[1].trim();
    }
    if (risksMatch && risksMatch[1]) {
        sections.risks = risksMatch[1].trim();
    }
    if (actionsMatch && actionsMatch[1]) {
        sections.actions = actionsMatch[1].trim();
    }

    if (!sections.strategy && !sections.risks && !sections.actions) {
        const paragraphs = narrative.split(/\n\n/).filter(p => p.trim());
        if (paragraphs.length >= 1) sections.strategy = paragraphs[0];
        if (paragraphs.length >= 2) sections.risks = paragraphs[1];
        if (paragraphs.length >= 3) sections.actions = paragraphs.slice(2).join('\n');
    }

    return sections;
}

/**
 * Create Recommendation Card
 */
function createRecommendationCard(icon, title, content, gradient) {
    let cleanContent = content
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^(Strategi Utama|Risiko Terdeteksi|Tindakan Prioritas):\s*/gi, '')
        .trim();

    let formattedContent = cleanContent;

    if (cleanContent.includes('\n') || cleanContent.includes('•') || cleanContent.includes('-')) {
        const lines = cleanContent.split(/[\n•-]/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (lines.length > 1) {
            formattedContent = '<ul class="list-disc list-inside space-y-2">' +
                lines.map(line => `<li class="text-muted-foreground">${line}</li>`).join('') +
                '</ul>';
        } else {
            formattedContent = `<p class="text-muted-foreground">${cleanContent}</p>`;
        }
    } else {
        formattedContent = `<p class="text-muted-foreground">${cleanContent}</p>`;
    }

    return `
        <div class="glass border border-border rounded-xl overflow-hidden">
            <div class="bg-gradient-to-r ${gradient} px-5 py-4 border-b border-border/50">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${icon}</span>
                    <h3 class="font-heading font-semibold text-lg text-foreground">${title}</h3>
                </div>
            </div>
            <div class="p-5">${formattedContent}</div>
        </div>
    `;
}

/**
 * Reset to Input Mode
 */
function resetToInput() {
    const generateBtn = document.getElementById('generate-btn');
    const loadingContainer = document.getElementById('loading-container');
    const resultDashboard = document.getElementById('result-dashboard');

    if (generateBtn) generateBtn.classList.remove('hidden');
    if (loadingContainer) loadingContainer.classList.add('hidden');
    if (resultDashboard) resultDashboard.classList.add('hidden');

    PlanningState.result = null;
}
