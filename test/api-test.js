/**
 * OptiMine API Endpoint Tester
 * Run this script to test all backend API endpoints
 * 
 * Usage: Open in browser console or run with Node.js (after adding node-fetch)
 */

const API_BASE = 'http://139.59.224.58:5000';

// Test results container
const results = {
    passed: [],
    failed: [],
    skipped: []
};

// ANSI colors for console (works in browser console)
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// ==========================================
// TEST HELPERS
// ==========================================

async function testEndpoint(name, method, endpoint, options = {}) {
    const { body, token, expectStatus = 200, skipAuth = false } = options;

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && !skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        console.log(`\n🔄 Testing: ${name}`);
        console.log(`   ${method} ${API_BASE}${endpoint}`);

        const startTime = Date.now();
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const duration = Date.now() - startTime;

        let data = null;
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : null;
        } catch (e) {
            data = { parseError: true };
        }

        const result = {
            name,
            endpoint: `${method} ${endpoint}`,
            status: response.status,
            duration: `${duration}ms`,
            data: data
        };

        if (response.status === expectStatus || (expectStatus === 'any' && response.status < 500)) {
            console.log(`   ✅ PASSED - Status: ${response.status} (${duration}ms)`);
            results.passed.push(result);
            return { success: true, data, status: response.status };
        } else {
            console.log(`   ❌ FAILED - Expected: ${expectStatus}, Got: ${response.status}`);
            results.failed.push(result);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.failed.push({
            name,
            endpoint: `${method} ${endpoint}`,
            error: error.message
        });
        return { success: false, error: error.message };
    }
}

function log(message, type = 'info') {
    const prefix = {
        info: '📋',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        section: '📦'
    };
    console.log(`${prefix[type] || ''} ${message}`);
}

// ==========================================
// TEST SUITES
// ==========================================

async function testPublicEndpoints() {
    log('='.repeat(50), 'section');
    log('PUBLIC ENDPOINTS (No Auth Required)', 'section');
    log('='.repeat(50), 'section');

    // AI Health
    await testEndpoint('AI Health Check', 'GET', '/ai/health', { skipAuth: true });

    // LLM Status
    await testEndpoint('LLM Status', 'GET', '/ai/llm/status', { skipAuth: true });

    // RAG Health
    await testEndpoint('RAG Health', 'GET', '/ai/rag/health', { skipAuth: true });

    // RAG Stats
    await testEndpoint('RAG Stats', 'GET', '/ai/rag/stats', { skipAuth: true });
}

async function testAuthEndpoints() {
    log('\n' + '='.repeat(50), 'section');
    log('AUTHENTICATION ENDPOINTS', 'section');
    log('='.repeat(50), 'section');

    // Register (might fail if user exists)
    const testUser = {
        nama: 'Test User API',
        email: `testapi_${Date.now()}@example.com`,
        password: 'TestPass123!',
        role: 'mining_planner'
    };

    const registerResult = await testEndpoint('Register User', 'POST', '/register', {
        body: testUser,
        expectStatus: 'any'
    });

    // Login
    const loginResult = await testEndpoint('Login', 'POST', '/login', {
        body: { email: testUser.email, password: testUser.password },
        expectStatus: 'any'
    });

    let token = null;
    if (loginResult.success && loginResult.data?.data?.token) {
        token = loginResult.data.data.token;
        log(`Token acquired: ${token.substring(0, 20)}...`, 'success');
    }

    // Password Reset Request (test with fake email - expected to fail or return error)
    await testEndpoint('Forgot Password', 'POST', '/forgot-password', {
        body: { email: 'test@example.com' },
        expectStatus: 'any'
    });

    return token;
}

async function testMineOperationsEndpoints(token) {
    log('\n' + '='.repeat(50), 'section');
    log('MINE OPERATIONS ENDPOINTS', 'section');
    log('='.repeat(50), 'section');

    if (!token) {
        log('Skipping - No auth token available', 'warning');
        return;
    }

    // Mines
    await testEndpoint('Get All Mines', 'GET', '/mines', { token, expectStatus: 'any' });
    await testEndpoint('Get Mine by ID', 'GET', '/mines/1', { token, expectStatus: 'any' });

    // Equipments
    await testEndpoint('Get All Equipments', 'GET', '/equipments', { token, expectStatus: 'any' });
    await testEndpoint('Get Equipment by ID', 'GET', '/equipments/1', { token, expectStatus: 'any' });

    // Effective Capacity
    await testEndpoint('Get Effective Capacity', 'GET', '/effective-capacity', { token, expectStatus: 'any' });

    // Production Constraints
    await testEndpoint('Get Production Constraints', 'GET', '/production-constraints', { token, expectStatus: 'any' });

    // Production Plans
    await testEndpoint('Get Production Plans', 'GET', '/production-plans', { token, expectStatus: 'any' });

    // Weather
    await testEndpoint('Get Weather Data', 'GET', '/weather', { token, expectStatus: 'any' });

    // Roads
    await testEndpoint('Get Road Conditions', 'GET', '/roads', { token, expectStatus: 'any' });

    // Shipping Schedules
    await testEndpoint('Get Shipping Schedules', 'GET', '/shipping-schedules', { token, expectStatus: 'any' });
}

async function testAIPredictionsEndpoints(token) {
    log('\n' + '='.repeat(50), 'section');
    log('AI PREDICTIONS ENDPOINTS', 'section');
    log('='.repeat(50), 'section');

    // AI Chat
    await testEndpoint('AI Chat', 'POST', '/ai/chat', {
        token,
        body: { chatInput: 'Hello, test message', message: 'Hello, test message' },
        expectStatus: 'any'
    });

    // AI Weather Forecast
    await testEndpoint('AI Weather Forecast', 'POST', '/ai/weather/forecast', {
        token,
        body: { location: 'Site A', date: new Date().toISOString() },
        expectStatus: 'any'
    });

    // AI Weather Classify
    await testEndpoint('AI Weather Classify', 'POST', '/ai/weather/classify', {
        token,
        body: { temperature: 25, humidity: 80, rainfall_mm: 5 },
        expectStatus: 'any'
    });

    // AI Capacity Predict
    await testEndpoint('AI Capacity Predict', 'POST', '/ai/capacity/predict', {
        token,
        body: { mine_id: 1 },
        expectStatus: 'any'
    });

    // AI Production Predict
    await testEndpoint('AI Production Predict', 'POST', '/ai/production/predict', {
        token,
        body: { mine_id: 1, date: new Date().toISOString() },
        expectStatus: 'any'
    });

    // AI Recommendations
    await testEndpoint('AI Recommendations', 'POST', '/ai/recommendations', {
        token,
        body: { context: 'production optimization' },
        expectStatus: 'any'
    });

    // LLM Recommend
    await testEndpoint('LLM Recommend', 'POST', '/ai/llm/recommend', {
        token,
        body: { prompt: 'Recommend production strategy' },
        expectStatus: 'any'
    });

    // LLM Chat
    await testEndpoint('LLM Chat', 'POST', '/ai/llm/chat', {
        token,
        body: { message: 'Test LLM chat message' },
        expectStatus: 'any'
    });

    // RAG Chat
    await testEndpoint('RAG Chat', 'POST', '/ai/rag/chat', {
        token,
        body: { query: 'What is the production status?' },
        expectStatus: 'any'
    });
}

async function testUserEndpoints(token, userId) {
    log('\n' + '='.repeat(50), 'section');
    log('USER MANAGEMENT ENDPOINTS', 'section');
    log('='.repeat(50), 'section');

    if (!token) {
        log('Skipping - No auth token available', 'warning');
        return;
    }

    // Get User Profile (use ID 1 as fallback)
    const id = userId || 1;
    await testEndpoint('Get User Profile', 'GET', `/users/${id}`, { token, expectStatus: 'any' });

    // Update User Profile
    await testEndpoint('Update User Profile', 'PUT', `/users/${id}`, {
        token,
        body: { nama: 'Updated Name' },
        expectStatus: 'any'
    });
}

// ==========================================
// MAIN TEST RUNNER
// ==========================================

async function runAllTests() {
    console.clear();
    log('🚀 OptiMine API Endpoint Tester', 'section');
    log(`API Base URL: ${API_BASE}`, 'info');
    log(`Started at: ${new Date().toLocaleString()}`, 'info');
    log('');

    const startTime = Date.now();

    // Run test suites
    await testPublicEndpoints();
    const token = await testAuthEndpoints();
    await testMineOperationsEndpoints(token);
    await testAIPredictionsEndpoints(token);
    await testUserEndpoints(token);

    const duration = Date.now() - startTime;

    // Print summary
    log('\n' + '='.repeat(50), 'section');
    log('TEST SUMMARY', 'section');
    log('='.repeat(50), 'section');

    const total = results.passed.length + results.failed.length;
    const passRate = total > 0 ? ((results.passed.length / total) * 100).toFixed(1) : 0;

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Passed: ${results.passed.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`   📈 Pass Rate: ${passRate}%`);
    console.log(`   ⏱️ Duration: ${(duration / 1000).toFixed(2)}s`);

    // List failed tests
    if (results.failed.length > 0) {
        console.log('\n❌ Failed Tests:');
        results.failed.forEach(test => {
            console.log(`   - ${test.name}: ${test.endpoint}`);
            if (test.error) console.log(`     Error: ${test.error}`);
            if (test.status) console.log(`     Status: ${test.status}`);
        });
    }

    // List passed tests
    if (results.passed.length > 0) {
        console.log('\n✅ Passed Tests:');
        results.passed.forEach(test => {
            console.log(`   - ${test.name}: ${test.status} (${test.duration})`);
        });
    }

    console.log('\n📋 Detailed results available in: window.apiTestResults');
    window.apiTestResults = results;

    return results;
}

// ==========================================
// QUICK TEST FUNCTIONS
// ==========================================

// Quick test for a single endpoint
async function quickTest(method, endpoint, body = null) {
    const token = localStorage.getItem('optimine-token');
    return await testEndpoint('Quick Test', method, endpoint, { body, token, expectStatus: 'any' });
}

// Export for console usage
window.OptiMineAPITest = {
    runAllTests,
    quickTest,
    testPublicEndpoints,
    testAuthEndpoints,
    results
};

// Instructions
console.log(`
╔════════════════════════════════════════════════════════════════╗
║           OptiMine API Endpoint Tester                         ║
╠════════════════════════════════════════════════════════════════╣
║ Usage:                                                         ║
║   1. Run all tests:    OptiMineAPITest.runAllTests()          ║
║   2. Quick test:       OptiMineAPITest.quickTest('GET', '/mines') ║
║   3. Public only:      OptiMineAPITest.testPublicEndpoints()  ║
║                                                                 ║
║ Results will be saved in: window.apiTestResults               ║
╚════════════════════════════════════════════════════════════════╝
`);
