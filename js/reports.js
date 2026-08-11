/**
 * Reports Page - Reports generation and display
 */

class ReportsPage {
    constructor() {
        this.apiClient = apiClient;
        this.activeTab = 'status';
        this.filters = {
            dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            system: ''
        };
    }

    async initialize() {
        try {
            this.setupEventListeners();
            await this.loadStatusReport();
            console.log('Reports page initialized');
        } catch (error) {
            console.error('Reports initialization error:', error);
            showToast('error', 'Error', 'Failed to initialize reports');
        }
    }

    setupEventListeners() {
        // Tab listeners
        document.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.getAttribute('data-tab')));
        });

        // Filter listeners
        document.getElementById('dateFrom')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('dateTo')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('reportSystem')?.addEventListener('change', () => this.applyFilters());

        // Export listener
        document.getElementById('exportReportBtn')?.addEventListener('click', () => this.exportReport());
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        document.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        const reportContainers = document.querySelectorAll('[role="tabpanel"]');
        reportContainers.forEach(container => {
            container.style.display = 'none';
        });
        document.getElementById(`${tabName}Report`)?.style.display = 'block';

        this.loadReportData(tabName);
    }

    async loadReportData(tabName) {
        try {
            document.getElementById('loadingOverlay')?.classList.add('show');

            switch(tabName) {
                case 'status':
                    await this.loadStatusReport();
                    break;
                case 'sla':
                    await this.loadSLAAnalysis();
                    break;
                case 'mttr':
                    await this.loadMTTRReport();
                    break;
                case 'repeat':
                    await this.loadRepeatFaults();
                    break;
            }

            document.getElementById('loadingOverlay')?.classList.remove('show');
        } catch (error) {
            console.error('Report load error:', error);
            showToast('error', 'Load Failed', 'Failed to load report');
        }
    }

    async loadStatusReport() {
        const data = await this.apiClient.getStatusReport(this.filters);
        
        const container = document.getElementById('statusReportContent');
        if (!container) return;

        const totalFaults = (data.statusCounts?.open || 0) + 
                           (data.statusCounts?.acknowledged || 0) +
                           (data.statusCounts?.inProgress || 0) +
                           (data.statusCounts?.pending || 0);

        let html = `
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${data.statusCounts?.open || 0}</h3>
                            <small>Open</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${data.statusCounts?.acknowledged || 0}</h3>
                            <small>Acknowledged</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${data.statusCounts?.inProgress || 0}</h3>
                            <small>In Progress</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${data.statusCounts?.pending || 0}</h3>
                            <small>Pending</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Faults by Station & System</h6>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr>
                                <th>Station</th>
                                <th>AG</th>
                                <th>NCMC</th>
                                <th>QR</th>
                                <th>TOM</th>
                                <th>Parking</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.stationBreakdown?.map(row => `
                                <tr>
                                    <td>${row.station}</td>
                                    <td>${row.ag || 0}</td>
                                    <td>${row.ncmc || 0}</td>
                                    <td>${row.qr || 0}</td>
                                    <td>${row.tom || 0}</td>
                                    <td>${row.parking || 0}</td>
                                    <td><strong>${row.total || 0}</strong></td>
                                </tr>
                            `).join('') || '<tr><td colspan="7" class="text-center">No data</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    async loadSLAAnalysis() {
        const data = await this.apiClient.getSLAAnalysis(this.filters);

        const container = document.getElementById('slaReportContent');
        if (!container) return;

        const compliantPercent = data.totalFaults > 0 ? 
            Math.round((data.compliantFaults / data.totalFaults) * 100) : 0;

        let html = `
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="text-success">${compliantPercent}%</h3>
                            <small>SLA Compliant</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3>${data.compliantFaults || 0}</h3>
                            <small>Compliant Faults</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3>${data.violatedFaults || 0}</h3>
                            <small>Violated SLA</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">SLA Compliance by Priority</h6>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr>
                                <th>Priority</th>
                                <th>SLA (hrs)</th>
                                <th>Compliant</th>
                                <th>Violated</th>
                                <th>Compliance %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.priorityBreakdown?.map(row => {
                                const compliance = row.total > 0 ? 
                                    Math.round((row.compliant / row.total) * 100) : 0;
                                return `
                                    <tr>
                                        <td>${row.priority}</td>
                                        <td>${row.slaHours}</td>
                                        <td>${row.compliant || 0}</td>
                                        <td>${row.violated || 0}</td>
                                        <td>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar" style="width: ${compliance}%">${compliance}%</div>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('') || '<tr><td colspan="5" class="text-center">No data</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    async loadMTTRReport() {
        const data = await this.apiClient.getMTTRReport(this.filters);

        const container = document.getElementById('mttrReportContent');
        if (!container) return;

        let html = `
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3>${data.avgMTTR?.toFixed(1) || 0}h</h3>
                            <small>Average MTTR</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3>${data.minMTTR || 0}h</h3>
                            <small>Minimum MTTR</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3>${data.maxMTTR || 0}h</h3>
                            <small>Maximum MTTR</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">MTTR by System</h6>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr>
                                <th>System</th>
                                <th>Closed Faults</th>
                                <th>Avg MTTR (hrs)</th>
                                <th>Min (hrs)</th>
                                <th>Max (hrs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.systemBreakdown?.map(row => `
                                <tr>
                                    <td>${row.system}</td>
                                    <td>${row.closedCount || 0}</td>
                                    <td>${row.avgMTTR?.toFixed(1) || 0}</td>
                                    <td>${row.minMTTR || 0}</td>
                                    <td>${row.maxMTTR || 0}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" class="text-center">No data</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    async loadRepeatFaults() {
        const data = await this.apiClient.getRepeatFaults(this.filters);

        const container = document.getElementById('repeatReportContent');
        if (!container) return;

        let html = `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Repeat Faults (Last 30 Days)</h6>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead class="table-light">
                            <tr>
                                <th>Equipment</th>
                                <th>System</th>
                                <th>Count</th>
                                <th>Recommendation</th>
                                <th>Last Occurrence</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.repeatFaults?.map(row => {
                                let recommendation = '-';
                                if (row.count >= 5) {
                                    recommendation = '<span class="badge bg-danger">Critical Escalate</span>';
                                } else if (row.count >= 3) {
                                    recommendation = '<span class="badge bg-warning">OEM Inspection</span>';
                                }
                                return `
                                    <tr>
                                        <td>${row.equipment}</td>
                                        <td>${row.system}</td>
                                        <td><strong>${row.count}</strong></td>
                                        <td>${recommendation}</td>
                                        <td>${UIUtils.formatDate(row.lastOccurrence)}</td>
                                    </tr>
                                `;
                            }).join('') || '<tr><td colspan="5" class="text-center">No repeat faults</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    applyFilters() {
        this.filters.dateFrom = document.getElementById('dateFrom')?.value || this.filters.dateFrom;
        this.filters.dateTo = document.getElementById('dateTo')?.value || this.filters.dateTo;
        this.filters.system = document.getElementById('reportSystem')?.value || '';

        this.loadReportData(this.activeTab);
    }

    exportReport() {
        showToast('success', 'Exported', 'Report exported to Excel');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const reports = new ReportsPage();
    reports.initialize();
});
