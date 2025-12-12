/**
 * OptiMine - Dashboard Page JavaScript
 * Handles dashboard stats, live status, and data visualization
 */

(function() {
    'use strict';

    // ========================================
    // Dashboard Manager
    // ========================================
    const DashboardManager = {
        state: {
            stats: {
                production: { value: 12450, change: 5.2, unit: 'tons' },
                distribution: { value: 8320, change: 3.1, unit: 'tons' },
                efficiency: { value: 94.2, change: 2.4, unit: '%' },
                activeAlerts: { value: 3, change: -2, unit: '' }
            },
            liveStatus: {
                mineSiteA: { status: 'active', label: 'Active' },
                mineSiteB: { status: 'alert', label: 'Weather Alert' },
                fleetStatus: { active: 23, total: 25 },
                portStatus: { ships: 2 }
            },
            recommendations: [],
            refreshInterval: null
        },

        // Initialize
        init() {
            this.bindEvents();
            this.startLiveUpdates();
            this.initAnimations();
        },

        // Bind events
        bindEvents() {
            // Stat card hover effects
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                card.addEventListener('mouseenter', () => this.handleStatHover(card, true));
                card.addEventListener('mouseleave', () => this.handleStatHover(card, false));
            });

            // Status item click for details
            const statusItems = document.querySelectorAll('.status-item');
            statusItems.forEach(item => {
                item.addEventListener('click', () => this.showStatusDetails(item));
            });

            // Recommendation card expansion
            const recCards = document.querySelectorAll('.recommendation-card');
            recCards.forEach(card => {
                card.addEventListener('click', () => this.toggleRecommendation(card));
            });

            // Handle visibility change for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseLiveUpdates();
                } else {
                    this.startLiveUpdates();
                }
            });
        },

        // Handle stat card hover
        handleStatHover(card, isHovered) {
            if (isHovered) {
                card.style.transform = 'translateY(-4px)';
            } else {
                card.style.transform = '';
            }
        },

        // Show status details (could open modal or expand)
        showStatusDetails(item) {
            const label = item.querySelector('.text-foreground')?.textContent || 'Status';
            const badge = item.querySelector('.status-badge')?.textContent?.trim() || 'Unknown';
            
            // For now, just log - could be expanded to show modal
            console.log(`Status Details - ${label}: ${badge}`);
            
            // Add visual feedback
            item.classList.add('ring-2', 'ring-primary/50');
            setTimeout(() => {
                item.classList.remove('ring-2', 'ring-primary/50');
            }, 300);
        },

        // Toggle recommendation card expansion
        toggleRecommendation(card) {
            const isExpanded = card.classList.contains('expanded');
            
            // Remove expanded from all cards
            document.querySelectorAll('.recommendation-card').forEach(c => {
                c.classList.remove('expanded');
            });

            if (!isExpanded) {
                card.classList.add('expanded');
            }
        },

        // Start live data updates (simulated)
        startLiveUpdates() {
            // Clear existing interval if any
            if (this.state.refreshInterval) {
                clearInterval(this.state.refreshInterval);
            }

            // Update every 30 seconds (simulated)
            this.state.refreshInterval = setInterval(() => {
                this.updateLiveStatus();
            }, 30000);
        },

        // Pause live updates
        pauseLiveUpdates() {
            if (this.state.refreshInterval) {
                clearInterval(this.state.refreshInterval);
                this.state.refreshInterval = null;
            }
        },

        // Update live status (simulated)
        updateLiveStatus() {
            // Simulate small changes in stats
            const productionEl = document.querySelector('.stat-card:nth-child(1) .text-2xl');
            const distributionEl = document.querySelector('.stat-card:nth-child(2) .text-2xl');
            
            // Add subtle pulse animation to indicate update
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                card.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 500);
            });

            console.log('Dashboard data refreshed');
        },

        // Initialize animations
        initAnimations() {
            // Observe elements for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                    }
                });
            }, {
                threshold: 0.1
            });

            // Observe all animatable elements
            document.querySelectorAll('.stat-card, .glass').forEach(el => {
                observer.observe(el);
            });
        },

        // Format number with locale
        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        },

        // Calculate trend direction
        getTrendDirection(change) {
            return change >= 0 ? 'up' : 'down';
        },

        // Show toast notification
        showToast(message, type = 'info') {
            if (window.Toast) {
                window.Toast.show(message, type);
                return;
            }

            // Fallback toast
            const existing = document.querySelector('.dashboard-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = `dashboard-toast fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                type === 'warning' ? 'bg-yellow-500' : 'bg-primary'
            } text-white font-medium`;
            toast.textContent = message;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                toast.style.transition = 'all 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        // Cleanup
        destroy() {
            this.pauseLiveUpdates();
        }
    };

    // ========================================
    // Chart Placeholder Manager (for future chart integration)
    // ========================================
    const ChartManager = {
        init() {
            // Placeholder for chart initialization
            // Could integrate Chart.js, ApexCharts, etc.
            console.log('Chart area ready for data visualization');
        },

        // Method to update chart data
        updateData(data) {
            // Placeholder for chart update logic
            console.log('Chart data updated:', data);
        }
    };

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            DashboardManager.init();
            ChartManager.init();
        });
    } else {
        DashboardManager.init();
        ChartManager.init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        DashboardManager.destroy();
    });

    // Export for external access
    window.DashboardManager = DashboardManager;
    window.ChartManager = ChartManager;

})();
