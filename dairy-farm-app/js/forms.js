// js/forms.js - Form Handling

// Form submission handlers
function initializeForms() {
    // Cow form handler
    document.getElementById('cowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cowData = {
            id: 'COW' + String(appData.cows.length + 1).padStart(3, '0'),
            number: document.getElementById('cowNumber').value,
            breed: document.getElementById('cowBreed').value,
            dob: document.getElementById('cowDob').value,
            arrival: document.getElementById('cowArrival').value,
            weight: parseFloat(document.getElementById('cowWeight').value) || 0,
            bcs: parseInt(document.getElementById('cowBcs').value) || 3,
            status: 'Active'
        };
        
        appData.cows.push(cowData);
        saveData();
        this.reset();
        updateCowList();
        populateDropdowns();
        showAlert('success', 'Cow added successfully!');
    });

    // Milk production form handler
    document.getElementById('milkForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const milkData = {
            id: Date.now(),
            date: document.getElementById('milkDate').value,
            cowId: document.getElementById('milkCowId').value,
            session: document.getElementById('milkSession').value,
            yield: parseFloat(document.getElementById('milkYield').value),
            fat: parseFloat(document.getElementById('milkFat').value) || 0,
            snf: parseFloat(document.getElementById('milkSnf').value) || 0,
            remarks: document.getElementById('milkRemarks').value
        };
        
        appData.milkProduction.push(milkData);
        saveData();
        this.reset();
        updateMilkRecords();
        updateDashboard();
        showAlert('success', 'Milk production recorded!');
    });

    // Breeding form handler
    document.getElementById('breedingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const breedingData = {
            id: Date.now(),
            cowId: document.getElementById('breedingCowId').value,
            aiDate: document.getElementById('aiDate').value,
            semenId: document.getElementById('semenId').value,
            technician: document.getElementById('technician').value,
            heatMethod: document.getElementById('heatMethod').value,
            serviceNumber: appData.breeding.filter(b => b.cowId === document.getElementById('breedingCowId').value).length + 1,
            pdDue: addDays(document.getElementById('aiDate').value, 60),
            pdResult: '',
            expectedDelivery: addDays(document.getElementById('aiDate').value, 280)
        };
        
        appData.breeding.push(breedingData);
        saveData();
        this.reset();
        updateBreedingRecords();
        showAlert('success', 'AI service recorded!');
    });

    // Vaccination form handler
    document.getElementById('vaccinationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const vaccineData = {
            id: Date.now(),
            cowId: document.getElementById('vaccineCowId').value,
            type: document.getElementById('vaccineType').value,
            date: document.getElementById('vaccineDate').value,
            batch: document.getElementById('vaccineBatch').value,
            veterinarian: document.getElementById('veterinarian').value,
            cost: parseFloat(document.getElementById('vaccineCost').value) || 0,
            nextDue: calculateNextVaccination(document.getElementById('vaccineType').value, document.getElementById('vaccineDate').value)
        };
        
        appData.vaccinations.push(vaccineData);
        saveData();
        this.reset();
        updateVaccinationRecords();
        showAlert('success', 'Vaccination recorded!');
    });

    // Feed form handler
    document.getElementById('feedForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const feedData = {
            id: Date.now(),
            date: document.getElementById('feedDate').value,
            item: document.getElementById('feedItem').value,
            transaction: document.getElementById('feedTransaction').value,
            quantity: parseFloat(document.getElementById('feedQuantity').value),
            rate: parseFloat(document.getElementById('feedRate').value) || 0,
            notes: document.getElementById('feedNotes').value
        };
        
        appData.feedTransactions.push(feedData);
        saveData();
        this.reset();
        updateStockLevels();
        showAlert('success', 'Feed transaction recorded!');
    });

    // Calf form handler
    document.getElementById('calfForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const calfData = {
            id: Date.now(),
            number: document.getElementById('calfNumber').value || 'Male-' + Date.now(),
            gender: document.getElementById('calfGender').value,
            birth: document.getElementById('calfBirth').value,
            mother: document.getElementById('calfMother').value,
            weight: parseFloat(document.getElementById('calfWeight').value) || 0,
            breed: document.getElementById('calfBreed').value
        };
        
        appData.calves.push(calfData);
        saveData();
        this.reset();
        updateCalfRecords();
        showAlert('success', 'Calf registered successfully!');
    });

    // Sales form handler
    document.getElementById('salesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const salesData = {
            id: Date.now(),
            date: document.getElementById('saleDate').value,
            farmerId: document.getElementById('farmerCode').value,
            session: document.getElementById('saleSession').value,
            quantity: parseFloat(document.getElementById('saleQuantity').value),
            fat: parseFloat(document.getElementById('saleFat').value),
            snf: parseFloat(document.getElementById('saleSnf').value),
            rate: parseFloat(document.getElementById('saleRate').value),
            amount: parseFloat(document.getElementById('saleQuantity').value) * parseFloat(document.getElementById('saleRate').value)
        };
        
        appData.sales.push(salesData);
        saveData();
        this.reset();
        updateSalesRecords();
        showAlert('success', 'Sale recorded successfully!');
    });
}

// Update functions for displaying data
function updateCowList() {
    const cowList = document.getElementById('cowList');
    if (!cowList) return;
    
    cowList.innerHTML = '';
    appData.cows.forEach(cow => {
        const age = calculateAge(cow.dob);
        const cowCard = document.createElement('div');
        cowCard.className = 'cow-card';
        cowCard.innerHTML = `
            <div class="cow-header">
                <div class="cow-number">Cow #${cow.number}</div>
                <div class="cow-status status-${cow.status.toLowerCase()}">${cow.status}</div>
            </div>
            <div class="cow-details">
                <div class="detail-item">
                    <div class="detail-value">${cow.breed}</div>
                    <div class="detail-label">Breed</div>
                </div>
                <div class="detail-item">
                    <div class="detail-value">${age} months</div>
                    <div class="detail-label">Age</div>
                </div>
                <div class="detail-item">
                    <div class="detail-value">${cow.weight}kg</div>
                    <div class="detail-label">Weight</div>
                </div>
                <div class="detail-item">
                    <div class="detail-value">BCS ${cow.bcs}</div>
                    <div class="detail-label">Body Condition</div>
                </div>
            </div>
        `;
        cowList.appendChild(cowCard);
    });
}

function updateMilkRecords() {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = appData.milkProduction.filter(m => m.date === today);
    const tbody = document.getElementById('milkRecords');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    todayRecords.forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const dailyTotal = appData.milkProduction
            .filter(m => m.date === record.date && m.cowId === record.cowId)
            .reduce((sum, m) => sum + m.yield, 0);
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${record.session}</td>
                <td>${record.yield.toFixed(1)}</td>
                <td>${record.fat.toFixed(1)}</td>
                <td>${record.snf.toFixed(1)}</td>
                <td>${dailyTotal.toFixed(1)}</td>
                <td>${record.remarks}</td>
            </tr>
        `;
    });
}

function updateBreedingRecords() {
    const tbody = document.getElementById('breedingRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.breeding.slice(-10).reverse().forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const pdStatus = record.pdResult || 'Pending';
        const statusClass = pdStatus === 'Positive' ? 'status-pregnant' : 
                          pdStatus === 'Negative' ? 'status-open' : 'status-pending';
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${formatDate(record.aiDate)}</td>
                <td>${record.serviceNumber}</td>
                <td>${formatDate(record.pdDue)}</td>
                <td><span class="cow-status ${statusClass}">${pdStatus}</span></td>
                <td>${record.expectedDelivery ? formatDate(record.expectedDelivery) : '-'}</td>
                <td>${getBreedingStatus(record)}</td>
            </tr>
        `;
    });
}

function updateVaccinationRecords() {
    const tbody = document.getElementById('vaccinationRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.vaccinations.slice(-10).reverse().forEach(record => {
        const cow = appData.cows.find(c => c.id === record.cowId);
        const daysUntilDue = getDaysUntil(record.nextDue);
        const status = daysUntilDue < 0 ? 'Overdue' : 
                      daysUntilDue < 7 ? 'Due Soon' : 'Current';
        const statusClass = status === 'Overdue' ? 'status-danger' : 
                           status === 'Due Soon' ? 'status-warning' : 'status-success';
        
        tbody.innerHTML += `
            <tr>
                <td>${cow ? cow.number : 'Unknown'}</td>
                <td>${record.type}</td>
                <td>${formatDate(record.date)}</td>
                <td>${formatDate(record.nextDue)}</td>
                <td><span class="cow-status ${statusClass}">${status}</span></td>
                <td>₹${record.cost.toFixed(2)}</td>
            </tr>
        `;
    });
}

function updateStockLevels() {
    const tbody = document.getElementById('stockLevels');
    if (!tbody) return;
    
    // Calculate current stock levels
    const stockLevels = {};
    const feedItems = ['Concentrate', 'Wheat Bran', 'Cotton Seed', 'Maize', 'Hay', 'Silage', 'Mineral Mix'];
    
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
        const status = data.current < data.minLevel ? 'Low Stock' : 
                      data.daysRemaining < 7 ? 'Order Soon' : 'Good';
        const statusClass = status === 'Low Stock' ? 'status-danger' : 
                           status === 'Order Soon' ? 'status-warning' : 'status-success';
        
        tbody.innerHTML += `
            <tr>
                <td>${item}</td>
                <td>${data.current.toFixed(1)}</td>
                <td>${data.minLevel}</td>
                <td>${data.dailyUsage.toFixed(1)}</td>
                <td>${data.daysRemaining.toFixed(0)}</td>
                <td><span class="cow-status ${statusClass}">${status}</span></td>
            </tr>
        `;
    });
}

function updateCalfRecords() {
    const tbody = document.getElementById('calfRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.calves.forEach(calf => {
        const mother = appData.cows.find(c => c.id === calf.mother);
        const age = getDaysUntil(calf.birth) * -1; // Negative because birth is in past
        
        tbody.innerHTML += `
            <tr>
                <td>${calf.number}</td>
                <td>${calf.gender}</td>
                <td>${formatDate(calf.birth)}</td>
                <td>${age} days</td>
                <td>${mother ? mother.number : 'Unknown'}</td>
                <td>${calf.weight}kg</td>
                <td>-</td>
                <td>Active</td>
            </tr>
        `;
    });
}

function updateSalesRecords() {
    const tbody = document.getElementById('salesRecords');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.sales.slice(-10).reverse().forEach(record => {
        const farmer = appData.farmers.find(f => f.id === record.farmerId);
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td>${farmer ? farmer.name : 'Unknown'}</td>
                <td>${record.session}</td>
                <td>${record.quantity.toFixed(1)}</td>
                <td>${record.fat.toFixed(1)}</td>
                <td>${record.snf.toFixed(1)}</td>
                <td>₹${record.rate.toFixed(2)}</td>
                <td>₹${record.amount.toFixed(2)}</td>
            </tr>
        `;
    });
}

function updateReportsData() {
    // Placeholder for reports data
    const container = document.getElementById('reportsContainer');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-info">
                <strong>Reports Coming Soon!</strong> Advanced reporting features will be available in the next update.
            </div>
        `;
    }
}

function updateAlertsData() {
    // Placeholder for alerts data
    const container = document.getElementById('alertsContainer');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-success">
                <strong>All systems operational!</strong> No critical alerts at this time.
            </div>
        `;
    }
}

// Generate reports
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const fromDate = document.getElementById('reportFromDate').value;
    const toDate = document.getElementById('reportToDate').value;
    
    showAlert('info', `Generating ${reportType} report from ${fromDate} to ${toDate}`);
}