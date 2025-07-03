// js/app.js - Main Application

// Initialize the entire application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐄 Dairy Farm Management System Starting...');
    
    // Initialize core systems
    initializeApp();
});

function initializeApp() {
    try {
        // 1. Initialize data management
        console.log('📊 Loading data...');
        loadData();
        
        // 2. Initialize navigation system
        console.log('🧭 Setting up navigation...');
        initializeNavigation();
        
        // 3. Initialize form handlers
        console.log('📝 Setting up forms...');
        initializeForms();
        
        // 4. Initialize notifications
        console.log('🔔 Setting up notifications...');
        initializeNotifications();
        
        // 5. Load all data displays
        console.log('🔄 Updating displays...');
        updateAllDisplays();
        
        // 6. Set up periodic updates
        console.log('⏰ Setting up periodic updates...');
        setupPeriodicUpdates();
        
        console.log('✅ Dairy Farm Management System Ready!');
        
        // Show welcome message
        setTimeout(() => {
            showAlert('success', 'Welcome to Dairy Farm Management System!');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showAlert('danger', 'Error starting application. Please refresh the page.');
    }
}

function updateAllDisplays() {
    updateCowList();
    updateMilkRecords();
    updateBreedingRecords();
    updateVaccinationRecords();
    updateStockLevels();
    updateCalfRecords();
    updateSalesRecords();
    updateDashboard();
    updateDashboardAlerts();
}

function setupPeriodicUpdates() {
    // Update dashboard every 5 minutes
    setInterval(() => {
        updateDashboard();
    }, 300000);
    
    // Check alerts every hour
    setInterval(() => {
        checkAlerts();
        updateDashboardAlerts();
    }, 3600000);
    
    // Save data every 10 minutes (backup)
    setInterval(() => {
        saveData();
    }, 600000);
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registered successfully:', registration);
        })
        .catch(error => {
            console.log('SW registration failed:', error);
        });
}

// Handle offline/online status
window.addEventListener('online', function() {
    showAlert('success', 'Back online! Data will sync automatically.');
});

window.addEventListener('offline', function() {
    showAlert('warning', 'You are offline. Data will be saved locally.');
});

// Handle app installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    showInstallPrompt();
});

function showInstallPrompt() {
    const installAlert = document.createElement('div');
    installAlert.className = 'alert alert-info';
    installAlert.innerHTML = `
        <strong>📱 Install App:</strong> 
        Add this app to your home screen for better experience!
        <button onclick="installApp()" class="btn" style="margin-left: 10px;">Install</button>
        <button onclick="this.parentElement.remove()" class="btn" style="margin-left: 5px;">Later</button>
    `;
    
    document.body.appendChild(installAlert);
    
    setTimeout(() => {
        if (installAlert.parentElement) {
            installAlert.remove();
        }
    }, 10000);
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                showAlert('success', 'App installed successfully!');
            }
            deferredPrompt = null;
        });
    }
}

// Handle app updates
window.addEventListener('appinstalled', () => {
    showAlert('success', 'App installed! You can now access it from your home screen.');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showAlert('danger', 'An error occurred. Please refresh the page if problems persist.');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Handle app visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // App became visible - refresh data
        updateDashboard();
        checkAlerts();
    }
});

// Handle app focus
window.addEventListener('focus', function() {
    // App gained focus - refresh critical data
    updateDashboard();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.focus();
        }
    }
    
    // Ctrl/Cmd + D for dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        showPage('dashboard');
    }
    
    // Ctrl/Cmd + M for milk production
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        showPage('milk');
    }
});

// Touch/gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe right to open sidebar (mobile)
    if (deltaX > 50 && Math.abs(deltaY) < 50 && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('mobile-hidden')) {
            sidebar.classList.remove('mobile-hidden');
        }
    }
    
    // Swipe left to close sidebar (mobile)
    if (deltaX < -50 && Math.abs(deltaY) < 50 && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('mobile-hidden')) {
            sidebar.classList.add('mobile-hidden');
        }
    }
});

// Handle screen orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Recalculate layout after orientation change
        initializePageContent();
    }, 100);
});

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`App loaded in ${loadTime}ms`);
        
        // Track page navigation performance
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log(`Navigation timing: ${entry.duration}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
    }
}

// Initialize performance tracking
trackPerformance();

// Auto-save functionality
let autoSaveInterval;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        saveData();
        console.log('Auto-saved data');
    }, 300000); // Save every 5 minutes
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Start auto-save
startAutoSave();

// Handle page unload
window.addEventListener('beforeunload', function(e) {
    // Save data before page unload
    saveData();
    
    // Show warning if there are unsaved changes
    const hasUnsavedChanges = false; // You can implement logic to check for unsaved changes
    
    if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
    }
});

// Initialize app theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('dairyFarmTheme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        // Default to light theme
        document.body.classList.add('light-theme');
    }
}

// Theme toggle (if you want to add dark mode later)
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.classList.remove(`${currentTheme}-theme`);
    document.body.classList.add(`${newTheme}-theme`);
    
    localStorage.setItem('dairyFarmTheme', `${newTheme}-theme`);
}

// Initialize theme on load
initializeTheme();

// Add global utilities
window.DairyFarmApp = {
    version: '1.0.0',
    data: appData,
    saveData: saveData,
    loadData: loadData,
    exportData: exportData,
    importData: importData,
    showAlert: showAlert,
    showPage: showPage,
    updateDashboard: updateDashboard
};

// Console welcome message
console.log(`
🐄 Dairy Farm Management System v${window.DairyFarmApp.version}
📱 Ready for production use!
🔧 Debug mode: ${localStorage.getItem('debug') === 'true' ? 'ON' : 'OFF'}
`);

// Debug mode
if (localStorage.getItem('debug') === 'true') {
    console.log('🔍 Debug mode enabled');
    window.debugApp = {
        data: appData,
        notifications: notificationSystem,
        clearData: () => {
            localStorage.removeItem('dairyFarmData');
            location.reload();
        }
    };
}
