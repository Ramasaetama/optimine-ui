/**
 * OptiMine - Profile Page JavaScript
 * Handles profile settings, preferences, and activity
 */

(function() {
    'use strict';

    // ========================================
    // Profile Manager
    // ========================================
    const ProfileManager = {
        state: {
            user: {
                name: 'John Doe',
                email: 'tidaktau@gmail.com',
                jobTitle: 'Operations Manager',
                avatar: null
            },
            preferences: {
                notifications: true
            },
            activities: [],
            isDirty: false
        },

        // Initialize
        init() {
            this.loadUserData();
            this.bindEvents();
            this.syncPreferences();
            this.loadActivities();
        },

        // Load user data from localStorage
        loadUserData() {
            const savedUser = localStorage.getItem('optimine-user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    this.state.user = { ...this.state.user, ...userData };
                } catch (e) {
                    console.error('Error loading user data:', e);
                }
            }

            const savedPrefs = localStorage.getItem('optimine-preferences');
            if (savedPrefs) {
                try {
                    const prefsData = JSON.parse(savedPrefs);
                    this.state.preferences = { ...this.state.preferences, ...prefsData };
                } catch (e) {
                    console.error('Error loading preferences:', e);
                }
            }

            // Update UI with loaded data
            this.updateProfileUI();
        },

        // Update profile UI with current state
        updateProfileUI() {
            const { user } = this.state;
            
            // Update form fields
            const nameInput = document.getElementById('profile-name');
            const jobInput = document.getElementById('profile-job');
            const emailDisplay = document.getElementById('user-email');
            const navUsername = document.getElementById('nav-username');
            
            if (nameInput) nameInput.value = user.name;
            if (jobInput) jobInput.value = user.jobTitle;
            if (emailDisplay) emailDisplay.textContent = user.email;
            if (navUsername) navUsername.textContent = user.name;
            
            // Update avatar if exists
            if (user.avatar) {
                const avatarImage = document.getElementById('avatar-image');
                const avatarIcon = document.querySelector('#avatar-preview svg');
                if (avatarImage) {
                    avatarImage.src = user.avatar;
                    avatarImage.classList.remove('hidden');
                    if (avatarIcon) avatarIcon.classList.add('hidden');
                }
            }
        },

        // Sync preferences with global managers
        syncPreferences() {
            // Sync language buttons
            const currentLang = localStorage.getItem('optimine-language') || 'id';
            const langButtons = document.querySelectorAll('.lang-pref-btn');
            langButtons.forEach(btn => {
                const isActive = btn.dataset.lang === currentLang;
                btn.classList.toggle('active', isActive);
            });

            // Sync theme switch
            const isDark = document.documentElement.classList.contains('dark');
            const themeSwitch = document.getElementById('theme-switch');
            if (themeSwitch) {
                themeSwitch.setAttribute('aria-checked', isDark.toString());
            }

            // Sync notifications
            const notificationsSwitch = document.getElementById('notifications-switch');
            if (notificationsSwitch) {
                const isEnabled = this.state.preferences.notifications;
                notificationsSwitch.setAttribute('aria-checked', isEnabled.toString());
            }
        },

        // Bind all events
        bindEvents() {
            // Profile form submission
            const profileForm = document.getElementById('profile-form');
            if (profileForm) {
                profileForm.addEventListener('submit', (e) => this.handleSaveProfile(e));
            }

            // Avatar upload
            const avatarBtn = document.getElementById('avatar-upload-btn');
            const avatarInput = document.getElementById('avatar-input');
            if (avatarBtn && avatarInput) {
                avatarBtn.addEventListener('click', () => avatarInput.click());
                avatarInput.addEventListener('change', (e) => this.handleAvatarChange(e));
            }

            // Language preference buttons
            const langButtons = document.querySelectorAll('.lang-pref-btn');
            langButtons.forEach(btn => {
                btn.addEventListener('click', () => this.handleLanguageChange(btn.dataset.lang));
            });

            // Theme switch
            const themeSwitch = document.getElementById('theme-switch');
            if (themeSwitch) {
                themeSwitch.addEventListener('click', () => this.handleThemeToggle());
            }

            // Notifications switch
            const notificationsSwitch = document.getElementById('notifications-switch');
            if (notificationsSwitch) {
                notificationsSwitch.addEventListener('click', () => this.handleNotificationsToggle());
            }

            // Logout button
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.handleLogout());
            }

            // Track form changes
            const inputs = document.querySelectorAll('.profile-input');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.state.isDirty = true;
                });
            });
        },

        // Handle save profile
        async handleSaveProfile(e) {
            e.preventDefault();
            
            const saveBtn = document.getElementById('save-profile-btn');
            const nameInput = document.getElementById('profile-name');
            const jobInput = document.getElementById('profile-job');
            
            // Validate
            const name = nameInput?.value.trim();
            const jobTitle = jobInput?.value.trim();
            
            if (!name) {
                this.showToast('Please enter your full name', 'error');
                nameInput?.focus();
                return;
            }

            // Show loading state
            if (saveBtn) {
                saveBtn.classList.add('loading');
                saveBtn.disabled = true;
            }

            // Simulate API call
            await this.delay(1000);

            // Update state
            this.state.user.name = name;
            this.state.user.jobTitle = jobTitle || '';
            this.state.isDirty = false;

            // Save to localStorage
            this.saveUserData();

            // Update UI
            this.updateProfileUI();

            // Add activity
            this.addActivity('profile_update', 'Profile updated successfully');

            // Hide loading state
            if (saveBtn) {
                saveBtn.classList.remove('loading');
                saveBtn.disabled = false;
            }

            // Show success toast
            this.showToast('Profile saved successfully!', 'success');
        },

        // Handle avatar change
        handleAvatarChange(e) {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showToast('Please select an image file', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('Image size must be less than 5MB', 'error');
                return;
            }

            // Read and display the image
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result;
                if (imageData) {
                    this.state.user.avatar = imageData;
                    
                    const avatarImage = document.getElementById('avatar-image');
                    const avatarIcon = document.querySelector('#avatar-preview svg');
                    
                    if (avatarImage) {
                        avatarImage.src = imageData;
                        avatarImage.classList.remove('hidden');
                    }
                    if (avatarIcon) {
                        avatarIcon.classList.add('hidden');
                    }

                    // Save to localStorage
                    this.saveUserData();
                    
                    // Add activity
                    this.addActivity('avatar_update', 'Profile picture updated');
                    
                    this.showToast('Avatar updated!', 'success');
                }
            };
            reader.readAsDataURL(file);
        },

        // Handle language change
        handleLanguageChange(lang) {
            // Update buttons
            const langButtons = document.querySelectorAll('.lang-pref-btn');
            langButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // Use global LanguageManager if available
            if (window.LanguageManager) {
                window.LanguageManager.setLanguage(lang);
            } else {
                // Fallback
                localStorage.setItem('optimine-language', lang);
                document.documentElement.lang = lang;
            }

            // Add activity
            this.addActivity('language_change', `Language changed to ${lang === 'en' ? 'English' : 'Indonesian'}`);

            this.showToast(`Language changed to ${lang === 'en' ? 'English' : 'Indonesian'}`, 'success');
        },

        // Handle theme toggle
        handleThemeToggle() {
            const themeSwitch = document.getElementById('theme-switch');
            const isDark = document.documentElement.classList.contains('dark');
            
            // Toggle theme
            if (window.ThemeManager) {
                window.ThemeManager.setTheme(isDark ? 'light' : 'dark');
            } else {
                // Fallback
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('optimine-theme', isDark ? 'light' : 'dark');
            }

            // Update switch
            if (themeSwitch) {
                themeSwitch.setAttribute('aria-checked', (!isDark).toString());
            }

            // Add activity
            this.addActivity('theme_change', `Theme changed to ${isDark ? 'light' : 'dark'} mode`);
        },

        // Handle notifications toggle
        handleNotificationsToggle() {
            const notificationsSwitch = document.getElementById('notifications-switch');
            const isEnabled = notificationsSwitch?.getAttribute('aria-checked') === 'true';
            
            // Toggle
            this.state.preferences.notifications = !isEnabled;
            
            // Update UI
            if (notificationsSwitch) {
                notificationsSwitch.setAttribute('aria-checked', (!isEnabled).toString());
            }

            // Save preferences
            this.savePreferences();

            // Add activity
            this.addActivity('notifications_toggle', `Notifications ${!isEnabled ? 'enabled' : 'disabled'}`);

            this.showToast(`Notifications ${!isEnabled ? 'enabled' : 'disabled'}`, 'success');
        },

        // Handle logout
        handleLogout() {
            // Use global handleLogout from auth.js if available
            if (typeof window.handleLogout === 'function') {
                window.handleLogout();
            } else {
                // Fallback: Clear user data with correct keys
                localStorage.removeItem('optimine-logged-in');
                localStorage.removeItem('optimine-user');
                localStorage.removeItem('optimine-redirect');
                
                // Show toast
                this.showToast('Logged out successfully', 'success');

                // Redirect to home page after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        },

        // Save user data to localStorage
        saveUserData() {
            try {
                localStorage.setItem('optimine-user', JSON.stringify(this.state.user));
            } catch (e) {
                console.error('Error saving user data:', e);
            }
        },

        // Save preferences to localStorage
        savePreferences() {
            try {
                localStorage.setItem('optimine-preferences', JSON.stringify(this.state.preferences));
            } catch (e) {
                console.error('Error saving preferences:', e);
            }
        },

        // Load activities from localStorage
        loadActivities() {
            const savedActivities = localStorage.getItem('optimine-activities');
            if (savedActivities) {
                try {
                    this.state.activities = JSON.parse(savedActivities);
                    this.renderActivities();
                } catch (e) {
                    console.error('Error loading activities:', e);
                }
            }
        },

        // Add activity
        addActivity(type, message) {
            const activity = {
                id: Date.now(),
                type,
                message,
                timestamp: new Date().toISOString()
            };

            this.state.activities.unshift(activity);
            
            // Keep only last 10 activities
            if (this.state.activities.length > 10) {
                this.state.activities = this.state.activities.slice(0, 10);
            }

            // Save to localStorage
            localStorage.setItem('optimine-activities', JSON.stringify(this.state.activities));

            // Re-render activities
            this.renderActivities();
        },

        // Render activities list
        renderActivities() {
            const emptyState = document.getElementById('activity-empty');
            const activityList = document.getElementById('activity-list');
            
            if (!activityList) return;

            if (this.state.activities.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                activityList.classList.add('hidden');
                return;
            }

            if (emptyState) emptyState.classList.add('hidden');
            activityList.classList.remove('hidden');

            activityList.innerHTML = this.state.activities.map(activity => {
                const icon = this.getActivityIcon(activity.type);
                const timeAgo = this.formatTimeAgo(activity.timestamp);
                
                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            ${icon}
                        </div>
                        <div class="activity-content">
                            <p class="activity-title">${activity.message}</p>
                            <p class="activity-time">${timeAgo}</p>
                        </div>
                    </div>
                `;
            }).join('');
        },

        // Get activity icon based on type
        getActivityIcon(type) {
            const icons = {
                profile_update: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
                avatar_update: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
                language_change: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>',
                theme_change: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>',
                notifications_toggle: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>',
                default: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
            };
            return icons[type] || icons.default;
        },

        // Format time ago
        formatTimeAgo(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            if (seconds < 60) return 'Just now';
            if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
            if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
            
            return date.toLocaleDateString();
        },

        // Show toast notification
        showToast(message, type = 'info') {
            // Check if global Toast exists
            if (window.Toast) {
                window.Toast.show(message, type);
                return;
            }

            // Fallback toast implementation
            const existing = document.querySelector('.profile-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = `profile-toast fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 'bg-primary'
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

        // Utility: delay
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProfileManager.init());
    } else {
        ProfileManager.init();
    }

    // Export for external access
    window.ProfileManager = ProfileManager;

})();
