/**
 * OptiMine SPA - Auth Page
 * Login/Register form within SPA
 */

import { App } from '../../app.js';

const API_BASE_URL = 'http://139.59.224.58:5000';

/**
 * Auth Page Handler
 */
export const authPage = async (params) => {
    // Hide navbar and footer on auth page
    App.View.hideNavbar();

    const content = getAuthTemplate();
    await App.View.render(content, 'auth');

    // Initialize after render
    setTimeout(() => {
        initAuthPage();
    }, 100);
};

/**
 * Get Auth Page Template
 */
function getAuthTemplate() {
    return `
        <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <!-- Auth Card -->
                <div class="glass border border-border rounded-2xl p-6 sm:p-8 animate-fade-in">
                    
                    <!-- Header: Logo + Title -->
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                            <img src="assets/images/b (192 x 192 piksel) (1).png" alt="OptiMine Logo" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <svg class="w-8 h-8 text-primary" style="display: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 class="font-heading text-2xl font-bold mb-1">
                            <span class="text-primary">Opti</span><span class="text-foreground">Mine</span>
                        </h1>
                        <p class="text-sm text-muted-foreground">Mining Value Chain Optimization Platform</p>
                    </div>
                    
                    <!-- Tab Navigation -->
                    <div class="grid grid-cols-2 gap-1 bg-secondary/50 rounded-lg p-1 mb-6">
                        <button id="login-tab" class="auth-tab active py-2 px-4 text-sm font-medium rounded-md transition-all bg-primary text-white" data-tab="login">
                            Masuk
                        </button>
                        <button id="register-tab" class="auth-tab py-2 px-4 text-sm font-medium rounded-md transition-all text-muted-foreground hover:text-foreground" data-tab="register">
                            Daftar
                        </button>
                    </div>
                    
                    <!-- LOGIN FORM -->
                    <form id="login-form" class="space-y-4">
                        <!-- Email Input -->
                        <div class="space-y-1.5">
                            <label for="login-email" class="text-sm font-medium text-foreground">Email</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input 
                                    type="email" 
                                    id="login-email" 
                                    class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="email@example.com"
                                    required
                                >
                            </div>
                        </div>
                        
                        <!-- Password Input -->
                        <div class="space-y-1.5">
                            <label for="login-password" class="text-sm font-medium text-foreground">Kata Sandi</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    class="w-full pl-10 pr-10 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="••••••••"
                                    required
                                >
                                <button type="button" class="password-toggle absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg class="eye-open w-5 h-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg class="eye-closed w-5 h-5 text-muted-foreground hover:text-foreground hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            id="login-submit"
                            class="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-300 glow-hover flex items-center justify-center gap-2"
                        >
                            <span>Masuk</span>
                            <svg class="loading-spinner w-5 h-5 animate-spin hidden" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </button>
                    </form>
                    
                    <!-- REGISTER FORM -->
                    <form id="register-form" class="space-y-4 hidden">
                        <!-- Full Name -->
                        <div class="space-y-1.5">
                            <label for="register-name" class="text-sm font-medium text-foreground">Nama Lengkap</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input type="text" id="register-name" class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm" placeholder="John Doe" required>
                            </div>
                        </div>
                        
                        <!-- Email -->
                        <div class="space-y-1.5">
                            <label for="register-email" class="text-sm font-medium text-foreground">Email</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input type="email" id="register-email" class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm" placeholder="email@example.com" required>
                            </div>
                        </div>
                        
                        <!-- Password -->
                        <div class="space-y-1.5">
                            <label for="register-password" class="text-sm font-medium text-foreground">Kata Sandi</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input type="password" id="register-password" class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm" placeholder="Minimal 8 karakter" required minlength="8">
                            </div>
                        </div>
                        
                        <!-- Confirm Password -->
                        <div class="space-y-1.5">
                            <label for="register-confirm" class="text-sm font-medium text-foreground">Konfirmasi Kata Sandi</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input type="password" id="register-confirm" class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm" placeholder="••••••••" required>
                            </div>
                        </div>
                        
                        <!-- Role Dropdown -->
                        <div class="space-y-1.5">
                            <label for="register-role" class="text-sm font-medium text-foreground">Peran</label>
                            <select id="register-role" class="w-full px-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" required>
                                <option value="">Pilih Peran</option>
                                <option value="mining_planner">Mining Planner</option>
                                <option value="shipping_planner">Shipping Planner</option>
                            </select>
                        </div>
                        
                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            id="register-submit"
                            class="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-300 glow-hover flex items-center justify-center gap-2"
                        >
                            <span>Buat Akun</span>
                            <svg class="loading-spinner w-5 h-5 animate-spin hidden" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize Auth Page
 */
function initAuthPage() {
    setupTabNavigation();
    setupLoginForm();
    setupRegisterForm();
    setupPasswordToggles();
}

/**
 * Setup Tab Navigation
 */
function setupTabNavigation() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('bg-primary', 'text-white');
            loginTab.classList.remove('text-muted-foreground');
            registerTab.classList.remove('bg-primary', 'text-white');
            registerTab.classList.add('text-muted-foreground');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('bg-primary', 'text-white');
            registerTab.classList.remove('text-muted-foreground');
            loginTab.classList.remove('bg-primary', 'text-white');
            loginTab.classList.add('text-muted-foreground');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }
}

/**
 * Setup Login Form
 */
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('login-submit');
        const spinner = submitBtn.querySelector('.loading-spinner');

        // Show loading
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.message || 'Login gagal');
            }

            // Save login state
            localStorage.setItem('optimine-logged-in', 'true');
            localStorage.setItem('optimine-token', result.data.token);
            localStorage.setItem('optimine-user', JSON.stringify({
                id: result.data.id,
                email: email,
                name: result.data.nama,
                role: result.data.role
            }));

            // Update navbar auth UI - hide login, show profile
            updateNavbarAuthUI(true, result.data.nama);

            // Show navbar again before redirect
            App.View.showNavbar();

            // Redirect to saved destination or home
            setTimeout(() => {
                const redirectRoute = localStorage.getItem('optimine-redirect') || 'home';
                localStorage.removeItem('optimine-redirect');
                window.location.hash = redirectRoute;
            }, 1000);

        } catch (error) {
            App.View.showToast(error.message || 'Email atau password salah', 'error');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    });
}

/**
 * Setup Register Form
 */
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    // Prevent duplicate event listener registration
    if (form.dataset.listenerAdded === 'true') {
        console.log('Register form listener already added, skipping');
        return;
    }
    form.dataset.listenerAdded = 'true';

    let isSubmitting = false; // Flag to prevent double-submit

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation(); // Stop other listeners

        // Prevent double-submit
        if (isSubmitting) {
            console.log('Registration already in progress, ignoring duplicate submit');
            return;
        }

        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const role = document.getElementById('register-role').value;
        const submitBtn = document.getElementById('register-submit');
        const spinner = submitBtn.querySelector('.loading-spinner');

        // Validate
        if (password !== confirm) {
            App.View.showToast('Konfirmasi password tidak cocok', 'error');
            return;
        }

        if (!role) {
            App.View.showToast('Pilih peran terlebih dahulu', 'error');
            return;
        }

        // Show loading and set flag
        isSubmitting = true;
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');

        try {
            // Register
            const registerResponse = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama: name, email, password, role })
            });

            const registerResult = await registerResponse.json();

            if (!registerResponse.ok || registerResult.error) {
                throw new Error(registerResult.message || 'Registrasi gagal');
            }

            // Auto login
            const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const loginResult = await loginResponse.json();

            let finalUserName = name;
            if (loginResponse.ok && !loginResult.error) {
                localStorage.setItem('optimine-logged-in', 'true');
                localStorage.setItem('optimine-token', loginResult.data.token);
                localStorage.setItem('optimine-user', JSON.stringify({
                    id: loginResult.data.id,
                    email: email,
                    name: loginResult.data.nama,
                    role: loginResult.data.role
                }));
                finalUserName = loginResult.data.nama;
            }

            // Update navbar auth UI - hide login, show profile
            updateNavbarAuthUI(true, finalUserName);

            // Show navbar again before redirect
            App.View.showNavbar();

            setTimeout(() => {
                const redirectRoute = localStorage.getItem('optimine-redirect') || 'home';
                localStorage.removeItem('optimine-redirect');
                window.location.hash = redirectRoute;
            }, 1000);

        } catch (error) {
            App.View.showToast(error.message || 'Registrasi gagal', 'error');
        } finally {
            isSubmitting = false; // Reset flag
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    });
}

/**
 * Setup Password Toggle
 */
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const eyeOpen = toggle.querySelector('.eye-open');
            const eyeClosed = toggle.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen?.classList.add('hidden');
                eyeClosed?.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen?.classList.remove('hidden');
                eyeClosed?.classList.add('hidden');
            }
        });
    });
}

/**
 * Update Navbar Auth UI
 * Hide login button and show profile when logged in
 */
function updateNavbarAuthUI(isLoggedIn, userName) {
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');

    if (isLoggedIn) {
        // Hide login buttons
        loginBtn?.classList.add('hidden');
        loginBtn?.classList.remove('sm:flex');
        mobileLoginBtn?.classList.add('hidden');

        // Show profile buttons
        profileBtn?.classList.remove('hidden');
        profileBtn?.classList.add('flex');
        mobileProfileBtn?.classList.remove('hidden');
        mobileProfileBtn?.classList.add('flex');

        // Update user name and initial
        const userNameElements = document.querySelectorAll('.user-name');
        const userInitialElements = document.querySelectorAll('.user-initial');

        userNameElements.forEach(el => {
            el.textContent = userName || 'User';
        });

        userInitialElements.forEach(el => {
            el.textContent = (userName || 'U').charAt(0).toUpperCase();
        });
    } else {
        // Show login buttons
        loginBtn?.classList.remove('hidden');
        loginBtn?.classList.add('sm:flex');
        mobileLoginBtn?.classList.remove('hidden');

        // Hide profile buttons
        profileBtn?.classList.add('hidden');
        profileBtn?.classList.remove('flex');
        mobileProfileBtn?.classList.add('hidden');
        mobileProfileBtn?.classList.remove('flex');
    }
}
