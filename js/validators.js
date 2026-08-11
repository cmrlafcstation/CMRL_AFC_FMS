/**
 * Validators - Form validation and business rules
 */

const SLA_TIMES = {
    'High': 2,
    'Medium': 6,
    'Low': 24,
    'NoCritical': 48
};

class Validators {
    static validateFaultForm(formData) {
        const errors = [];

        if (!formData.zone) errors.push('Zone is required');
        if (!formData.station) errors.push('Station is required');
        if (!formData.system) errors.push('System is required');
        if (!formData.equipment) errors.push('Equipment is required');
        if (!formData.location) errors.push('Location is required');
        if (!formData.priority) errors.push('Priority is required');
        
        if (!formData.description || formData.description.trim().length < 10) {
            errors.push('Description must be at least 10 characters');
        }
        
        if (formData.description && formData.description.length > 500) {
            errors.push('Description cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static validateClosureForm(formData) {
        const errors = [];

        if (!formData.faultCode) errors.push('Fault code is required');
        if (!formData.actionTaken || formData.actionTaken.trim().length < 10) {
            errors.push('Action taken must be at least 10 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static checkSLAViolation(fault) {
        if (!fault.createdAt || !fault.priority) return false;

        const slaHours = SLA_TIMES[fault.priority] || 48;
        const ageHours = moment().diff(moment(fault.createdAt), 'hours');
        
        return ageHours > slaHours;
    }

    static getSLAStatus(fault) {
        const slaHours = SLA_TIMES[fault.priority] || 48;
        const ageHours = moment().diff(moment(fault.createdAt), 'hours');
        const percentUsed = (ageHours / slaHours) * 100;

        if (percentUsed > 100) {
            return { status: 'violated', percent: 100 };
        } else if (percentUsed > 80) {
            return { status: 'warning', percent: percentUsed };
        } else {
            return { status: 'ok', percent: percentUsed };
        }
    }

    static checkRepeatFault(equipmentCode, faults) {
        if (!faults || faults.length === 0) return false;

        const thirtyDaysAgo = moment().subtract(30, 'days');
        const recentFaults = faults.filter(f => 
            f.equipmentCode === equipmentCode && 
            moment(f.createdAt).isAfter(thirtyDaysAgo)
        );

        return recentFaults.length >= 3;
    }

    static getRepeatFaultLevel(equipmentCode, faults) {
        if (!faults || faults.length === 0) return null;

        const thirtyDaysAgo = moment().subtract(30, 'days');
        const recentFaults = faults.filter(f => 
            f.equipmentCode === equipmentCode && 
            moment(f.createdAt).isAfter(thirtyDaysAgo)
        );

        if (recentFaults.length >= 5) return 'critical';
        if (recentFaults.length >= 3) return 'oem';
        return null;
    }

    static calculateAge(createdAt) {
        return moment().diff(moment(createdAt), 'hours');
    }

    static formatTicketId(id) {
        const year = new Date().getFullYear();
        return `TKT-${year}-${String(id).padStart(5, '0')}`;
    }

    static validateStation(zone, stationCode) {
        const station = getStationByCode(stationCode);
        return station && station.zone === zone;
    }

    static validateEquipment(systemCode, equipmentId) {
        const equipment = EQUIPMENT.find(e => e.id == equipmentId);
        return equipment && equipment.system === systemCode;
    }

    static validateLocation(stationCode, location) {
        const locations = getLocationsByStation(stationCode);
        return locations.includes(location);
    }
}

// Validation helper functions
function validateEmail(email) {
    return UIUtils.validateEmail(email);
}

function validatePhone(phone) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone.replace(/[-\s]/g, ''));
}

function validateRequired(value) {
    return value && value.toString().trim().length > 0;
}

function validateMinLength(value, minLength) {
    return value && value.toString().length >= minLength;
}

function validateMaxLength(value, maxLength) {
    return !value || value.toString().length <= maxLength;
}
