/**
 * OptiMine Auth Page JavaScript
 * Handles login, register, and forgot password functionality
 */

// ========================================
// AUTH PAGE MODULE
// ========================================

const AuthPage = (() => {
    // State
    const state = {
        currentView: 'login', // 'login', 'register', 'forgot'
        isLoading: false,
        selectedRole: null,
    };

    // DOM Elements
    let loginTab;
    let registerTab;
    let loginForm;
    let registerForm;
    let forgotPasswordForm;
    let forgotPasswordLink;
    let backToLoginBtn;
    let roleDropdownBtn;
    let roleDropdown;
    let roleChevron;
    let selectedRoleText;
    let roleInput;

    // ========================================
    // TRANSLATION HELPER
    // ========================================

    const t = (key) => {
        if (window.OptiMine && window.OptiMine.LanguageManager) {
            return window.OptiMine.LanguageManager.t(key);
        }
        return key;
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    const init = () => {
        // Get DOM elements
        loginTab = document.getElementById('login-tab');
        registerTab = document.getElementById('register-tab');
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        forgotPasswordForm = document.getElementById('forgot-password-form');
        forgotPasswordLink = document.getElementById('forgot-password-link');
        backToLoginBtn = document.getElementById('back-to-login');
        roleDropdownBtn = document.getElementById('role-dropdown-btn');
        roleDropdown = document.getElementById('role-dropdown');
        roleChevron = document.getElementById('role-chevron');
        selectedRoleText = document.getElementById('selected-role');
        roleInput = document.getElementById('register-role');

        if (!loginTab || !registerTab) {
            console.warn('Auth Page: Required elements not found');
            return;
        }

        // Setup event listeners
        setupTabNavigation();
        setupForms();
        setupRoleDropdown();
        setupPasswordToggles();
        setupForgotPassword();
        setupPasswordStrength();

        // Check URL for initial tab
        checkUrlParams();

        console.log('Auth Page initialized');
    };

    // ========================================
    // TAB NAVIGATION
    // ========================================

    const setupTabNavigation = () => {
        loginTab.addEventListener('click', () => switchTab('login'));
        registerTab.addEventListener('click', () => switchTab('register'));
    };

    const switchTab = (tab) => {
        if (state.isLoading) return;

        state.currentView = tab;

        // Update tab styles
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            forgotPasswordForm.classList.add('hidden');
        } else if (tab === 'register') {
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            forgotPasswordForm.classList.add('hidden');
        }

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url);

        // Clear any errors
        clearFormErrors();
    };

    const checkUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'register') {
            switchTab('register');
        }
    };

    // ========================================
    // FORM HANDLING
    // ========================================

    const setupForms = () => {
        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Register form
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        // Send reset link
        const sendResetLinkBtn = document.getElementById('send-reset-link');
        if (sendResetLinkBtn) {
            sendResetLinkBtn.addEventListener('click', handleForgotPassword);
        }

        // Real-time validation
        setupRealTimeValidation();
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (state.isLoading) return;

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Validate
        if (!validateEmail(email)) {
            showFieldError('login-email', t('auth.invalidEmail') || 'Please enter a valid email address');
            return;
        }

        if (!password) {
            showFieldError('login-password', t('auth.passwordRequired') || 'Password is required');
            return;
        }

        // Submit
        setLoading(true, loginForm);

        try {
            // Call real API
            const response = await fetch('http://139.59.224.58:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.message || 'Login failed');
            }

            // Save login state from API response
            localStorage.setItem('optimine-logged-in', 'true');
            localStorage.setItem('optimine-token', result.data.token);
            localStorage.setItem('optimine-user', JSON.stringify({
                id: result.data.id,
                email: email,
                name: result.data.nama,
                role: result.data.role,
                avatar: null
            }));

            // Success - redirect to home or saved redirect
            showToast('success', t('auth.loginSuccess') || 'Login successful! Redirecting...');

            setTimeout(() => {
                const redirectUrl = localStorage.getItem('optimine-redirect') || 'index.html';
                localStorage.removeItem('optimine-redirect');
                window.location.href = redirectUrl;
            }, 1500);

        } catch (error) {
            showToast('error', error.message || t('auth.loginError') || 'Invalid email or password');
        } finally {
            setLoading(false, loginForm);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (state.isLoading) return;

        const fullName = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const role = document.getElementById('register-role').value;

        // Validate
        let hasError = false;

        if (!fullName || fullName.length < 2) {
            showFieldError('register-name', t('auth.nameRequired') || 'Please enter your full name');
            hasError = true;
        }

        if (!validateEmail(email)) {
            showFieldError('register-email', t('auth.invalidEmail') || 'Please enter a valid email address');
            hasError = true;
        }

        if (password.length < 8) {
            showFieldError('register-password', t('auth.passwordMinLength') || 'Password must be at least 8 characters');
            hasError = true;
        }

        if (password !== confirmPassword) {
            showFieldError('register-confirm-password', t('auth.passwordMismatch') || 'Passwords do not match');
            hasError = true;
        }

        if (!role) {
            showFieldError('role-dropdown-btn', t('auth.roleRequired') || 'Please select a role');
            hasError = true;
        }

        if (hasError) return;

        // Submit
        setLoading(true, registerForm);

        try {
            // Prepare data for registration
            const registerData = {
                nama: fullName,
                email,
                password,
                role
            };

            console.log('Sending registration data:', registerData);

            // Call real API for registration
            const registerResponse = await fetch('http://139.59.224.58:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const registerResult = await registerResponse.json();
            console.log('Registration response:', registerResult);

            if (!registerResponse.ok || registerResult.error) {
                throw new Error(registerResult.message || 'Registration failed');
            }

            // Auto login after successful registration
            const loginResponse = await fetch('http://139.59.224.58:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const loginResult = await loginResponse.json();

            if (loginResponse.ok && !loginResult.error) {
                // Save login state from API response
                localStorage.setItem('optimine-logged-in', 'true');
                localStorage.setItem('optimine-token', loginResult.data.token);
                localStorage.setItem('optimine-user', JSON.stringify({
                    id: loginResult.data.id,
                    email: email,
                    name: loginResult.data.nama,
                    role: loginResult.data.role,
                    avatar: null
                }));
            } else {
                // If auto-login fails, just save basic info
                localStorage.setItem('optimine-logged-in', 'true');
                localStorage.setItem('optimine-user', JSON.stringify({
                    email: email,
                    name: fullName,
                    role: role,
                    avatar: null
                }));
            }

            // Success - redirect to home
            showToast('success', t('auth.registerSuccess') || 'Account created successfully! Redirecting...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            showToast('error', error.message || t('auth.registerError') || 'Registration failed. Please try again.');
        } finally {
            setLoading(false, registerForm);
        }
    };

    const handleForgotPassword = async () => {
        if (state.isLoading) return;

        const email = document.getElementById('forgot-email').value.trim();

        if (!validateEmail(email)) {
            showFieldError('forgot-email', t('auth.invalidEmail') || 'Please enter a valid email address');
            return;
        }

        setLoading(true, forgotPasswordForm);

        try {
            await simulateApiCall();

            showToast('success', t('auth.resetEmailSent') || 'Password reset link has been sent to your email.');

        } catch (error) {
            showToast('error', t('auth.resetError') || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false, forgotPasswordForm);
        }
    };

    // ========================================
    // ROLE DROPDOWN
    // ========================================

    const setupRoleDropdown = () => {
        if (!roleDropdownBtn || !roleDropdown) return;

        // Toggle dropdown
        roleDropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleRoleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!roleDropdownBtn.contains(e.target) && !roleDropdown.contains(e.target)) {
                closeRoleDropdown();
            }
        });

        // Role options
        const roleOptions = roleDropdown.querySelectorAll('.role-option');
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectRole(option);
            });
        });
    };

    const toggleRoleDropdown = () => {
        const isHidden = roleDropdown.classList.contains('hidden');

        if (isHidden) {
            roleDropdown.classList.remove('hidden');
            roleChevron.classList.add('open');
        } else {
            closeRoleDropdown();
        }
    };

    const closeRoleDropdown = () => {
        roleDropdown.classList.add('hidden');
        roleChevron.classList.remove('open');
    };

    const selectRole = (option) => {
        const value = option.dataset.value;
        const text = option.querySelector('span').textContent;

        state.selectedRole = value;
        roleInput.value = value;
        selectedRoleText.textContent = text;
        selectedRoleText.classList.remove('text-muted-foreground');
        selectedRoleText.classList.add('text-foreground');

        // Update selected state
        roleDropdown.querySelectorAll('.role-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');

        closeRoleDropdown();
        clearFieldError('role-dropdown-btn');
    };

    // ========================================
    // PASSWORD TOGGLE
    // ========================================

    const setupPasswordToggles = () => {
        const toggles = document.querySelectorAll('.password-toggle');

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentElement.querySelector('input');
                const eyeOpen = toggle.querySelector('.eye-open');
                const eyeClosed = toggle.querySelector('.eye-closed');

                if (input.type === 'password') {
                    input.type = 'text';
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else {
                    input.type = 'password';
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        });
    };

    // ========================================
    // FORGOT PASSWORD VIEW
    // ========================================

    const setupForgotPassword = () => {
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                showForgotPasswordView();
            });
        }

        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => {
                hideForgotPasswordView();
            });
        }
    };

    const showForgotPasswordView = () => {
        state.currentView = 'forgot';
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        forgotPasswordForm.classList.remove('hidden');

        // Hide tabs
        loginTab.parentElement.classList.add('hidden');
    };

    const hideForgotPasswordView = () => {
        state.currentView = 'login';
        forgotPasswordForm.classList.add('hidden');
        loginForm.classList.remove('hidden');

        // Show tabs
        loginTab.parentElement.classList.remove('hidden');
    };

    // ========================================
    // VALIDATION
    // ========================================

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const setupRealTimeValidation = () => {
        // Email fields
        const emailFields = document.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            field.addEventListener('blur', () => {
                if (field.value && !validateEmail(field.value)) {
                    showFieldError(field.id, t('auth.invalidEmail') || 'Please enter a valid email address');
                } else {
                    clearFieldError(field.id);
                }
            });
        });

        // Password confirmation
        const confirmPassword = document.getElementById('register-confirm-password');
        const password = document.getElementById('register-password');

        if (confirmPassword && password) {
            confirmPassword.addEventListener('blur', () => {
                if (confirmPassword.value && confirmPassword.value !== password.value) {
                    showFieldError('register-confirm-password', t('auth.passwordMismatch') || 'Passwords do not match');
                } else {
                    clearFieldError('register-confirm-password');
                }
            });
        }
    };

    // ========================================
    // PASSWORD STRENGTH INDICATOR
    // ========================================

    const setupPasswordStrength = () => {
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
        const reqLength = document.getElementById('req-length');
        const reqUppercase = document.getElementById('req-uppercase');
        const reqNumber = document.getElementById('req-number');

        if (!registerPassword || !passwordInfoContainer) return;

        // Get translations
        const getStrengthLabel = (strength) => {
            const lang = localStorage.getItem('optimine-language') || 'id';
            const labels = {
                en: ['', 'Weak', 'Fair', 'Good', 'Strong'],
                id: ['', 'Lemah', 'Cukup', 'Baik', 'Kuat']
            };
            return (labels[lang] || labels['id'])[strength] || '';
        };

        // Check password strength
        const checkPasswordStrength = (password) => {
            let strength = 0;
            const checks = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                number: /[0-9]/.test(password),
                lowercase: /[a-z]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            // Calculate strength
            if (checks.length) strength++;
            if (checks.uppercase) strength++;
            if (checks.number) strength++;
            if (checks.special || (checks.lowercase && password.length >= 10)) strength++;

            return { strength, checks };
        };

        // Update requirement indicator
        const updateRequirement = (element, isValid) => {
            if (!element) return;
            const span = element.querySelector('span');
            const text = span ? span.textContent : '';

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

        // Update strength UI
        const updateStrengthUI = (strength) => {
            const colors = {
                0: { bar: 'bg-secondary', text: '', color: '' },
                1: { bar: 'bg-red-500', text: 'text-red-500', color: getStrengthLabel(1) },
                2: { bar: 'bg-orange-500', text: 'text-orange-500', color: getStrengthLabel(2) },
                3: { bar: 'bg-yellow-500', text: 'text-yellow-500', color: getStrengthLabel(3) },
                4: { bar: 'bg-green-500', text: 'text-green-500', color: getStrengthLabel(4) }
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
                strengthText.textContent = config.color;
                strengthText.className = `text-xs font-medium ${config.text}`;
            }
        };

        // Show password info on focus
        registerPassword.addEventListener('focus', () => {
            passwordInfoContainer.classList.remove('hidden');
        });

        // Hide password info on blur (only if empty)
        registerPassword.addEventListener('blur', () => {
            if (!registerPassword.value) {
                passwordInfoContainer.classList.add('hidden');
                strengthContainer?.classList.add('hidden');
            }
        });

        // Input handler
        registerPassword.addEventListener('input', (e) => {
            const password = e.target.value;

            // Always show container when typing
            passwordInfoContainer.classList.remove('hidden');

            if (password.length > 0) {
                strengthContainer?.classList.remove('hidden');
                const { strength, checks } = checkPasswordStrength(password);

                // Update requirements
                updateRequirement(reqLength, checks.length);
                updateRequirement(reqUppercase, checks.uppercase);
                updateRequirement(reqNumber, checks.number);

                // Update strength bar
                updateStrengthUI(strength);
            } else {
                strengthContainer?.classList.add('hidden');
                updateStrengthUI(0);

                // Reset requirements
                updateRequirement(reqLength, false);
                updateRequirement(reqUppercase, false);
                updateRequirement(reqNumber, false);
            }
        });
    };

    // ========================================
    // UI HELPERS
    // ========================================

    const showFieldError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add new error message
        const errorEl = document.createElement('p');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);
    };

    const clearFieldError = (fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove('error');

        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    };

    const clearFormErrors = () => {
        document.querySelectorAll('.auth-input.error').forEach(field => {
            field.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    };

    const setLoading = (loading, form) => {
        state.isLoading = loading;

        const submitBtn = form.querySelector('.auth-submit') || form.querySelector('button[type="submit"]') || form.querySelector('#send-reset-link');
        if (!submitBtn) return;

        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.querySelector('.loading-spinner')?.classList.remove('hidden');
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.querySelector('.loading-spinner')?.classList.add('hidden');
        }
    };

    const showToast = (type, message) => {
        // Use main.js Toast if available
        if (window.OptiMine && window.OptiMine.Toast) {
            window.OptiMine.Toast.show(message, type);
        } else {
            // Fallback
            alert(message);
        }
    };

    const simulateApiCall = () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    };

    // ========================================
    // PUBLIC API
    // ========================================

    return {
        init,
        switchTab,
        getState: () => ({ ...state }),
    };
})();

// ========================================
// INITIALIZE ON DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the Auth page
    if (document.getElementById('login-form') || document.getElementById('register-form')) {
        AuthPage.init();
    }
});

// ========================================
// GLOBAL AUTH FUNCTIONS
// ========================================

/**
 * Handle user logout
 * Clears session and redirects to home
 */
function handleLogout() {
    // Clear auth data
    localStorage.removeItem('optimine-logged-in');
    localStorage.removeItem('optimine-user');
    localStorage.removeItem('optimine-redirect');

    // Show toast if available
    if (window.OptiMine && window.OptiMine.Toast) {
        window.OptiMine.Toast.show('Logged out successfully', 'success');
    }

    // Redirect to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem('optimine-logged-in') === 'true';
}

/**
 * Get current user data
 * @returns {object}
 */
function getUserData() {
    try {
        return JSON.parse(localStorage.getItem('optimine-user') || '{}');
    } catch {
        return {};
    }
}

// Export for global use
window.handleLogout = handleLogout;
window.isLoggedIn = isLoggedIn;
window.getUserData = getUserData;
