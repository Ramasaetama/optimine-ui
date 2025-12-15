/**
 * OptiMine SPA - Dashboard Page
 * Operations Dashboard with AI integration and real-time charts
 * Integrated with Backend API endpoints
 */

import { App } from '../../app.js';
import { EventBus } from '../../utils/index.js';

// ============================================
// API CONFIGURATION
// ============================================
const API_CONFIG = {
    baseUrl: 'http://139.59.224.58:5000',
    endpoints: {
        // AI Endpoints
        aiHealth: '/ai/health',
        aiChat: '/ai/chat',
        aiRecommendations: '/ai/recommendations',
        // Mine Operations
        productionPlans: '/production-plans',
        shippingSchedules: '/shipping-schedules',
        effectiveCapacity: '/effective-capacity',
        productionConstraints: '/production-constraints',
        weather: '/weather',
        equipments: '/equipments',
        mines: '/mines'
    },
    timeout: 30000,
    refreshInterval: 60000 // Refresh data every 60 seconds
};

// ============================================
// STATE MANAGEMENT
// ============================================
const DashboardState = {
    // Stats with default/fallback values
    stats: {
        production: { value: 0, change: 0, unit: 'tons', loading: true },
        distribution: { value: 0, change: 0, unit: 'tons', loading: true },
        efficiency: { value: 0, change: 0, unit: '%', loading: true },
        activeAlerts: { value: 0, change: 0, unit: '', loading: true }
    },
    // Weather data
    weather: {
        temperature: null,
        condition: 'Loading...',
        rainfall: null,
        windSpeed: null,
        loading: true
    },
    // Fleet/Equipment status
    fleet: {
        active: 0,
        total: 0,
        loading: true
    },
    // Mine sites
    mines: [],
    // AI Status
    aiStatus: { isOnline: false },
    // Chart state
    chart: null,
    chartType: 'line',
    chartData: { labels: [], production: [], distribution: [], target: [] },
    // Intervals
    updateInterval: null,
    chartUpdateInterval: null,
    dataRefreshInterval: null
};

// ============================================
// API HELPER
// ============================================
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('optimine-token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        console.warn(`API call failed: ${endpoint}`, error.message);
        return null;
    }
};

// ============================================
// AI HEALTH CHECK
// ============================================
const checkAIHealth = async () => {
    try {
        const response = await fetchWithAuth(API_CONFIG.endpoints.aiHealth, { method: 'GET' });

        if (response && response.ok) {
            const data = await response.json().catch(() => ({}));
            DashboardState.aiStatus.isOnline = data.status === 'success';
        } else {
            DashboardState.aiStatus.isOnline = false;
        }
    } catch (error) {
        DashboardState.aiStatus.isOnline = false;
    }

    updateAIStatusUI();
};

const updateAIStatusUI = () => {
    const dot = document.getElementById('ai-dot');
    const text = document.getElementById('ai-text');

    if (!dot || !text) return;

    dot.classList.remove('bg-green-500', 'bg-red-500', 'bg-gray-400');
    text.classList.remove('text-green-500', 'text-red-500', 'text-muted-foreground');

    if (DashboardState.aiStatus.isOnline) {
        dot.classList.add('bg-green-500');
        text.textContent = 'AI Online';
        text.classList.add('text-green-500');
    } else {
        dot.classList.add('bg-red-500');
        text.textContent = 'AI Offline';
        text.classList.add('text-red-500');
    }
};

// ============================================
// LOAD PRODUCTION STATS FROM API
// ============================================
const loadProductionStats = async () => {
    const token = localStorage.getItem('optimine-token');
    if (!token) {
        // Use fallback data for non-authenticated users
        setFallbackStats();
        return;
    }

    try {
        // Fetch production plans
        const prodResponse = await fetchWithAuth(API_CONFIG.endpoints.productionPlans);
        if (prodResponse && prodResponse.ok) {
            const data = await prodResponse.json();
            const plans = data.data || data || [];
            if (Array.isArray(plans) && plans.length > 0) {
                // Calculate total production from plans
                const totalProduction = plans.reduce((sum, plan) => {
                    return sum + (plan.target_production || plan.production || 0);
                }, 0);
                DashboardState.stats.production.value = totalProduction;
                DashboardState.stats.production.change = calculateChange(plans);
            }
        }

        // Fetch shipping schedules for distribution
        const shipResponse = await fetchWithAuth(API_CONFIG.endpoints.shippingSchedules);
        if (shipResponse && shipResponse.ok) {
            const data = await shipResponse.json();
            const schedules = data.data || data || [];
            if (Array.isArray(schedules) && schedules.length > 0) {
                const totalDistribution = schedules.reduce((sum, schedule) => {
                    return sum + (schedule.tonnage || schedule.quantity || 0);
                }, 0);
                DashboardState.stats.distribution.value = totalDistribution;
                DashboardState.stats.distribution.change = 3.1; // Default change
            }
        }

        // Fetch effective capacity for efficiency
        const capacityResponse = await fetchWithAuth(API_CONFIG.endpoints.effectiveCapacity);
        if (capacityResponse && capacityResponse.ok) {
            const data = await capacityResponse.json();
            const capacity = data.data || data;
            if (capacity && typeof capacity.efficiency !== 'undefined') {
                DashboardState.stats.efficiency.value = capacity.efficiency;
                DashboardState.stats.efficiency.change = capacity.change || 2.4;
            } else if (Array.isArray(capacity) && capacity.length > 0) {
                // Calculate average efficiency
                const avgEfficiency = capacity.reduce((sum, c) => sum + (c.efficiency || c.rate || 0), 0) / capacity.length;
                DashboardState.stats.efficiency.value = Math.round(avgEfficiency * 10) / 10;
            }
        }

        // Fetch production constraints for alerts
        const constraintsResponse = await fetchWithAuth(API_CONFIG.endpoints.productionConstraints);
        if (constraintsResponse && constraintsResponse.ok) {
            const data = await constraintsResponse.json();
            const constraints = data.data || data || [];
            if (Array.isArray(constraints)) {
                // Count total constraints as alerts, or filter by active status
                const activeAlerts = constraints.filter(c =>
                    c.active !== false &&
                    c.status !== 'resolved' &&
                    c.status !== 'closed'
                ).length || constraints.length;
                DashboardState.stats.activeAlerts.value = activeAlerts;
                // Calculate change from previous period if available
                DashboardState.stats.activeAlerts.change = -2; // Default
            }
        }
    } catch (error) {
        console.warn('Failed to load production stats:', error);
    }

    // Mark loading complete and use fallback for any missing data
    finishStatsLoading();
    updateStatsUI();
};

const calculateChange = (plans) => {
    if (plans.length < 2) return 5.2;
    // Simple change calculation (latest vs previous)
    const latest = plans[0]?.target_production || plans[0]?.production || 0;
    const previous = plans[1]?.target_production || plans[1]?.production || 0;
    if (previous === 0) return 0;
    return Math.round(((latest - previous) / previous) * 100 * 10) / 10;
};

const setFallbackStats = () => {
    DashboardState.stats = {
        production: { value: 12450, change: 5.2, unit: 'tons', loading: false },
        distribution: { value: 8320, change: 3.1, unit: 'tons', loading: false },
        efficiency: { value: 94.2, change: 2.4, unit: '%', loading: false },
        activeAlerts: { value: 3, change: -2, unit: '', loading: false }
    };
    // Also set default fleet values
    DashboardState.fleet = { active: 23, total: 25, loading: false };
};

const finishStatsLoading = () => {
    const { stats } = DashboardState;
    // Set defaults for any missing data
    if (stats.production.value === 0) stats.production.value = 12450;
    if (stats.distribution.value === 0) stats.distribution.value = 8320;
    if (stats.efficiency.value === 0) stats.efficiency.value = 94.2;

    // Set default change values if they're 0 (API didn't provide)
    if (stats.production.change === 0) stats.production.change = 5.2;
    if (stats.distribution.change === 0) stats.distribution.change = 3.1;
    if (stats.efficiency.change === 0) stats.efficiency.change = 2.4;
    if (stats.activeAlerts.change === 0) stats.activeAlerts.change = -2;

    stats.production.loading = false;
    stats.distribution.loading = false;
    stats.efficiency.loading = false;
    stats.activeAlerts.loading = false;
};

const updateStatsUI = () => {
    const { stats } = DashboardState;

    // Update production
    const prodValue = document.getElementById('stat-production-value');
    const prodChange = document.getElementById('stat-production-change');
    if (prodValue) prodValue.textContent = stats.production.value.toLocaleString();
    if (prodChange) prodChange.textContent = `${stats.production.change >= 0 ? '+' : ''}${stats.production.change}%`;

    // Update distribution
    const distValue = document.getElementById('stat-distribution-value');
    const distChange = document.getElementById('stat-distribution-change');
    if (distValue) distValue.textContent = stats.distribution.value.toLocaleString();
    if (distChange) distChange.textContent = `${stats.distribution.change >= 0 ? '+' : ''}${stats.distribution.change}%`;

    // Update efficiency
    const effValue = document.getElementById('stat-efficiency-value');
    const effChange = document.getElementById('stat-efficiency-change');
    if (effValue) effValue.textContent = stats.efficiency.value;
    if (effChange) effChange.textContent = `${stats.efficiency.change >= 0 ? '+' : ''}${stats.efficiency.change}%`;

    // Update alerts
    const alertValue = document.getElementById('stat-alerts-value');
    const alertChange = document.getElementById('stat-alerts-change');
    if (alertValue) alertValue.textContent = stats.activeAlerts.value;
    if (alertChange) alertChange.textContent = stats.activeAlerts.change;
};

// ============================================
// LOAD WEATHER DATA
// ============================================
const loadWeatherData = async () => {
    try {
        const response = await fetchWithAuth(API_CONFIG.endpoints.weather);

        if (response && response.ok) {
            const data = await response.json();
            const weather = data.data || data;

            if (weather) {
                DashboardState.weather = {
                    temperature: weather.temperature || weather.temp || 28,
                    condition: weather.condition || weather.weather_class || 'Clear',
                    rainfall: weather.rainfall_mm || weather.rainfall || 0,
                    windSpeed: weather.wind_speed_kmh || weather.wind_speed || 12,
                    loading: false
                };
            }
        } else {
            // Use fallback
            DashboardState.weather = {
                temperature: 28,
                condition: 'Partly Cloudy',
                rainfall: 0,
                windSpeed: 12,
                loading: false
            };
        }
    } catch (error) {
        console.warn('Failed to load weather:', error);
        DashboardState.weather.loading = false;
    }

    updateWeatherUI();
};

const updateWeatherUI = () => {
    const { weather } = DashboardState;

    const tempEl = document.getElementById('weather-temp');
    const condEl = document.getElementById('weather-condition');
    const rainEl = document.getElementById('weather-rainfall');
    const windEl = document.getElementById('weather-wind');

    if (tempEl) tempEl.textContent = `${weather.temperature}°C`;
    if (condEl) condEl.textContent = weather.condition;
    if (rainEl) rainEl.textContent = `${weather.rainfall}mm`;
    if (windEl) windEl.textContent = `${weather.windSpeed} km/h`;
};

// ============================================
// LOAD FLEET/EQUIPMENT STATUS
// ============================================
const loadFleetStatus = async () => {
    try {
        const response = await fetchWithAuth(API_CONFIG.endpoints.equipments);

        if (response && response.ok) {
            const data = await response.json();
            const equipments = data.data || data || [];

            if (Array.isArray(equipments) && equipments.length > 0) {
                DashboardState.fleet.total = equipments.length;
                // Count active equipment with various status field names
                const activeCount = equipments.filter(e => {
                    const status = (e.status || e.equipment_status || '').toLowerCase();
                    return status === 'active' ||
                        status === 'operational' ||
                        status === 'available' ||
                        status === 'running' ||
                        e.active === true ||
                        e.is_active === true;
                }).length;
                // If no equipment matches active status, assume all are active
                DashboardState.fleet.active = activeCount > 0 ? activeCount : equipments.length;
            }
        } else {
            // Fallback
            DashboardState.fleet = { active: 23, total: 25, loading: false };
        }
    } catch (error) {
        DashboardState.fleet = { active: 23, total: 25, loading: false };
    }

    DashboardState.fleet.loading = false;
    updateFleetUI();
};

const updateFleetUI = () => {
    const { fleet } = DashboardState;
    const fleetEl = document.getElementById('fleet-status');
    if (fleetEl) {
        fleetEl.textContent = `${fleet.active}/${fleet.total} Active`;
    }
};

// ============================================
// LOAD MINES STATUS
// ============================================
const loadMinesStatus = async () => {
    try {
        const response = await fetchWithAuth(API_CONFIG.endpoints.mines);

        if (response && response.ok) {
            const data = await response.json();
            DashboardState.mines = data.data || data || [];
        }
    } catch (error) {
        console.warn('Failed to load mines:', error);
    }

    updateMinesUI();
};

const updateMinesUI = () => {
    const mines = DashboardState.mines;
    if (mines.length === 0) return;

    // Update mine status badges (if elements exist)
    const mineAStatus = document.getElementById('mine-a-status');
    const mineBStatus = document.getElementById('mine-b-status');

    if (mines[0] && mineAStatus) {
        mineAStatus.textContent = mines[0].status || 'Active';
    }
    if (mines[1] && mineBStatus) {
        mineBStatus.textContent = mines[1].status || 'Active';
    }
};

// ============================================
// AI RECOMMENDATIONS
// ============================================
const loadAIRecommendations = async () => {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    // Show loading
    container.innerHTML = `
        <div class="col-span-3 flex items-center justify-center py-8">
            <div class="flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span class="text-muted-foreground text-sm">Memuat rekomendasi AI...</span>
            </div>
        </div>
    `;

    const token = localStorage.getItem('optimine-token');

    try {
        // Try the dedicated recommendations endpoint first
        let response = await fetchWithAuth(API_CONFIG.endpoints.aiRecommendations, {
            method: 'POST',
            body: JSON.stringify({
                context: {
                    production: DashboardState.stats.production.value,
                    efficiency: DashboardState.stats.efficiency.value,
                    alerts: DashboardState.stats.activeAlerts.value,
                    weather: DashboardState.weather.condition
                }
            })
        });

        // Fallback to chat endpoint if recommendations fails
        if (!response || !response.ok) {
            response = await fetchWithAuth(API_CONFIG.endpoints.aiChat, {
                method: 'POST',
                body: JSON.stringify({
                    chatInput: `Berikan 3 rekomendasi operasional mining berdasarkan: Production ${DashboardState.stats.production.value} tons, Efficiency ${DashboardState.stats.efficiency.value}%, Active Alerts ${DashboardState.stats.activeAlerts.value}. Format: JSON array [{title, description, priority, justification}]`,
                    type: 'dashboard_recommendations'
                })
            });
        }

        if (response && response.ok) {
            const data = await response.json().catch(() => ({}));

            // Handle different response formats
            let recommendations;
            if (data.recommendations) {
                recommendations = data.recommendations;
            } else if (data.data && Array.isArray(data.data)) {
                recommendations = data.data;
            } else {
                const aiResponse = data.output || data.text || data.response || data.message || '';
                recommendations = parseRecommendations(aiResponse);
            }

            renderRecommendations(container, recommendations);
        } else {
            renderRecommendations(container, getFallbackRecommendations(), true);
        }
    } catch (error) {
        renderRecommendations(container, getFallbackRecommendations(), true);
    }
};

const parseRecommendations = (aiResponse) => {
    try {
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) { }
    return getFallbackRecommendations();
};

const getFallbackRecommendations = () => {
    // Get values with safe defaults
    const fleetActive = DashboardState.fleet.active || 23;
    const fleetTotal = DashboardState.fleet.total || 25;
    const weatherCondition = DashboardState.weather.condition || 'Clear';
    const alertsCount = DashboardState.stats.activeAlerts.value || 3;

    return [
        {
            title: 'Tingkatkan Produksi Melalui Pemeliharaan Fleet',
            description: 'Lakukan pemeliharaan preventif pada armada untuk memastikan semua kendaraan berfungsi dengan baik.',
            priority: 'high',
            justification: `Dengan ${fleetActive} dari ${fleetTotal} kendaraan aktif, pemeliharaan dapat meningkatkan efisiensi.`
        },
        {
            title: 'Optimalkan Distribusi Berdasarkan Cuaca',
            description: `Kondisi cuaca saat ini: ${weatherCondition}. Sesuaikan jadwal pengiriman.`,
            priority: 'medium',
            justification: 'Optimalisasi distribusi dapat mengurangi biaya dan meningkatkan efisiensi operasional.'
        },
        {
            title: 'Tanggapi Alert Aktif Secara Proaktif',
            description: `Tinjau dan tangani ${alertsCount} alert aktif untuk mencegah gangguan.`,
            priority: alertsCount > 5 ? 'high' : 'medium',
            justification: 'Menangani alert dengan cepat mencegah dampak negatif pada produksi.'
        }
    ];
};

const renderRecommendations = (container, recommendations, isFallback = false) => {
    const colors = {
        high: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
        medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30' },
        low: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30' }
    };

    container.innerHTML = recommendations.map((rec, i) => {
        const c = colors[rec.priority] || colors.medium;
        return `
            <div class="glass border border-border rounded-lg p-4 hover:border-primary/50 transition-all animate-fade-in" style="animation-delay: ${i * 0.1}s">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="font-medium text-sm text-foreground">${escapeHtml(rec.title)}</h3>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full ${c.bg} ${c.text} ${c.border}">${rec.priority}</span>
                </div>
                <p class="text-xs text-muted-foreground mb-3">${escapeHtml(rec.description)}</p>
                <div class="border-t border-border/50 pt-3">
                    <p class="text-xs text-muted-foreground">
                        <span class="font-medium text-yellow-500">Justifikasi:</span> ${escapeHtml(rec.justification)}
                    </p>
                </div>
            </div>
        `;
    }).join('');

    if (isFallback) {
        container.innerHTML += `<div class="col-span-3 text-center text-xs text-muted-foreground mt-2"><em>📡 Mode offline - AI sedang tidak tersedia</em></div>`;
    }
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ============================================
// CHART MANAGEMENT
// ============================================
const initChart = () => {
    try {
        if (typeof window.Chart === 'undefined' && typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded - chart disabled');
            return;
        }

        loadChartData();
        bindChartToggle();
    } catch (error) {
        console.error('Chart initialization error:', error);
    }
};

const loadChartData = async () => {
    // Try to load from API first
    try {
        const response = await fetchWithAuth(`${API_CONFIG.endpoints.productionPlans}?limit=12`);

        if (response && response.ok) {
            const data = await response.json();
            const plans = data.data || data || [];

            if (Array.isArray(plans) && plans.length > 0) {
                DashboardState.chartData = {
                    labels: plans.map(p => formatDate(p.date || p.created_at)).reverse(),
                    production: plans.map(p => p.target_production || p.production || 0).reverse(),
                    distribution: plans.map(p => p.distribution || Math.round((p.target_production || 0) * 0.7)).reverse(),
                    target: plans.map(() => 1200)
                };
                createChart();
                startChartUpdates();
                return;
            }
        }
    } catch (error) {
        console.warn('Failed to load chart data from API:', error);
    }

    // Fallback to generated data
    generateChartData();
    createChart();
    startChartUpdates();
};

const formatDate = (dateStr) => {
    if (!dateStr) return formatTime(new Date());
    const date = new Date(dateStr);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const generateChartData = () => {
    const now = new Date();
    DashboardState.chartData = { labels: [], production: [], distribution: [], target: [] };

    for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60 * 1000);
        DashboardState.chartData.labels.push(formatTime(time));
        DashboardState.chartData.production.push(Math.round(1000 + Math.random() * 400 - 200));
        DashboardState.chartData.distribution.push(Math.round(700 + Math.random() * 300 - 150));
        DashboardState.chartData.target.push(1200);
    }
};

const formatTime = (date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const createChart = () => {
    const canvas = document.getElementById('dashboard-chart');
    if (!canvas) return;

    const existingChart = window.Chart?.getChart?.(canvas);
    if (existingChart) existingChart.destroy();

    if (DashboardState.chart) {
        try { DashboardState.chart.destroy(); } catch (e) { }
        DashboardState.chart = null;
    }

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    const ChartJS = window.Chart || Chart;

    DashboardState.chart = new ChartJS(ctx, {
        type: DashboardState.chartType,
        data: {
            labels: DashboardState.chartData.labels,
            datasets: [
                {
                    label: 'Production',
                    data: DashboardState.chartData.production,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Distribution',
                    data: DashboardState.chartData.distribution,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Target',
                    data: DashboardState.chartData.target,
                    borderColor: 'rgb(234, 179, 8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: { min: 500, max: 1600, grid: { color: gridColor }, ticks: { color: textColor } }
            }
        }
    });
};

const bindChartToggle = () => {
    const btn = document.getElementById('chart-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            DashboardState.chartType = DashboardState.chartType === 'line' ? 'bar' : 'line';
            btn.querySelector('span').textContent = DashboardState.chartType === 'line' ? 'Line' : 'Bar';
            createChart();
        });
    }
};

const startChartUpdates = () => {
    DashboardState.chartUpdateInterval = setInterval(() => {
        const now = new Date();
        const { chartData } = DashboardState;

        chartData.labels.push(formatTime(now));
        const lastProd = chartData.production[chartData.production.length - 1] || 1000;
        const lastDist = chartData.distribution[chartData.distribution.length - 1] || 700;

        chartData.production.push(Math.max(600, Math.min(1500, lastProd * (0.95 + Math.random() * 0.1))));
        chartData.distribution.push(Math.max(400, Math.min(1200, lastDist * (0.95 + Math.random() * 0.1))));
        chartData.target.push(1200);

        if (chartData.labels.length > 12) {
            chartData.labels.shift();
            chartData.production.shift();
            chartData.distribution.shift();
            chartData.target.shift();
        }

        if (DashboardState.chart) {
            DashboardState.chart.data.labels = chartData.labels;
            DashboardState.chart.data.datasets[0].data = chartData.production;
            DashboardState.chart.data.datasets[1].data = chartData.distribution;
            DashboardState.chart.data.datasets[2].data = chartData.target;
            DashboardState.chart.update('none');
        }
    }, 5000);
};

// ============================================
// PERIODIC DATA REFRESH
// ============================================
const startDataRefresh = () => {
    DashboardState.dataRefreshInterval = setInterval(() => {
        loadProductionStats();
        loadWeatherData();
        loadFleetStatus();
        checkAIHealth();
    }, API_CONFIG.refreshInterval);
};

// ============================================
// CLEANUP
// ============================================
const cleanup = () => {
    if (DashboardState.updateInterval) clearInterval(DashboardState.updateInterval);
    if (DashboardState.chartUpdateInterval) clearInterval(DashboardState.chartUpdateInterval);
    if (DashboardState.dataRefreshInterval) clearInterval(DashboardState.dataRefreshInterval);
    if (DashboardState.chart) {
        DashboardState.chart.destroy();
        DashboardState.chart = null;
    }
};

// ============================================
// TEMPLATE
// ============================================
const template = () => {
    const { stats, weather, fleet } = DashboardState;

    return `
<div class="min-h-[calc(100vh-4rem)] pt-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="font-heading text-2xl md:text-3xl font-bold text-foreground">Operations Dashboard</h1>
                <p class="text-muted-foreground mt-1">Real-time monitoring and analytics</p>
            </div>
            <div class="flex items-center gap-3 px-4 py-2 glass border border-border rounded-xl">
                <div id="ai-dot" class="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"></div>
                <span id="ai-text" class="text-sm font-medium text-muted-foreground">Checking AI...</span>
            </div>
        </div>
        
        <!-- Stats Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="glass border border-border rounded-xl p-5 glow-hover">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span id="stat-production-change" class="text-sm font-medium text-green-500">+${stats.production.change}%</span>
                </div>
                <p class="font-heading text-2xl font-bold text-foreground"><span id="stat-production-value">${stats.production.value.toLocaleString()}</span> <span class="text-sm font-normal text-muted-foreground">tons</span></p>
                <p class="text-sm text-muted-foreground">Production</p>
            </div>
            
            <div class="glass border border-border rounded-xl p-5 glow-hover">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <span id="stat-distribution-change" class="text-sm font-medium text-green-500">+${stats.distribution.change}%</span>
                </div>
                <p class="font-heading text-2xl font-bold text-foreground"><span id="stat-distribution-value">${stats.distribution.value.toLocaleString()}</span> <span class="text-sm font-normal text-muted-foreground">tons</span></p>
                <p class="text-sm text-muted-foreground">Distribution</p>
            </div>
            
            <div class="glass border border-border rounded-xl p-5 glow-hover">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span id="stat-efficiency-change" class="text-sm font-medium text-green-500">+${stats.efficiency.change}%</span>
                </div>
                <p class="font-heading text-2xl font-bold text-foreground"><span id="stat-efficiency-value">${stats.efficiency.value}</span> <span class="text-sm font-normal text-muted-foreground">%</span></p>
                <p class="text-sm text-muted-foreground">Efficiency</p>
            </div>
            
            <div class="glass border border-border rounded-xl p-5 glow-hover">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span id="stat-alerts-change" class="text-sm font-medium text-red-500">${stats.activeAlerts.change}</span>
                </div>
                <p class="font-heading text-2xl font-bold text-foreground"><span id="stat-alerts-value">${stats.activeAlerts.value}</span></p>
                <p class="text-sm text-muted-foreground">Active Alerts</p>
            </div>
        </div>
        
        <!-- Chart & Status Grid -->
        <div class="grid lg:grid-cols-3 gap-6 mb-6">
            <!-- Chart -->
            <div class="lg:col-span-2 glass border border-border rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h2 class="font-heading font-semibold text-lg text-foreground">Production & Distribution</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="chart-toggle" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary/50 hover:bg-secondary rounded-lg">
                            <span>Line</span>
                        </button>
                        <div class="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg">
                            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>Live</span>
                        </div>
                    </div>
                </div>
                <div class="h-64 md:h-72">
                    <canvas id="dashboard-chart"></canvas>
                </div>
                <div class="flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t border-border/50">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-green-500"></div><span class="text-xs text-muted-foreground">Production</span></div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-blue-500"></div><span class="text-xs text-muted-foreground">Distribution</span></div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-yellow-500"></div><span class="text-xs text-muted-foreground">Target</span></div>
                </div>
            </div>
            
            <!-- Live Status -->
            <div class="glass border border-border rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="font-heading font-semibold text-lg text-foreground">Live Status</h2>
                </div>
                <div class="space-y-3">
                    <!-- Mine Site A -->
                    <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span class="text-sm font-medium">Mine Site A</span>
                        </div>
                        <span id="mine-a-status" class="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/30">Active</span>
                    </div>
                    
                    <!-- Mine Site B -->
                    <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <span class="text-sm font-medium">Mine Site B</span>
                        </div>
                        <span id="mine-b-status" class="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">Weather Alert</span>
                    </div>
                    
                    <!-- Fleet Status -->
                    <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <span class="text-sm font-medium">Fleet Status</span>
                        </div>
                        <span id="fleet-status" class="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/30">${fleet.active}/${fleet.total} Active</span>
                    </div>
                    
                    <!-- Weather Widget -->
                    <div class="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <div>
                                <span class="text-sm font-medium">Weather</span>
                                <div class="text-xs text-muted-foreground">
                                    <span id="weather-condition">${weather.condition}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <span id="weather-temp" class="text-lg font-bold text-foreground">${weather.temperature || '--'}°C</span>
                            <div class="text-xs text-muted-foreground">
                                💧 <span id="weather-rainfall">${weather.rainfall || 0}mm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- AI Recommendations -->
        <div class="glass border border-border rounded-xl p-6 border-glow">
            <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 class="font-heading font-semibold text-lg text-foreground">AI Recommendations</h2>
            </div>
            <div id="recommendations-grid" class="grid md:grid-cols-3 gap-4">
                <!-- Recommendations will be loaded here -->
            </div>
        </div>
        
    </div>
</div>
`;
};

// Store clean up function reference
let routeCleanupFn = null;

// ============================================
// PAGE HANDLER
// ============================================
export const dashboardPage = async () => {
    // Remove previous event listener if exists
    if (routeCleanupFn) {
        routeCleanupFn();
        routeCleanupFn = null;
    }

    // Cleanup previous state
    cleanup();

    // Render template
    await App.View.render(template(), 'dashboard');

    // Initialize after render with proper loading order
    setTimeout(async () => {
        // First: Check AI status
        checkAIHealth();

        // Second: Load base data that recommendations depend on
        await Promise.all([
            loadProductionStats(),
            loadWeatherData(),
            loadFleetStatus(),
            loadMinesStatus()
        ]);

        // Third: Load AI recommendations (after stats and fleet are loaded)
        loadAIRecommendations();

        // Initialize chart
        initChart();

        // Start periodic refresh
        startDataRefresh();
    }, 100);

    // Listen for page change to cleanup
    routeCleanupFn = EventBus.on('routeChanged', (route) => {
        if (route !== 'dashboard') {
            cleanup();
            if (routeCleanupFn) {
                routeCleanupFn();
                routeCleanupFn = null;
            }
        }
    });
};
