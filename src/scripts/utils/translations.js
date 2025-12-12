/**
 * OptiMine SPA - Translations / i18n
 * Dual Language Support: English (en) & Indonesian (id)
 */

export const translations = {
    en: {
        // Navbar
        nav: {
            home: 'Home',
            planning: 'Planning',
            aiTools: 'AI Tools',
            dashboard: 'Dashboard',
            login: 'Login',
            profile: 'Profile',
            logout: 'Sign Out'
        },
        
        // Home Page
        home: {
            welcomeBack: 'Welcome Back',
            subtitle: 'Mining Value Chain Optimization',
            activeSites: 'Active Sites',
            fleetUnits: 'Fleet Units',
            efficiency: 'Efficiency',
            quickAccess: 'QUICK ACCESS',
            aiScenario: 'AI Scenario Simulator',
            aiScenarioDesc: 'Simulate various operational scenarios and generate optimized production & distribution recommendations based on real-time field conditions.',
            aiChatbot: 'AI Assistant Chatbot',
            aiChatbotDesc: 'Interactive Q&A chatbot for field conditions, operational queries, and AI-powered recommendations with contextual responses.',
            opsDashboard: 'Operations Dashboard',
            opsDashboardDesc: 'Comprehensive data visualization with real-time monitoring, analytics, and justification for every AI recommendation.',
            accessDashboard: 'Access Dashboard',
            aiPoweredAnalysis: 'AI-Powered Analysis',
            realtimeMonitoring: 'Real-time Monitoring',
            riskMitigation: 'Risk Mitigation',
            costOptimization: 'Cost Optimization'
        },
        
        // Planning Page
        planning: {
            title: 'Production Planning',
            subtitle: 'Input operational conditions to generate optimized plans',
            weatherConditions: 'Weather Conditions',
            rainfallLevel: 'Rainfall Level',
            low: 'Low',
            high: 'High',
            waveHeight: 'Wave Height',
            calm: 'Calm',
            rough: 'Rough',
            fleetStatus: 'Fleet Status',
            activeVehicles: 'Active Vehicles',
            maintenanceStatus: 'Maintenance Status',
            fleetAvailability: 'Fleet Availability',
            truckCount: 'Truck Count',
            excavatorCount: 'Excavator Count',
            shipSchedule: 'Ship Schedule',
            vesselName: 'Vessel Name',
            estimatedArrival: 'Estimated Arrival',
            cargoCapacity: 'Cargo Capacity (tons)',
            addVessel: 'Add Vessel',
            generatePlan: 'Generate Optimization Plan',
            systemStatus: 'System Status',
            aiSystemOnline: 'AI System Online',
            n8nReady: 'n8n Integration Ready',
            activeAlerts: 'Active Alerts',
            alertRainfall: 'High rainfall expected at Mine Site B',
            alertMaintenance: '2 vehicles scheduled for maintenance',
            weatherData: 'Weather Data',
            connected: 'Connected',
            fleetTracking: 'Fleet Tracking',
            online: 'Online',
            aiEngine: 'AI Engine',
            ready: 'Ready',
            lastUpdate: 'Last Updated',
            justNow: 'Just now',
            active: 'Active'
        },
        
        // AI Tools Page
        aiTools: {
            title: 'AI Assistant',
            subtitle: 'Ask questions about field conditions and get AI recommendations',
            aiOnline: 'AI Online',
            responseTime: 'Response time',
            suggestedPrompts: 'Suggested Prompts',
            prompt1: 'What is the impact of current rainfall on mining operations?',
            prompt2: 'Recommend optimal fleet allocation for today',
            prompt3: 'Analyze shipping delays due to high waves',
            integration: 'Integration',
            integrationDesc: 'Ready for n8n workflow integration and Lovable AI connection',
            connectedSystems: 'Connected Systems',
            weather: 'Weather',
            fleet: 'Fleet',
            shipping: 'Shipping',
            placeholder: 'Ask about weather impact, fleet optimization, or production planning...',
            greeting: "Hello! I'm your AI Mining Operations Assistant. How can I help you optimize your operations today?"
        },
        
        // Dashboard Page
        dashboard: {
            title: 'Operations Dashboard',
            subtitle: 'Real-time monitoring and analytics',
            totalProduction: 'Total Production',
            fromLastMonth: 'from last month',
            activeEquipment: 'Active Equipment',
            outOfTotal: 'out of 48 total units',
            efficiencyRate: 'Efficiency Rate',
            target: 'Target',
            costSavings: 'Cost Savings',
            thisQuarter: 'This quarter',
            productionTrends: 'Production Trends',
            equipmentStatus: 'Equipment Status',
            chartPlaceholder: 'Chart visualization here',
            statusPlaceholder: 'Status overview here'
        },
        
        // Auth Page
        auth: {
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            fullName: 'Full Name',
            role: 'Role',
            forgotPassword: 'Forgot Password?',
            signIn: 'Sign In',
            createAccount: 'Create Account',
            resetPassword: 'Reset Password',
            resetDesc: "Enter your email address and we'll send you a link to reset your password.",
            sendResetLink: 'Send Reset Link',
            backToLogin: 'Back to Login',
            miningPlanner: 'Mining Planner',
            shippingPlanner: 'Shipping Planner',
            // Password strength
            passwordRequirements: 'Password Requirements:',
            minLength: 'Minimum 6 characters',
            uppercase: 'Uppercase letter (A-Z)',
            number: 'Number (0-9)',
            weak: 'Weak',
            medium: 'Medium',
            fair: 'Fair',
            strong: 'Strong',
            passwordError: 'Password must be at least 6 characters, contain uppercase letter and number!',
            passwordMismatch: 'Passwords do not match!'
        },
        
        // Profile Page
        profile: {
            title: 'Profile Settings',
            subtitle: 'Manage your account preferences',
            accountInfo: 'Account Information',
            displayName: 'Display Name',
            email: 'Email',
            preferences: 'Preferences',
            darkMode: 'Dark Mode',
            useDarkTheme: 'Use dark theme',
            language: 'Language',
            selectLanguage: 'Select your language',
            signOut: 'Sign Out',
            theme: 'Theme',
            dark: 'Dark',
            light: 'Light'
        },
        
        // Common
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            search: 'Search',
            noData: 'No data available',
            languageChanged: 'Language changed to English',
            copyright: '© 2025 OptiMine. All rights reserved.',
            privacy: 'Privacy',
            terms: 'Terms',
            contact: 'Contact'
        }
    },
    
    id: {
        // Navbar
        nav: {
            home: 'Beranda',
            planning: 'Perencanaan',
            aiTools: 'AI Tools',
            dashboard: 'Dashboard',
            login: 'Masuk',
            profile: 'Profil',
            logout: 'Keluar'
        },
        
        // Home Page
        home: {
            welcomeBack: 'Selamat Datang',
            subtitle: 'Optimasi Rantai Nilai Pertambangan',
            activeSites: 'Lokasi Aktif',
            fleetUnits: 'Unit Armada',
            efficiency: 'Efisiensi',
            quickAccess: 'AKSES CEPAT',
            aiScenario: 'Simulator Skenario AI',
            aiScenarioDesc: 'Simulasikan berbagai skenario operasional dan hasilkan rekomendasi produksi & distribusi yang dioptimalkan berdasarkan kondisi lapangan real-time.',
            aiChatbot: 'Chatbot Asisten AI',
            aiChatbotDesc: 'Chatbot Q&A interaktif untuk kondisi lapangan, pertanyaan operasional, dan rekomendasi bertenaga AI dengan respons kontekstual.',
            opsDashboard: 'Dashboard Operasi',
            opsDashboardDesc: 'Visualisasi data komprehensif dengan pemantauan real-time, analitik, dan justifikasi untuk setiap rekomendasi AI.',
            accessDashboard: 'Akses Dashboard',
            aiPoweredAnalysis: 'Analisis Bertenaga AI',
            realtimeMonitoring: 'Pemantauan Real-time',
            riskMitigation: 'Mitigasi Risiko',
            costOptimization: 'Optimasi Biaya'
        },
        
        // Planning Page
        planning: {
            title: 'Perencanaan Produksi',
            subtitle: 'Masukkan kondisi operasional untuk menghasilkan rencana yang dioptimalkan',
            weatherConditions: 'Kondisi Cuaca',
            rainfallLevel: 'Tingkat Curah Hujan',
            low: 'Rendah',
            high: 'Tinggi',
            waveHeight: 'Tinggi Gelombang',
            calm: 'Tenang',
            rough: 'Bergelombang',
            fleetStatus: 'Status Armada',
            activeVehicles: 'Kendaraan Aktif',
            maintenanceStatus: 'Status Perawatan',
            fleetAvailability: 'Ketersediaan Armada',
            truckCount: 'Jumlah Truk',
            excavatorCount: 'Jumlah Excavator',
            shipSchedule: 'Jadwal Kapal',
            vesselName: 'Nama Kapal',
            estimatedArrival: 'Perkiraan Kedatangan',
            cargoCapacity: 'Kapasitas Kargo (ton)',
            addVessel: 'Tambah Kapal',
            generatePlan: 'Hasilkan Rencana Optimal',
            systemStatus: 'Status Sistem',
            aiSystemOnline: 'Sistem AI Online',
            n8nReady: 'Integrasi n8n Siap',
            activeAlerts: 'Peringatan Aktif',
            alertRainfall: 'Curah hujan tinggi diperkirakan di Lokasi Tambang B',
            alertMaintenance: '2 kendaraan dijadwalkan untuk perawatan',
            weatherData: 'Data Cuaca',
            connected: 'Terhubung',
            fleetTracking: 'Pelacakan Armada',
            online: 'Online',
            aiEngine: 'Mesin AI',
            ready: 'Siap',
            lastUpdate: 'Terakhir Diperbarui',
            justNow: 'Baru saja',
            active: 'Aktif'
        },
        
        // AI Tools Page
        aiTools: {
            title: 'Asisten AI',
            subtitle: 'Ajukan pertanyaan tentang kondisi lapangan dan dapatkan rekomendasi AI',
            aiOnline: 'AI Online',
            responseTime: 'Waktu respons',
            suggestedPrompts: 'Prompt Disarankan',
            prompt1: 'Apa dampak curah hujan saat ini terhadap operasi tambang?',
            prompt2: 'Rekomendasikan alokasi armada optimal untuk hari ini',
            prompt3: 'Analisis keterlambatan pengiriman akibat gelombang tinggi',
            integration: 'Integrasi',
            integrationDesc: 'Siap untuk integrasi alur kerja n8n dan koneksi Lovable AI',
            connectedSystems: 'Sistem Terhubung',
            weather: 'Cuaca',
            fleet: 'Armada',
            shipping: 'Pengiriman',
            placeholder: 'Tanyakan tentang dampak cuaca, optimasi armada, atau perencanaan produksi...',
            greeting: 'Halo! Saya Asisten AI Operasi Tambang Anda. Bagaimana saya bisa membantu mengoptimalkan operasi Anda hari ini?'
        },
        
        // Dashboard Page
        dashboard: {
            title: 'Dashboard Operasi',
            subtitle: 'Pemantauan dan analitik real-time',
            totalProduction: 'Total Produksi',
            fromLastMonth: 'dari bulan lalu',
            activeEquipment: 'Peralatan Aktif',
            outOfTotal: 'dari 48 unit total',
            efficiencyRate: 'Tingkat Efisiensi',
            target: 'Target',
            costSavings: 'Penghematan Biaya',
            thisQuarter: 'Kuartal ini',
            productionTrends: 'Tren Produksi',
            equipmentStatus: 'Status Peralatan',
            chartPlaceholder: 'Visualisasi grafik di sini',
            statusPlaceholder: 'Ringkasan status di sini'
        },
        
        // Auth Page
        auth: {
            login: 'Masuk',
            register: 'Daftar',
            email: 'Email',
            password: 'Kata Sandi',
            confirmPassword: 'Konfirmasi Kata Sandi',
            fullName: 'Nama Lengkap',
            role: 'Peran',
            forgotPassword: 'Lupa Kata Sandi?',
            signIn: 'Masuk',
            createAccount: 'Buat Akun',
            resetPassword: 'Reset Kata Sandi',
            resetDesc: 'Masukkan alamat email Anda dan kami akan mengirimkan link untuk mereset kata sandi.',
            sendResetLink: 'Kirim Link Reset',
            backToLogin: 'Kembali ke Login',
            miningPlanner: 'Perencana Tambang',
            shippingPlanner: 'Perencana Pengiriman',
            // Password strength
            passwordRequirements: 'Persyaratan Password:',
            minLength: 'Minimal 6 karakter',
            uppercase: 'Huruf kapital (A-Z)',
            number: 'Angka (0-9)',
            weak: 'Lemah',
            medium: 'Sedang',
            fair: 'Cukup Kuat',
            strong: 'Kuat',
            passwordError: 'Password harus minimal 6 karakter, mengandung huruf kapital dan angka!',
            passwordMismatch: 'Password tidak cocok!'
        },
        
        // Profile Page
        profile: {
            title: 'Pengaturan Profil',
            subtitle: 'Kelola preferensi akun Anda',
            accountInfo: 'Informasi Akun',
            displayName: 'Nama Tampilan',
            email: 'Email',
            preferences: 'Preferensi',
            darkMode: 'Mode Gelap',
            useDarkTheme: 'Gunakan tema gelap',
            language: 'Bahasa',
            selectLanguage: 'Pilih bahasa Anda',
            signOut: 'Keluar',
            theme: 'Tema',
            dark: 'Gelap',
            light: 'Terang'
        },
        
        // Common
        common: {
            loading: 'Memuat...',
            error: 'Kesalahan',
            success: 'Berhasil',
            save: 'Simpan',
            cancel: 'Batal',
            confirm: 'Konfirmasi',
            delete: 'Hapus',
            edit: 'Edit',
            view: 'Lihat',
            search: 'Cari',
            noData: 'Tidak ada data',
            languageChanged: 'Bahasa diubah ke Indonesia',
            copyright: '© 2025 OptiMine. Hak cipta dilindungi.',
            privacy: 'Privasi',
            terms: 'Ketentuan',
            contact: 'Kontak'
        }
    }
};

/**
 * Get translation by key path
 * @param {string} lang - Language code ('en' or 'id')
 * @param {string} path - Dot notation path (e.g., 'nav.home', 'home.welcomeBack')
 * @returns {string} - Translated string or key if not found
 */
export const t = (lang, path) => {
    const keys = path.split('.');
    let result = translations[lang] || translations['en'];
    
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            console.warn(`Translation not found: ${path} for language: ${lang}`);
            return path; // Return the key if translation not found
        }
    }
    
    return result;
};

/**
 * Get all translations for a section
 * @param {string} lang - Language code
 * @param {string} section - Section name (e.g., 'nav', 'home')
 * @returns {object} - All translations for that section
 */
export const getSection = (lang, section) => {
    return translations[lang]?.[section] || translations['en']?.[section] || {};
};

export default translations;
