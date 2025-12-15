/**
 * OptiMine - Mining Value Chain Optimization
 * Main JavaScript File
 */

// ========================================
// Theme Management
// ========================================
const ThemeManager = {
    STORAGE_KEY: 'optimine-theme',

    init() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Setup toggle button
        this.setupToggle();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    },

    setupToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');

            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: isDark ? 'dark' : 'light' }
            }));
        });
    },

    isDark() {
        return document.documentElement.classList.contains('dark');
    },

    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(this.STORAGE_KEY, theme);
    }
};

// ========================================
// Language Management
// ========================================
const LanguageManager = {
    STORAGE_KEY: 'optimine-lang',
    currentLang: 'en',

    // Translation dictionary
    translations: {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.planning': 'Planning',
            'nav.aiTools': 'AI Tools',
            'nav.dashboard': 'Dashboard',
            'nav.login': 'Login',

            // Home Page
            'home.welcome': 'Welcome to',
            'home.subtitle': 'AI-powered Mining Value Chain Optimization Platform',
            'home.activeSites': 'Active Sites',
            'home.fleetUnits': 'Fleet Units',
            'home.efficiency': 'Efficiency',
            'home.quickAccess': 'Quick Access',
            'home.scenarioSimulator': 'AI Scenario Simulator',
            'home.scenarioDesc': 'Optimize planning with weather and fleet analysis',
            'home.chatbot': 'AI Assistant Chatbot',
            'home.chatbotDesc': 'Get AI-powered operational recommendations',
            'home.operationsDashboard': 'Operations Dashboard',
            'home.operationsDesc': 'Real-time monitoring and analytics',
            'home.capabilities': 'Our Capabilities',

            // Planning Page
            'planning.title': 'AI Scenario Simulator',
            'planning.subtitle': 'Configure parameters to generate optimized production plans',
            'planning.weatherConditions': 'Weather Conditions',
            'planning.rainfallIntensity': 'Rainfall Intensity (mm/hour)',
            'planning.waveHeight': 'Wave Height (meters)',
            'planning.fleetStatus': 'Fleet Status',
            'planning.availableHaulers': 'Available Haulers',
            'planning.activeExcavators': 'Active Excavators',
            'planning.shipSchedule': 'Ship Schedule',
            'planning.generatePlan': 'Generate Optimized Plan',
            'planning.generating': 'Generating...',
            'planning.systemStatus': 'System Status',
            'planning.aiEngine': 'AI Engine',
            'planning.online': 'Online',
            'planning.dataSync': 'Data Sync',
            'planning.ready': 'Ready',
            'planning.activeAlerts': 'Active Alerts',

            // AI Tools Page
            'aiTools.title': 'AI Assistant',
            'aiTools.subtitle': 'Ask questions about field conditions and get AI recommendations',
            'aiTools.placeholder': 'Ask about weather impact, fleet optimization, or production planning...',
            'aiTools.aiOnline': 'AI Online',
            'aiTools.responseTime': 'Response time: <2s',
            'aiTools.suggestedPrompts': 'Suggested Prompts',
            'aiTools.prompt1': 'What is the impact of current rainfall on mining operations?',
            'aiTools.prompt2': 'Recommend optimal fleet allocation for today',
            'aiTools.prompt3': 'Analyze shipping delays due to high waves',
            'aiTools.integration': 'Integration',
            'aiTools.integrationDesc': 'Ready for n8n workflow integration and Lovable AI connection',
            'aiTools.welcomeMessage': "Hello! I'm your AI Mining Operations Assistant. How can I help you optimize your operations today?",

            // AI Responses
            'ai.weatherAnalysis': 'Weather Impact Analysis',
            'ai.fleetOptimization': 'Fleet Optimization',
            'ai.shippingCoordination': 'Shipping Coordination',
            'ai.productionPlanning': 'Production Planning',

            // Auth Page
            'auth.subtitle': 'Mining Value Chain Optimization Platform',
            'auth.login': 'Login',
            'auth.register': 'Register',
            'auth.email': 'Email',
            'auth.password': 'Password',
            'auth.fullName': 'Full Name',
            'auth.confirmPassword': 'Confirm Password',
            'auth.role': 'Role',
            'auth.selectRole': 'Select Role',
            'auth.miningPlanner': 'Mining Planner',
            'auth.shippingPlanner': 'Shipping Planner',
            'auth.forgotPassword': 'Forgot Password?',
            'auth.signIn': 'Sign In',
            'auth.createAccount': 'Create Account',
            'auth.resetPassword': 'Reset Password',
            'auth.resetDescription': "Enter your email address and we'll send you a link to reset your password.",
            'auth.sendResetLink': 'Send Reset Link',
            'auth.backToLogin': 'Back to Login',
            'auth.invalidEmail': 'Please enter a valid email address',
            'auth.passwordRequired': 'Password is required',
            'auth.nameRequired': 'Please enter your full name',
            'auth.passwordMinLength': 'Password must be at least 8 characters',
            'auth.passwordMismatch': 'Passwords do not match',
            'auth.roleRequired': 'Please select a role',
            'auth.loginSuccess': 'Login successful! Redirecting...',
            'auth.loginError': 'Invalid email or password',
            'auth.registerSuccess': 'Account created successfully! Please login.',
            'auth.registerError': 'Registration failed. Please try again.',
            'auth.resetEmailSent': 'Password reset link has been sent to your email.',
            'auth.resetError': 'Failed to send reset link. Please try again.',
            'auth.passwordRequirements': 'Password Requirements:',
            'auth.minLength': 'Minimum 8 characters',
            'auth.uppercase': 'Uppercase letter (A-Z)',
            'auth.number': 'Number (0-9)',

            // Profile Page
            'profile.title': 'Profile Settings',
            'profile.editProfile': 'Edit Profile',
            'profile.fullName': 'Full Name',
            'profile.jobTitle': 'Job Title',
            'profile.saveChanges': 'Save Changes',
            'profile.logout': 'Logout',
            'profile.preferences': 'Preferences',
            'profile.languagePreference': 'Language Preference',
            'profile.theme': 'Theme',
            'profile.notifications': 'Notifications',
            'profile.recentActivity': 'Recent Activity',
            'profile.noRecentActivity': 'No recent activity',
            'profile.profileSaved': 'Profile saved successfully!',
            'profile.avatarUpdated': 'Avatar updated!',
            'profile.languageChanged': 'Language changed',
            'profile.notificationsEnabled': 'Notifications enabled',
            'profile.notificationsDisabled': 'Notifications disabled',
            'profile.loggedOut': 'Logged out successfully',

            // AI Recommendations
            'profile.aiRecommendations': 'AI Recommendations',
            'profile.justification': 'Justification:',
            'profile.rec1Title': 'Optimize Fleet Route',
            'profile.rec1Desc': 'Reroute haulers via alternate path to avoid congestion at Pit 3.',
            'profile.rec1Just': 'Current route showing 23% delay increase due to road conditions.',
            'profile.rec2Title': 'Delay Vessel C Loading',
            'profile.rec2Desc': 'Postpone loading by 2 hours due to incoming weather system.',
            'profile.rec2Just': 'Wave height expected to exceed 2.5m threshold at 14:00.',
            'profile.rec3Title': 'Schedule Maintenance',
            'profile.rec3Desc': 'Excavator EX-07 approaching 500hr service interval.',
            'profile.rec3Just': 'Preventive maintenance will avoid 15% productivity loss.',

            // Dashboard Page
            'dashboard.title': 'Operations Dashboard',
            'dashboard.subtitle': 'Real-time monitoring and analytics',
            'dashboard.production': 'Production',
            'dashboard.distribution': 'Distribution',
            'dashboard.efficiency': 'Efficiency',
            'dashboard.activeAlerts': 'Active Alerts',
            'dashboard.chartTitle': 'Production & Distribution Overview',
            'dashboard.chartPlaceholder': 'Chart visualization will be displayed here',
            'dashboard.chartConnection': 'Connected to real-time data sources',
            'dashboard.liveStatus': 'Live Status',
            'dashboard.mineSiteA': 'Mine Site A',
            'dashboard.mineSiteB': 'Mine Site B',
            'dashboard.fleetStatus': 'Fleet Status',
            'dashboard.portStatus': 'Port Status',
            'dashboard.active': 'Active',
            'dashboard.weatherAlert': 'Weather Alert',
            'dashboard.shipsDocked': '2 Ships Docked',
            'dashboard.aiRecommendations': 'AI Recommendations',
            'dashboard.justification': 'Justification:',
            'dashboard.rec1Title': 'Optimize Fleet Route',
            'dashboard.rec1Desc': 'Reroute 5 trucks via Road B to avoid congestion',
            'dashboard.rec1Just': ' Weather data indicates Road A flooding risk. Route B is 15% longer but ensures delivery continuity.',
            'dashboard.rec2Title': 'Delay Vessel C Loading',
            'dashboard.rec2Desc': 'Postpone loading by 2 hours due to wave conditions',
            'dashboard.rec2Just': ' Wave height forecast shows calmer conditions at 16:00. Safety protocols recommend waiting.',
            'dashboard.rec3Title': 'Schedule Maintenance',
            'dashboard.rec3Desc': 'Excavator EX-007 shows wear indicators',
            'dashboard.rec3Just': ' Predictive analysis indicates optimal maintenance window tomorrow during low-activity period.',
        },
        id: {
            // Navigation
            'nav.home': 'Beranda',
            'nav.planning': 'Perencanaan',
            'nav.aiTools': 'Alat AI',
            'nav.dashboard': 'Dasbor',
            'nav.login': 'Masuk',

            // Home Page
            'home.welcome': 'Selamat Datang di',
            'home.subtitle': 'Platform Optimisasi Rantai Nilai Pertambangan Berbasis AI',
            'home.activeSites': 'Situs Aktif',
            'home.fleetUnits': 'Unit Armada',
            'home.efficiency': 'Efisiensi',
            'home.quickAccess': 'Akses Cepat',
            'home.scenarioSimulator': 'Simulator Skenario AI',
            'home.scenarioDesc': 'Optimalkan perencanaan dengan analisis cuaca dan armada',
            'home.chatbot': 'Chatbot Asisten AI',
            'home.chatbotDesc': 'Dapatkan rekomendasi operasional berbasis AI',
            'home.operationsDashboard': 'Dasbor Operasi',
            'home.operationsDesc': 'Pemantauan dan analitik real-time',
            'home.capabilities': 'Kemampuan Kami',

            // Planning Page
            'planning.title': 'Simulator Skenario AI',
            'planning.subtitle': 'Konfigurasi parameter untuk menghasilkan rencana produksi optimal',
            'planning.weatherConditions': 'Kondisi Cuaca',
            'planning.rainfallIntensity': 'Intensitas Curah Hujan (mm/jam)',
            'planning.waveHeight': 'Tinggi Gelombang (meter)',
            'planning.fleetStatus': 'Status Armada',
            'planning.availableHaulers': 'Hauler Tersedia',
            'planning.activeExcavators': 'Excavator Aktif',
            'planning.shipSchedule': 'Jadwal Kapal',
            'planning.generatePlan': 'Hasilkan Rencana Optimal',
            'planning.generating': 'Memproses...',
            'planning.systemStatus': 'Status Sistem',
            'planning.aiEngine': 'Mesin AI',
            'planning.online': 'Online',
            'planning.dataSync': 'Sinkronisasi Data',
            'planning.ready': 'Siap',
            'planning.activeAlerts': 'Peringatan Aktif',

            // AI Tools Page
            'aiTools.title': 'Asisten AI',
            'aiTools.subtitle': 'Ajukan pertanyaan tentang kondisi lapangan dan dapatkan rekomendasi AI',
            'aiTools.placeholder': 'Tanyakan tentang dampak cuaca, optimasi armada, atau perencanaan produksi...',
            'aiTools.aiOnline': 'AI Online',
            'aiTools.responseTime': 'Waktu respon: <2 detik',
            'aiTools.suggestedPrompts': 'Saran Pertanyaan',
            'aiTools.prompt1': 'Apa dampak curah hujan saat ini terhadap operasi pertambangan?',
            'aiTools.prompt2': 'Rekomendasikan alokasi armada optimal untuk hari ini',
            'aiTools.prompt3': 'Analisis keterlambatan pengiriman akibat gelombang tinggi',
            'aiTools.integration': 'Integrasi',
            'aiTools.integrationDesc': 'Siap untuk integrasi workflow n8n dan koneksi Lovable AI',
            'aiTools.welcomeMessage': 'Halo! Saya Asisten AI Operasi Pertambangan Anda. Bagaimana saya bisa membantu mengoptimalkan operasi Anda hari ini?',

            // AI Responses
            'ai.weatherAnalysis': 'Analisis Dampak Cuaca',
            'ai.fleetOptimization': 'Optimasi Armada',
            'ai.shippingCoordination': 'Koordinasi Pengiriman',
            'ai.productionPlanning': 'Perencanaan Produksi',

            // Auth Page
            'auth.subtitle': 'Platform Optimisasi Rantai Nilai Pertambangan',
            'auth.login': 'Masuk',
            'auth.register': 'Daftar',
            'auth.email': 'Email',
            'auth.password': 'Kata Sandi',
            'auth.fullName': 'Nama Lengkap',
            'auth.confirmPassword': 'Konfirmasi Kata Sandi',
            'auth.role': 'Peran',
            'auth.selectRole': 'Pilih Peran',
            'auth.miningPlanner': 'Perencana Tambang',
            'auth.shippingPlanner': 'Perencana Pengiriman',
            'auth.forgotPassword': 'Lupa Kata Sandi?',
            'auth.signIn': 'Masuk',
            'auth.createAccount': 'Buat Akun',
            'auth.resetPassword': 'Atur Ulang Kata Sandi',
            'auth.resetDescription': 'Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.',
            'auth.sendResetLink': 'Kirim Tautan Reset',
            'auth.backToLogin': 'Kembali ke Login',
            'auth.invalidEmail': 'Silakan masukkan alamat email yang valid',
            'auth.passwordRequired': 'Kata sandi diperlukan',
            'auth.nameRequired': 'Silakan masukkan nama lengkap Anda',
            'auth.passwordMinLength': 'Kata sandi minimal 8 karakter',
            'auth.passwordMismatch': 'Kata sandi tidak cocok',
            'auth.roleRequired': 'Silakan pilih peran',
            'auth.loginSuccess': 'Login berhasil! Mengalihkan...',
            'auth.loginError': 'Email atau kata sandi salah',
            'auth.registerSuccess': 'Akun berhasil dibuat! Silakan login.',
            'auth.registerError': 'Pendaftaran gagal. Silakan coba lagi.',
            'auth.resetEmailSent': 'Tautan reset kata sandi telah dikirim ke email Anda.',
            'auth.resetError': 'Gagal mengirim tautan reset. Silakan coba lagi.',
            'auth.passwordRequirements': 'Persyaratan Password:',
            'auth.minLength': 'Minimal 8 karakter',
            'auth.uppercase': 'Huruf kapital (A-Z)',
            'auth.number': 'Angka (0-9)',

            'profile.title': 'Pengaturan Profil',
            'profile.editProfile': 'Edit Profil',
            'profile.fullName': 'Nama Lengkap',
            'profile.jobTitle': 'Jabatan',
            'profile.saveChanges': 'Simpan Perubahan',
            'profile.logout': 'Keluar',
            'profile.preferences': 'Preferensi',
            'profile.languagePreference': 'Preferensi Bahasa',
            'profile.theme': 'Tema',
            'profile.notifications': 'Notifikasi',
            'profile.recentActivity': 'Aktivitas Terbaru',
            'profile.noRecentActivity': 'Tidak ada aktivitas terbaru',
            'profile.profileSaved': 'Profil berhasil disimpan!',
            'profile.avatarUpdated': 'Avatar diperbarui!',
            'profile.languageChanged': 'Bahasa diubah',
            'profile.notificationsEnabled': 'Notifikasi diaktifkan',
            'profile.notificationsDisabled': 'Notifikasi dinonaktifkan',
            'profile.loggedOut': 'Berhasil keluar',

            // AI Recommendations
            'profile.aiRecommendations': 'Rekomendasi AI',
            'profile.justification': 'Justifikasi:',
            'profile.rec1Title': 'Optimalkan Rute Armada',
            'profile.rec1Desc': 'Arahkan hauler melalui jalur alternatif untuk menghindari kemacetan di Pit 3.',
            'profile.rec1Just': 'Rute saat ini menunjukkan peningkatan keterlambatan 23% karena kondisi jalan.',
            'profile.rec2Title': 'Tunda Pemuatan Kapal C',
            'profile.rec2Desc': 'Tunda pemuatan 2 jam karena sistem cuaca yang akan datang.',
            'profile.rec2Just': 'Tinggi gelombang diperkirakan melebihi ambang 2.5m pada pukul 14:00.',
            'profile.rec3Title': 'Jadwalkan Pemeliharaan',
            'profile.rec3Desc': 'Excavator EX-07 mendekati interval servis 500 jam.',
            'profile.rec3Just': 'Pemeliharaan preventif akan menghindari kehilangan produktivitas 15%.',

            // Dashboard Page
            'dashboard.title': 'Dasbor Operasi',
            'dashboard.subtitle': 'Pemantauan dan analitik real-time',
            'dashboard.production': 'Produksi',
            'dashboard.distribution': 'Distribusi',
            'dashboard.efficiency': 'Efisiensi',
            'dashboard.activeAlerts': 'Peringatan Aktif',
            'dashboard.chartTitle': 'Gambaran Produksi & Distribusi',
            'dashboard.chartPlaceholder': 'Visualisasi grafik akan ditampilkan di sini',
            'dashboard.chartConnection': 'Terhubung ke sumber data real-time',
            'dashboard.liveStatus': 'Status Langsung',
            'dashboard.mineSiteA': 'Situs Tambang A',
            'dashboard.mineSiteB': 'Situs Tambang B',
            'dashboard.fleetStatus': 'Status Armada',
            'dashboard.portStatus': 'Status Pelabuhan',
            'dashboard.active': 'Aktif',
            'dashboard.weatherAlert': 'Peringatan Cuaca',
            'dashboard.shipsDocked': '2 Kapal Berlabuh',
            'dashboard.aiRecommendations': 'Rekomendasi AI',
            'dashboard.justification': 'Justifikasi:',
            'dashboard.rec1Title': 'Optimalkan Rute Armada',
            'dashboard.rec1Desc': 'Arahkan 5 truk melalui Jalan B untuk menghindari kemacetan',
            'dashboard.rec1Just': ' Data cuaca menunjukkan risiko banjir Jalan A. Rute B 15% lebih panjang tetapi menjamin kontinuitas pengiriman.',
            'dashboard.rec2Title': 'Tunda Pemuatan Kapal C',
            'dashboard.rec2Desc': 'Tunda pemuatan 2 jam karena kondisi gelombang',
            'dashboard.rec2Just': ' Prakiraan tinggi gelombang menunjukkan kondisi lebih tenang pada 16:00. Protokol keselamatan merekomendasikan menunggu.',
            'dashboard.rec3Title': 'Jadwalkan Pemeliharaan',
            'dashboard.rec3Desc': 'Excavator EX-007 menunjukkan indikator keausan',
            'dashboard.rec3Just': ' Analisis prediktif menunjukkan jendela pemeliharaan optimal besok selama periode aktivitas rendah.',
        }
    },

    init() {
        // Get saved language or default to 'en'
        this.currentLang = localStorage.getItem(this.STORAGE_KEY) || 'en';
        this.setupDropdown();
        this.setupMobileLanguage();
        // Apply translations on init
        this.applyTranslations();
    },

    setupDropdown() {
        const langToggle = document.getElementById('lang-toggle');
        const langDropdown = document.getElementById('lang-dropdown');

        if (!langToggle || !langDropdown) return;

        // Toggle dropdown
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.add('hidden');
            }
        });

        // Language options
        const langOptions = langDropdown.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.setLanguage(lang);
                langDropdown.classList.add('hidden');
            });
        });
    },

    setupMobileLanguage() {
        const mobileOptions = document.querySelectorAll('.lang-option-mobile');
        mobileOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.setLanguage(lang);

                // Update active state
                mobileOptions.forEach(opt => opt.classList.remove('bg-primary/10', 'text-primary'));
                option.classList.add('bg-primary/10', 'text-primary');
            });
        });
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem(this.STORAGE_KEY, lang);

        // Apply translations
        this.applyTranslations();

        // Dispatch event for translation updates
        window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: lang }
        }));

        console.log(`Language changed to: ${lang}`);
    },

    getLanguage() {
        return this.currentLang;
    },

    // Get translation by key
    t(key) {
        const translations = this.translations[this.currentLang] || this.translations['en'];
        return translations[key] || key;
    },

    // Apply translations to all elements with data-translate attribute
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.t(key);
            el.textContent = translation;
        });

        // Also update placeholders with data-translate-placeholder
        const placeholders = document.querySelectorAll('[data-translate-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            el.placeholder = this.t(key);
        });
    }
}

// ========================================
// Mobile Navigation
// ========================================
const MobileNav = {
    isOpen: false,

    init() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', () => {
            this.isOpen = !this.isOpen;

            if (this.isOpen) {
                mobileMenu.classList.remove('hidden');
                menuIcon?.classList.add('hidden');
                closeIcon?.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon?.classList.remove('hidden');
                closeIcon?.classList.add('hidden');
            }

            menuBtn.setAttribute('aria-expanded', this.isOpen);
        });

        // Close menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close menu when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                this.close();
            }
        });
    },

    close() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        this.isOpen = false;
        mobileMenu?.classList.add('hidden');
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
        menuBtn?.setAttribute('aria-expanded', 'false');
    }
};

// ========================================
// Navigation Active State
// ========================================
const Navigation = {
    init() {
        this.setActiveLink();
    },

    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');

            // Check if current path matches link href
            if (href === '/' && (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/optimine-ui/') || currentPath.endsWith('/optimine-ui/index.html'))) {
                link.classList.add('active');
            } else if (href !== '/' && currentPath.includes(href.replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    }
};

// ========================================
// Scroll Effects
// ========================================
const ScrollEffects = {
    init() {
        this.setupHeaderScroll();
        this.setupScrollAnimations();
        this.setupSmoothScroll();
    },

    setupHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;

            // Add/remove shadow based on scroll position
            if (currentScrollY > 10) {
                header.classList.add('shadow-lg');
            } else {
                header.classList.remove('shadow-lg');
            }

            // Hide/show header based on scroll direction (optional)
            // Uncomment below for hide-on-scroll behavior
            /*
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            */

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    },

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate;
                    entry.target.classList.add(`animate-${animation}`);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    },

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ========================================
// Utility Functions
// ========================================
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format number with thousands separator
    formatNumber(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    },

    // Format currency
    formatCurrency(num, currency = 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency
        }).format(num);
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }
};

// ========================================
// Toast Notifications
// ========================================
const Toast = {
    container: null,

    init() {
        // Create toast container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `
            glass border border-border rounded-lg px-4 py-3 shadow-lg
            transform translate-x-full opacity-0 transition-all duration-300
            flex items-center gap-3 max-w-sm
        `;

        // Icon based on type
        const icons = {
            success: '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
            error: '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
            warning: '<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
            info: '<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        };

        toast.innerHTML = `
            ${icons[type] || icons.info}
            <span class="text-sm">${message}</span>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// ========================================
// Form Validation Helpers
// ========================================
const FormValidation = {
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    },

    validate(value, type) {
        if (!this.patterns[type]) return true;
        return this.patterns[type].test(value);
    },

    validateEmail(email) {
        return this.patterns.email.test(email);
    },

    validatePhone(phone) {
        return this.patterns.phone.test(phone);
    },

    validatePassword(password) {
        return this.patterns.password.test(password);
    },

    getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const levels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        return {
            score: strength,
            label: levels[strength - 1] || levels[0]
        };
    }
};

// ========================================
// API Client (placeholder)
// ========================================
const API = {
    baseURL: '/api',

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if exists
        const token = localStorage.getItem('optimine-token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// ========================================
// App Initialization
// ========================================
const App = {
    init() {
        // Initialize all modules
        ThemeManager.init();
        LanguageManager.init();
        MobileNav.init();
        Navigation.init();
        ScrollEffects.init();

        // Log initialization
        console.log('%c OptiMine ', 'background: #0891b2; color: white; font-size: 16px; padding: 4px 8px; border-radius: 4px;');
        console.log('Mining Value Chain Optimization Platform');

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('optimine:ready'));
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for module usage (if needed)
window.OptiMine = {
    ThemeManager,
    LanguageManager,
    MobileNav,
    Navigation,
    ScrollEffects,
    Utils,
    Toast,
    FormValidation,
    API
};
