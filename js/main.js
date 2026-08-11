/**
 * Main - Dashboard initialization and logic
 */

const REFRESH_INTERVAL = 30000; // 30 seconds
let refreshIntervalId = null;

class Dashboard {
    constructor() {
        this.apiClient = apiClient;
    }

    async initialize() {
        try {
            this.setupEventListeners();
            await this.loadDashboardData();
            this.setupAutoRefresh();
            this.setupKeyboardShortcuts();
            console.log('Dashboard initialized');
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            showToast('error', 'Error', 'Failed to initialize dashboard');
        }
    }

    setupEventListeners() {
        document.getElementById('sidebarToggleBtn')?.addEventListener('click', toggleSidebar);
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
        document.getElementById('notificationBtn')?.addEventListener('click', () => this.showNotifications());
    }

    async loadDashboardData() {
        try {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.add('show');

            const data = await this.apiClient.getDashboardData();

            // Update status cards
            document.getElementById('openCount').textContent = data.statusCounts?.open || 0;
            document.getElementById('acknowledgedCount').textContent = data.statusCounts?.acknowledged || 0;
            document.getElementById('inProgressCount').textContent = data.statusCounts?.inProgress || 0;
            document.getElementById('pendingCount').textContent = data.statusCounts?.pending || 0;
            document.getElementById('closedTodayCount').textContent = data.statusCounts?.closedToday || 0;

            // Update team lists
            this.updateTeamList('l1TeamList', data.teams?.afc_l1 || []);
            this.updateTeamList('ncmcTeamList', data.teams?.ncmc || []);

            // Update recent faults
            this.updateRecentFaults(data.recentFaults || []);

            // Update notification count
            document.getElementById('notificationCount').textContent = data.notificationCount || 0;

            if (loadingOverlay) loadingOverlay.classList.remove('show');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showToast('error', 'Load Failed', 'Could not load dashboard data');
        }
    }

    updateTeamList(elementId, teamMembers) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (!teamMembers || teamMembers.length === 0) {
            element.innerHTML = '<div class="text-center text-muted py-3"><small>No team members available</small></div>';
            return;
        }

        let html = '';
        teamMembers.slice(0, 5).forEach(member => {
            html += `
                <div class="team-member mb-2">
                    <div class="d-flex align-items-center">
                        <img src="https://via.placeholder.com/40" alt="${member.name}" class="rounded-circle me-2" width="40">
                        <div>
                            <small class="d-block font-weight-bold">${member.name}</small>
                            <small class="text-muted">${member.role}</small>
                        </div>
                    </div>
                </div>
            `;
        });

        element.innerHTML = html;
    }

    updateRecentFaults(faults) {
        const tbody = document.getElementById('recentFaultsList');
        if (!tbody) return;

        if (!faults || faults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No recent faults</td></tr>';
            return;
        }

        let html = '';
        faults.slice(0, 10).forEach(fault => {
            const statusBadge = UIUtils.createStatusBadge(fault.status);
            const priorityBadge = UIUtils.createPriorityBadge(fault.priority);
            const age = UIUtils.calculateAge(fault.createdAt);

            html += `
                <tr>
                    <td><a href="fault-list.html?search=${fault.ticketId}">${fault.ticketId}</a></td>
                    <td>${fault.station}</td>
                    <td>${fault.system}</td>
                    <td>${UIUtils.createPriorityBadge(fault.priority)}</td>
                    <td>${statusBadge}</td>
                    <td>${age}h</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewFaultDetails('${fault.ticketId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    setupAutoRefresh() {
        refreshIntervalId = setInterval(async () => {
            try {
                this.cache.clear();
                await this.loadDashboardData();
                console.log('Dashboard refreshed');
            } catch (error) {
                console.error('Auto-refresh error:', error);
            }
        }, REFRESH_INTERVAL);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k') {
                    e.preventDefault();
                    this.openSearch();
                } else if (e.key === 'r') {
                    e.preventDefault();
                    this.loadDashboardData();
                }
            }
        });
    }

    openSearch() {
        showToast('info', 'Search', 'Search feature coming soon');
    }

    showNotifications() {
        showToast('info', 'Notifications', 'You have no new notifications');
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    dashboard.initialize();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
    }
});
