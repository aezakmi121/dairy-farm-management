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
