// Updated App Initialization - Add to app.js

// Enhanced initialization function
function initializeApp() {
    try {
        console.log('🐄 Dairy Farm Management System Starting...');
        
        // 1. Initialize data management
        console.log('📊 Loading data...');
        loadData();
        
        // 2. Initialize navigation system
        console.log('🧭 Setting up navigation...');
        initializeNavigation();
        
        // 3. Initialize enhanced form handlers
        console.log('📝 Setting up enhanced forms...');
        initializeForms();
        setupEnhancedCowForm();
        setupEnhancedCalfForm();
        
        // 4. Initialize validation and search
        console.log('🔍 Setting up validation and search...');
        setupNumberValidation();
        setupImagePreview();
        setupAdvancedSearch();
        
        // 5. Initialize cow status system
        console.log('📋 Setting up cow status tracking...');
        scheduleStatusUpdates();
        
        // 6. Initialize notifications
        console.log('🔔 Setting up notifications...');
        initializeNotifications();
        
        // 7. Load all data displays
        console.log('🔄 Updating displays...');
        updateAllDisplays();
        
        // 8. Add UI enhancements
        console.log('🎨 Setting up UI enhancements...');
        createFilterButtons();
        addNumberReferenceToForms();
        addNumberSuggestion();
        
        // 9. Set up periodic updates
        console.log('⏰ Setting up periodic updates...');
        setupPeriodicUpdates();
        
        console.log('✅ Dairy Farm Management System Ready!');
        
        // Show welcome message
        setTimeout(() => {
            showAlert('success', 'Welcome to Enhanced Dairy Farm Management System!');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showAlert('danger', 'Error starting application. Please refresh the page.');
    }
}

// Enhanced update function
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
    
    // Update number references
    setTimeout(() => {
        addNumberReferenceToForms();
    }, 500);
}

// Enhanced periodic updates
function setupPeriodicUpdates() {
    // Update dashboard every 5 minutes
    setInterval(() => {
        updateDashboard();
    }, 300000);
    
    // Check and update cow statuses every hour
    setInterval(() => {
        updateCowStatuses();
        updateCowList();
        checkAlerts();
        updateDashboardAlerts();
    }, 3600000);
    
    // Save data every 10 minutes (backup)
    setInterval(() => {
        saveData();
        console.log('📁 Auto-saved data');
    }, 600000);
    
    // Update number references when data changes
    setInterval(() => {
        addNumberReferenceToForms();
    }, 60000);
}

// Enhanced search criteria help
function showSearchHelp() {
    const helpContent = `
        <div class="search-help">
            <h4>🔍 Search Tips:</h4>
            <ul>
                <li><strong>Cow Number:</strong> Type "101" or "102"</li>
                <li><strong>Breed:</strong> Type "Holstein", "Jersey", etc.</li>
                <li><strong>Status:</strong> Type "Milking", "Dry", "Pregnant"</li>
                <li><strong>Age:</strong> Type "24 months" or just "24"</li>
                <li><strong>Weight:</strong> Type "550kg" or "550"</li>
            </ul>
            <div class="search-examples">
                <h5>Examples:</h5>
                <code>101</code> - Find cow #101<br>
                <code>Holstein</code> - All Holstein cows<br>
                <code>Milking</code> - All milking cows<br>
                <code>24</code> - Cows around 24 months old
            </div>
        </div>
    `;
    
    showModal('Search Help', helpContent);
}

// Add help button to search
function addSearchHelp() {
    const searchBox = document.getElementById('cowSearch');
    if (searchBox && !searchBox.parentNode.querySelector('.search-help-btn')) {
        const helpBtn = document.createElement('button');
        helpBtn.type = 'button';
        helpBtn.className = 'btn-small search-help-btn';
        helpBtn.innerHTML = '❓ Help';
        helpBtn.onclick = showSearchHelp;
        helpBtn.style.marginLeft = '10px';
        searchBox.parentNode.appendChild(helpBtn);
    }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Add search help after a delay
    setTimeout(() => {
        addSearchHelp();
    }, 2000);
});
