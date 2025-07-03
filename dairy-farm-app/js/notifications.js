// js/notifications.js - Notifications System

// Request notification permission
async function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted');
            return true;
        }
    }
    return false;
}

// Send local notification
function sendNotification(title, message, options = {}) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: '🐄',
            badge: '🔔',
            vibrate: [200, 100, 200],
            requireInteraction: true,
            actions: [
                { action: 'view', title: 'View Details' },
                { action: 'dismiss', title: 'Dismiss' }
            ],
            ...options
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
    }
}

// Smart notification system
class DairyNotificationSystem {
    constructor() {
        this.alerts = [];
        this.scheduledChecks = [];
        this.init();
    }
    
    init() {
        this.schedulePeriodicChecks();
        this.checkCriticalAlerts();
    }
    
    schedulePeriodicChecks() {
        // Check every hour for critical alerts
        setInterval(() => this.checkCriticalAlerts(), 3600000);
        
        // Check twice daily for routine alerts
        setInterval(() => this.checkRoutineAlerts(), 43200000);
        
        // Daily summary at 8 AM
        this.scheduleDailyReport();
    }
    
    checkCriticalAlerts() {
        const alerts = [];
        
        // 1. Health Emergencies
        this.checkHealthEmergencies(alerts);
        
        // 2. Breeding Alerts
        this.checkBreedingAlerts(alerts);
        
        // 3. Feed Stock Alerts
        this.checkFeedStockAlerts(alerts);
        
        // 4. Vaccination Overdue
        this.checkVaccinationAlerts(alerts);
        
        // Send notifications for critical alerts
        alerts.forEach(alert => {
            if (alert.priority === 'critical') {
                this.sendImmediateNotification(alert);
            }
        });
        
        return alerts;
    }
    
    checkHealthEmergencies(alerts) {
        // Check for milk production drops
        appData.cows.forEach(cow => {
            const recentProduction = appData.milkProduction
                .filter(m => m.cowId === cow.id && this.isRecentDate(m.date, 3))
                .reduce((sum, m) => sum + m.yield, 0);
                
            const previousProduction = appData.milkProduction
                .filter(m => m.cowId === cow.id && this.isPreviousPeriod(m.date, 3, 6))
                .reduce((sum, m) => sum + m.yield, 0);
                
            if (recentProduction < previousProduction * 0.7 && previousProduction > 0) {
                alerts.push({
                    type: 'health',
                    priority: 'critical',
                    title: 'Milk Production Drop Alert',
                    message: `Cow #${cow.number} milk production dropped by ${((1 - recentProduction/previousProduction) * 100).toFixed(1)}%`,
                    cowId: cow.id,
                    action: 'health_check'
                });
            }
        });
    }
    
    checkBreedingAlerts(alerts) {
        appData.breeding.forEach(record => {
            const cow = appData.cows.find(c => c.id === record.cowId);
            
            // PD overdue alerts
            if (!record.pdResult && this.getDaysUntil(record.pdDue) < -7) {
                alerts.push({
                    type: 'breeding',
                    priority: 'high',
                    title: 'PD Check Overdue',
                    message: `Cow #${cow?.number} PD check is ${Math.abs(this.getDaysUntil(record.pdDue))} days overdue`,
                    cowId: record.cowId,
                    action: 'schedule_pd'
                });
            }
            
            // Expected delivery alerts
            if (record.pdResult === 'Positive' && this.getDaysUntil(record.expectedDelivery) <= 1) {
                alerts.push({
                    type: 'breeding',
                    priority: 'critical',
                    title: 'Calving Expected',
                    message: `Cow #${cow?.number} expected to calve ${this.getDaysUntil(record.expectedDelivery) === 0 ? 'today' : 'tomorrow'}`,
                    cowId: record.cowId,
                    action: 'monitor_calving'
                });
            }
        });
    }
    
    checkFeedStockAlerts(alerts) {
        const feedItems = ['Concentrate', 'Wheat Bran', 'Cotton Seed', 'Maize', 'Hay', 'Silage', 'Mineral Mix'];
        
        feedItems.forEach(item => {
            const stock = calculateCurrentStock(item);
            const minLevel = getMinStockLevel(item);
            const dailyUsage = getDailyUsage(item);
            const daysRemaining = stock / dailyUsage;
            
            if (stock < minLevel) {
                alerts.push({
                    type: 'feed',
                    priority: 'high',
                    title: 'Low Stock Alert',
                    message: `${item} stock is below minimum level. Only ${daysRemaining.toFixed(0)} days remaining.`,
                    action: 'order_feed',
                    item: item
                });
            }
        });
    }
    
    checkVaccinationAlerts(alerts) {
        const upcomingVaccinations = this.getUpcomingVaccinations(7);
        
        upcomingVaccinations.forEach(vaccination => {
            const cow = appData.cows.find(c => c.id === vaccination.cowId);
            alerts.push({
                type: 'vaccination',
                priority: 'medium',
                title: 'Vaccination Due',
                message: `Cow #${cow?.number} due for ${vaccination.type} in ${this.getDaysUntil(vaccination.nextDue)} days`,
                cowId: vaccination.cowId,
                action: 'schedule_vaccination'
            });
        });
    }
    
    getUpcomingVaccinations(days) {
        return appData.vaccinations.filter(v => {
            const daysUntil = this.getDaysUntil(v.nextDue);
            return daysUntil >= 0 && daysUntil <= days;
        });
    }
    
    sendImmediateNotification(alert) {
        // Browser notification
        sendNotification(alert.title, alert.message, {
            tag: alert.type,
            requireInteraction: true
        });
        
        // Add to notification log
        this.logNotification(alert);
    }
    
    logNotification(alert) {
        const notification = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            type: alert.type,
            title: alert.title,
            message: alert.message,
            priority: alert.priority,
            status: 'Unread'
        };
        
        appData.notifications.push(notification);
        saveData();
        updateDashboard();
    }
    
    scheduleDailyReport() {
        const now = new Date();
        const eightAM = new Date();
        eightAM.setHours(8, 0, 0, 0);
        
        if (now > eightAM) {
            eightAM.setDate(eightAM.getDate() + 1);
        }
        
        const timeUntilEightAM = eightAM - now;
        
        setTimeout(() => {
            this.sendDailySummary();
            // Schedule for next day
            setInterval(() => this.sendDailySummary(), 86400000);
        }, timeUntilEightAM);
    }
    
    sendDailySummary() {
        const today = new Date().toISOString().split('T')[0];
        const todayMilk = appData.milkProduction
            .filter(m => m.date === today)
            .reduce((sum, m) => sum + m.yield, 0);
        
        const milkingCows = appData.cows.filter(c => c.status === 'Milking').length;
        const avgPerCow = milkingCows > 0 ? (todayMilk / milkingCows).toFixed(1) : 0;
        
        const summary = `Daily Summary:
🥛 Total Milk: ${todayMilk.toFixed(1)}L
📊 Average per Cow: ${avgPerCow}L
🐄 Milking Cows: ${milkingCows}
💰 Estimated Revenue: ₹${(todayMilk * 25).toFixed(0)}`;
        
        sendNotification('Daily Farm Summary', summary);
    }
    
    checkRoutineAlerts() {
        // Check for routine maintenance alerts
        const alerts = [];
        
        // Check for cows due for weight measurement
        appData.cows.forEach(cow => {
            const lastWeightUpdate = '2024-01-01'; // Placeholder
            if (this.getDaysUntil(lastWeightUpdate) < -30) {
                alerts.push({
                    type: 'maintenance',
                    priority: 'low',
                    title: 'Weight Measurement Due',
                    message: `Cow #${cow.number} due for weight measurement`,
                    action: 'measure_weight'
                });
            }
        });
        
        return alerts;
    }
    
    // Utility methods
    isRecentDate(dateStr, days) {
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = today - date;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
    }
    
    isPreviousPeriod(dateStr, startDays, endDays) {
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = today - date;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= startDays && diffDays <= endDays;
    }
    
    getDaysUntil(dateStr) {
        const target = new Date(dateStr);
        const today = new Date();
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Initialize the notification system
let notificationSystem;

// Simple alert check function
function checkAlerts() {
    const alerts = [];
    const today = new Date();
    
    // Check for overdue vaccinations
    appData.vaccinations.forEach(v => {
        const dueDate = new Date(v.nextDue);
        if (dueDate < today) {
            alerts.push(`Vaccination overdue: ${v.type}`);
        }
    });
    
    // Check for PD overdue
    appData.breeding.forEach(b => {
        const pdDue = new Date(b.pdDue);
        if (pdDue < today && !b.pdResult) {
            alerts.push(`PD check overdue for cow ${b.cowId}`);
        }
    });
    
    // Update alert count
    document.getElementById('alertCount').textContent = alerts.length;
    
    return alerts;
}

// Update dashboard alerts
function updateDashboardAlerts() {
    const alertContainer = document.getElementById('dashboardAlerts');
    if (!alertContainer) return;
    
    const alerts = checkAlerts();
    
    if (alerts.length > 0) {
        alertContainer.innerHTML = `
            <div class="alert alert-warning">
                <strong>⚠️ Alerts:</strong> ${alerts.join(', ')}
            </div>
        `;
    } else {
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                <strong>✅ All Good:</strong> No pending alerts
            </div>
        `;
    }
}

// Initialize notifications
function initializeNotifications() {
    // Request permission for notifications
    requestNotificationPermission();
    
    // Initialize notification system
    notificationSystem = new DairyNotificationSystem();
    
    // Run initial alert check
    setTimeout(checkAlerts, 1000);
    
    // Update dashboard alerts
    updateDashboardAlerts();
    
    // Check alerts every hour
    setInterval(() => {
        checkAlerts();
        updateDashboardAlerts();
    }, 3600000);
}