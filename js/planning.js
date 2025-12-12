/**
 * OptiMine - Planning Page JavaScript
 * Handles planning page specific interactions
 */

// ========================================
// Planning Page Manager
// ========================================
const PlanningPage = {
    // State
    state: {
        rainfallLevel: 50,
        waveHeight: 40,
        activeVehicles: 25,
        maintenanceStatus: 3,
        vessels: [
            { id: 'A', time: '08:00', status: 'active' },
            { id: 'B', time: '14:00', status: 'active' },
            { id: 'C', time: '20:00', status: 'active' }
        ]
    },
    
    init() {
        this.setupSliders();
        this.setupInputs();
        this.setupGenerateButton();
        this.updateSliderFill();
    },
    
    // ========================================
    // Slider Setup
    // ========================================
    setupSliders() {
        const rainfallSlider = document.getElementById('rainfall-slider');
        const waveSlider = document.getElementById('wave-slider');
        
        if (rainfallSlider) {
            rainfallSlider.addEventListener('input', (e) => {
                this.state.rainfallLevel = parseInt(e.target.value);
                this.updateSliderFill(e.target);
                this.onStateChange();
            });
            this.updateSliderFill(rainfallSlider);
        }
        
        if (waveSlider) {
            waveSlider.addEventListener('input', (e) => {
                this.state.waveHeight = parseInt(e.target.value);
                this.updateSliderFill(e.target);
                this.onStateChange();
            });
            this.updateSliderFill(waveSlider);
        }
    },
    
    updateSliderFill(slider) {
        if (!slider) {
            // Update all sliders
            const sliders = document.querySelectorAll('.custom-slider');
            sliders.forEach(s => this.updateSliderFill(s));
            return;
        }
        
        const value = slider.value;
        const min = slider.min || 0;
        const max = slider.max || 100;
        const percentage = ((value - min) / (max - min)) * 100;
        
        // Create gradient for filled track effect
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
            
            activeVehiclesInput.addEventListener('focus', (e) => {
                e.target.select();
            });
        }
        
        if (maintenanceInput) {
            maintenanceInput.addEventListener('change', (e) => {
                this.state.maintenanceStatus = parseInt(e.target.value) || 0;
                this.onStateChange();
            });
            
            maintenanceInput.addEventListener('focus', (e) => {
                e.target.select();
            });
        }
    },
    
    // ========================================
    // Generate Button
    // ========================================
    setupGenerateButton() {
        const generateBtn = document.getElementById('generate-btn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateOptimizationPlan();
            });
        }
    },
    
    async generateOptimizationPlan() {
        const generateBtn = document.getElementById('generate-btn');
        
        // Show loading state
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Plan...</span>
            `;
        }
        
        // Simulate API call
        try {
            await this.simulateAPICall();
            
            // Show success toast
            if (window.OptiMine && window.OptiMine.Toast) {
                window.OptiMine.Toast.success('Optimization plan generated successfully!');
            }
            
            // Log the state
            console.log('Generated plan with state:', this.state);
            
        } catch (error) {
            console.error('Error generating plan:', error);
            if (window.OptiMine && window.OptiMine.Toast) {
                window.OptiMine.Toast.error('Failed to generate optimization plan');
            }
        } finally {
            // Reset button
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Generate Optimization Plan</span>
                `;
            }
        }
    },
    
    simulateAPICall() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        recommendedOutput: '1200 tons',
                        fleetUtilization: '85%',
                        estimatedCost: '$45,000'
                    }
                });
            }, 2000);
        });
    },
    
    // ========================================
    // State Change Handler
    // ========================================
    onStateChange() {
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('planning:statechange', {
            detail: { state: this.state }
        }));
        
        // Log state change (for debugging)
        console.log('Planning state updated:', this.state);
    },
    
    // ========================================
    // Get Current State
    // ========================================
    getState() {
        return { ...this.state };
    },
    
    // ========================================
    // Set State (for external updates)
    // ========================================
    setState(newState) {
        this.state = { ...this.state, ...newState };
        
        // Update UI to reflect new state
        const rainfallSlider = document.getElementById('rainfall-slider');
        const waveSlider = document.getElementById('wave-slider');
        const activeVehiclesInput = document.getElementById('active-vehicles');
        const maintenanceInput = document.getElementById('maintenance-status');
        
        if (rainfallSlider && newState.rainfallLevel !== undefined) {
            rainfallSlider.value = newState.rainfallLevel;
            this.updateSliderFill(rainfallSlider);
        }
        
        if (waveSlider && newState.waveHeight !== undefined) {
            waveSlider.value = newState.waveHeight;
            this.updateSliderFill(waveSlider);
        }
        
        if (activeVehiclesInput && newState.activeVehicles !== undefined) {
            activeVehiclesInput.value = newState.activeVehicles;
        }
        
        if (maintenanceInput && newState.maintenanceStatus !== undefined) {
            maintenanceInput.value = newState.maintenanceStatus;
        }
    }
};

// ========================================
// Initialize Planning Page
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if on planning page
    if (document.getElementById('generate-btn')) {
        PlanningPage.init();
        
        // Listen for theme changes to update slider fills
        window.addEventListener('themechange', () => {
            PlanningPage.updateSliderFill();
        });
    }
});

// Export for module usage
window.PlanningPage = PlanningPage;
