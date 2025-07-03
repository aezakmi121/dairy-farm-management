// js/navigation.js - Complete Navigation System with Page Isolation

// Enhanced showPage function with aggressive page isolation
function showPage(pageId) {
    console.log('🔄 Switching to page:', pageId);
    
    try {
        // Step 1: Aggressively hide ALL pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
            page.style.visibility = 'hidden';
            page.style.opacity = '0';
            page.style.position = 'absolute';
            page.style.left = '-9999px';
            page.style.zIndex = '-1';
            page.setAttribute('aria-hidden', 'true');
        });
        
        // Step 2: Remove active from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Step 3: Show ONLY the selected page
        const selectedPage = document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.add('active');
            selectedPage.style.display = 'block';
            selectedPage.style.visibility = 'visible';
            selectedPage.style.opacity = '1';
            selectedPage.style.position = 'relative';
            selectedPage.style.left = 'auto';
            selectedPage.style.zIndex = '1';
            selectedPage.setAttribute('aria-hidden', 'false');
            
            console.log('✅ Page activated successfully:', pageId);
        } else {
            console.error('❌ Page not found:', pageId);
            return;
        }
        
        // Step 4: Update navigation state
        updateNavigationState(pageId);
        
        // Step 5: Load page-specific data
        loadPageData(pageId);
        
        // Step 6: Hide mobile sidebar
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('mobile-hidden');
            }
        }
        
        // Step 7: Clear any form validation errors
        clearFormErrors();
        
        // Step 8: Reset forms in inactive pages
        resetAllForms();
        
    } catch (error) {
        console.error('❌ Error in showPage:', error);
    }
}

// Update navigation state
function updateNavigationState(pageId) {
    // Add active to correct nav item
    const navMapping = {
        'dashboard': 0,
        'cows': 1,
        'milk': 2,
        'breeding': 3,
        'health': 4,
        'feed': 5,
        'calves': 6,
        'sales': 7,
        'reports': 8,
        'alerts': 9
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const activeIndex = navMapping[pageId];
    
    if (activeIndex !== undefined && navItems[activeIndex]) {
        navItems[activeIndex].classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'cows': 'Cow Management',
        'milk': 'Milk Production',
        'breeding': 'AI & Breeding',
        'health': 'Health & Vaccination',
        'feed': 'Feed & Stock',
        'calves': 'Calf Management',
        'sales': 'Milk Sales',
        'reports': 'Reports & Analytics',
        'alerts': 'Alerts & Notifications'
    };
    
    const titleElement = document.getElementById('pageTitle');
    if (titleElement) {
        titleElement.textContent = titles[pageId] || 'Dashboard';
    }
}

// Aggressive page isolation enforcement
function enforcePageIsolation() {
    const activePage = document.querySelector('.page.active');
    
    if (!activePage) {
        console.warn('⚠️ No active page found, defaulting to dashboard');
        showPage('dashboard');
        return;
    }
    
    const activePageId = activePage.id;
    
    // Hide all non-active pages aggressively
    document.querySelectorAll('.page').forEach(page => {
        if (page.id !== activePageId) {
            page.classList.remove('active');
            page.style.display = 'none';
            page.style.visibility = 'hidden';
            page.style.opacity = '0';
            page.style.position = 'absolute';
            page.style.left = '-9999px';
            page.style.zIndex = '-1';
        }
    });
    
    // Ensure active page is fully visible
    activePage.style.display = 'block';
    activePage.style.visibility = 'visible';
    activePage.style.opacity = '1';
    activePage.style.position = 'relative';
    activePage.style.left = 'auto';
    activePage.style.zIndex = '1';
}

// Toggle mobile sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-hidden');
    }
}

// Initialize page content with proper isolation
function initializePageContent() {
    console.log('🚀 Initializing page content...');
    
    try {
        // Get all pages
        const pages = document.querySelectorAll('.page');
        
        if (pages.length === 0) {
            console.error('❌ No pages found!');
            return;
        }
        
        // Hide all pages initially
        pages.forEach((page, index) => {
            page.classList.remove('active');
            page.style.display = 'none';
            page.style.visibility = 'hidden';
            page.style.opacity = '0';
            page.style.position = 'absolute';
            page.style.left = '-9999px';
            page.style.zIndex = '-1';
            page.setAttribute('aria-hidden', 'true');
        });
        
        // Show dashboard by default
        const dashboardPage = document.getElementById('dashboard');
        if (dashboardPage) {
            dashboardPage.classList.add('active');
            dashboardPage.style.display = 'block';
            dashboardPage.style.visibility = 'visible';
            dashboardPage.style.opacity = '1';
            dashboardPage.style.position = 'relative';
            dashboardPage.style.left = 'auto';
            dashboardPage.style.zIndex = '1';
            dashboardPage.setAttribute('aria-hidden', 'false');
            
            console.log('✅ Dashboard page activated');
        }
        
        // Set up navigation states
        updateNavigationState('dashboard');
        
        console.log('✅ Page content initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing page content:', error);
    }
}

// Load page-specific data
function loadPageData(pageId) {
    try {
        switch(pageId) {
            case 'dashboard':
                if (typeof updateDashboard === 'function') updateDashboard();
                if (typeof updateDashboardAlerts === 'function') updateDashboardAlerts();
                break;
            case 'cows':
                if (typeof updateCowList === 'function') updateCowList();
                if (typeof createFilterButtons === 'function') createFilterButtons();
                break;
            case 'milk':
                if (typeof updateMilkRecords === 'function') updateMilkRecords();
                break;
            case 'breeding':
                if (typeof updateBreedingRecords === 'function') updateBreedingRecords();
                if (typeof populatePDDropdown === 'function') populatePDDropdown();
                break;
            case 'health':
                if (typeof updateVaccinationRecords === 'function') updateVaccinationRecords();
                break;
            case 'feed':
                if (typeof updateStockLevels === 'function') updateStockLevels();
                break;
            case 'calves':
                if (typeof updateCalfRecords === 'function') updateCalfRecords();
                break;
            case 'sales':
                if (typeof updateSalesRecords === 'function') updateSalesRecords();
                if (typeof updateSalesStats === 'function') updateSalesStats();
                break;
            case 'reports':
                if (typeof updateReportsData === 'function') updateReportsData();
                break;
            case 'alerts':
                if (typeof updateAlertsData === 'function') updateAlertsData();
                break;
        }
    } catch (error) {
        console.error('❌ Error loading page data:', error);
    }
}

// Clear form validation errors
function clearFormErrors() {
    // Remove any error styling from form inputs
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.classList.remove('error', 'invalid');
    });
    
    // Hide any error messages
    document.querySelectorAll('.error-message, .validation-message').forEach(msg => {
        if (msg.classList.contains('error')) {
            msg.style.display = 'none';
        }
    });
}

// Reset all forms when changing pages
function resetAllForms() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    
    // Only reset forms that are NOT in the active page
    document.querySelectorAll('.page:not(.active) form').forEach(form => {
        if (form.id !== 'searchForm') { // Don't reset search forms
            form.reset();
        }
    });
    
    // Clear image previews in inactive pages
    document.querySelectorAll('.page:not(.active) .image-preview').forEach(preview => {
        preview.innerHTML = '';
    });
}

// Set today's date as default for date inputs
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = ['milkDate', 'feedDate', 'saleDate', 'vaccineDate', 'aiDate', 'calfBirth', 'pdDate'];
    
    dateInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && !input.value) {
            input.value = today;
        }
    });
}

// Update current date in header
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-IN', options);
    }
}

// Search functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-box');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.data-table').querySelector('table tbody');
            const cardContainer = this.closest('.data-table').querySelector('#cowList');
            
            if (table) {
                // Search in table rows
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
            
            if (cardContainer) {
                // Search in cow cards
                if (typeof searchCows === 'function') {
                    searchCows(searchTerm);
                }
            }
        });
    });
}

// Modal functions
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Alert system with animations
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="close-btn" onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: inherit; font-size: 1.2em; cursor: pointer;">&times;</button>
    `;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.animation = 'slideInRight 0.3s ease';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }
    }, 5000);
}

// Auto-calculate milk sale rate based on fat and SNF
function setupSaleCalculation() {
    const fatInput = document.getElementById('saleFat');
    const snfInput = document.getElementById('saleSnf');
    const rateInput = document.getElementById('saleRate');
    const quantityInput = document.getElementById('saleQuantity');
    const amountInput = document.getElementById('saleAmount');
    
    function calculateRate() {
        const fat = parseFloat(fatInput?.value) || 3.5;
        const snf = parseFloat(snfInput?.value) || 8.5;
        const quantity = parseFloat(quantityInput?.value) || 0;
        
        // Simple rate calculation formula (can be customized)
        const baseRate = 25;
        const fatPremium = (fat - 3.5) * 2;
        const snfPremium = (snf - 8.5) * 1;
        const rate = baseRate + fatPremium + snfPremium;
        
        const finalRate = Math.max(rate, 15);
        const totalAmount = quantity * finalRate;
        
        if (rateInput) rateInput.value = finalRate.toFixed(2);
        if (amountInput) amountInput.value = totalAmount.toFixed(2);
    }
    
    if (fatInput && snfInput && rateInput) {
        fatInput.addEventListener('input', calculateRate);
        snfInput.addEventListener('input', calculateRate);
        if (quantityInput) quantityInput.addEventListener('input', calculateRate);
    }
}

// Enable/disable calf number field based on gender
function setupCalfGenderToggle() {
    const calfGenderSelect = document.getElementById('calfGender');
    const calfNumberInput = document.getElementById('calfNumber');
    
    if (calfGenderSelect && calfNumberInput) {
        calfGenderSelect.addEventListener('change', function() {
            if (this.value === 'Female') {
                calfNumberInput.disabled = false;
                calfNumberInput.required = true;
                calfNumberInput.placeholder = 'Enter calf number for female';
            } else {
                calfNumberInput.disabled = true;
                calfNumberInput.required = false;
                calfNumberInput.value = '';
                calfNumberInput.placeholder = 'Auto-generated for males';
            }
        });
    }
}

// Setup farmer rate type toggle
function setupFarmerRateToggle() {
    const rateTypeSelect = document.getElementById('farmerRateType');
    const customRateInput = document.getElementById('farmerCustomRate');
    
    if (rateTypeSelect && customRateInput) {
        rateTypeSelect.addEventListener('change', function() {
            if (this.value === 'Custom') {
                customRateInput.disabled = false;
                customRateInput.required = true;
            } else {
                customRateInput.disabled = true;
                customRateInput.required = false;
                customRateInput.value = '';
            }
        });
    }
}

// Add CSS animations for alerts
function addAlertAnimations() {
    if (!document.getElementById('alertAnimations')) {
        const style = document.createElement('style');
        style.id = 'alertAnimations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize navigation system
function initializeNavigation() {
    console.log('🧭 Initializing navigation system...');
    
    try {
        // Add alert animations
        addAlertAnimations();
        
        // Initialize page content first
        initializePageContent();
        
        // Set up event listeners
        setupSearch();
        setupSaleCalculation();
        setupCalfGenderToggle();
        setupFarmerRateToggle();
        
        // Set default dates
        setDefaultDates();
        
        // Update current date
        updateCurrentDate();
        
        // Set up date update interval
        setInterval(updateCurrentDate, 60000); // Update every minute
        
        // Set up periodic page isolation enforcement
        setInterval(enforcePageIsolation, 5000); // Check every 5 seconds
        
        // Show dashboard by default
        setTimeout(() => {
            showPage('dashboard');
        }, 100);
        
        console.log('✅ Navigation system initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-hidden');
        }
    }
});

// Close modal on outside click
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Close modal on escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Prevent forms from submitting when pressing enter in search boxes
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.classList.contains('search-box')) {
        event.preventDefault();
    }
});

// Export data function
function exportData() {
    if (typeof window.exportData === 'function') {
        window.exportData();
    } else {
        showAlert('info', 'Export functionality will be available after data loads.');
    }
}

// Show existing numbers function
function showExistingNumbers() {
    if (typeof window.showExistingNumbers === 'function') {
        window.showExistingNumbers();
    } else {
        showAlert('info', 'Number reference will be available after data loads.');
    }
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.showPage = showPage;
    window.toggleSidebar = toggleSidebar;
    window.showModal = showModal;
    window.closeModal = closeModal;
    window.showAlert = showAlert;
    window.initializeNavigation = initializeNavigation;
    window.exportData = exportData;
    window.showExistingNumbers = showExistingNumbers;
}

console.log('📄 Navigation.js loaded successfully');
