// Updated App.js - Complete Fixed Version

// Safe DOM manipulation functions
function safeUpdateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
        return true;
    }
    console.warn(`Element ${elementId} not found`);
    return false;
}

function safeUpdateHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = html;
        return true;
    }
    console.warn(`Element ${elementId} not found`);
    return false;
}

function safeAddEventListener(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(event, handler);
        return true;
    }
    console.warn(`Element ${elementId} not found for event listener`);
    return false;
}

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

// Enhanced update function with safe calls
function updateAllDisplays() {
    try {
        updateCowList();
        updateMilkRecords();
        updateBreedingRecords();
        updateVaccinationRecords();
        updateStockLevels();
        updateCalfRecords();
        updateSalesRecords();
        updateDashboard();
        updateDashboardAlerts();
        updateReportsData();
        updateAlertsData();
        
        // Update number references
        setTimeout(() => {
            addNumberReferenceToForms();
        }, 500);
    } catch (error) {
        console.error('Error updating displays:', error);
        showAlert('warning', 'Some data may not have loaded correctly.');
    }
}

// Missing update functions - now implemented
function updateMilkRecords() {
    const today = new Date().toISOString().split('T')[0];
    const dateFilter = document.getElementById('milkDateFilter');
    let filterDate = today;
    
    if (dateFilter) {
        const filterValue = dateFilter.value;
        switch(filterValue) {
            case 'yesterday':
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                filterDate = yesterday.toISOString().split('T')[0];
                break;
            case 'week':
                // Get records from last 7 days
                break;
            case 'month':
                // Get records from current month
                break;
            default:
                filterDate = today;
        }
    }
    
    const filteredRecords = appData.milkProduction.filter(m => {
        if (dateFilter && dateFilter.value === 'week') {
            const recordDate = new Date(m.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return recordDate >= weekAgo;
        } else if (dateFilter && dateFilter.value === 'month') {
            const recordDate = new Date(m.date);
            const now = new Date();
            return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
        }
        return m.date === filterDate;
    });
    
    const tbody = document.getElementById('milkRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    filteredRecords.forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const dailyTotal = appData.milkProduction
            .filter(m => m.date === record.date && m.cowId === record.cowId)
            .reduce((sum, m) => sum + m.yield, 0);
        
        const quality = record.scc ? (record.scc > 400000 ? 'Poor' : record.scc > 200000 ? 'Good' : 'Excellent') : 'N/A';
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${record.session}</td>
                <td>${record.yield.toFixed(1)}</td>
                <td>${record.fat ? record.fat.toFixed(1) : '-'}</td>
                <td>${record.snf ? record.snf.toFixed(1) : '-'}</td>
                <td>${record.scc ? record.scc.toLocaleString() : '-'}</td>
                <td>${dailyTotal.toFixed(1)}</td>
                <td><span class="quality-${quality.toLowerCase()}">${quality}</span></td>
                <td>${record.remarks || '-'}</td>
            </tr>
        `;
    });
}

function updateBreedingRecords() {
    const tbody = document.getElementById('breedingRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const recentRecords = appData.breeding.slice(-10).reverse();
    
    recentRecords.forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const pdStatus = record.pdResult || 'Pending';
        const statusClass = pdStatus === 'Positive' ? 'status-pregnant' : 
                          pdStatus === 'Negative' ? 'status-open' : 'status-pending';
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${formatDate(record.aiDate)}</td>
                <td>${record.serviceNumber || 1}</td>
                <td>${record.semenId || '-'}</td>
                <td>${formatDate(record.pdDue)}</td>
                <td><span class="cow-status ${statusClass}">${pdStatus}</span></td>
                <td>${record.expectedDelivery ? formatDate(record.expectedDelivery) : '-'}</td>
                <td>${getBreedingStatus(record)}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editBreeding('${record.id}')">Edit</button>
                </td>
            </tr>
        `;
    });
}

function updateVaccinationRecords() {
    const tbody = document.getElementById('vaccinationRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const recentRecords = (appData.vaccinations || []).slice(-10).reverse();
    
    recentRecords.forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const daysUntilDue = record.nextDue ? getDaysUntil(record.nextDue) : null;
        
        let status = 'Current';
        let statusClass = 'status-success';
        
        if (daysUntilDue !== null) {
            if (daysUntilDue < 0) {
                status = 'Overdue';
                statusClass = 'status-danger';
            } else if (daysUntilDue < 7) {
                status = 'Due Soon';
                statusClass = 'status-warning';
            }
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${record.type}</td>
                <td>${formatDate(record.date)}</td>
                <td>${record.nextDue ? formatDate(record.nextDue) : '-'}</td>
                <td>${record.batch || '-'}</td>
                <td>${record.veterinarian || '-'}</td>
                <td><span class="cow-status ${statusClass}">${status}</span></td>
                <td>₹${(record.cost || 0).toFixed(2)}</td>
            </tr>
        `;
    });
}

function updateStockLevels() {
    const tbody = document.getElementById('stockLevels');
    if (!tbody) return;
    
    const feedItems = ['Concentrate', 'Wheat Bran', 'Cotton Seed', 'Maize', 'Hay', 'Silage', 'Mineral Mix'];
    const stockLevels = {};
    
    feedItems.forEach(item => {
        const current = calculateCurrentStock(item);
        const minLevel = getMinStockLevel(item);
        const dailyUsage = getDailyUsage(item);
        const daysRemaining = dailyUsage > 0 ? current / dailyUsage : 0;
        
        stockLevels[item] = {
            current,
            minLevel,
            dailyUsage,
            daysRemaining
        };
    });
    
    tbody.innerHTML = '';
    Object.entries(stockLevels).forEach(([item, data]) => {
        let status = 'Good';
        let statusClass = 'status-success';
        
        if (data.current < data.minLevel) {
            status = 'Low Stock';
            statusClass = 'status-danger';
        } else if (data.daysRemaining < 7) {
            status = 'Order Soon';
            statusClass = 'status-warning';
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${item}</td>
                <td>${data.current.toFixed(1)}</td>
                <td>${data.minLevel}</td>
                <td>${data.dailyUsage.toFixed(1)}</td>
                <td>${data.daysRemaining.toFixed(0)}</td>
                <td><span class="cow-status ${statusClass}">${status}</span></td>
                <td>
                    <button class="btn-small" onclick="addStock('${item}')">Add Stock</button>
                </td>
            </tr>
        `;
    });
    
    // Update stock alerts
    updateStockAlerts(stockLevels);
}

function updateStockAlerts(stockLevels) {
    const lowStockItems = Object.entries(stockLevels)
        .filter(([item, data]) => data.current < data.minLevel)
        .map(([item]) => item);
    
    const alertElement = document.getElementById('lowStockAlert');
    const itemsElement = document.getElementById('lowStockItems');
    
    if (alertElement && itemsElement) {
        if (lowStockItems.length > 0) {
            itemsElement.textContent = lowStockItems.join(', ');
            alertElement.style.display = 'block';
        } else {
            alertElement.style.display = 'none';
        }
    }
}

function updateCalfRecords() {
    const tbody = document.getElementById('calfRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    (appData.calves || []).forEach(calf => {
        const mother = appData.cows.find(c => c.id === calf.mother);
        const birthDate = new Date(calf.birth);
        const today = new Date();
        const age = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        
        tbody.innerHTML += `
            <tr>
                <td>${calf.number}</td>
                <td>${calf.gender}</td>
                <td>${formatDate(calf.birth)}</td>
                <td>${age} days</td>
                <td>${mother ? mother.number : 'Unknown'}</td>
                <td>${calf.weight || '-'}kg</td>
                <td>-</td>
                <td><span class="cow-status status-success">${calf.status || 'Active'}</span></td>
                <td>
                    <button class="btn-small btn-view" onclick="viewCalf('${calf.id}')">View</button>
                    <button class="btn-small btn-edit" onclick="editCalf('${calf.id}')">Edit</button>
                </td>
            </tr>
        `;
    });
}

function updateSalesRecords() {
    const tbody = document.getElementById('salesRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const recentSales = (appData.sales || []).slice(-10).reverse();
    
    recentSales.forEach(record => {
        const farmer = appData.farmers.find(f => f.id === record.farmerId);
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td>${farmer ? farmer.name : 'Unknown'}</td>
                <td>${record.session}</td>
                <td>${record.quantity.toFixed(1)}</td>
                <td>${record.fat ? record.fat.toFixed(1) : '-'}</td>
                <td>${record.snf ? record.snf.toFixed(1) : '-'}</td>
                <td>₹${record.rate.toFixed(2)}</td>
                <td>₹${record.amount.toFixed(2)}</td>
                <td><span class="payment-${(record.payment || 'cash').toLowerCase()}">${record.payment || 'Cash'}</span></td>
            </tr>
        `;
    });
    
    // Update sales statistics
    updateSalesStats();
}

function updateSalesStats() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const todaySales = (appData.sales || [])
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.amount, 0);
    
    const monthSales = (appData.sales || [])
        .filter(s => {
            const saleDate = new Date(s.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        })
        .reduce((sum, s) => sum + s.amount, 0);
    
    const avgRate = (appData.sales || []).length > 0 ? 
        (appData.sales.reduce((sum, s) => sum + s.rate, 0) / appData.sales.length) : 0;
    
    const totalFarmers = (appData.farmers || []).length;
    
    safeUpdateElement('todaySales', `₹${todaySales.toFixed(0)}`);
    safeUpdateElement('monthSales', `₹${monthSales.toFixed(0)}`);
    safeUpdateElement('avgRate', `₹${avgRate.toFixed(2)}`);
    safeUpdateElement('totalFarmers', totalFarmers);
}

function updateReportsData() {
    // Enhanced reports data update
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const thisMonthMilk = appData.milkProduction
        .filter(m => new Date(m.date) >= thisMonth)
        .reduce((sum, m) => sum + m.yield, 0);
    
    const daysInMonth = today.getDate();
    const avgDailyMilk = daysInMonth > 0 ? thisMonthMilk / daysInMonth : 0;
    
    const totalAI = appData.breeding.length;
    const pregnantCows = appData.breeding.filter(b => b.pdResult === 'Positive').length;
    const conceptionRate = totalAI > 0 ? (pregnantCows / totalAI) * 100 : 0;
    
    const feedCost = (appData.feedTransactions || [])
        .filter(f => f.transaction === 'Purchase' && new Date(f.date) >= thisMonth)
        .reduce((sum, f) => sum + (f.quantity * f.rate), 0);
    
    const milkRevenue = (appData.sales || [])
        .filter(s => new Date(s.date) >= thisMonth)
        .reduce((sum, s) => sum + s.amount, 0);
    
    const profitMargin = milkRevenue - feedCost;
    const feedEfficiency = thisMonthMilk > 0 && feedCost > 0 ? thisMonthMilk / (feedCost / 25) : 0;
    
    safeUpdateElement('avgDailyMilk', `${avgDailyMilk.toFixed(1)}L`);
    safeUpdateElement('conceptionRate', `${conceptionRate.toFixed(1)}%`);
    safeUpdateElement('feedEfficiency', feedEfficiency.toFixed(2));
    safeUpdateElement('profitMargin', `₹${profitMargin.toFixed(0)}`);
}

function updateAlertsData() {
    const criticalAlerts = [];
    const upcomingTasks = [];
    const generalNotifications = [];
    
    // Check for critical alerts
    checkHealthEmergencies(criticalAlerts);
    checkBreedingAlerts(upcomingTasks);
    checkVaccinationAlerts(upcomingTasks);
    checkStockAlerts(criticalAlerts);
    
    // Update alert sections
    safeUpdateHTML('criticalAlertsList', 
        criticalAlerts.length > 0 ? 
        criticalAlerts.map(alert => `<div class="alert-item">${alert}</div>`).join('') : 
        'No critical alerts'
    );
    
    safeUpdateHTML('upcomingTasksList', 
        upcomingTasks.length > 0 ? 
        upcomingTasks.map(task => `<div class="alert-item">${task}</div>`).join('') : 
        'No upcoming tasks'
    );
    
    // Update notifications list
    updateNotificationsList();
}

function updateNotificationsList() {
    const tbody = document.getElementById('notificationsList');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const notifications = (appData.notifications || []).slice(-20).reverse();
    
    notifications.forEach(notification => {
        const priorityClass = `priority-${notification.priority.toLowerCase()}`;
        const statusClass = notification.status === 'Read' ? 'status-read' : 'status-unread';
        
        tbody.innerHTML += `
            <tr class="${statusClass}">
                <td>${formatDate(notification.date)}</td>
                <td>${notification.type}</td>
                <td>${notification.message}</td>
                <td><span class="priority ${priorityClass}">${notification.priority}</span></td>
                <td><span class="status">${notification.status}</span></td>
                <td>
                    <button class="btn-small" onclick="markAsRead('${notification.id}')">Mark Read</button>
                    <button class="btn-small btn-danger" onclick="deleteNotification('${notification.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Helper functions for alerts
function checkHealthEmergencies(alerts) {
    appData.cows.forEach(cow => {
        const recentMilk = appData.milkProduction
            .filter(m => m.cowId === cow.id && isRecentDate(m.date, 3))
            .reduce((sum, m) => sum + m.yield, 0);
        
        if (cow.status === 'Milking' && recentMilk < 10) {
            alerts.push(`⚠️ Cow #${cow.number} low milk production: ${recentMilk.toFixed(1)}L in 3 days`);
        }
    });
}

function checkBreedingAlerts(alerts) {
    appData.breeding.forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        if (!record.pdResult && getDaysUntil(record.pdDue) <= 0) {
            alerts.push(`🔬 PD check due for Cow #${cow?.number}`);
        }
        
        if (record.pdResult === 'Positive' && getDaysUntil(record.expectedDelivery) <= 7) {
            alerts.push(`🐮 Cow #${cow?.number} expected to calve in ${getDaysUntil(record.expectedDelivery)} days`);
        }
    });
}

function checkVaccinationAlerts(alerts) {
    (appData.vaccinations || []).forEach(vaccination => {
        const cow = appData.cows.find(c => c.id === vaccination.cowId);
        const daysUntil = getDaysUntil(vaccination.nextDue);
        
        if (daysUntil <= 7 && daysUntil >= 0) {
            alerts.push(`💉 Cow #${cow?.number} due for ${vaccination.type} vaccination`);
        } else if (daysUntil < 0) {
            alerts.push(`⚠️ Cow #${cow?.number} overdue for ${vaccination.type} vaccination`);
        }
    });
}

function checkStockAlerts(alerts) {
    const feedItems = ['Concentrate', 'Wheat Bran', 'Cotton Seed', 'Maize', 'Hay', 'Silage', 'Mineral Mix'];
    
    feedItems.forEach(item => {
        const stock = calculateCurrentStock(item);
        const minLevel = getMinStockLevel(item);
        
        if (stock < minLevel) {
            alerts.push(`📦 Low stock alert: ${item} (${stock.toFixed(1)}kg remaining)`);
        }
    });
}

// Utility functions
function isRecentDate(dateStr, days) {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
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

// Missing alert functions
function markAllRead() {
    if (appData.notifications) {
        appData.notifications.forEach(notification => {
            notification.status = 'Read';
        });
        saveData();
        updateAlertsData();
        showAlert('success', 'All notifications marked as read');
    }
}

function clearNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        appData.notifications = [];
        saveData();
        updateAlertsData();
        updateDashboard();
        showAlert('success', 'All notifications cleared');
    }
}

function markAsRead(notificationId) {
    const notification = appData.notifications.find(n => n.id == notificationId);
    if (notification) {
        notification.status = 'Read';
        saveData();
        updateAlertsData();
        updateDashboard();
    }
}

function deleteNotification(notificationId) {
    if (confirm('Delete this notification?')) {
        appData.notifications = appData.notifications.filter(n => n.id != notificationId);
        saveData();
        updateAlertsData();
        updateDashboard();
    }
}

// Missing utility functions
function addStock(item) {
    const quantity = prompt(`How much ${item} to add (kg)?`);
    if (quantity && !isNaN(quantity)) {
        const feedData = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            item: item,
            transaction: 'Purchase',
            quantity: parseFloat(quantity),
            rate: 0,
            notes: 'Manual stock addition'
        };
        
        appData.feedTransactions.push(feedData);
        saveData();
        updateStockLevels();
        showAlert('success', `Added ${quantity}kg of ${item}`);
    }
}

function viewCalf(calfId) {
    const calf = appData.calves.find(c => c.id === calfId);
    if (!calf) return;
    
    const mother = appData.cows.find(c => c.id === calf.mother);
    const age = Math.floor((new Date() - new Date(calf.birth)) / (1000 * 60 * 60 * 24));
    
    const modalContent = `
        <div class="calf-detail-view">
            <h3>Calf #${calf.number}</h3>
            <div class="info-grid">
                <div class="info-item"><strong>Gender:</strong> ${calf.gender}</div>
                <div class="info-item"><strong>Birth Date:</strong> ${formatDate(calf.birth)}</div>
                <div class="info-item"><strong>Age:</strong> ${age} days</div>
                <div class="info-item"><strong>Mother:</strong> ${mother ? mother.number : 'Unknown'}</div>
                <div class="info-item"><strong>Birth Weight:</strong> ${calf.weight || 'Not recorded'}kg</div>
                <div class="info-item"><strong>Breed:</strong> ${calf.breed || 'Not specified'}</div>
            </div>
        </div>
    `;
    
    showModal(`Calf Details - #${calf.number}`, modalContent);
}

function editCalf(calfId) {
    // Implementation for editing calf
    showAlert('info', 'Calf editing feature coming soon!');
}

function editBreeding(recordId) {
    // Implementation for editing breeding record
    showAlert('info', 'Breeding record editing feature coming soon!');
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Add search help after a delay
    setTimeout(() => {
        addSearchHelp();
    }, 2000);
});
