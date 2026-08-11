/**
 * Google Sheet API Client - Fast data retrieval and storage
 * ✅ FIXED VERSION - Uses deploymentId parameter correctly
 */

class GSheetAPI {
    constructor(deploymentId) {
        // ✅ FIXED: Now uses the deploymentId parameter instead of hardcoding
        this.baseURL = `https://script.google.com/macros/d/${deploymentId}/usercallback`;
        this.timeout = 30000;
        this.retries = 3;
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    }

    async request(action, data = null) {
        const cacheKey = `${action}_${JSON.stringify(data)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                console.log(`[CACHE HIT] ${action}`, cached.data);
                return cached.data;
            }
            this.cache.delete(cacheKey);
        }

        let lastError;
        for (let i = 0; i < this.retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                console.log(`[API] Calling ${action}...`);

                const response = await fetch(this.baseURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action, data }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();
                
                // Cache successful responses
                if (result.ok) {
                    this.cache.set(cacheKey, {
                        data: result,
                        timestamp: Date.now()
                    });
                    console.log(`[API OK] ${action}`, result);
                }

                return result;
            } catch (error) {
                lastError = error;
                console.error(`[API RETRY ${i + 1}/${this.retries}] ${action}:`, error.message);
                if (i < this.retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }

        console.error(`[API FAILED] ${action}`, lastError);
        throw lastError;
    }

    // Fault operations
    async createFault(faultData) {
        return this.request('createFault', faultData);
    }

    async checkDuplicate(faultData) {
        return this.request('checkDuplicate', faultData);
    }

    async listFaults(filters = {}) {
        return this.request('listFaults', filters);
    }

    async getDashboard() {
        return this.request('dashboard');
    }

    async listDuty() {
        return this.request('listDuty');
    }

    async closeFault(ticketId, closureData) {
        return this.request('closeByCMO', {
            ticketId,
            ...closureData
        });
    }

    async getHistorySuggestions(system, equipment = null) {
        return this.request('historySuggestions', { system, equipment });
    }

    async getEquipmentHistory(stationCode, system, equipment, equipmentKey) {
        return this.request('equipmentHistory', {
            stationCode,
            system,
            equipment,
            equipmentKey
        });
    }

    async listFaultsWithStats(filters = {}) {
        return this.request('listFaultsWithStats', filters);
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('[CACHE] Cleared all cached data');
    }

    clearCacheForAction(action) {
        for (let [key] of this.cache) {
            if (key.startsWith(action)) {
                this.cache.delete(key);
            }
        }
        console.log(`[CACHE] Cleared cache for ${action}`);
    }
}

// ✅ FIXED: Now uses YOUR DEPLOYMENT ID (not spreadsheet ID)
const gsheetAPI = new GSheetAPI('AKfycbzo28mkU9_YWzFawK7PcvpRrt7curzIOoEPhHfxYwRH5qmapBvUe3xN9zhmW3-5B93wbw');

// Helper functions
async function createFault(faultData) {
    try {
        const result = await gsheetAPI.createFault(faultData);
        if (!result.ok) {
            throw new Error(result.error);
        }
        gsheetAPI.clearCacheForAction('listFaults');
        gsheetAPI.clearCacheForAction('dashboard');
        return result;
    } catch (error) {
        console.error('Create fault error:', error);
        throw error;
    }
}

async function checkDuplicate(faultData) {
    try {
        return await gsheetAPI.checkDuplicate(faultData);
    } catch (error) {
        console.error('Check duplicate error:', error);
        return { ok: false, error: error.message };
    }
}

async function getFaults(filters = {}) {
    try {
        return await gsheetAPI.listFaults(filters);
    } catch (error) {
        console.error('Get faults error:', error);
        return { ok: false, data: [] };
    }
}

async function getDashboard() {
    try {
        return await gsheetAPI.getDashboard();
    } catch (error) {
        console.error('Get dashboard error:', error);
        return { ok: false, error: error.message };
    }
}

async function getHistorySuggestions(system, equipment = null) {
    try {
        return await gsheetAPI.getHistorySuggestions(system, equipment);
    } catch (error) {
        console.error('Get suggestions error:', error);
        return { ok: false, descriptionSuggestions: [] };
    }
}

async function closeFault(ticketId, closureData) {
    try {
        const result = await gsheetAPI.closeFault(ticketId, closureData);
        gsheetAPI.clearCacheForAction('listFaults');
        gsheetAPI.clearCacheForAction('dashboard');
        return result;
    } catch (error) {
        console.error('Close fault error:', error);
        throw error;
    }
}
