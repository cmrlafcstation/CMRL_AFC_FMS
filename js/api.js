/**
 * API Client - Central API client for all backend communication
 */

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://script.google.com/macros/d/1hCvN5N_Jn-MadzrVFvE6doegN5OwEV5_HoEvIpT4W4w/usercallback';
        this.timeout = 30000;
        this.retries = 3;
        this.cache = cacheManager;
    }

    async request(method, endpoint, data = null) {
        const url = `${this.baseURL}?action=${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        let lastError;
        for (let i = 0; i < this.retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                options.signal = controller.signal;
                const response = await fetch(url, options);
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                lastError = error;
                if (i < this.retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }

        throw lastError;
    }

    // Dashboard
    async getDashboardData() {
        const cached = this.cache.get('dashboard');
        if (cached) return cached;

        const data = await this.request('POST', 'getDashboardData');
        this.cache.set('dashboard', data);
        return data;
    }

    async getStatusSummary() {
        const cached = this.cache.get('statusSummary');
        if (cached) return cached;

        const data = await this.request('POST', 'getStatusSummary');
        this.cache.set('statusSummary', data);
        return data;
    }

    async getRecentFaults() {
        const cached = this.cache.get('recentFaults');
        if (cached) return cached;

        const data = await this.request('POST', 'getRecentFaults');
        this.cache.set('recentFaults', data);
        return data;
    }

    // Faults
    async registerFault(formData) {
        const result = await this.request('POST', 'registerFault', formData);
        this.cache.clear();
        return result;
    }

    async getFaultList(filters = {}) {
        const cacheKey = `faultList_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.request('POST', 'getFaultList', filters);
        this.cache.set(cacheKey, data);
        return data;
    }

    async getFaultDetails(ticketId) {
        const data = await this.request('POST', 'getFaultDetails', { ticketId });
        return data;
    }

    async updateFaultStatus(ticketId, status) {
        const result = await this.request('POST', 'updateFaultStatus', { ticketId, status });
        this.cache.clear();
        return result;
    }

    async closeFault(ticketId, closureData) {
        const result = await this.request('POST', 'closeFault', { ticketId, ...closureData });
        this.cache.clear();
        return result;
    }

    async checkDuplicateFault(data) {
        try {
            const result = await this.request('POST', 'checkDuplicateFault', data);
            return result;
        } catch (error) {
            return null;
        }
    }

    // Equipment
    async getEquipmentHistory(equipmentCode) {
        const data = await this.request('POST', 'getEquipmentHistory', { equipmentCode });
        return data;
    }

    // Reports
    async getStatusReport(filters = {}) {
        const cacheKey = `statusReport_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.request('POST', 'getStatusReport', filters);
        this.cache.set(cacheKey, data);
        return data;
    }

    async getSLAAnalysis(filters = {}) {
        const cacheKey = `slaAnalysis_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.request('POST', 'getSLAAnalysis', filters);
        this.cache.set(cacheKey, data);
        return data;
    }

    async getMTTRReport(filters = {}) {
        const cacheKey = `mttrReport_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.request('POST', 'getMTTRReport', filters);
        this.cache.set(cacheKey, data);
        return data;
    }

    async getRepeatFaults(filters = {}) {
        const cacheKey = `repeatFaults_${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.request('POST', 'getRepeatFaults', filters);
        this.cache.set(cacheKey, data);
        return data;
    }

    // Master Data
    async getTeamList() {
        const cached = this.cache.get('teamList');
        if (cached) return cached;

        const data = await this.request('POST', 'getTeamList');
        this.cache.set('teamList', data, 60 * 60 * 1000); // 1 hour
        return data;
    }

    async getStationList() {
        const cached = this.cache.get('stationList');
        if (cached) return cached;

        const data = await this.request('POST', 'getStationList');
        this.cache.set('stationList', data, 60 * 60 * 1000); // 1 hour
        return data;
    }

    async getSystemList() {
        const cached = this.cache.get('systemList');
        if (cached) return cached;

        const data = await this.request('POST', 'getSystemList');
        this.cache.set('systemList', data, 60 * 60 * 1000); // 1 hour
        return data;
    }
}

// Global instance
const apiClient = new APIClient();

// Fallback for offline/demo mode
async function getOfflineFaultList() {
    return {
        faults: [
            {
                ticketId: 'TKT-2024-00001',
                station: 'AIRPORT',
                system: 'AG',
                equipment: 'Card Reader',
                priority: 'High',
                status: 'Open',
                createdAt: moment().subtract(2, 'hours').format(),
                description: 'Card reader not responding'
            }
        ],
        total: 1
    };
}
