/**
 * OptiMine - Planning Page JavaScript
 * Handles planning page with AI-powered production optimization
 */

// ========================================
// API Configuration
// ========================================
const PLAN_API_URL = 'http://139.59.224.58:5000/ai/plan';
const SHIPPING_API_URL = 'http://139.59.224.58:5000/shipping-schedules';

// ========================================
// Planning Page Manager
// ========================================
const PlanningPage = {
    // State
    state: {
        rainfall_mm: 0.5,      // Direct mm value (0-50)
        wind_speed_kmh: 0.4,   // Direct km/h value (0-10)
        activeVehicles: 25,
        maintenanceStatus: 3,
        totalFleet: 40,
        vessels: [],
        isLoading: false,
        result: null
    },

    // Loading steps for animation
    loadingSteps: [
        { icon: '📡', text: 'Mengirim data telemetri ke Server...', duration: 2000 },
        { icon: '🌩️', text: 'Menganalisis dampak cuaca & gelombang...', duration: 2000 },
        { icon: '🤖', text: 'AI menyusun strategi optimal...', duration: null }
    ],

    init() {
        this.setupSliders();
        this.setupInputs();
        this.setupGenerateButton();
        this.updateSliderFill();
        this.updateSliderValueDisplays();
        this.injectResultContainers();
        this.loadVessels();
    },

    // ========================================
    // Load Vessels from API
    // ========================================
    async loadVessels() {
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
                this.renderDefaultVessels(container);
                return;
            }

            // Store vessels in state
            this.state.vessels = schedules.map(s => ({
                id: s.shipment_id,
                name: s.vessel_name,
                etd: s.etd,
                status: s.status,
                destination: s.destination_port,
                tonnage: s.coal_tonnage
            }));

            // Render vessels
            this.renderVessels(container, schedules);

        } catch (error) {
            console.warn('Failed to load vessels, using defaults:', error.message);
            this.renderDefaultVessels(container);
        }
    },

    renderVessels(container, schedules) {
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
    },

    renderDefaultVessels(container) {
        // Fallback to static vessels
        this.state.vessels = [
            { id: 'A', name: 'MV Samudera Jaya', time: '08:00', status: 'Scheduled' },
            { id: 'B', name: 'MV Nusantara', time: '14:00', status: 'Loading' },
            { id: 'C', name: 'MV Bahari Indah', time: '20:00', status: 'Scheduled' }
        ];

        container.innerHTML = this.state.vessels.map(v => `
            <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                <span class="text-sm text-foreground">${v.name} - ${v.time}</span>
                <span class="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">${v.status}</span>
            </div>
        `).join('');
    },

    // ========================================
    // Inject Loading & Result Containers
    // ========================================
    injectResultContainers() {
        const generateBtn = document.getElementById('generate-btn');
        if (!generateBtn) return;

        const loadingHTML = `
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
        `;

        const resultHTML = `
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
        `;

        generateBtn.insertAdjacentHTML('afterend', loadingHTML);
        generateBtn.insertAdjacentHTML('afterend', resultHTML);

        const newPlanBtn = document.getElementById('new-plan-btn');
        if (newPlanBtn) {
            newPlanBtn.addEventListener('click', () => this.resetToInput());
        }
    },

    // ========================================
    // Slider Setup with Value Display
    // ========================================
    setupSliders() {
        const rainfallSlider = document.getElementById('rainfall-slider');
        const waveSlider = document.getElementById('wave-slider');

        if (rainfallSlider) {
            rainfallSlider.addEventListener('input', (e) => {
                this.state.rainfall_mm = parseFloat(e.target.value);
                this.updateSliderFill(e.target);
                this.updateSliderValueDisplays();
                this.onStateChange();
            });
            this.updateSliderFill(rainfallSlider);
        }

        if (waveSlider) {
            waveSlider.addEventListener('input', (e) => {
                this.state.wind_speed_kmh = parseFloat(e.target.value);
                this.updateSliderFill(e.target);
                this.updateSliderValueDisplays();
                this.onStateChange();
            });
            this.updateSliderFill(waveSlider);
        }
    },

    updateSliderValueDisplays() {
        const rainfallValue = document.getElementById('rainfall-value');
        const windValue = document.getElementById('wind-value');

        if (rainfallValue) {
            rainfallValue.textContent = `${this.state.rainfall_mm.toFixed(1)} mm`;
        }
        if (windValue) {
            windValue.textContent = `${this.state.wind_speed_kmh.toFixed(1)} km/h`;
        }
    },

    updateSliderFill(slider) {
        if (!slider) {
            const sliders = document.querySelectorAll('.custom-slider');
            sliders.forEach(s => this.updateSliderFill(s));
            return;
        }

        const value = parseFloat(slider.value);
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const percentage = ((value - min) / (max - min)) * 100;

        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary').trim();

        slider.style.background = `linear-gradient(to right, 
            hsl(${primaryColor || '199 89% 48%'}) 0%, 
            hsl(${primaryColor || '199 89% 48%'}) ${percentage}%, 
            hsl(var(--secondary)) ${percentage}%, 
            hsl(var(--secondary)) 100%)`;
    },

    // ========================================
    // Input Setup
    // ========================================
    setupInputs() {
        const activeVehiclesInput = document.getElementById('active-vehicles');
        const maintenanceInput = document.getElementById('maintenance-status');

        if (activeVehiclesInput) {
            activeVehiclesInput.addEventListener('change', (e) => {
                this.state.activeVehicles = parseInt(e.target.value) || 0;
                this.onStateChange();
            });
            activeVehiclesInput.addEventListener('focus', (e) => e.target.select());
        }

        if (maintenanceInput) {
            maintenanceInput.addEventListener('change', (e) => {
                this.state.maintenanceStatus = parseInt(e.target.value) || 0;
                this.onStateChange();
            });
            maintenanceInput.addEventListener('focus', (e) => e.target.select());
        }
    },

    // ========================================
    // Generate Button
    // ========================================
    setupGenerateButton() {
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateOptimizationPlan());
        }
    },

    // ========================================
    // Build Payload (Data Mapping for ML)
    // ========================================
    buildPayload() {
        // Weather Input - Direct values from sliders (now realistic)
        const weather_input = {
            rainfall_mm: this.state.rainfall_mm,           // 0-50 mm
            wind_speed_kmh: this.state.wind_speed_kmh,     // 0-10 km/h
            temperature_c: 30,
            humidity_pct: 80
        };

        // Determine weather condition category based on ML data patterns
        let weather_condition = 'Mendung'; // Default
        if (this.state.rainfall_mm >= 1.0) {
            weather_condition = 'Hujan ringan';
        } else if (this.state.rainfall_mm < 0.1) {
            weather_condition = 'Berawan';
        }

        // Capacity Input
        const availability_pct = (this.state.activeVehicles / this.state.totalFleet) * 100;

        // Road condition based on rainfall (from ML patterns: Good, Fair, Poor)
        let road_condition = 'Good';
        if (this.state.rainfall_mm >= 1.0) {
            road_condition = 'Poor';
        } else if (this.state.rainfall_mm >= 0.3) {
            road_condition = 'Fair';
        }

        const capacity_input = {
            availability_pct: parseFloat(availability_pct.toFixed(2)),
            road_condition: road_condition,
            weather_condition: weather_condition,    // Added for ML
            mine_id: "MINE_1",                       // Match ML format: MINE_1, not MINE-A
            equipment_type: "Excavator"
        };

        // Production Input
        const production_input = {
            planned_output_ton: 5000
        };

        // Additional Context
        const vesselInfo = this.state.vessels
            .map(v => v.name ? `${v.name} (${v.status})` : `Vessel ${v.id} - ${v.time} (${v.status})`)
            .join(', ');

        const additional_context =
            `Status cuaca: ${weather_condition}, curah hujan ${this.state.rainfall_mm.toFixed(1)}mm, angin ${this.state.wind_speed_kmh.toFixed(1)}km/h. ` +
            `Armada: ${this.state.activeVehicles} aktif dari ${this.state.totalFleet} total, ${this.state.maintenanceStatus} dalam perawatan. ` +
            `Kondisi jalan: ${road_condition}. ` +
            `Jadwal kapal: ${vesselInfo || 'Tidak ada data'}.`;

        return {
            weather_input,
            capacity_input,
            production_input,
            additional_context
        };
    },

    // ========================================
    // Generate Optimization Plan
    // ========================================
    async generateOptimizationPlan() {
        if (this.state.isLoading) return;

        const generateBtn = document.getElementById('generate-btn');
        const loadingContainer = document.getElementById('loading-container');
        const resultDashboard = document.getElementById('result-dashboard');

        if (generateBtn) generateBtn.classList.add('hidden');
        if (resultDashboard) resultDashboard.classList.add('hidden');
        if (loadingContainer) loadingContainer.classList.remove('hidden');

        this.state.isLoading = true;

        const loadingPromise = this.runLoadingAnimation();

        try {
            const payload = this.buildPayload();
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

            this.state.result = result;
            await loadingPromise;
            this.renderResultDashboard(result);

            if (window.OptiMine && window.OptiMine.Toast) {
                window.OptiMine.Toast.success('Rencana optimasi berhasil dibuat!');
            }

        } catch (error) {
            console.error('❌ Error generating plan:', error);
            await loadingPromise;

            if (window.OptiMine && window.OptiMine.Toast) {
                window.OptiMine.Toast.error('Gagal menghasilkan rencana. Silakan coba lagi.');
            }

            if (generateBtn) generateBtn.classList.remove('hidden');
            if (loadingContainer) loadingContainer.classList.add('hidden');
        } finally {
            this.state.isLoading = false;
        }
    },

    // ========================================
    // Loading Animation
    // ========================================
    async runLoadingAnimation() {
        const loadingIcon = document.getElementById('loading-icon');
        const loadingText = document.getElementById('loading-text');

        for (let i = 0; i < this.loadingSteps.length - 1; i++) {
            const step = this.loadingSteps[i];
            if (loadingIcon) loadingIcon.textContent = step.icon;
            if (loadingText) loadingText.textContent = step.text;
            await this.sleep(step.duration);
        }

        const finalStep = this.loadingSteps[this.loadingSteps.length - 1];
        if (loadingIcon) loadingIcon.textContent = finalStep.icon;
        if (loadingText) loadingText.textContent = finalStep.text;
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // ========================================
    // Render Result Dashboard
    // ========================================
    renderResultDashboard(result) {
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

        this.renderMetrics(result.data || result);
        this.renderRecommendations(result.data || result);
    },

    // ========================================
    // Render Key Metrics
    // ========================================
    renderMetrics(data) {
        const metricsGrid = document.getElementById('metrics-grid');
        if (!metricsGrid) return;

        const predictions = data.ml_predictions || {};

        // Weather classification from ML
        const weatherClass = predictions.weather_classification ||
            this.getWeatherClassFromRainfall(this.state.rainfall_mm);
        const weatherIcon = this.getWeatherIcon(weatherClass);

        // Capacity
        const capacity = predictions.effective_capacity_ton_per_day ||
            predictions.capacity_forecast ||
            (this.state.activeVehicles * 50);

        // Confidence
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
                    ${this.state.rainfall_mm.toFixed(1)}mm curah hujan, ${this.state.wind_speed_kmh.toFixed(1)}km/h angin
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
    },

    getWeatherClassFromRainfall(rainfall) {
        if (rainfall >= 1.0) return 'Hujan ringan';
        if (rainfall >= 0.3) return 'Mendung';
        return 'Berawan';
    },

    getWeatherIcon(weatherClass) {
        const lower = weatherClass.toLowerCase();
        if (lower.includes('hujan')) return '🌧️';
        if (lower.includes('mendung')) return '☁️';
        return '⛅';
    },

    // ========================================
    // Render Recommendations
    // ========================================
    renderRecommendations(data) {
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        const narrative = data.narrative_recommendation ||
            data.recommendation ||
            data.response ||
            'Tidak ada rekomendasi tersedia.';

        const sections = this.parseNarrativeToSections(narrative);

        let html = '';

        if (sections.strategy) {
            html += this.createRecommendationCard('📌', 'Strategi Utama', sections.strategy, 'from-primary/20 to-cyan-500/20');
        }
        if (sections.risks) {
            html += this.createRecommendationCard('⚠️', 'Risiko Terdeteksi', sections.risks, 'from-yellow-500/20 to-orange-500/20');
        }
        if (sections.actions) {
            html += this.createRecommendationCard('✅', 'Tindakan Prioritas', sections.actions, 'from-emerald-500/20 to-green-500/20');
        }

        if (!sections.strategy && !sections.risks && !sections.actions) {
            html = this.createRecommendationCard('💡', 'Rekomendasi AI', narrative, 'from-primary/20 to-blue-500/20');
        }

        container.innerHTML = html;
    },

    createRecommendationCard(icon, title, content, gradient) {
        let formattedContent = content;
        if (content.includes('\n') || content.includes('•') || content.includes('-')) {
            const lines = content.split(/[\n•]/).filter(line => line.trim() && !line.trim().startsWith('-'));
            formattedContent = '<ul class="list-disc list-inside space-y-2">' +
                lines.map(line => `<li class="text-muted-foreground">${line.trim()}</li>`).join('') +
                '</ul>';
        } else {
            formattedContent = `<p class="text-muted-foreground">${content}</p>`;
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
    },

    parseNarrativeToSections(narrative) {
        const sections = { strategy: '', risks: '', actions: '' };
        const paragraphs = narrative.split(/\n\n|\n/).filter(p => p.trim());

        const strategyKw = ['strategi', 'strategy', 'rekomendasi utama'];
        const riskKw = ['risiko', 'risk', 'peringatan', 'warning'];
        const actionKw = ['tindakan', 'action', 'langkah', 'prioritas'];

        paragraphs.forEach(para => {
            const lower = para.toLowerCase();
            if (strategyKw.some(kw => lower.includes(kw)) && !sections.strategy) {
                sections.strategy = para;
            } else if (riskKw.some(kw => lower.includes(kw)) && !sections.risks) {
                sections.risks = para;
            } else if (actionKw.some(kw => lower.includes(kw)) && !sections.actions) {
                sections.actions = para;
            } else if (!sections.strategy) {
                sections.strategy = para;
            }
        });

        if (sections.strategy && !sections.risks && !sections.actions && paragraphs.length >= 2) {
            sections.strategy = paragraphs[0];
            if (paragraphs.length >= 2) sections.risks = paragraphs[1];
            if (paragraphs.length >= 3) sections.actions = paragraphs.slice(2).join('\n');
        }

        return sections;
    },

    // ========================================
    // Reset to Input Mode
    // ========================================
    resetToInput() {
        const generateBtn = document.getElementById('generate-btn');
        const loadingContainer = document.getElementById('loading-container');
        const resultDashboard = document.getElementById('result-dashboard');

        if (generateBtn) generateBtn.classList.remove('hidden');
        if (loadingContainer) loadingContainer.classList.add('hidden');
        if (resultDashboard) resultDashboard.classList.add('hidden');

        this.state.result = null;
    },

    // ========================================
    // State Management
    // ========================================
    onStateChange() {
        window.dispatchEvent(new CustomEvent('planning:statechange', {
            detail: { state: this.state }
        }));
        console.log('Planning state updated:', this.state);
    },

    getState() { return { ...this.state }; },

    setState(newState) {
        this.state = { ...this.state, ...newState };

        const rainfallSlider = document.getElementById('rainfall-slider');
        const waveSlider = document.getElementById('wave-slider');
        const activeVehiclesInput = document.getElementById('active-vehicles');
        const maintenanceInput = document.getElementById('maintenance-status');

        if (rainfallSlider && newState.rainfall_mm !== undefined) {
            rainfallSlider.value = newState.rainfall_mm;
            this.updateSliderFill(rainfallSlider);
        }
        if (waveSlider && newState.wind_speed_kmh !== undefined) {
            waveSlider.value = newState.wind_speed_kmh;
            this.updateSliderFill(waveSlider);
        }
        if (activeVehiclesInput && newState.activeVehicles !== undefined) {
            activeVehiclesInput.value = newState.activeVehicles;
        }
        if (maintenanceInput && newState.maintenanceStatus !== undefined) {
            maintenanceInput.value = newState.maintenanceStatus;
        }

        this.updateSliderValueDisplays();
    }
};

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('generate-btn')) {
        PlanningPage.init();
        window.addEventListener('themechange', () => PlanningPage.updateSliderFill());
    }
});

window.PlanningPage = PlanningPage;
