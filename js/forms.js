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
                <div class="cow-actions">
                    <button class="btn-small btn-view" onclick="viewCow('${cow.id}')">👁️ View</button>
                    <button class="btn-small btn-edit" onclick="editCow('${cow.id}')">✏️ Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteCow('${cow.id}')">🗑️ Delete</button>
                </div>
            </div>
            <div class="cow-status-row">
                <div class="cow-status status-${cow.status.toLowerCase()}">${cow.status}</div>
                ${cow.image ? `<img src="${cow.image}" alt="Cow ${cow.number}" class="cow-thumbnail">` : '<div class="no-image">📷 No Image</div>'}
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
                <div class="detail-item">
                    <div class="detail-value">${getLastMilkDate(cow.id)}</div>
                    <div class="detail-label">Last Milked</div>
                </div>
                <div class="detail-item">
                    <div class="detail-value">${getLifetimeMilk(cow.id)}L</div>
                    <div class="detail-label">Lifetime Milk</div>
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


// Unique Number Validation & Image Handling - Add to forms.js

// Unique number validation for cows
function validateCowNumber(number, excludeId = null) {
    return !appData.cows.some(cow => cow.number === number && cow.id !== excludeId);
}

// Unique number validation for calves
function validateCalfNumber(number, excludeId = null) {
    // Check against both cows and calves
    const existsInCows = appData.cows.some(cow => cow.number === number && cow.id !== excludeId);
    const existsInCalves = appData.calves.some(calf => calf.number === number && calf.id !== excludeId);
    return !existsInCows && !existsInCalves;
}

// Real-time number validation
function setupNumberValidation() {
    const cowNumberInput = document.getElementById('cowNumber');
    if (cowNumberInput) {
        cowNumberInput.addEventListener('input', function() {
            const number = this.value.trim();
            const isValid = validateCowNumber(number);
            
            this.classList.toggle('invalid', !isValid && number !== '');
            
            // Show/hide validation message
            let validationMsg = this.parentNode.querySelector('.validation-message');
            if (!validationMsg) {
                validationMsg = document.createElement('div');
                validationMsg.className = 'validation-message';
                this.parentNode.appendChild(validationMsg);
            }
            
            if (!isValid && number !== '') {
                validationMsg.textContent = '❌ This cow number already exists!';
                validationMsg.className = 'validation-message error';
            } else if (number !== '') {
                validationMsg.textContent = '✅ Number is available';
                validationMsg.className = 'validation-message success';
            } else {
                validationMsg.textContent = '';
            }
        });
    }
    
    const calfNumberInput = document.getElementById('calfNumber');
    if (calfNumberInput) {
        calfNumberInput.addEventListener('input', function() {
            const number = this.value.trim();
            const isValid = validateCalfNumber(number);
            
            this.classList.toggle('invalid', !isValid && number !== '');
            
            let validationMsg = this.parentNode.querySelector('.validation-message');
            if (!validationMsg) {
                validationMsg = document.createElement('div');
                validationMsg.className = 'validation-message';
                this.parentNode.appendChild(validationMsg);
            }
            
            if (!isValid && number !== '') {
                validationMsg.textContent = '❌ This number already exists!';
                validationMsg.className = 'validation-message error';
            } else if (number !== '') {
                validationMsg.textContent = '✅ Number is available';
                validationMsg.className = 'validation-message success';
            } else {
                validationMsg.textContent = '';
            }
        });
    }
}

// Image handling functions
function setupImagePreview() {
    const cowImageInput = document.getElementById('cowImage');
    if (cowImageInput) {
        cowImageInput.addEventListener('change', function() {
            handleImagePreview(this, 'imagePreview');
        });
    }
    
    const calfImageInput = document.getElementById('calfImage');
    if (calfImageInput) {
        calfImageInput.addEventListener('change', function() {
            handleImagePreview(this, 'calfImagePreview');
        });
    }
}

function handleImagePreview(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file) {
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('danger', 'Image size must be less than 2MB');
            input.value = '';
            preview.innerHTML = '';
            return;
        }
        
        // Validate file type
        if (!file.type.match('image.*')) {
            showAlert('danger', 'Please select a valid image file');
            input.value = '';
            preview.innerHTML = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="image-preview-container">
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <button type="button" class="remove-image" onclick="removeImagePreview('${input.id}', '${previewId}')">×</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

function removeImagePreview(inputId, previewId) {
    document.getElementById(inputId).value = '';
    document.getElementById(previewId).innerHTML = '';
}

// Enhanced cow form submission with validation
function setupEnhancedCowForm() {
    document.getElementById('cowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cowNumber = document.getElementById('cowNumber').value.trim();
        
        // Validate unique number
        if (!validateCowNumber(cowNumber)) {
            showAlert('danger', 'Cow number already exists! Please choose a different number.');
            return;
        }
        
        const cowData = {
            id: 'COW' + String(Date.now()).slice(-6), // Use timestamp for unique ID
            number: cowNumber,
            breed: document.getElementById('cowBreed').value,
            dob: document.getElementById('cowDob').value,
            arrival: document.getElementById('cowArrival').value,
            weight: parseFloat(document.getElementById('cowWeight').value) || 0,
            bcs: parseInt(document.getElementById('cowBcs').value) || 3,
            status: 'Active',
            image: null,
            createdDate: new Date().toISOString()
        };
        
        // Handle image upload
        const imageFile = document.getElementById('cowImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                cowData.image = e.target.result;
                saveCowData(cowData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveCowData(cowData);
        }
    });
}

function saveCowData(cowData) {
    appData.cows.push(cowData);
    saveData();
    document.getElementById('cowForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    updateCowList();
    populateDropdowns();
    updateDashboard();
    showAlert('success', `Cow #${cowData.number} added successfully!`);
}

// Enhanced calf form submission with validation
function setupEnhancedCalfForm() {
    document.getElementById('calfForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const calfGender = document.getElementById('calfGender').value;
        const calfNumber = document.getElementById('calfNumber').value.trim();
        
        // Validate calf number for females
        if (calfGender === 'Female') {
            if (!calfNumber) {
                showAlert('danger', 'Calf number is required for female calves!');
                return;
            }
            
            if (!validateCalfNumber(calfNumber)) {
                showAlert('danger', 'Calf number already exists! Please choose a different number.');
                return;
            }
        }
        
        const calfData = {
            id: 'CALF' + String(Date.now()).slice(-6),
            number: calfGender === 'Female' ? calfNumber : `Male-${Date.now()}`,
            gender: calfGender,
            birth: document.getElementById('calfBirth').value,
            mother: document.getElementById('calfMother').value,
            weight: parseFloat(document.getElementById('calfWeight').value) || 0,
            breed: document.getElementById('calfBreed').value,
            image: null,
            status: 'Active',
            createdDate: new Date().toISOString()
        };
        
        // Handle image upload
        const imageFile = document.getElementById('calfImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                calfData.image = e.target.result;
                saveCalfData(calfData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveCalfData(calfData);
        }
    });
}

function saveCalfData(calfData) {
    appData.calves.push(calfData);
    saveData();
    document.getElementById('calfForm').reset();
    document.getElementById('calfImagePreview').innerHTML = '';
    // Reset calf number field to disabled
    document.getElementById('calfNumber').disabled = true;
    updateCalfRecords();
    showAlert('success', `Calf #${calfData.number} registered successfully!`);
}

// Show existing numbers for reference
function showExistingNumbers() {
    const existingCowNumbers = appData.cows.map(cow => cow.number).sort((a, b) => {
        // Sort numerically if possible, otherwise alphabetically
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        return a.localeCompare(b);
    });
    
    const existingCalfNumbers = appData.calves
        .filter(calf => calf.gender === 'Female')
        .map(calf => calf.number)
        .sort((a, b) => {
            const aNum = parseInt(a);
            const bNum = parseInt(b);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            return a.localeCompare(b);
        });
    
    // Create reference panel
    const referencePanel = document.createElement('div');
    referencePanel.className = 'number-reference-panel';
    referencePanel.innerHTML = `
        <div class="reference-section">
            <h4>Existing Cow Numbers:</h4>
            <div class="number-list">
                ${existingCowNumbers.length > 0 ? existingCowNumbers.join(', ') : 'None yet'}
            </div>
        </div>
        <div class="reference-section">
            <h4>Existing Female Calf Numbers:</h4>
            <div class="number-list">
                ${existingCalfNumbers.length > 0 ? existingCalfNumbers.join(', ') : 'None yet'}
            </div>
        </div>
        <div class="reference-section">
            <h4>💡 Numbering Tips:</h4>
            <ul>
                <li>Use sequential numbers (101, 102, 103...)</li>
                <li>Or use year-based (2024001, 2024002...)</li>
                <li>Keep it simple and consistent</li>
                <li>Female calves become cows when they start producing milk</li>
            </ul>
        </div>
    `;
    
    return referencePanel;
}

// Add reference panel to forms
function addNumberReferenceToForms() {
    const cowForm = document.getElementById('cowForm');
    const calfForm = document.getElementById('calfForm');
    
    if (cowForm && !document.querySelector('.cow-number-reference')) {
        const referencePanel = showExistingNumbers();
        referencePanel.classList.add('cow-number-reference');
        cowForm.parentNode.appendChild(referencePanel);
    }
    
    if (calfForm && !document.querySelector('.calf-number-reference')) {
        const referencePanel = showExistingNumbers();
        referencePanel.classList.add('calf-number-reference');
        calfForm.parentNode.appendChild(referencePanel);
    }
}

// Suggest next available number
function suggestNextNumber() {
    const existingNumbers = appData.cows.map(cow => parseInt(cow.number)).filter(num => !isNaN(num));
    if (existingNumbers.length === 0) return '101';
    
    const maxNumber = Math.max(...existingNumbers);
    return String(maxNumber + 1);
}

// Add suggestion button
function addNumberSuggestion() {
    const cowNumberInput = document.getElementById('cowNumber');
    if (cowNumberInput && !cowNumberInput.parentNode.querySelector('.suggest-number')) {
        const suggestBtn = document.createElement('button');
        suggestBtn.type = 'button';
        suggestBtn.className = 'btn-small suggest-number';
        suggestBtn.textContent = '💡 Suggest Number';
        suggestBtn.onclick = function() {
            cowNumberInput.value = suggestNextNumber();
            cowNumberInput.dispatchEvent(new Event('input')); // Trigger validation
        };
        cowNumberInput.parentNode.appendChild(suggestBtn);
    }
}
function viewCow(cowId) {
    const cow = appData.cows.find(c => c.id === cowId);
    if (!cow) return;
    
    const age = calculateAge(cow.dob);
    const lifetimeMilk = getLifetimeMilk(cowId);
    const lastMilkDate = getLastMilkDate(cowId);
    const avgDailyMilk = getAverageDailyMilk(cowId);
    
    const modalContent = `
        <div class="cow-detail-view">
            <div class="cow-image-section">
                ${cow.image ? `<img src="${cow.image}" alt="Cow ${cow.number}" class="cow-detail-image">` : '<div class="no-image-large">📷 No Image</div>'}
            </div>
            <div class="cow-info-section">
                <h3>Cow #${cow.number} - ${cow.breed}</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Status:</strong> 
                        <span class="cow-status status-${cow.status.toLowerCase()}">${cow.status}</span>
                    </div>
                    <div class="info-item">
                        <strong>Age:</strong> ${age} months
                    </div>
                    <div class="info-item">
                        <strong>Weight:</strong> ${cow.weight}kg
                    </div>
                    <div class="info-item">
                        <strong>Body Condition:</strong> ${cow.bcs}/5
                    </div>
                    <div class="info-item">
                        <strong>Date of Birth:</strong> ${formatDate(cow.dob)}
                    </div>
                    <div class="info-item">
                        <strong>Arrival Date:</strong> ${formatDate(cow.arrival)}
                    </div>
                    <div class="info-item">
                        <strong>Lifetime Milk:</strong> ${lifetimeMilk}L
                    </div>
                    <div class="info-item">
                        <strong>Average Daily:</strong> ${avgDailyMilk}L
                    </div>
                    <div class="info-item">
                        <strong>Last Milked:</strong> ${lastMilkDate}
                    </div>
                    <div class="info-item">
                        <strong>Days in Milk:</strong> ${getDaysInMilk(cowId)} days
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(`Cow Details - #${cow.number}`, modalContent);
}

function editCow(cowId) {
    const cow = appData.cows.find(c => c.id === cowId);
    if (!cow) return;
    
    const modalContent = `
        <form id="editCowForm">
            <div class="form-grid">
                <div class="form-group">
                    <label>Cow Number</label>
                    <input type="text" id="editCowNumber" value="${cow.number}" required>
                </div>
                <div class="form-group">
                    <label>Breed</label>
                    <select id="editCowBreed" required>
                        <option value="Holstein" ${cow.breed === 'Holstein' ? 'selected' : ''}>Holstein</option>
                        <option value="Jersey" ${cow.breed === 'Jersey' ? 'selected' : ''}>Jersey</option>
                        <option value="Crossbred" ${cow.breed === 'Crossbred' ? 'selected' : ''}>Crossbred</option>
                        <option value="Gir" ${cow.breed === 'Gir' ? 'selected' : ''}>Gir</option>
                        <option value="Sahiwal" ${cow.breed === 'Sahiwal' ? 'selected' : ''}>Sahiwal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" id="editCowDob" value="${cow.dob}" required>
                </div>
                <div class="form-group">
                    <label>Current Weight (kg)</label>
                    <input type="number" id="editCowWeight" value="${cow.weight}">
                </div>
                <div class="form-group">
                    <label>Body Condition Score (1-5)</label>
                    <select id="editCowBcs">
                        <option value="1" ${cow.bcs === 1 ? 'selected' : ''}>1 - Very Thin</option>
                        <option value="2" ${cow.bcs === 2 ? 'selected' : ''}>2 - Thin</option>
                        <option value="3" ${cow.bcs === 3 ? 'selected' : ''}>3 - Ideal</option>
                        <option value="4" ${cow.bcs === 4 ? 'selected' : ''}>4 - Fat</option>
                        <option value="5" ${cow.bcs === 5 ? 'selected' : ''}>5 - Very Fat</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editCowStatus" required>
                        <option value="Milking" ${cow.status === 'Milking' ? 'selected' : ''}>Milking</option>
                        <option value="Dry" ${cow.status === 'Dry' ? 'selected' : ''}>Dry</option>
                        <option value="Pregnant" ${cow.status === 'Pregnant' ? 'selected' : ''}>Pregnant</option>
                        <option value="Sick" ${cow.status === 'Sick' ? 'selected' : ''}>Sick</option>
                        <option value="Sold" ${cow.status === 'Sold' ? 'selected' : ''}>Sold</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Cow Image</label>
                    <input type="file" id="editCowImage" accept="image/*">
                    ${cow.image ? `<img src="${cow.image}" alt="Current" class="current-image">` : ''}
                </div>
            </div>
            <button type="submit" class="btn btn-success">Update Cow</button>
            <button type="button" class="btn" onclick="closeModal()">Cancel</button>
        </form>
    `;
    
    showModal(`Edit Cow #${cow.number}`, modalContent);
    
    // Handle form submission
    document.getElementById('editCowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newNumber = document.getElementById('editCowNumber').value;
        
        // Check if number is unique (excluding current cow)
        if (newNumber !== cow.number && appData.cows.some(c => c.number === newNumber)) {
            showAlert('danger', 'Cow number already exists!');
            return;
        }
        
        // Update cow data
        cow.number = newNumber;
        cow.breed = document.getElementById('editCowBreed').value;
        cow.dob = document.getElementById('editCowDob').value;
        cow.weight = parseFloat(document.getElementById('editCowWeight').value) || 0;
        cow.bcs = parseInt(document.getElementById('editCowBcs').value);
        cow.status = document.getElementById('editCowStatus').value;
        
        // Handle image upload
        const imageFile = document.getElementById('editCowImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                cow.image = e.target.result;
                saveData();
                updateCowList();
                populateDropdowns();
                showAlert('success', 'Cow updated successfully!');
                closeModal();
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveData();
            updateCowList();
            populateDropdowns();
            showAlert('success', 'Cow updated successfully!');
            closeModal();
        }
    });
}

function deleteCow(cowId) {
    const cow = appData.cows.find(c => c.id === cowId);
    if (!cow) return;
    
    if (confirm(`Are you sure you want to delete Cow #${cow.number}? This action cannot be undone.`)) {
        // Remove cow from array
        appData.cows = appData.cows.filter(c => c.id !== cowId);
        
        // Also remove related data
        appData.milkProduction = appData.milkProduction.filter(m => m.cowId !== cowId);
        appData.breeding = appData.breeding.filter(b => b.cowId !== cowId);
        appData.vaccinations = appData.vaccinations.filter(v => v.cowId !== cowId);
        
        saveData();
        updateCowList();
        updateDashboard();
        populateDropdowns();
        showAlert('success', 'Cow deleted successfully!');
    }
}

// Helper functions
function getLastMilkDate(cowId) {
    const milkRecords = appData.milkProduction.filter(m => m.cowId === cowId);
    if (milkRecords.length === 0) return 'Never';
    
    const lastRecord = milkRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return formatDate(lastRecord.date);
}

function getLifetimeMilk(cowId) {
    return appData.milkProduction
        .filter(m => m.cowId === cowId)
        .reduce((sum, m) => sum + m.yield, 0)
        .toFixed(1);
}

function getAverageDailyMilk(cowId) {
    const milkRecords = appData.milkProduction.filter(m => m.cowId === cowId);
    if (milkRecords.length === 0) return '0.0';
    
    const dailyTotals = {};
    milkRecords.forEach(record => {
        if (!dailyTotals[record.date]) {
            dailyTotals[record.date] = 0;
        }
        dailyTotals[record.date] += record.yield;
    });
    
    const totalDays = Object.keys(dailyTotals).length;
    const totalMilk = Object.values(dailyTotals).reduce((sum, daily) => sum + daily, 0);
    
    return totalDays > 0 ? (totalMilk / totalDays).toFixed(1) : '0.0';
}

function getDaysInMilk(cowId) {
    const lastCalvingDate = getLastCalvingDate(cowId);
    if (!lastCalvingDate) return 0;
    
    const today = new Date();
    const calving = new Date(lastCalvingDate);
    const diffTime = today - calving;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getLastCalvingDate(cowId) {
    const calvingRecords = appData.breeding.filter(b => b.cowId === cowId && b.actualDelivery);
    if (calvingRecords.length === 0) return null;
    
    return calvingRecords.sort((a, b) => new Date(b.actualDelivery) - new Date(a.actualDelivery))[0].actualDelivery;
}
// Enhanced Search & Filter Functions - Add to forms.js

// Advanced search functionality for cows
function setupAdvancedSearch() {
    const cowSearch = document.getElementById('cowSearch');
    if (cowSearch) {
        cowSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchCows(searchTerm);
        });
    }
}

function searchCows(searchTerm) {
    const cowCards = document.querySelectorAll('.cow-card');
    let visibleCount = 0;
    
    cowCards.forEach(card => {
        const cowNumber = card.querySelector('.cow-number').textContent.toLowerCase();
        const cowBreed = card.querySelector('.detail-value').textContent.toLowerCase();
        const cowStatus = card.querySelector('.cow-status').textContent.toLowerCase();
        const cowAge = card.textContent.toLowerCase();
        
        // Search in multiple fields
        const isVisible = cowNumber.includes(searchTerm) || 
                         cowBreed.includes(searchTerm) || 
                         cowStatus.includes(searchTerm) || 
                         cowAge.includes(searchTerm);
        
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    // Show search results count
    updateSearchCount(visibleCount);
}

function updateSearchCount(count) {
    let searchInfo = document.getElementById('searchInfo');
    if (!searchInfo) {
        searchInfo = document.createElement('div');
        searchInfo.id = 'searchInfo';
        searchInfo.className = 'search-info';
        document.getElementById('cowList').parentNode.insertBefore(searchInfo, document.getElementById('cowList'));
    }
    
    if (document.getElementById('cowSearch').value) {
        searchInfo.innerHTML = `<small>Showing ${count} cow(s) matching your search</small>`;
        searchInfo.style.display = 'block';
    } else {
        searchInfo.style.display = 'none';
    }
}

// Filter functions
function createFilterButtons() {
    const tableHeader = document.querySelector('.table-header');
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
        <div class="filter-buttons">
            <button class="filter-btn active" onclick="filterCows('all')">All</button>
            <button class="filter-btn" onclick="filterCows('milking')">Milking</button>
            <button class="filter-btn" onclick="filterCows('dry')">Dry</button>
            <button class="filter-btn" onclick="filterCows('pregnant')">Pregnant</button>
            <button class="filter-btn" onclick="filterCows('sick')">Sick</button>
        </div>
    `;
    tableHeader.appendChild(filterContainer);
}

function filterCows(status) {
    const cowCards = document.querySelectorAll('.cow-card');
    let visibleCount = 0;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cowCards.forEach(card => {
        const cowStatus = card.querySelector('.cow-status').textContent.toLowerCase();
        const isVisible = status === 'all' || cowStatus.includes(status);
        
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    updateSearchCount(visibleCount);
}
