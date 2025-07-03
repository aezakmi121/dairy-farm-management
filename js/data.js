// js/data.js - Data Management

// Initialize app data storage
let appData = {
    cows: [],
    milkProduction: [],
    breeding: [],
    vaccinations: [],
    feedTransactions: [],
    calves: [],
    sales: [],
    farmers: [],
    notifications: [],
    tasks: [],
    purchaseOrders: []
};

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('dairyFarmData');
    if (savedData) {
        appData = JSON.parse(savedData);
    } else {
        // Initialize with sample data
        initializeSampleData();
    }
    updateDashboard();
    populateDropdowns();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('dairyFarmData', JSON.stringify(appData));
}

// Initialize with sample data
function initializeSampleData() {
    appData.cows = [
        {
            id: 'COW001',
            number: '101',
            breed: 'Holstein',
            dob: '2020-03-15',
            arrival: '2020-04-01',
            weight: 550,
            bcs: 3,
            status: 'Milking'
        },
        {
            id: 'COW002',
            number: '102',
            breed: 'Jersey',
            dob: '2019-08-20',
            arrival: '2020-01-10',
            weight: 420,
            bcs: 3,
            status: 'Pregnant'
        },
        {
            id: 'COW003',
            number: '103',
            breed: 'Crossbred',
            dob: '2020-01-12',
            arrival: '2020-02-15',
            weight: 480,
            bcs: 4,
            status: 'Milking'
        }
    ];

    appData.farmers = [
        {
            id: 'FARM001',
            code: 'F001',
            name: 'Rajesh Kumar',
            phone: '9876543210',
            address: 'Village Rampur',
            rateType: 'Standard'
        },
        {
            id: 'FARM002',
            code: 'F002',
            name: 'Suresh Patel',
            phone: '9876543211',
            address: 'Village Mathura',
            rateType: 'Premium'
        }
    ];

    appData.notifications = [
        {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            type: 'Health',
            message: 'Cow #101 due for vaccination',
            priority: 'High',
            status: 'Unread'
        },
        {
            id: 2,
            date: new Date().toISOString().split('T')[0],
            type: 'Breeding',
            message: 'Cow #102 PD check due',
            priority: 'Medium',
            status: 'Unread'
        }
    ];

    // Add some sample milk production data
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        appData.cows.forEach(cow => {
            if (cow.status === 'Milking') {
                // Morning session
                appData.milkProduction.push({
                    id: Date.now() + Math.random(),
                    date: dateStr,
                    cowId: cow.id,
                    session: 'Morning',
                    yield: Math.round((Math.random() * 5 + 8) * 10) / 10, // 8-13 liters
                    fat: Math.round((Math.random() * 1 + 3.5) * 10) / 10, // 3.5-4.5%
                    snf: Math.round((Math.random() * 1 + 8.5) * 10) / 10, // 8.5-9.5%
                    remarks: ''
                });

                // Evening session
                appData.milkProduction.push({
                    id: Date.now() + Math.random(),
                    date: dateStr,
                    cowId: cow.id,
                    session: 'Evening',
                    yield: Math.round((Math.random() * 4 + 6) * 10) / 10, // 6-10 liters
                    fat: Math.round((Math.random() * 1 + 3.5) * 10) / 10,
                    snf: Math.round((Math.random() * 1 + 8.5) * 10) / 10,
                    remarks: ''
                });
            }
        });
    }

    saveData();
}

// Update dashboard statistics
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's milk production
    const todayMilk = appData.milkProduction
        .filter(m => m.date === today)
        .reduce((sum, m) => sum + m.yield, 0);
    
    // Count different cow statuses
    const milkingCows = appData.cows.filter(c => c.status === 'Milking' || c.status === 'Active').length;
    const pregnantCows = appData.breeding.filter(b => b.pdResult === 'Positive').length;
    
    // Calculate average milk per cow
    const avgMilk = milkingCows > 0 ? (todayMilk / milkingCows) : 0;
    
    // Calculate revenue (assuming ₹25 per liter)
    const todayRevenue = todayMilk * 25;
    
    // Update DOM elements
    document.getElementById('totalCows').textContent = appData.cows.length;
    document.getElementById('milkingCows').textContent = milkingCows;
    document.getElementById('todayMilk').textContent = todayMilk.toFixed(1) + 'L';
    document.getElementById('avgMilk').textContent = avgMilk.toFixed(1) + 'L';
    document.getElementById('pregnantCows').textContent = pregnantCows;
    document.getElementById('todayRevenue').textContent = '₹' + todayRevenue.toFixed(0);
    
    // Update alert count
    const unreadNotifications = appData.notifications.filter(n => n.status === 'Unread').length;
    document.getElementById('alertCount').textContent = unreadNotifications;
}

// Populate dropdown menus
function populateDropdowns() {
    // Populate cow dropdowns
    const cowSelects = ['milkCowId', 'breedingCowId', 'vaccineCowId', 'calfMother'];
    cowSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Cow</option>';
            appData.cows.forEach(cow => {
                select.innerHTML += `<option value="${cow.id}">${cow.number} (${cow.breed})</option>`;
            });
        }
    });

    // Populate farmer dropdown
    const farmerSelect = document.getElementById('farmerCode');
    if (farmerSelect) {
        farmerSelect.innerHTML = '<option value="">Select Farmer</option>';
        appData.farmers.forEach(farmer => {
            farmerSelect.innerHTML += `<option value="${farmer.id}">${farmer.code} - ${farmer.name}</option>`;
        });
    }
}

// Utility functions
function calculateAge(dob) {
    const birth = new Date(dob);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    return months;
}

function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function getDaysUntil(dateStr) {
    const target = new Date(dateStr);
    const today = new Date();
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN');
}

function calculateNextVaccination(vaccineType, date) {
    const intervals = {
        'Deworming': 90,
        'FMD': 365,
        'Brucellosis': 365,
        'BVD': 365,
        'HS': 365,
        'Anthrax': 365
    };
    return addDays(date, intervals[vaccineType] || 365);
}

function getBreedingStatus(record) {
    if (record.pdResult === 'Positive') return 'Pregnant';
    if (record.pdResult === 'Negative') return 'Open';
    if (getDaysUntil(record.pdDue) < 0) return 'PD Overdue';
    return 'PD Pending';
}

function getMinStockLevel(item) {
    const levels = {
        'Concentrate': 500,
        'Wheat Bran': 200,
        'Cotton Seed': 300,
        'Maize': 400,
        'Hay': 1000,
        'Silage': 2000,
        'Mineral Mix': 50
    };
    return levels[item] || 100;
}

function getDailyUsage(item) {
    const usage = {
        'Concentrate': 45,
        'Wheat Bran': 20,
        'Cotton Seed': 25,
        'Maize': 30,
        'Hay': 150,
        'Silage': 200,
        'Mineral Mix': 5
    };
    return usage[item] || 10;
}

function calculateCurrentStock(item) {
    const transactions = appData.feedTransactions.filter(f => f.item === item);
    const purchased = transactions.filter(f => f.transaction === 'Purchase').reduce((sum, f) => sum + f.quantity, 0);
    const consumed = transactions.filter(f => f.transaction === 'Consumption').reduce((sum, f) => sum + f.quantity, 0);
    return purchased - consumed;
}

// Export data function
function exportData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dairy_farm_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                appData = importedData;
                saveData();
                location.reload();
            } catch (error) {
                showAlert('danger', 'Invalid backup file format');
            }
        };
        reader.readAsText(file);
    }
}
// Cow Status Logic & Auto-Update Functions - Add to data.js

// Cow status criteria and automatic updates
function updateCowStatuses() {
    appData.cows.forEach(cow => {
        cow.status = calculateCowStatus(cow);
    });
    saveData();
}

function calculateCowStatus(cow) {
    const cowId = cow.id;
    const today = new Date();
    
    // Check if cow is pregnant
    const pregnantRecord = appData.breeding.find(b => 
        b.cowId === cowId && 
        b.pdResult === 'Positive' && 
        !b.actualDelivery
    );
    
    if (pregnantRecord) {
        const expectedDelivery = new Date(pregnantRecord.expectedDelivery);
        const daysUntilCalving = Math.ceil((expectedDelivery - today) / (1000 * 60 * 60 * 24));
        
        // If within 60 days of calving, mark as dry
        if (daysUntilCalving <= 60) {
            return 'Dry';
        }
        return 'Pregnant';
    }
    
    // Check if cow has calved recently (within 7 days)
    const recentCalving = appData.breeding.find(b => 
        b.cowId === cowId && 
        b.actualDelivery &&
        Math.ceil((today - new Date(b.actualDelivery)) / (1000 * 60 * 60 * 24)) <= 7
    );
    
    if (recentCalving) {
        return 'Fresh'; // Just calved
    }
    
    // Check milk production to determine if milking
    const recentMilk = appData.milkProduction.filter(m => 
        m.cowId === cowId &&
        Math.ceil((today - new Date(m.date)) / (1000 * 60 * 60 * 24)) <= 7
    );
    
    if (recentMilk.length > 0) {
        const avgDailyMilk = recentMilk.reduce((sum, m) => sum + m.yield, 0) / 7;
        
        // If producing less than 2L per day, consider dry
        if (avgDailyMilk < 2) {
            return 'Dry';
        }
        return 'Milking';
    }
    
    // Check if cow is sick (high SCC or health issues)
    const recentHighSCC = appData.milkProduction.find(m => 
        m.cowId === cowId &&
        m.scc > 750000 &&
        Math.ceil((today - new Date(m.date)) / (1000 * 60 * 60 * 24)) <= 3
    );
    
    if (recentHighSCC) {
        return 'Sick';
    }
    
    // Check if cow hasn't been milked for over 14 days
    const lastMilkRecord = appData.milkProduction
        .filter(m => m.cowId === cowId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (lastMilkRecord) {
        const daysSinceLastMilk = Math.ceil((today - new Date(lastMilkRecord.date)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastMilk > 14) {
            return 'Dry';
        }
    }
    
    // Default status
    return cow.status || 'Active';
}

// Status definitions and colors
const COW_STATUS_DEFINITIONS = {
    'Milking': {
        description: 'Currently being milked regularly (>2L/day)',
        color: '#3498db',
        criteria: 'Recent milk production >2L/day average'
    },
    'Dry': {
        description: 'Not producing milk (pregnant >7 months or resting)',
        color: '#95a5a6',
        criteria: 'No milk production or <2L/day for 7+ days, or 60 days before calving'
    },
    'Pregnant': {
        description: 'Confirmed pregnant but still milking',
        color: '#e74c3c',
        criteria: 'Positive pregnancy diagnosis, >60 days before calving'
    },
    'Fresh': {
        description: 'Recently calved (within 7 days)',
        color: '#f39c12',
        criteria: 'Calved within last 7 days'
    },
    'Sick': {
        description: 'Health issues detected',
        color: '#e67e22',
        criteria: 'High SCC (>750k) or marked as sick'
    },
    'Open': {
        description: 'Not pregnant, available for breeding',
        color: '#27ae60',
        criteria: 'Not pregnant, ready for AI services'
    },
    'Sold': {
        description: 'Sold or removed from herd',
        color: '#7f8c8d',
        criteria: 'Manually marked as sold'
    }
};

// Auto-update cow statuses daily
function scheduleStatusUpdates() {
    // Update statuses when app loads
    updateCowStatuses();
    
    // Set up daily updates at 6 AM
    const now = new Date();
    const sixAM = new Date();
    sixAM.setHours(6, 0, 0, 0);
    
    if (now > sixAM) {
        sixAM.setDate(sixAM.getDate() + 1);
    }
    
    const timeUntilSixAM = sixAM - now;
    
    setTimeout(() => {
        updateCowStatuses();
        updateDashboard();
        updateCowList();
        
        // Schedule daily updates
        setInterval(() => {
            updateCowStatuses();
            updateDashboard();
            updateCowList();
        }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilSixAM);
}
