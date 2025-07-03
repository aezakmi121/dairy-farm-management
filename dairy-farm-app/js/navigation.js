// js/navigation.js - Navigation System

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Remove active from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        selectedPage.style.display = 'block';
    }
    
    // Add active to clicked nav item
    if (event && event.target) {
        event.target.classList.add('active');
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
    
    document.getElementById('pageTitle').textContent = titles[pageId] || 'Dashboard';
    
    // Hide mobile sidebar after navigation
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('mobile-hidden');
    }
    
    // Clear any form validation errors
    clearFormErrors();
    
    // Reset forms in inactive pages
    resetAllForms();
    
    // Load page-specific data
    loadPageData(pageId);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-hidden');
}

function clearFormErrors() {
    // Remove any error styling from form inputs
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.classList.remove('error');
    });
    
    // Hide any error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
    });
}

// Fix for proper page isolation
function initializePageContent() {
    // Ensure all pages are properly hidden except active one
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (!page.classList.contains('active')) {
            page.style.display = 'none';
        }
    });
    
    // Show only the active page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        activePage.style.display = 'block';
    }
}

// Reset all forms when changing pages
function resetAllForms() {
    document.querySelectorAll('form').forEach(form => {
        if (form.id !== 'searchForm') { // Don't reset search forms
            form.reset();
        }
    });
}

// Load page-specific data
function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'cows':
            updateCowList();
            break;
        case 'milk':
            updateMilkRecords();
            break;
        case 'breeding':
            updateBreedingRecords();
            break;
        case 'health':
            updateVaccinationRecords();
            break;
        case 'feed':
            updateStockLevels();
            break;
        case 'calves':
            updateCalfRecords();
            break;
        case 'sales':
            updateSalesRecords();
            break;
        case 'reports':
            updateReportsData();
            break;
        case 'alerts':
            updateAlertsData();
            break;
    }
}

// Update current date in header
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-IN', options);
}

// Set today's date as default for date inputs
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = ['milkDate', 'feedDate', 'saleDate', 'vaccineDate', 'aiDate'];
    dateInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.value = today;
    });
}

// Search functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-box');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.data-table').querySelector('table tbody');
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
}

// Modal functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Alert system
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<strong>${message}</strong>`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Auto-calculate milk sale rate based on fat and SNF
function setupSaleCalculation() {
    const fatInput = document.getElementById('saleFat');
    const snfInput = document.getElementById('saleSnf');
    const rateInput = document.getElementById('saleRate');
    
    function calculateRate() {
        const fat = parseFloat(fatInput.value) || 0;
        const snf = parseFloat(snfInput.value) || 0;
        
        // Simple rate calculation formula (can be customized)
        const baseRate = 25;
        const fatPremium = (fat - 3.5) * 2;
        const snfPremium = (snf - 8.5) * 1;
        const rate = baseRate + fatPremium + snfPremium;
        
        rateInput.value = Math.max(rate, 15).toFixed(2);
    }
    
    if (fatInput && snfInput && rateInput) {
        fatInput.addEventListener('input', calculateRate);
        snfInput.addEventListener('input', calculateRate);
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
            } else {
                calfNumberInput.disabled = true;
                calfNumberInput.required = false;
                calfNumberInput.value = '';
            }
        });
    }
}

// Initialize navigation system
function initializeNavigation() {
    // Set up event listeners
    setupSearch();
    setupSaleCalculation();
    setupCalfGenderToggle();
    
    // Initialize page content
    initializePageContent();
    
    // Set default dates
    setDefaultDates();
    
    // Update current date
    updateCurrentDate();
    
    // Set up date update interval
    setInterval(updateCurrentDate, 60000); // Update every minute
    
    // Show dashboard by default
    setTimeout(() => {
        showPage('dashboard');
    }, 100);
}