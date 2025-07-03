// js/data.js - Complete Data Management System

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
    purchaseOrders: [],
    settings: {
        farmName: 'Maharani Farm',
        currency: '₹',
        defaultMilkPrice: 25,
        language: 'en'
    }
};

// Load data from localStorage with error handling
function loadData() {
    try {
        const savedData = localStorage.getItem('dairyFarmData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Ensure all required arrays exist
            appData = {
                cows: parsedData.cows || [],
                milkProduction: parsedData.milkProduction || [],
                breeding: parsedData.breeding || [],
                vaccinations: parsedData.vaccinations || [],
                feedTransactions: parsedData.feedTransactions || [],
                calves: parsedData.calves || [],
                sales: parsedData.sales || [],
                farmers: parsedData.farmers || [],
                notifications: parsedData.notifications || [],
                tasks: parsedData.tasks || [],
                purchaseOrders: parsedData.purchaseOrders || [],
                settings: parsedData.settings || appData.settings
            };
            
            console.log('Data loaded successfully');
        } else {
            // Initialize with sample data if no saved data exists
            initializeSampleData();
        }
        
        // Update displays after loading data
        setTimeout(() => {
            updateDashboard();
            populateDropdowns();
        }, 100);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('warning', 'Error loading saved data. Starting with fresh data.');
        initializeSampleData();
    }
}

// Save data to localStorage with error handling
function saveData() {
    try {
        const dataToSave = JSON.stringify(appData);
        localStorage.setItem('dairyFarmData', dataToSave);
        console.log('Data saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        showAlert('danger', 'Error saving data. Please try again.');
        return false;
    }
}

// Initialize with comprehensive sample data
function initializeSampleData() {
    console.log('Initializing sample data...');
    
    // Sample cows with diverse data
    appData.cows = [
        {
            id: 'COW001',
            number: '101',
            breed: 'Holstein',
            dob: '2020-03-15',
            arrival: '2020-04-01',
            weight: 550,
            bcs: 3,
            status: 'Milking',
            notes: 'High milk producer, good health record',
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'COW002',
            number: '102',
            breed: 'Jersey',
            dob: '2019-08-20',
            arrival: '2020-01-10',
            weight: 420,
            bcs: 3,
            status: 'Pregnant',
            notes: 'Expected to calve in 2 months',
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'COW003',
            number: '103',
            breed: 'Crossbred',
            dob: '2020-01-12',
            arrival: '2020-02-15',
            weight: 480,
            bcs: 4,
            status: 'Milking',
            notes: 'Good fat content in milk',
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'COW004',
            number: '104',
            breed: 'Gir',
            dob: '2019-12-05',
            arrival: '2020-03-01',
            weight: 390,
            bcs: 3,
            status: 'Dry',
            notes: 'Resting period before next lactation',
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'COW005',
            number: '105',
            breed: 'Sahiwal',
            dob: '2020-05-10',
            arrival: '2020-06-15',
            weight: 430,
            bcs: 3,
            status: 'Milking',
            notes: 'Disease resistant, good for hot climate',
            createdDate: '2024-01-01T00:00:00.000Z'
        }
    ];

    // Sample farmers/customers
    appData.farmers = [
        {
            id: 'FARM001',
            code: 'F001',
            name: 'Rajesh Kumar',
            phone: '9876543210',
            address: 'Village Rampur, Sector 12',
            rateType: 'Standard',
            customRate: 0,
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'FARM002',
            code: 'F002',
            name: 'Suresh Patel',
            phone: '9876543211',
            address: 'Village Mathura, Near Temple',
            rateType: 'Premium',
            customRate: 27,
            createdDate: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'FARM003',
            code: 'F003',
            name: 'Ramesh Singh',
            phone: '9876543212',
            address: 'Village Bharatpur, Main Road',
            rateType: 'Bulk',
            customRate: 24,
            createdDate: '2024-01-01T00:00:00.000Z'
        }
    ];

    // Generate sample milk production data for last 30 days
    appData.milkProduction = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        appData.cows.forEach(cow => {
            if (cow.status === 'Milking') {
                // Morning session
                appData.milkProduction.push({
                    id: `MILK_${Date.now()}_${cow.id}_${i}_M`,
                    date: dateStr,
                    cowId: cow.id,
                    session: 'Morning',
                    yield: Math.round((Math.random() * 5 + 8) * 10) / 10, // 8-13 liters
                    fat: Math.round((Math.random() * 1 + 3.5) * 10) / 10, // 3.5-4.5%
                    snf: Math.round((Math.random() * 1 + 8.5) * 10) / 10, // 8.5-9.5%
                    scc: Math.floor(Math.random() * 300000 + 100000), // 100k-400k
                    remarks: ''
                });

                // Evening session
                appData.milkProduction.push({
                    id: `MILK_${Date.now()}_${cow.id}_${i}_E`,
                    date: dateStr,
                    cowId: cow.id,
                    session: 'Evening',
                    yield: Math.round((Math.random() * 4 + 6) * 10) / 10, // 6-10 liters
                    fat: Math.round((Math.random() * 1 + 3.5) * 10) / 10,
                    snf: Math.round((Math.random() * 1 + 8.5) * 10) / 10,
                    scc: Math.floor(Math.random() * 300000 + 100000),
                    remarks: ''
                });
            }
        });
    }

    // Sample breeding records
    appData.breeding = [
        {
            id: 'BREED001',
            cowId: 'COW001',
            aiDate: '2024-10-15',
            semenId: 'HO12345',
            technician: 'Dr. Sharma',
            heatMethod: 'Visual',
            serviceType: 'First',
            serviceNumber: 1,
            cost: 500,
            pdDue: addDays('2024-10-15', 60),
            pdResult: 'Positive',
            pdDate: '2024-12-14',
            expectedDelivery: addDays('2024-10-15', 280),
            notes: 'Good heat detection, successful AI'
        },
        {
            id: 'BREED002',
            cowId: 'COW003',
            aiDate: '2024-11-01',
            semenId: 'CB67890',
            technician: 'Dr. Kumar',
            heatMethod: 'Standing Heat',
            serviceType: 'Repeat',
            serviceNumber: 2,
            cost: 500,
            pdDue: addDays('2024-11-01', 60),
            pdResult: '',
            expectedDelivery: addDays('2024-11-01', 280),
            notes: 'Second service after negative PD'
        },
        {
            id: 'BREED003',
            cowId: 'COW005',
            aiDate: '2024-09-20',
            semenId: 'SA11111',
            technician: 'Dr. Sharma',
            heatMethod: 'Heat Detector',
            serviceType: 'First',
            serviceNumber: 1,
            cost: 500,
            pdDue: addDays('2024-09-20', 60),
            pdResult: 'Negative',
            pdDate: '2024-11-19',
            expectedDelivery: '',
            notes: 'Will retry next heat cycle'
        }
    ];

    // Sample vaccination records
    appData.vaccinations = [
        {
            id: 'VAC001',
            cowId: 'COW001',
            type: 'FMD',
            date: '2024-01-15',
            batch: 'FMD2024001',
            veterinarian: 'Dr. Verma',
            dosage: '2ml',
            cost: 150,
            nextDue: '2025-01-15',
            notes: 'No adverse reactions'
        },
        {
            id: 'VAC002',
            cowId: 'COW002',
            type: 'Deworming',
            date: '2024-10-01',
            batch: 'DW2024050',
            veterinarian: 'Dr. Singh',
            dosage: '10ml',
            cost: 75,
            nextDue: '2025-01-01',
            notes: 'Administered orally'
        },
        {
            id: 'VAC003',
            cowId: 'COW003',
            type: 'Brucellosis',
            date: '2024-06-15',
            batch: 'BR2024025',
            veterinarian: 'Dr. Verma',
            dosage: '2ml',
            cost: 200,
            nextDue: '2025-06-15',
            notes: 'Annual vaccination'
        },
        {
            id: 'VAC004',
            cowId: 'COW004',
            type: 'HS',
            date: '2024-08-10',
            batch: 'HS2024030',
            veterinarian: 'Dr. Kumar',
            dosage: '2ml',
            cost: 120,
            nextDue: '2025-08-10',
            notes: 'Preventive vaccination'
        },
        {
            id: 'VAC005',
            cowId: 'COW005',
            type: 'Anthrax',
            date: '2024-07-20',
            batch: 'AN2024015',
            veterinarian: 'Dr. Singh',
            dosage: '1ml',
            cost: 100,
            nextDue: '2025-07-20',
            notes: 'Annual booster'
        }
    ];

    // Sample feed transactions
    appData.feedTransactions = [
        // Recent purchases
        {
            id: 'FEED001',
            date: '2024-12-01',
            item: 'Concentrate',
            transaction: 'Purchase',
            quantity: 1000,
            rate: 25,
            notes: 'Monthly stock purchase from ABC Feeds'
        },
        {
            id: 'FEED002',
            date: '2024-12-01',
            item: 'Wheat Bran',
            transaction: 'Purchase',
            quantity: 500,
            rate: 18,
            notes: 'Quality wheat bran from local supplier'
        },
        {
            id: 'FEED003',
            date: '2024-12-01',
            item: 'Cotton Seed',
            transaction: 'Purchase',
            quantity: 300,
            rate: 22,
            notes: 'Protein rich cotton seed cake'
        },
        {
            id: 'FEED004',
            date: '2024-12-01',
            item: 'Maize',
            transaction: 'Purchase',
            quantity: 800,
            rate: 20,
            notes: 'Fresh maize for energy'
        },
        {
            id: 'FEED005',
            date: '2024-12-01',
            item: 'Hay',
            transaction: 'Purchase',
            quantity: 2000,
            rate: 8,
            notes: 'Good quality hay bales'
        },
        {
            id: 'FEED006',
            date: '2024-12-01',
            item: 'Silage',
            transaction: 'Purchase',
            quantity: 3000,
            rate: 5,
            notes: 'Fresh corn silage'
        },
        {
            id: 'FEED007',
            date: '2024-12-01',
            item: 'Mineral Mix',
            transaction: 'Purchase',
            quantity: 100,
            rate: 45,
            notes: 'Essential minerals supplement'
        },
        // Daily consumption records for last 10 days
        ...generateFeedConsumption(10)
    ];

    // Sample calves
    appData.calves = [
        {
            id: 'CALF001',
            number: '201',
            gender: 'Female',
            birth: '2024-11-01',
            mother: 'COW001',
            weight: 35,
            breed: 'Holstein',
            health: 'Healthy',
            status: 'Active',
            notes: 'Strong and healthy calf',
            createdDate: '2024-11-01T00:00:00.000Z'
        },
        {
            id: 'CALF002',
            number: 'Male-1730419200000',
            gender: 'Male',
            birth: '2024-10-15',
            mother: 'COW003',
            weight: 32,
            breed: 'Crossbred',
            health: 'Healthy',
            status: 'Active',
            notes: 'Good birth weight',
            createdDate: '2024-10-15T00:00:00.000Z'
        },
        {
            id: 'CALF003',
            number: '202',
            gender: 'Female',
            birth: '2024-09-20',
            mother: 'COW005',
            weight: 28,
            breed: 'Sahiwal',
            health: 'Healthy',
            status: 'Active',
            notes: 'Adapting well to climate',
            createdDate: '2024-09-20T00:00:00.000Z'
        }
    ];

    // Sample sales records for last 15 days
    appData.sales = [];
    for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Morning sales
        appData.farmers.forEach((farmer, index) => {
            if (Math.random() > 0.3) { // 70% chance of sale per farmer per session
                const quantity = Math.round((Math.random() * 20 + 10) * 10) / 10; // 10-30 liters
                const fat = Math.round((Math.random() * 1 + 3.5) * 10) / 10;
                const snf = Math.round((Math.random() * 1 + 8.5) * 10) / 10;
                const baseRate = farmer.rateType === 'Premium' ? 27 : 
                               farmer.rateType === 'Bulk' ? 24 : 25;
                const rate = baseRate + (fat - 3.5) * 2 + (snf - 8.5) * 1;

                appData.sales.push({
                    id: `SALE_${Date.now()}_${farmer.id}_${i}_M`,
                    date: dateStr,
                    farmerId: farmer.id,
                    session: 'Morning',
                    quantity: quantity,
                    fat: fat,
                    snf: snf,
                    rate: Math.round(rate * 100) / 100,
                    amount: Math.round(quantity * rate * 100) / 100,
                    payment: ['Cash', 'UPI', 'Bank Transfer'][Math.floor(Math.random() * 3)]
                });
            }
        });

        // Evening sales
        appData.farmers.forEach((farmer, index) => {
            if (Math.random() > 0.2) { // 80% chance of sale per farmer per session
                const quantity = Math.round((Math.random() * 15 + 8) * 10) / 10; // 8-23 liters
                const fat = Math.round((Math.random() * 1 + 3.5) * 10) / 10;
                const snf = Math.round((Math.random() * 1 + 8.5) * 10) / 10;
                const baseRate = farmer.rateType === 'Premium' ? 27 : 
                               farmer.rateType === 'Bulk' ? 24 : 25;
                const rate = baseRate + (fat - 3.5) * 2 + (snf - 8.5) * 1;

                appData.sales.push({
                    id: `SALE_${Date.now()}_${farmer.id}_${i}_E`,
                    date: dateStr,
                    farmerId: farmer.id,
                    session: 'Evening',
                    quantity: quantity,
                    fat: fat,
                    snf: snf,
                    rate: Math.round(rate * 100) / 100,
                    amount: Math.round(quantity * rate * 100) / 100,
                    payment: ['Cash', 'UPI', 'Bank Transfer'][Math.floor(Math.random() * 3)]
                });
            }
        });
    }

    // Sample notifications
    appData.notifications = [
        {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            time: '08:30',
            type: 'Health',
            title: 'Vaccination Due',
            message: 'Cow #101 due for FMD vaccination',
            priority: 'High',
            status: 'Unread'
        },
        {
            id: 2,
            date: new Date().toISOString().split('T')[0],
            time: '09:15',
            type: 'Breeding',
            title: 'PD Check Required',
            message: 'Cow #103 PD check due in 3 days',
            priority: 'Medium',
            status: 'Unread'
        },
        {
            id: 3,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            type: 'Feed',
            title: 'Low Stock Alert',
            message: 'Concentrate stock running low (5 days remaining)',
            priority: 'Medium',
            status: 'Unread'
        },
        {
            id: 4,
            date: new Date().toISOString().split('T')[0],
            time: '14:20',
            type: 'Production',
            title: 'High Milk Production',
            message: 'Cow #101 produced 26L today - excellent performance!',
            priority: 'Low',
            status: 'Read'
        },
        {
            id: 5,
            date: new Date().toISOString().split('T')[0],
            time: '16:45',
            type: 'Breeding',
            title: 'Calving Expected',
            message: 'Cow #102 expected to calve within 7 days',
            priority: 'High',
            status: 'Unread'
        }
    ];

    // Sample tasks
    appData.tasks = [
        {
            id: 'TASK001',
            title: 'Morning Milking',
            description: 'Complete morning milking session for all lactating cows',
            priority: 'High',
            status: 'Completed',
            dueDate: new Date().toISOString().split('T')[0],
            assignedTo: 'Farm Worker 1'
        },
        {
            id: 'TASK002',
            title: 'Feed Inventory Check',
            description: 'Check and update feed stock levels',
            priority: 'Medium',
            status: 'Pending',
            dueDate: new Date().toISOString().split('T')[0],
            assignedTo: 'Farm Manager'
        },
        {
            id: 'TASK003',
            title: 'Cow Health Inspection',
            description: 'Daily health check for all animals',
            priority: 'High',
            status: 'In Progress',
            dueDate: new Date().toISOString().split('T')[0],
            assignedTo: 'Veterinarian'
        }
    ];

    // Save the initialized data
    saveData();
    console.log('Sample data initialized successfully');
}

// Generate feed consumption records
function generateFeedConsumption(days) {
    const consumption = [];
    const today = new Date();
    const feedItems = ['Concentrate', 'Wheat Bran', 'Cotton Seed', 'Maize', 'Hay', 'Silage', 'Mineral Mix'];
    
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        feedItems.forEach(item => {
            const dailyUsage = getDailyUsage(item);
            const variation = Math.random() * 0.2 - 0.1; // ±10% variation
            const actualUsage = dailyUsage * (1 + variation);
            
            consumption.push({
                id: `CONSUMPTION_${Date.now()}_${item}_${i}`,
                date: dateStr,
                item: item,
                transaction: 'Consumption',
                quantity: Math.round(actualUsage * 10) / 10,
                rate: 0,
                notes: 'Daily consumption'
            });
        });
    }
    
    return consumption;
}

// Update dashboard statistics with comprehensive calculations
function updateDashboard() {
    try {
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
        
        // Calculate revenue (using default price from settings)
        const todayRevenue = todayMilk * appData.settings.defaultMilkPrice;
        
        // Update DOM elements safely
        safeUpdateElement('totalCows', appData.cows.length);
        safeUpdateElement('milkingCows', milkingCows);
        safeUpdateElement('todayMilk', todayMilk.toFixed(1) + 'L');
        safeUpdateElement('avgMilk', avgMilk.toFixed(1) + 'L');
        safeUpdateElement('pregnantCows', pregnantCows);
        safeUpdateElement('todayRevenue', appData.settings.currency + todayRevenue.toFixed(0));
        
        // Update alert count
        const unreadNotifications = appData.notifications.filter(n => n.status === 'Unread').length;
        safeUpdateElement('alertCount', unreadNotifications);
        
        console.log('Dashboard updated successfully');
        
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Populate dropdown menus with current data
function populateDropdowns() {
    try {
        // Populate cow dropdowns
        const cowSelects = ['milkCowId', 'breedingCowId', 'vaccineCowId', 'calfMother'];
        cowSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Cow</option>';
                appData.cows
                    .filter(cow => cow.status !== 'Sold') // Don't show sold cows
                    .forEach(cow => {
                        select.innerHTML += `<option value="${cow.id}">${cow.number} (${cow.breed} - ${cow.status})</option>`;
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
        
        // Populate PD dropdown with pending AI records
        populatePDDropdown();
        
        console.log('Dropdowns populated successfully');
        
    } catch (error) {
        console.error('Error populating dropdowns:', error);
    }
}

// Populate PD dropdown with pending AI records
function populatePDDropdown() {
    const pdSelect = document.getElementById('pdRecordId');
    if (pdSelect) {
        pdSelect.innerHTML = '<option value="">Select AI Record for PD</option>';
        
        const pendingRecords = appData.breeding.filter(b => !b.pdResult);
        pendingRecords.forEach(record => {
            const cow = appData.cows.find(c => c.id === record.cowId);
            const daysSinceAI = Math.floor((new Date() - new Date(record.aiDate)) / (1000 * 60 * 60 * 24));
            pdSelect.innerHTML += `
                <option value="${record.id}">
                    Cow #${cow?.number || 'Unknown'} - AI: ${formatDate(record.aiDate)} (${daysSinceAI} days ago)
                </option>
            `;
        });
    }
}

// Utility functions
function calculateAge(dob) {
    const birth = new Date(dob);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    return Math.max(0, months);
}

function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function getDaysUntil(dateStr) {
    if (!dateStr) return null;
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
        'Anthrax': 365,
        'Blackleg': 365,
        'IBR': 365
    };
    return addDays(date, intervals[vaccineType] || 365);
}

function getBreedingStatus(record) {
    if (record.pdResult === 'Positive') return 'Pregnant';
    if (record.pdResult === 'Negative') return 'Open';
    if (record.pdDue && getDaysUntil(record.pdDue) < 0) return 'PD Overdue';
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
        'Mineral Mix': 50,
        'Salt': 100,
        'Green Fodder': 500
    };
    return levels[item] || 100;
}

function getDailyUsage(item) {
    // Daily usage in kg for the entire herd
    const milkingCowCount = appData.cows.filter(c => c.status === 'Milking').length;
    const dryCowCount = appData.cows.filter(c => c.status === 'Dry' || c.status === 'Pregnant').length;
    const totalCows = appData.cows.length;
    
    const usage = {
        'Concentrate': milkingCowCount * 4 + dryCowCount * 2, // 4kg/milking cow, 2kg/dry cow
        'Wheat Bran': milkingCowCount * 2 + dryCowCount * 1, // 2kg/milking cow, 1kg/dry cow
        'Cotton Seed': milkingCowCount * 1.5 + dryCowCount * 0.5, // 1.5kg/milking cow
        'Maize': milkingCowCount * 3 + dryCowCount * 2, // 3kg/milking cow, 2kg/dry cow
        'Hay': totalCows * 8, // 8kg per cow (dry matter)
        'Silage': totalCows * 15, // 15kg per cow (fresh weight)
        'Mineral Mix': totalCows * 0.1, // 100g per cow
        'Salt': totalCows * 0.05, // 50g per cow
        'Green Fodder': totalCows * 20 // 20kg per cow
    };
    return usage[item] || 10;
}

function calculateCurrentStock(item) {
    const transactions = appData.feedTransactions.filter(f => f.item === item);
    const purchased = transactions.filter(f => f.transaction === 'Purchase').reduce((sum, f) => sum + f.quantity, 0);
    const consumed = transactions.filter(f => f.transaction === 'Consumption').reduce((sum, f) => sum + f.quantity, 0);
    const wastage = transactions.filter(f => f.transaction === 'Wastage').reduce((sum, f) => sum + f.quantity, 0);
    return Math.max(0, purchased - consumed - wastage);
}

// Enhanced data export function
function exportData() {
    try {
        const exportData = {
            ...appData,
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            farmInfo: {
                name: appData.settings.farmName,
                totalCows: appData.cows.length,
                activeCows: appData.cows.filter(c => c.status !== 'Sold').length,
                dataRange: {
                    oldestRecord: getOldestRecordDate(),
                    newestRecord: getNewestRecordDate()
                }
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dairy_farm_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        showAlert('success', 'Data exported successfully!');
        console.log('Data exported successfully');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showAlert('danger', 'Error exporting data. Please try again.');
    }
}

// Enhanced data import function
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate imported data structure
            if (!validateImportedData(importedData)) {
                showAlert('danger', 'Invalid backup file format. Please check the file and try again.');
                return;
            }
            
            // Backup current data before import
            const currentDataBackup = JSON.stringify(appData);
            
            try {
                // Import the data
                appData = {
                    cows: importedData.cows || [],
                    milkProduction: importedData.milkProduction || [],
                    breeding: importedData.breeding || [],
                    vaccinations: importedData.vaccinations || [],
                    feedTransactions: importedData.feedTransactions || [],
                    calves: importedData.calves || [],
                    sales: importedData.sales || [],
                    farmers: importedData.farmers || [],
                    notifications: importedData.notifications || [],
                    tasks: importedData.tasks || [],
                    purchaseOrders: importedData.purchaseOrders || [],
                    settings: importedData.settings || appData.settings
                };
                
                saveData();
                
                // Refresh the page to reload all data
                if (confirm('Data imported successfully! The page will refresh to load the new data.')) {
                    location.reload();
                }
                
            } catch (importError) {
                // Restore backup if import fails
                appData = JSON.parse(currentDataBackup);
                saveData();
                throw importError;
            }
            
        } catch (error) {
            console.error('Error importing data:', error);
            showAlert('danger', 'Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Validate imported data structure
function validateImportedData(data) {
    const requiredFields = ['cows', 'milkProduction', 'breeding'];
    return requiredFields.every(field => Array.isArray(data[field]));
}

// Get oldest and newest record dates for export info
function getOldestRecordDate() {
    const allDates = [
        ...appData.milkProduction.map(m => m.date),
        ...appData.breeding.map(b => b.aiDate),
        ...appData.vaccinations.map(v => v.date),
        ...appData.sales.map(s => s.date)
    ].filter(date => date);
    
    return allDates.length > 0 ? allDates.sort()[0] : null;
}

function getNewestRecordDate() {
    const allDates = [
        ...appData.milkProduction.map(m => m.date),
        ...appData.breeding.map(b => b.aiDate),
        ...appData.vaccinations.map(v => v.date),
        ...appData.sales.map(s => s.date)
    ].filter(date => date);
    
    return allDates.length > 0 ? allDates.sort().reverse()[0] : null;
}

// Cow Status Logic & Auto-Update Functions
function updateCowStatuses() {
    try {
        let updatedCount = 0;
        
        appData.cows.forEach(cow => {
            const oldStatus = cow.status;
            const newStatus = calculateCowStatus(cow);
            
            if (oldStatus !== newStatus) {
                cow.status = newStatus;
                updatedCount++;
                
                // Add notification for status change
                addNotification({
                    type: 'Status',
                    title: 'Cow Status Updated',
                    message: `Cow #${cow.number} status changed from ${oldStatus} to ${newStatus}`,
                    priority: 'Medium'
                });
            }
        });
        
        if (updatedCount > 0) {
            saveData();
            console.log(`Updated status for ${updatedCount} cows`);
        }
        
    } catch (error) {
        console.error('Error updating cow statuses:', error);
    }
}

function calculateCowStatus(cow) {
    const cowId = cow.id;
    const today = new Date();
    
    // Check if cow is sold
    if (cow.status === 'Sold') {
        return 'Sold';
    }
    
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
    
    // Check if cow is open (not pregnant and available for breeding)
    const lastBreeding = appData.breeding
        .filter(b => b.cowId === cowId)
        .sort((a, b) => new Date(b.aiDate) - new Date(a.aiDate))[0];
    
    if (lastBreeding && lastBreeding.pdResult === 'Negative') {
        return 'Open';
    }
    
    // Default status based on current status or set to Active
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
    'Active': {
        description: 'Active in herd, status pending',
        color: '#3498db',
        criteria: 'General active status'
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
        
        // Schedule daily updates
        setInterval(() => {
            updateCowStatuses();
            updateDashboard();
            console.log('Daily status update completed');
        }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilSixAM);
}

// Notification management
function addNotification(notification) {
    const newNotification = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        type: notification.type || 'General',
        title: notification.title || 'Notification',
        message: notification.message || '',
        priority: notification.priority || 'Low',
        status: 'Unread'
    };
    
    appData.notifications.unshift(newNotification); // Add to beginning
    
    // Keep only last 100 notifications
    if (appData.notifications.length > 100) {
        appData.notifications = appData.notifications.slice(0, 100);
    }
    
    saveData();
    updateDashboard(); // Update alert count
    
    return newNotification;
}

// Data analytics functions
function getProductionAnalytics(startDate, endDate) {
    const records = appData.milkProduction.filter(m => 
        m.date >= startDate && m.date <= endDate
    );
    
    const totalMilk = records.reduce((sum, r) => sum + r.yield, 0);
    const avgFat = records.length > 0 ? records.reduce((sum, r) => sum + (r.fat || 0), 0) / records.length : 0;
    const avgSNF = records.length > 0 ? records.reduce((sum, r) => sum + (r.snf || 0), 0) / records.length : 0;
    const avgSCC = records.length > 0 ? records.reduce((sum, r) => sum + (r.scc || 0), 0) / records.length : 0;
    
    const dailyProduction = {};
    records.forEach(record => {
        if (!dailyProduction[record.date]) {
            dailyProduction[record.date] = 0;
        }
        dailyProduction[record.date] += record.yield;
    });
    
    const days = Object.keys(dailyProduction).length;
    const avgDaily = days > 0 ? totalMilk / days : 0;
    
    return {
        totalMilk,
        avgFat,
        avgSNF,
        avgSCC,
        avgDaily,
        recordCount: records.length,
        dailyProduction
    };
}

function getBreedingAnalytics() {
    const totalServices = appData.breeding.length;
    const pregnantCows = appData.breeding.filter(b => b.pdResult === 'Positive').length;
    const conceptionRate = totalServices > 0 ? (pregnantCows / totalServices) * 100 : 0;
    
    const pendingPD = appData.breeding.filter(b => !b.pdResult).length;
    const overduePD = appData.breeding.filter(b => 
        !b.pdResult && getDaysUntil(b.pdDue) < 0
    ).length;
    
    return {
        totalServices,
        pregnantCows,
        conceptionRate,
        pendingPD,
        overduePD
    };
}

function getFinancialAnalytics(startDate, endDate) {
    const sales = appData.sales.filter(s => s.date >= startDate && s.date <= endDate);
    const feedPurchases = appData.feedTransactions.filter(f => 
        f.date >= startDate && f.date <= endDate && f.transaction === 'Purchase'
    );
    const vaccinations = appData.vaccinations.filter(v => 
        v.date >= startDate && v.date <= endDate
    );
    
    const revenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const feedCosts = feedPurchases.reduce((sum, f) => sum + (f.quantity * f.rate), 0);
    const healthCosts = vaccinations.reduce((sum, v) => sum + (v.cost || 0), 0);
    const totalCosts = feedCosts + healthCosts;
    const profit = revenue - totalCosts;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return {
        revenue,
        feedCosts,
        healthCosts,
        totalCosts,
        profit,
        profitMargin
    };
}

// Safe element update function
function safeUpdateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
        return true;
    }
    return false;
}

// Data validation functions
function validateCowData(cowData) {
    const errors = [];
    
    if (!cowData.number || cowData.number.trim() === '') {
        errors.push('Cow number is required');
    }
    
    if (!cowData.breed) {
        errors.push('Breed is required');
    }
    
    if (!cowData.dob) {
        errors.push('Date of birth is required');
    } else {
        const dob = new Date(cowData.dob);
        const today = new Date();
        if (dob > today) {
            errors.push('Date of birth cannot be in the future');
        }
    }
    
    if (cowData.weight && (cowData.weight < 50 || cowData.weight > 1000)) {
        errors.push('Weight must be between 50-1000 kg');
    }
    
    if (cowData.bcs && (cowData.bcs < 1 || cowData.bcs > 5)) {
        errors.push('Body condition score must be between 1-5');
    }
    
    return errors;
}

function validateMilkData(milkData) {
    const errors = [];
    
    if (!milkData.cowId) {
        errors.push('Cow selection is required');
    }
    
    if (!milkData.date) {
        errors.push('Date is required');
    }
    
    if (!milkData.session) {
        errors.push('Session selection is required');
    }
    
    if (!milkData.yield || milkData.yield <= 0) {
        errors.push('Milk yield must be greater than 0');
    } else if (milkData.yield > 50) {
        errors.push('Milk yield seems unusually high (>50L)');
    }
    
    if (milkData.fat && (milkData.fat < 1 || milkData.fat > 10)) {
        errors.push('Fat percentage must be between 1-10%');
    }
    
    if (milkData.snf && (milkData.snf < 6 || milkData.snf > 15)) {
        errors.push('SNF percentage must be between 6-15%');
    }
    
    if (milkData.scc && (milkData.scc < 10000 || milkData.scc > 5000000)) {
        errors.push('SCC value must be between 10,000-5,000,000');
    }
    
    return errors;
}

// Initialize data management when script loads
console.log('Data management system initialized');

// Export commonly used functions for global access
window.appData = appData;
window.loadData = loadData;
window.saveData = saveData;
window.updateDashboard = updateDashboard;
window.populateDropdowns = populateDropdowns;
