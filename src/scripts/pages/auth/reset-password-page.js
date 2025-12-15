/**
 * OptiMine SPA - Reset Password Page
 * Handle password reset from email link
 */

import { App } from '../../app.js';
import { Router } from '../../routes/routes.js';
import { getSection } from '../../utils/translations.js';
import { API } from '../../data/api.js';

/**
 * Get reset password page translations
 */
const getTranslations = (lang) => {
    return {
        title: lang === 'en' ? 'Reset Password' : 'Reset Password',
        subtitle: lang === 'en' ? 'Enter your new password below' : 'Masukkan password baru Anda',
        newPassword: lang === 'en' ? 'New Password' : 'Password Baru',
        confirmPassword: lang === 'en' ? 'Confirm Password' : 'Konfirmasi Password',
        submit: lang === 'en' ? 'Reset Password' : 'Reset Password',
        backToLogin: lang === 'en' ? 'Back to Login' : 'Kembali ke Login',
        passwordMismatch: lang === 'en' ? 'Passwords do not match' : 'Password tidak cocok',
        passwordTooShort: lang === 'en' ? 'Password must be at least 6 characters' : 'Password minimal 6 karakter',
        success: lang === 'en' ? 'Password has been reset successfully!' : 'Password berhasil direset!',
        error: lang === 'en' ? 'Failed to reset password' : 'Gagal mereset password',
        invalidToken: lang === 'en' ? 'Invalid or expired reset link' : 'Link reset tidak valid atau sudah kadaluarsa'
    };
};

/**
 * Render reset password page template
 */
const renderTemplate = (lang) => {
    const t = getTranslations(lang);

    return `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <!-- Decorative elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="w-full max-w-md relative z-10">
            <!-- Reset Password Card -->
            <div id="reset-password-card" class="glass border border-border rounded-2xl p-6 sm:p-8 animate-scale-in">
                <!-- Header -->
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 class="font-heading text-xl font-bold text-foreground">${t.title}</h2>
                    <p class="text-sm text-muted-foreground mt-2">${t.subtitle}</p>
                </div>
                
                <form id="reset-password-form" class="space-y-4">
                    <!-- New Password -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${t.newPassword}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                type="password" 
                                id="new-password" 
                                required 
                                minlength="6"
                                class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                placeholder="••••••••"
                            >
                        </div>
                    </div>
                    
                    <!-- Confirm Password -->
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-2">${t.confirmPassword}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                type="password" 
                                id="confirm-new-password" 
                                required 
                                minlength="6"
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
                        ${t.submit}
                    </button>
                    
                    <!-- Back to Login -->
                    <button 
                        type="button" 
                        id="back-to-login"
                        class="w-full py-3 bg-secondary/50 hover:bg-secondary/70 text-foreground border border-border rounded-lg font-medium transition-all duration-300"
                    >
                        ${t.backToLogin}
                    </button>
                </form>
            </div>
        </div>
    </div>
    `;
};

/**
 * Setup reset password form handlers
 */
const setupHandlers = (token) => {
    const form = document.getElementById('reset-password-form');
    const backToLoginBtn = document.getElementById('back-to-login');
    const lang = localStorage.getItem('optimine-language') || 'id';
    const t = getTranslations(lang);

    // Back to login button
    backToLoginBtn?.addEventListener('click', () => {
        Router.navigate('auth');
    });

    // Form submit
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('new-password')?.value;
        const confirmPassword = document.getElementById('confirm-new-password')?.value;

        // Validation
        if (newPassword.length < 6) {
            App.View.showToast(t.passwordTooShort, 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            App.View.showToast(t.passwordMismatch, 'error');
            return;
        }

        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
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
            // Call backend API to reset password
            await API.auth.resetPassword(token, newPassword);

            // Show success message
            App.View.showToast(t.success, 'success');

            // Redirect to login after delay
            setTimeout(() => {
                Router.navigate('auth');
            }, 2000);

        } catch (error) {
            console.error('Reset password error:', error);
            App.View.showToast(
                error.message || t.error,
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
 * Reset Password Page Handler
 */
export const resetPasswordPage = async (params) => {
    const lang = localStorage.getItem('optimine-language') || 'id';
    const t = getTranslations(lang);
    const token = params?.token;

    // Check if token exists
    if (!token) {
        App.View.showToast(t.invalidToken, 'error');
        Router.navigate('auth');
        return;
    }

    // Render page
    await App.View.render(renderTemplate(lang), 'reset-password');

    // Setup form handlers
    setupHandlers(token);
};
