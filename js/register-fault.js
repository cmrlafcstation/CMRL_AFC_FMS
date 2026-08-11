/**
 * Register Fault Page - Form initialization and submission
 */

class RegisterFaultForm {
    constructor() {
        this.form = document.getElementById('faultRegistrationForm');
        this.apiClient = apiClient;
        this.formData = {};
    }

    initialize() {
        if (!this.form) return;

        this.setupDropdowns();
        this.setupEventListeners();
        console.log('Register fault form initialized');
    }

    setupDropdowns() {
        // Populate zone
        populateZoneDropdown('zone');

        // Setup cascades
        populateStationDropdown('zone', 'station');
        populateSystemDropdown('system');
        populateEquipmentDropdown('system', 'equipment');
        populateLocationDropdown('station', 'location');
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Show/hide equipment number field
        document.getElementById('equipment')?.addEventListener('change', () => {
            this.toggleEquipmentNumberField();
        });

        // Update description suggestions
        document.getElementById('system')?.addEventListener('change', () => {
            this.updateDescriptionSuggestions();
        });

        document.getElementById('faultDescription')?.addEventListener('input', () => {
            this.updateDescriptionSuggestions();
        });
    }

    toggleEquipmentNumberField() {
        const equipmentId = parseInt(document.getElementById('equipment').value);
        const equipment = EQUIPMENT.find(e => e.id === equipmentId);
        const field = document.getElementById('equipmentNumberField');

        if (equipment && ['AG', 'TOM', 'Parking'].includes(equipment.system)) {
            field.style.display = 'block';
            document.getElementById('equipmentNumber').required = true;
        } else {
            field.style.display = 'none';
            document.getElementById('equipmentNumber').required = false;
            document.getElementById('equipmentNumber').value = '';
        }
    }

    updateDescriptionSuggestions() {
        const systemId = document.getElementById('system').value;
        const description = document.getElementById('faultDescription').value;
        const suggestionsDiv = document.getElementById('descriptionSuggestions');

        if (!systemId || !suggestionsDiv) return;

        suggestionsDiv.innerHTML = '';
        const suggestions = getFaultCodeSuggestions(systemId, description);

        suggestions.slice(0, 5).forEach(suggestion => {
            const tag = document.createElement('span');
            tag.className = 'badge bg-info me-2 mb-2';
            tag.style.cursor = 'pointer';
            tag.textContent = suggestion.description;
            tag.onclick = () => {
                document.getElementById('faultDescription').value = suggestion.description;
            };
            suggestionsDiv.appendChild(tag);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.form.checkValidity()) {
            this.form.classList.add('was-validated');
            return;
        }

        // Collect form data
        const formData = {
            zone: document.getElementById('zone').value,
            station: document.getElementById('station').value,
            system: document.getElementById('system').value,
            equipment: document.getElementById('equipment').value,
            equipmentNumber: document.getElementById('equipmentNumber').value || 'N/A',
            location: document.getElementById('location').value,
            priority: document.querySelector('input[name="priority"]:checked').value,
            description: document.getElementById('faultDescription').value,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        // Validate with business rules
        const validation = Validators.validateFaultForm(formData);
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                showToast('error', 'Validation Error', error);
            });
            return;
        }

        // Show loading
        document.getElementById('loadingOverlay').classList.add('show');

        try {
            // Check for duplicate
            const duplicate = await this.checkDuplicateFault(formData);
            if (duplicate) {
                document.getElementById('loadingOverlay').classList.remove('show');
                this.showDuplicateWarning(duplicate);
                return;
            }

            // Submit fault
            const response = await this.apiClient.registerFault(formData);

            if (response && response.ticketId) {
                showToast('success', 'Success!', `Fault registered: ${response.ticketId}`);

                // Reset form
                this.form.reset();
                this.form.classList.remove('was-validated');
                document.getElementById('equipmentNumberField').style.display = 'none';
                document.getElementById('descriptionSuggestions').innerHTML = '';

                // Redirect
                setTimeout(() => {
                    window.location.href = 'fault-list.html?filter=open';
                }, 2000);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast('error', 'Submission Failed', error.message || 'Please try again');
        } finally {
            document.getElementById('loadingOverlay').classList.remove('show');
        }
    }

    async checkDuplicateFault(formData) {
        try {
            const result = await this.apiClient.checkDuplicateFault({
                station: formData.station,
                system: formData.system,
                equipment: formData.equipment,
                location: formData.location
            });
            return result && result.ticketId ? result : null;
        } catch (error) {
            return null;
        }
    }

    showDuplicateWarning(duplicateFault) {
        const modal = new bootstrap.Modal(document.getElementById('duplicateFaultModal'));
        document.getElementById('dupTicketId').textContent = duplicateFault.ticketId;
        document.getElementById('dupStatus').textContent = duplicateFault.status || 'Open';
        document.getElementById('dupDate').textContent = UIUtils.formatDateTime(duplicateFault.createdAt);

        document.getElementById('continueDuplicateBtn').onclick = () => {
            modal.hide();
        };

        modal.show();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const form = new RegisterFaultForm();
    form.initialize();
});
