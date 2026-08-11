/**
 * Cache Manager - Local storage caching with TTL
 */

class CacheManager {
    constructor() {
        this.PREFIX = 'cmrl_';
        this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
    }

    set(key, value, ttl = this.DEFAULT_TTL) {
        try {
            const item = {
                value: JSON.stringify(value),
                expiry: Date.now() + ttl
            };
            localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (!item) return null;

            const cached = JSON.parse(item);
            if (Date.now() > cached.expiry) {
                localStorage.removeItem(this.PREFIX + key);
                return null;
            }
            return JSON.parse(cached.value);
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
            return true;
        } catch (error) {
            console.error('Cache remove error:', error);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Cache clear error:', error);
            return false;
        }
    }

    isExpired(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (!item) return true;
            const cached = JSON.parse(item);
            return Date.now() > cached.expiry;
        } catch (error) {
            return true;
        }
    }
}

// Global instance
const cacheManager = new CacheManager();
