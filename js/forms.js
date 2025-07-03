// js/forms.js - Enhanced Form Handling with All Missing Functions

// Form submission handlers
function initializeForms() {
    // Cow form handler
    const cowForm = document.getElementById('cowForm');
    if (cowForm) {
        cowForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cowNumber = document.getElementById('cowNumber').value.trim();
            
            // Validate unique number
            if (!validateCowNumber(cowNumber)) {
                showAlert('danger', 'Cow number already exists! Please choose a different number.');
                return;
            }
            
            const cowData = {
                id: 'COW' + String(Date.now()).slice(-6),
                number: cowNumber,
                breed: document.getElementById('cowBreed').value,
                dob: document.getElementById('cowDob').value,
                arrival: document.getElementById('cowArrival').value,
                weight: parseFloat(document.getElementById('cowWeight').value) || 0,
                bcs: parseInt(document.getElementById('cowBcs').value) || 3,
                status: 'Active',
                notes: document.getElementById('cowNotes')?.value || '',
                createdDate: new Date().toISOString()
            };
            
            // Handle image upload
            const imageFile = document.getElementById('cowImage')?.files[0];
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

    // Milk production form handler
    const milkForm = document.getElementById('milkForm');
    if (milkForm) {
        milkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const milkData = {
                id: Date.now(),
                date: document.getElementById('milkDate').value,
                cowId: document.getElementById('milkCowId').value,
                session: document.getElementById('milkSession').value,
                yield: parseFloat(document.getElementById('milkYield').value),
                fat: parseFloat(document.getElementById('milkFat').value) || 0,
                snf: parseFloat(document.getElementById('milkSnf').value) || 0,
                scc: parseInt(document.getElementById('milkScc').value) || 0,
                remarks: document.getElementById('milkRemarks').value
            };
            
            appData.milkProduction.push(milkData);
            saveData();
            this.reset();
            updateMilkRecords();
            updateDashboard();
            showAlert('success', 'Milk production recorded!');
        });
    }

    // Breeding form handler
    const breedingForm = document.getElementById('breedingForm');
    if (breedingForm) {
        breedingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cowId = document.getElementById('breedingCowId').value;
            const breedingData = {
                id: Date.now(),
                cowId: cowId,
                aiDate: document.getElementById('aiDate').value,
                semenId: document.getElementById('semenId').value,
                technician: document.getElementById('technician').value,
                heatMethod: document.getElementById('heatMethod').value,
                serviceType: document.getElementById('serviceType').value,
                cost: parseFloat(document.getElementById('aiCost').value) || 0,
                serviceNumber: appData.breeding.filter(b => b.cowId === cowId).length + 1,
                pdDue: addDays(document.getElementById('aiDate').value, 60),
                pdResult: '',
                expectedDelivery: addDays(document.getElementById('aiDate').value, 280),
                notes: document.getElementById('breedingNotes').value
            };
            
            appData.breeding.push(breedingData);
            saveData();
            this.reset();
            updateBreedingRecords();
            populatePDDropdown();
            showAlert('success', 'AI service recorded!');
        });
    }

    // PD form handler (Missing form - now implemented)
    const pdForm = document.getElementById('pdForm');
    if (pdForm) {
        pdForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recordId = document.getElementById('pdRecordId').value;
            const record = appData.breeding.find(b => b.id == recordId);
            
            if (record) {
                record.pdDate = document.getElementById('pdDate').value;
                record.pdResult = document.getElementById('pdResult').value;
                record.pdVet = document.getElementById('pdVet')?.value || '';
                record.pdMethod = document.getElementById('pdMethod')?.value || '';
                record.pdCost = parseFloat(document.getElementById('pdCost')?.value) || 0;
                
                // Update cow status based on PD result
                const cow = appData.cows.find(c => c.id === record.cowId);
                if (cow && record.pdResult === 'Positive') {
                    cow.status = 'Pregnant';
                } else if (cow && record.pdResult === 'Negative') {
                    cow.status = 'Open';
                }
                
                saveData();
                this.reset();
                updateBreedingRecords();
                updateCowList();
                updateDashboard();
                showAlert('success', 'PD result updated!');
            }
        });
    }

    // Vaccination form handler
    const vaccinationForm = document.getElementById('vaccinationForm');
    if (vaccinationForm) {
        vaccinationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const vaccineData = {
                id: Date.now(),
                cowId: document.getElementById('vaccineCowId').value,
                type: document.getElementById('vaccineType').value,
                date: document.getElementById('vaccineDate').value,
                batch: document.getElementById('vaccineBatch').value,
                veterinarian: document.getElementById('veterinarian').value,
                dosage: document.getElementById('vaccineDosage')?.value || '',
                cost: parseFloat(document.getElementById('vaccineCost').value) || 0,
                nextDue: calculateNextVaccination(document.getElementById('vaccineType').value, document.getElementById('vaccineDate').value),
                notes: document.getElementById('vaccineNotes').value
            };
            
            if (!appData.vaccinations) appData.vaccinations = [];
            appData.vaccinations.push(vaccineData);
            saveData();
            this.reset();
            updateVaccinationRecords();
            showAlert('success', 'Vaccination recorded!');
        });
    }

    // Feed form handler
    const feedForm = document.getElementById('feedForm');
    if (feedForm) {
        feedForm.addEventListener('submit', function(e) {
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
    }

    // Calf form handler
    const calfForm = document.getElementById('calfForm');
    if (calfForm) {
        calfForm.addEventListener('submit', function(e) {
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
                health: document.getElementById('calfHealth')?.value || 'Healthy',
                status: 'Active',
                notes: document.getElementById('calfNotes')?.value || '',
                createdDate: new Date().toISOString()
            };
            
            // Handle image upload
            const imageFile = document.getElementById('calfImage')?.files[0];
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

    // Sales form handler
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const quantity = parseFloat(document.getElementById('saleQuantity').value);
            const rate = parseFloat(document.getElementById('saleRate').value);
            
            const salesData = {
                id: Date.now(),
                date: document.getElementById('saleDate').value,
                farmerId: document.getElementById('farmerCode').value,
                session: document.getElementById('saleSession').value,
                quantity: quantity,
                fat: parseFloat(document.getElementById('saleFat').value) || 0,
                snf: parseFloat(document.getElementById('saleSnf').value) || 0,
                rate: rate,
                amount: quantity * rate,
                payment: document.getElementById('paymentMethod')?.value || 'Cash'
            };
            
            if (!appData.sales) appData.sales = [];
            appData.sales.push(salesData);
            saveData();
            this.reset();
            updateSalesRecords();
            showAlert('success', 'Sale recorded successfully!');
        });
    }

    // Farmer form handler (Missing form - now implemented)
    const farmerForm = document.getElementById('farmerForm');
    if (farmerForm) {
        farmerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const farmerData = {
                id: 'FARM' + String(Date.now()).slice(-6),
                code: 'F' + String(appData.farmers.length + 1).padStart(3, '0'),
                name: document.getElementById('farmerName').value,
                phone: document.getElementById('farmerPhone').value,
                address: document.getElementById('farmerAddress')?.value || '',
                rateType: document.getElementById('farmerRateType')?.value || 'Standard',
                customRate: parseFloat(document.getElementById('farmerCustomRate')?.value) || 0
            };
            
            if (!appData.farmers) appData.farmers = [];
            appData.farmers.push(farmerData);
            saveData();
            this.reset();
            populateDropdowns();
            showAlert('success', 'Farmer added successfully!');
        });
    }
}

// Missing function: suggestCowNumber (called from HTML)
function suggestCowNumber() {
    const nextNumber = suggestNextNumber();
    const cowNumberInput = document.getElementById('cowNumber');
    if (cowNumberInput) {
        cowNumberInput.value = nextNumber;
        cowNumberInput.dispatchEvent(new Event('input'));
    }
}

// Show existing numbers for reference
function showExistingNumbers() {
    const existingCowNumbers = appData.cows.map(cow => cow.number).sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        return a.localeCompare(b);
    });
    
    const existingCalfNumbers = (appData.calves || [])
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
    
    const modalContent = `
        <div class="number-reference-panel">
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
        </div>
    `;
    
    showModal('Existing Numbers Reference', modalContent);
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
                ${cow.image ? `<img src="${cow.image}" alt="Cow ${cow.number}" class="cow-thumbnail">` : '<div class="no-image">📷</div>'}
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

// Unique number validation for cows
function validateCowNumber(number, excludeId = null) {
    return !appData.cows.some(cow => cow.number === number && cow.id !== excludeId);
}

// Unique number validation for calves
function validateCalfNumber(number, excludeId = null) {
    const existsInCows = appData.cows.some(cow => cow.number === number && cow.id !== excludeId);
    const existsInCalves = (appData.calves || []).some(calf => calf.number === number && calf.id !== excludeId);
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
        if (file.size > 2 * 1024 * 1024) {
            showAlert('danger', 'Image size must be less than 2MB');
            input.value = '';
            if (preview) preview.innerHTML = '';
            return;
        }
        
        if (!file.type.match('image.*')) {
            showAlert('danger', 'Please select a valid image file');
            input.value = '';
            if (preview) preview.innerHTML = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            if (preview) {
                preview.innerHTML = `
                    <div class="image-preview-container">
                        <img src="${e.target.result}" alt="Preview" class="preview-image">
                        <button type="button" class="remove-image" onclick="removeImagePreview('${input.id}', '${previewId}')">×</button>
                    </div>
                `;
            }
        };
        reader.readAsDataURL(file);
    } else {
        if (preview) preview.innerHTML = '';
    }
}

function removeImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (input) input.value = '';
    if (preview) preview.innerHTML = '';
}

// Enhanced cow form submission with validation
function setupEnhancedCowForm() {
    // This is handled in initializeForms() now
    console.log('Enhanced cow form setup completed');
}

function saveCowData(cowData) {
    appData.cows.push(cowData);
    saveData();
    document.getElementById('cowForm').reset();
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    updateCowList();
    populateDropdowns();
    updateDashboard();
    showAlert('success', `Cow #${cowData.number} added successfully!`);
}

// Enhanced calf form submission with validation
function setupEnhancedCalfForm() {
    // This is handled in initializeForms() now
    console.log('Enhanced calf form setup completed');
}

function saveCalfData(calfData) {
    if (!appData.calves) appData.calves = [];
    appData.calves.push(calfData);
    saveData();
    document.getElementById('calfForm').reset();
    const imagePreview = document.getElementById('calfImagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    // Reset calf number field to disabled
    const calfNumberField = document.getElementById('calfNumber');
    if (calfNumberField) calfNumberField.disabled = true;
    updateCalfRecords();
    showAlert('success', `Calf #${calfData.number} registered successfully!`);
}

// Add reference panel to forms
function addNumberReferenceToForms() {
    const cowForm = document.getElementById('cowForm');
    const calfForm = document.getElementById('calfForm');
    
    if (cowForm && !document.querySelector('.cow-number-reference')) {
        const existingNumbers = appData.cows.map(cow => cow.number).sort().slice(0, 10);
        const referenceDiv = document.createElement('div');
        referenceDiv.className = 'cow-number-reference';
        referenceDiv.innerHTML = `
            <small><strong>Recent cow numbers:</strong> ${existingNumbers.join(', ') || 'None yet'}</small>
        `;
        cowForm.appendChild(referenceDiv);
    }
    
    if (calfForm && !document.querySelector('.calf-number-reference')) {
        const existingNumbers = (appData.calves || [])
            .filter(calf => calf.gender === 'Female')
            .map(calf => calf.number)
            .sort()
            .slice(0, 10);
        const referenceDiv = document.createElement('div');
        referenceDiv.className = 'calf-number-reference';
        referenceDiv.innerHTML = `
            <small><strong>Recent female calf numbers:</strong> ${existingNumbers.join(', ') || 'None yet'}</small>
        `;
        calfForm.appendChild(referenceDiv);
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
            cowNumberInput.dispatchEvent(new Event('input'));
        };
        cowNumberInput.parentNode.appendChild(suggestBtn);
    }
}

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
        const cowDetails = card.textContent.toLowerCase();
        
        const isVisible = cowDetails.includes(searchTerm);
        
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    updateSearchCount(visibleCount);
}

function updateSearchCount(count) {
    let searchInfo = document.getElementById('searchInfo');
    if (!searchInfo) {
        searchInfo = document.createElement('div');
        searchInfo.id = 'searchInfo';
        searchInfo.className = 'search-info';
        const cowList = document.getElementById('cowList');
        if (cowList) {
            cowList.parentNode.insertBefore(searchInfo, cowList);
        }
    }
    
    const searchBox = document.getElementById('cowSearch');
    if (searchBox && searchBox.value) {
        searchInfo.innerHTML = `<small>Showing ${count} cow(s) matching your search</small>`;
        searchInfo.style.display = 'block';
    } else {
        searchInfo.style.display = 'none';
    }
}

// Filter functions
function createFilterButtons() {
    const tableHeader = document.querySelector('#cows .table-header');
    if (tableHeader && !tableHeader.querySelector('.filter-container')) {
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
}

function filterCows(status) {
    const cowCards = document.querySelectorAll('.cow-card');
    let visibleCount = 0;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    cowCards.forEach(card => {
        const cowStatus = card.querySelector('.cow-status');
        const statusText = cowStatus ? cowStatus.textContent.toLowerCase() : '';
        const isVisible = status === 'all' || statusText.includes(status);
        
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    updateSearchCount(visibleCount);
}

// Populate PD dropdown with pending AI records
function populatePDDropdown() {
    const pdSelect = document.getElementById('pdRecordId');
    if (pdSelect) {
        pdSelect.innerHTML = '<option value="">Select AI Record for PD</option>';
        
        const pendingRecords = appData.breeding.filter(b => !b.pdResult);
        pendingRecords.forEach(record => {
            const cow = appData.cows.find(c => c.id === record.cowId);
            pdSelect.innerHTML += `
                <option value="${record.id}">
                    Cow #${cow?.number || 'Unknown'} - AI Date: ${formatDate(record.aiDate)}
                </option>
            `;
        });
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

// Cow management functions
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
                ${cow.notes ? `<div class="cow-notes"><strong>Notes:</strong> ${cow.notes}</div>` : ''}
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
                        <option value="Red Sindhi" ${cow.breed === 'Red Sindhi' ? 'selected' : ''}>Red Sindhi</option>
                        <option value="Murrah" ${cow.breed === 'Murrah' ? 'selected' : ''}>Murrah (Buffalo)</option>
                        <option value="Nili Ravi" ${cow.breed === 'Nili Ravi' ? 'selected' : ''}>Nili Ravi (Buffalo)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" id="editCowDob" value="${cow.dob}" required>
                </div>
                <div class="form-group">
                    <label>Current Weight (kg)</label>
                    <input type="number" id="editCowWeight" value="${cow.weight}" min="100" max="800" step="0.5">
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
                        <option value="Fresh" ${cow.status === 'Fresh' ? 'selected' : ''}>Fresh</option>
                        <option value="Sick" ${cow.status === 'Sick' ? 'selected' : ''}>Sick</option>
                        <option value="Open" ${cow.status === 'Open' ? 'selected' : ''}>Open</option>
                        <option value="Sold" ${cow.status === 'Sold' ? 'selected' : ''}>Sold</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="editCowNotes" rows="3">${cow.notes || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Update Cow Image</label>
                    <input type="file" id="editCowImage" accept="image/*">
                    ${cow.image ? `<img src="${cow.image}" alt="Current" class="current-image">` : ''}
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-success">Update Cow</button>
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
            </div>
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
        cow.notes = document.getElementById('editCowNotes').value;
        
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
    
    if (confirm(`Are you sure you want to delete Cow #${cow.number}? This will also delete all related milk production, breeding, and vaccination records. This action cannot be undone.`)) {
        // Remove cow from array
        appData.cows = appData.cows.filter(c => c.id !== cowId);
        
        // Also remove related data
        appData.milkProduction = appData.milkProduction.filter(m => m.cowId !== cowId);
        appData.breeding = appData.breeding.filter(b => b.cowId !== cowId);
        if (appData.vaccinations) {
            appData.vaccinations = appData.vaccinations.filter(v => v.cowId !== cowId);
        }
        
        saveData();
        updateCowList();
        updateDashboard();
        populateDropdowns();
        showAlert('success', 'Cow and all related records deleted successfully!');
    }
}

// Additional utility functions
function generateReport() {
    const reportType = document.getElementById('reportType')?.value || 'production';
    const fromDate = document.getElementById('reportFromDate')?.value;
    const toDate = document.getElementById('reportToDate')?.value;
    const format = document.getElementById('reportFormat')?.value || 'view';
    
    if (!fromDate || !toDate) {
        showAlert('warning', 'Please select date range for the report');
        return;
    }
    
    let reportData = '';
    
    switch(reportType) {
        case 'production':
            reportData = generateProductionReport(fromDate, toDate);
            break;
        case 'breeding':
            reportData = generateBreedingReport(fromDate, toDate);
            break;
        case 'financial':
            reportData = generateFinancialReport(fromDate, toDate);
            break;
        case 'health':
            reportData = generateHealthReport(fromDate, toDate);
            break;
        case 'feed':
            reportData = generateFeedReport(fromDate, toDate);
            break;
        case 'cow-performance':
            reportData = generateCowPerformanceReport(fromDate, toDate);
            break;
        default:
            reportData = 'Report type not implemented yet.';
    }
    
    if (format === 'view') {
        showModal(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, reportData);
    } else if (format === 'print') {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${reportType} Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1, h2 { color: #333; }
                    </style>
                </head>
                <body>${reportData}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else if (format === 'export') {
        exportReportData(reportType, fromDate, toDate);
    }
    
    showAlert('success', `${reportType} report generated successfully!`);
}

function generateProductionReport(fromDate, toDate) {
    const filteredRecords = appData.milkProduction.filter(m => 
        m.date >= fromDate && m.date <= toDate
    );
    
    const totalMilk = filteredRecords.reduce((sum, m) => sum + m.yield, 0);
    const avgFat = filteredRecords.length > 0 ? 
        filteredRecords.reduce((sum, m) => sum + (m.fat || 0), 0) / filteredRecords.length : 0;
    const avgSNF = filteredRecords.length > 0 ?
        filteredRecords.reduce((sum, m) => sum + (m.snf || 0), 0) / filteredRecords.length : 0;
    
    return `
        <div class="report-content">
            <h2>Milk Production Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-summary">
                <h3>Summary</h3>
                <ul>
                    <li>Total Milk Produced: ${totalMilk.toFixed(1)} Liters</li>
                    <li>Total Records: ${filteredRecords.length}</li>
                    <li>Average Fat Content: ${avgFat.toFixed(1)}%</li>
                    <li>Average SNF Content: ${avgSNF.toFixed(1)}%</li>
                    <li>Average Daily Production: ${(totalMilk / Math.max(1, getDaysBetween(fromDate, toDate))).toFixed(1)} L/day</li>
                </ul>
            </div>
            
            <div class="report-details">
                <h3>Top Performing Cows</h3>
                ${generateTopCowsTable(filteredRecords)}
            </div>
        </div>
    `;
}

function generateBreedingReport(fromDate, toDate) {
    const filteredRecords = appData.breeding.filter(b => 
        b.aiDate >= fromDate && b.aiDate <= toDate
    );
    
    const totalAI = filteredRecords.length;
    const pregnantCows = filteredRecords.filter(b => b.pdResult === 'Positive').length;
    const conceptionRate = totalAI > 0 ? (pregnantCows / totalAI) * 100 : 0;
    
    return `
        <div class="report-content">
            <h2>Breeding Performance Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-summary">
                <h3>Summary</h3>
                <ul>
                    <li>Total AI Services: ${totalAI}</li>
                    <li>Confirmed Pregnancies: ${pregnantCows}</li>
                    <li>Conception Rate: ${conceptionRate.toFixed(1)}%</li>
                    <li>Pending PD Checks: ${filteredRecords.filter(b => !b.pdResult).length}</li>
                </ul>
            </div>
        </div>
    `;
}

function generateFinancialReport(fromDate, toDate) {
    const milkSales = (appData.sales || []).filter(s => s.date >= fromDate && s.date <= toDate);
    const feedCosts = appData.feedTransactions.filter(f => 
        f.date >= fromDate && f.date <= toDate && f.transaction === 'Purchase'
    );
    
    const totalRevenue = milkSales.reduce((sum, s) => sum + s.amount, 0);
    const totalFeedCost = feedCosts.reduce((sum, f) => sum + (f.quantity * f.rate), 0);
    const netProfit = totalRevenue - totalFeedCost;
    
    return `
        <div class="report-content">
            <h2>Financial Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-summary">
                <h3>Financial Summary</h3>
                <ul>
                    <li>Total Milk Sales Revenue: ₹${totalRevenue.toFixed(2)}</li>
                    <li>Total Feed Costs: ₹${totalFeedCost.toFixed(2)}</li>
                    <li>Net Profit: ₹${netProfit.toFixed(2)}</li>
                    <li>Profit Margin: ${totalRevenue > 0 ? ((netProfit/totalRevenue) * 100).toFixed(1) : 0}%</li>
                </ul>
            </div>
        </div>
    `;
}

function generateHealthReport(fromDate, toDate) {
    const vaccinations = (appData.vaccinations || []).filter(v => 
        v.date >= fromDate && v.date <= toDate
    );
    
    return `
        <div class="report-content">
            <h2>Health & Vaccination Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-summary">
                <h3>Summary</h3>
                <ul>
                    <li>Total Vaccinations: ${vaccinations.length}</li>
                    <li>Animals Vaccinated: ${new Set(vaccinations.map(v => v.cowId)).size}</li>
                    <li>Total Health Costs: ₹${vaccinations.reduce((sum, v) => sum + (v.cost || 0), 0).toFixed(2)}</li>
                </ul>
            </div>
        </div>
    `;
}

function generateFeedReport(fromDate, toDate) {
    const feedTransactions = appData.feedTransactions.filter(f => 
        f.date >= fromDate && f.date <= toDate
    );
    
    const purchases = feedTransactions.filter(f => f.transaction === 'Purchase');
    const consumption = feedTransactions.filter(f => f.transaction === 'Consumption');
    
    return `
        <div class="report-content">
            <h2>Feed Management Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-summary">
                <h3>Summary</h3>
                <ul>
                    <li>Total Feed Purchased: ${purchases.reduce((sum, f) => sum + f.quantity, 0).toFixed(1)} kg</li>
                    <li>Total Feed Consumed: ${consumption.reduce((sum, f) => sum + f.quantity, 0).toFixed(1)} kg</li>
                    <li>Total Feed Cost: ₹${purchases.reduce((sum, f) => sum + (f.quantity * f.rate), 0).toFixed(2)}</li>
                </ul>
            </div>
        </div>
    `;
}

function generateCowPerformanceReport(fromDate, toDate) {
    const cowPerformance = appData.cows.map(cow => {
        const milkRecords = appData.milkProduction.filter(m => 
            m.cowId === cow.id && m.date >= fromDate && m.date <= toDate
        );
        const totalMilk = milkRecords.reduce((sum, m) => sum + m.yield, 0);
        
        return {
            number: cow.number,
            breed: cow.breed,
            totalMilk: totalMilk,
            avgDaily: milkRecords.length > 0 ? totalMilk / getDaysBetween(fromDate, toDate) : 0
        };
    }).sort((a, b) => b.totalMilk - a.totalMilk);
    
    return `
        <div class="report-content">
            <h2>Individual Cow Performance Report</h2>
            <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            
            <div class="report-details">
                <table>
                    <thead>
                        <tr>
                            <th>Cow Number</th>
                            <th>Breed</th>
                            <th>Total Milk (L)</th>
                            <th>Avg Daily (L)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cowPerformance.map(cow => `
                            <tr>
                                <td>${cow.number}</td>
                                <td>${cow.breed}</td>
                                <td>${cow.totalMilk.toFixed(1)}</td>
                                <td>${cow.avgDaily.toFixed(1)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function generateTopCowsTable(milkRecords) {
    const cowTotals = {};
    
    milkRecords.forEach(record => {
        if (!cowTotals[record.cowId]) {
            cowTotals[record.cowId] = 0;
        }
        cowTotals[record.cowId] += record.yield;
    });
    
    const topCows = Object.entries(cowTotals)
        .map(([cowId, total]) => {
            const cow = appData.cows.find(c => c.id === cowId);
            return { cow, total };
        })
        .filter(item => item.cow)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    
    return `
        <table>
            <thead>
                <tr>
                    <th>Cow Number</th>
                    <th>Breed</th>
                    <th>Total Milk (L)</th>
                </tr>
            </thead>
            <tbody>
                ${topCows.map(item => `
                    <tr>
                        <td>${item.cow.number}</td>
                        <td>${item.cow.breed}</td>
                        <td>${item.total.toFixed(1)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function exportReportData(reportType, fromDate, toDate) {
    // Simple CSV export functionality
    let csvContent = '';
    
    switch(reportType) {
        case 'production':
            const milkData = appData.milkProduction.filter(m => m.date >= fromDate && m.date <= toDate);
            csvContent = 'Date,Cow Number,Session,Yield (L),Fat %,SNF %,SCC\n';
            milkData.forEach(record => {
                const cow = appData.cows.find(c => c.id === record.cowId);
                csvContent += `${record.date},${cow?.number || 'Unknown'},${record.session},${record.yield},${record.fat || ''},${record.snf || ''},${record.scc || ''}\n`;
            });
            break;
        
        default:
            showAlert('info', 'CSV export for this report type coming soon!');
            return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${fromDate}_to_${toDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}
