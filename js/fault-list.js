/**
 * Fault List Page - Fault list management and filtering
 */

class FaultList {
    constructor() {
        this.apiClient = apiClient;
        this.currentPage = 1;
        this.pageSize = 25;
        this.filters = {};
        this.allFaults = [];
    }

    async initialize() {
        try {
            this.setupEventListeners();
            await this.loadFaults();
            console.log('Fault list initialized');
        } catch (error) {
            console.error('Fault list initialization error:', error);
            showToast('error', 'Error', 'Failed to initialize fault list');
        }
    }

    setupEventListeners() {
        // Filter listeners
        document.getElementById('statusFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('priorityFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('systemFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('searchFilter')?.addEventListener('input', () => this.applyFilters());

        // Export
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportToExcel());
    }

    async loadFaults() {
        try {
            document.getElementById('loadingOverlay')?.classList.add('show');

            const data = await this.apiClient.getFaultList();
            this.allFaults = data.faults || [];

            this.renderTable();
            this.setupPagination();

            document.getElementById('loadingOverlay')?.classList.remove('show');
        } catch (error) {
            console.error('Error loading faults:', error);
            showToast('error', 'Load Failed', 'Could not load faults');
        }
    }

    applyFilters() {
        this.filters = {
            status: document.getElementById('statusFilter')?.value || '',
            priority: document.getElementById('priorityFilter')?.value || '',
            system: document.getElementById('systemFilter')?.value || '',
            search: document.getElementById('searchFilter')?.value || ''
        };

        this.currentPage = 1;
        this.renderTable();
    }

    getFilteredFaults() {
        return this.allFaults.filter(fault => {
            if (this.filters.status && fault.status !== this.filters.status) return false;
            if (this.filters.priority && fault.priority !== this.filters.priority) return false;
            if (this.filters.system && fault.system !== this.filters.system) return false;
            
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase();
                return fault.ticketId.toLowerCase().includes(search) ||
                       fault.station.toLowerCase().includes(search) ||
                       fault.equipment.toLowerCase().includes(search) ||
                       fault.description.toLowerCase().includes(search);
            }
            
            return true;
        });
    }

    renderTable() {
        const filteredFaults = this.getFilteredFaults();
        const tbody = document.getElementById('faultsTableBody');
        if (!tbody) return;

        const startIdx = (this.currentPage - 1) * this.pageSize;
        const endIdx = startIdx + this.pageSize;
        const pageFaults = filteredFaults.slice(startIdx, endIdx);

        if (pageFaults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="13" class="text-center text-muted py-4">No faults found</td></tr>';
            return;
        }

        let html = '';
        pageFaults.forEach(fault => {
            const age = UIUtils.calculateAge(fault.createdAt);
            const statusBadge = UIUtils.createStatusBadge(fault.status);
            const priorityBadge = UIUtils.createPriorityBadge(fault.priority);

            html += `
                <tr>
                    <td>${fault.ticketId}</td>
                    <td>${fault.station}</td>
                    <td>${fault.system}</td>
                    <td>${fault.equipment}</td>
                    <td>${fault.counter || 1}</td>
                    <td>${fault.isRepeat ? '<i class="fas fa-check text-danger"></i>' : '-'}</td>
                    <td>${fault.assignedTeam || '-'}</td>
                    <td>${priorityBadge}</td>
                    <td>${statusBadge}</td>
                    <td>${age}h</td>
                    <td>${fault.acknowledgedBy || '-'}</td>
                    <td>${fault.closedBy || '-'}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-primary" onclick="viewFaultDetails('${fault.ticketId}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-info" onclick="viewEquipmentHistory('${fault.equipment}')" title="History">
                                <i class="fas fa-history"></i>
                            </button>
                            ${fault.status === 'Open' ? `
                                <button class="btn btn-warning" onclick="updateFaultStatus('${fault.ticketId}', 'Acknowledged')" title="Acknowledge">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                            ${fault.status !== 'Closed' ? `
                                <button class="btn btn-danger" onclick="openCloseFaultModal('${fault.ticketId}')" title="Close">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        document.getElementById('faultCount').textContent = filteredFaults.length;
    }

    setupPagination() {
        const filteredFaults = this.getFilteredFaults();
        const totalPages = Math.ceil(filteredFaults.length / this.pageSize);
        const paginationDiv = document.getElementById('pagination');

        if (paginationDiv && totalPages > 1) {
            let html = '<nav><ul class="pagination">';
            
            if (this.currentPage > 1) {
                html += `<li class="page-item"><a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a></li>`;
            }
            
            for (let i = 1; i <= totalPages; i++) {
                const active = i === this.currentPage ? 'active' : '';
                html += `<li class="page-item ${active}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            
            if (this.currentPage < totalPages) {
                html += `<li class="page-item"><a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a></li>`;
            }
            
            html += '</ul></nav>';
            paginationDiv.innerHTML = html;

            paginationDiv.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.currentPage = parseInt(link.dataset.page);
                    this.renderTable();
                });
            });
        }
    }

    exportToExcel() {
        const filteredFaults = this.getFilteredFaults();
        if (filteredFaults.length === 0) {
            showToast('warning', 'No Data', 'No faults to export');
            return;
        }

        UIUtils.exportToExcel(filteredFaults, 'faults');
        showToast('success', 'Exported', 'Faults exported to Excel');
    }
}

// Global functions
function viewFaultDetails(ticketId) {
    showToast('info', 'Details', `Loading details for ${ticketId}`);
}

function viewEquipmentHistory(equipment) {
    showToast('info', 'History', `Showing history for ${equipment}`);
}

async function updateFaultStatus(ticketId, status) {
    try {
        await apiClient.updateFaultStatus(ticketId, status);
        showToast('success', 'Updated', `Fault status updated to ${status}`);
        const faultList = new FaultList();
        await faultList.loadFaults();
    } catch (error) {
        showToast('error', 'Error', 'Failed to update status');
    }
}

function openCloseFaultModal(ticketId) {
    showToast('info', 'Close', `Closing fault ${ticketId}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const faultList = new FaultList();
    faultList.initialize();
});
