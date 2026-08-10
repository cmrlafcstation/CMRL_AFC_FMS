/**
 * CMRL AFC Fault Management System
 * Master Data - Stations, Systems, Equipment, Fault Codes
 * Updated with all 41 CMRL Stations (Zone 1, 2, 3)
 */

// ===== STATION DATA =====
const STATIONS = [
    // ZONE 1 (15 stations)
    { zone: 'Zone 1', code: 'SSI', name: 'EKKATTUTHANGAL' },
    { zone: 'Zone 1', code: 'SAN', name: 'ASHOK NAGAR' },
    { zone: 'Zone 1', code: 'SVA', name: 'VADAPALANI' },
    { zone: 'Zone 1', code: 'SAR', name: 'ARUMBAKKAM' },
    { zone: 'Zone 1', code: 'SCM', name: 'PURATCHI THALAIVI DR.J.JAYALALITHA CMBT METRO' },
    { zone: 'Zone 1', code: 'SKO', name: 'KOYAMBEDU' },
    { zone: 'Zone 1', code: 'STI', name: 'THIRUMANGALAM' },
    { zone: 'Zone 1', code: 'SAT', name: 'ANNA NAGAR TOWER' },
    { zone: 'Zone 1', code: 'SAE', name: 'ANNA NAGAR EAST' },
    { zone: 'Zone 1', code: 'SSN', name: 'SHENOY NAGAR' },
    { zone: 'Zone 1', code: 'SPC', name: 'PACHIAPPAS COLLEGE' },
    { zone: 'Zone 1', code: 'SKM', name: 'KILPAUK' },
    { zone: 'Zone 1', code: 'SNP', name: 'NEHRU PARK' },
    { zone: 'Zone 1', code: 'SEG', name: 'EGMORE' },
    { zone: 'Zone 1', code: 'SMM', name: 'ST. THOMAS MOUNT' },

    // ZONE 2 (13 stations)
    { zone: 'Zone 2', code: 'SAP', name: 'AIRPORT' },
    { zone: 'Zone 2', code: 'SME', name: 'MEENAMBAKKAM' },
    { zone: 'Zone 2', code: 'SOT', name: 'NANGANALLUR ROAD' },
    { zone: 'Zone 2', code: 'SAL', name: 'ARIGNAR ANNA ALANDUR METR' },
    { zone: 'Zone 2', code: 'SGU', name: 'GUINDY' },
    { zone: 'Zone 2', code: 'SLM', name: 'LITTLE MOUNT' },
    { zone: 'Zone 2', code: 'SSA', name: 'SAIDAPET' },
    { zone: 'Zone 2', code: 'SCR', name: 'NANDANAM' },
    { zone: 'Zone 2', code: 'STE', name: 'THENAMPET' },
    { zone: 'Zone 2', code: 'SGM', name: 'AG DMS' },
    { zone: 'Zone 2', code: 'STL', name: 'THOUSAND LIGHT' },
    { zone: 'Zone 2', code: 'SLI', name: 'LIC' },
    { zone: 'Zone 2', code: 'SGE', name: 'GOVERNMENT ESTATE' },

    // ZONE 3 (13 stations)
    { zone: 'Zone 3', code: 'SCC', name: 'THALAIVAR DR.M.G.RAMACHANDRA N CENTRAL METRO' },
    { zone: 'Zone 3', code: 'SHC', name: 'HIGH COURT' },
    { zone: 'Zone 3', code: 'SMA', name: 'MANNADI' },
    { zone: 'Zone 3', code: 'SWA', name: 'WASHERMENPET' },
    { zone: 'Zone 3', code: 'STC', name: 'Thyagaraya College' },
    { zone: 'Zone 3', code: 'STR', name: 'Tondiarpet' },
    { zone: 'Zone 3', code: 'SNW', name: 'New Washermen pet' },
    { zone: 'Zone 3', code: 'STG', name: 'Toll Gat' },
    { zone: 'Zone 3', code: 'SKP', name: 'Kaladipet' },
    { zone: 'Zone 3', code: 'STT', name: 'Thiruvotriyur Theredi' },
    { zone: 'Zone 3', code: 'STV', name: 'Thiruvotriyur' },
    { zone: 'Zone 3', code: 'SWN', name: 'WimcoNagar' },
    { zone: 'Zone 3', code: 'SWD', name: 'WimcoNagar Depot' }
];

// ===== SYSTEM DATA (AFC Systems) =====
const SYSTEMS = [
    { id: 'AG', name: 'Automatic Gate' },
    { id: 'NCMC', name: 'Non-Contact Card' },
    { id: 'QR', name: 'QR Code' },
    { id: 'TOM', name: 'Token-Based Ticketing' },
    { id: 'Parking', name: 'Parking Management' }
];

// ===== EQUIPMENT DATA =====
const EQUIPMENT = [
    // AG System Equipment
    { id: 1, name: 'Card Reader', system: 'AG', type: 'Electronic' },
    { id: 2, name: 'Gate Motor', system: 'AG', type: 'Mechanical' },
    { id: 3, name: 'Door Sensor', system: 'AG', type: 'Electronic' },
    { id: 4, name: 'Control Panel', system: 'AG', type: 'Electronic' },
    { id: 5, name: 'LED Display', system: 'AG', type: 'Electronic' },

    // NCMC System Equipment
    { id: 6, name: 'NCMC Reader', system: 'NCMC', type: 'Electronic' },
    { id: 7, name: 'NCMC Validator', system: 'NCMC', type: 'Electronic' },
    { id: 8, name: 'Transaction Server', system: 'NCMC', type: 'Software' },
    { id: 9, name: 'Card Stock', system: 'NCMC', type: 'Consumable' },

    // QR System Equipment
    { id: 10, name: 'QR Scanner', system: 'QR', type: 'Electronic' },
    { id: 11, name: 'QR Printer', system: 'QR', type: 'Electronic' },
    { id: 12, name: 'Barcode Display', system: 'QR', type: 'Electronic' },

    // TOM System Equipment
    { id: 13, name: 'Token Dispenser', system: 'TOM', type: 'Mechanical' },
    { id: 14, name: 'Token Collector', system: 'TOM', type: 'Mechanical' },
    { id: 15, name: 'Counting Machine', system: 'TOM', type: 'Mechanical' },

    // Parking System Equipment
    { id: 16, name: 'Parking Barrier', system: 'Parking', type: 'Mechanical' },
    { id: 17, name: 'Parking Display', system: 'Parking', type: 'Electronic' },
    { id: 18, name: 'ANPR Camera', system: 'Parking', type: 'Electronic' }
];

// ===== FAULT CODES =====
const FAULT_CODES = [
    // AG System Faults
    { code: 'AG001', description: 'Card Reader Not Responding', system: 'AG', severity: 'High' },
    { code: 'AG002', description: 'Gate Motor Malfunction', system: 'AG', severity: 'High' },
    { code: 'AG003', description: 'Door Sensor Failure', system: 'AG', severity: 'Medium' },
    { code: 'AG004', description: 'Control Panel Error', system: 'AG', severity: 'High' },
    { code: 'AG005', description: 'LED Display Not Working', system: 'AG', severity: 'Low' },

    // NCMC System Faults
    { code: 'NCMC001', description: 'NCMC Reader Failure', system: 'NCMC', severity: 'High' },
    { code: 'NCMC002', description: 'Card Validation Error', system: 'NCMC', severity: 'Medium' },
    { code: 'NCMC003', description: 'Server Connection Lost', system: 'NCMC', severity: 'Critical' },
    { code: 'NCMC004', description: 'Card Balance Query Failed', system: 'NCMC', severity: 'Medium' },

    // QR System Faults
    { code: 'QR001', description: 'QR Scanner Not Reading', system: 'QR', severity: 'High' },
    { code: 'QR002', description: 'QR Printer Paper Jam', system: 'QR', severity: 'Medium' },
    { code: 'QR003', description: 'Invalid QR Code', system: 'QR', severity: 'Medium' },

    // TOM System Faults
    { code: 'TOM001', description: 'Token Dispenser Jam', system: 'TOM', severity: 'High' },
    { code: 'TOM002', description: 'Token Stock Empty', system: 'TOM', severity: 'Medium' },
    { code: 'TOM003', description: 'Counting Machine Error', system: 'TOM', severity: 'Low' },

    // Parking System Faults
    { code: 'PARK001', description: 'Barrier Motor Failure', system: 'Parking', severity: 'High' },
    { code: 'PARK002', description: 'ANPR Camera Malfunction', system: 'Parking', severity: 'Medium' },
    { code: 'PARK003', description: 'Display Communication Loss', system: 'Parking', severity: 'Medium' },
    { code: 'PARK004', description: 'Ticket Validation Failed', system: 'Parking', severity: 'Low' }
];

// ===== LOCATION DATA (by Station) =====
const LOCATIONS = {
    'SSI': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SAN': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SVA': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SAR': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SCM': ['Platform A', 'Platform B', 'Platform C', 'Entrance', 'Exit', 'Parking'],
    'SKO': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'STI': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SAT': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SAE': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SSN': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SPC': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SKM': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SNP': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SEG': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SMM': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SAP': ['Platform A', 'Platform B', 'Platform C', 'Entrance', 'Exit', 'Parking'],
    'SME': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SOT': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SAL': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SGU': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SLM': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SSA': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SCR': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'STE': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SGM': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'STL': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SLI': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SGE': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SCC': ['Platform A', 'Platform B', 'Platform C', 'Entrance', 'Exit', 'Parking'],
    'SHC': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SMA': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SWA': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'STC': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'STR': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SNW': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'STG': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SKP': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'STT': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'STV': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking'],
    'SWN': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Office'],
    'SWD': ['Platform A', 'Platform B', 'Entrance', 'Exit', 'Parking']
};

// ===== HELPER FUNCTIONS =====

/**
 * Get all stations by zone
 */
function getStationsByZone(zone) {
    return STATIONS.filter(station => station.zone === zone);
}

/**
 * Get all zones
 */
function getAllZones() {
    return [...new Set(STATIONS.map(s => s.zone))].sort();
}

/**
 * Get station by code
 */
function getStationByCode(code) {
    return STATIONS.find(s => s.code === code);
}

/**
 * Get systems
 */
function getSystems() {
    return SYSTEMS;
}

/**
 * Get equipment by system
 */
function getEquipmentBySystem(system) {
    return EQUIPMENT.filter(eq => eq.system === system);
}

/**
 * Get fault codes by system
 */
function getFaultCodesBySystem(system) {
    return FAULT_CODES.filter(fc => fc.system === system);
}

/**
 * Get locations by station
 */
function getLocationsByStation(stationCode) {
    return LOCATIONS[stationCode] || [];
}

/**
 * Initialize master data on page load
 */
function initializeMasterData() {
    console.log(`✓ Master Data Loaded`);
    console.log(`  Stations: ${STATIONS.length}`);
    console.log(`  Zones: ${getAllZones().length}`);
    console.log(`  Systems: ${SYSTEMS.length}`);
    console.log(`  Equipment: ${EQUIPMENT.length}`);
    console.log(`  Fault Codes: ${FAULT_CODES.length}`);
}

// ===== EXPORT FOR USE IN FORMS =====

/**
 * Populate zone dropdown
 */
function populateZoneDropdown(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    const zones = getAllZones();
    zones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone;
        option.textContent = zone;
        select.appendChild(option);
    });
}

/**
 * Populate station dropdown based on selected zone
 */
function populateStationDropdown(zoneSelectId, stationSelectId) {
    const zoneSelect = document.getElementById(zoneSelectId);
    const stationSelect = document.getElementById(stationSelectId);

    if (!zoneSelect || !stationSelect) return;

    zoneSelect.addEventListener('change', function() {
        stationSelect.innerHTML = '<option value="">Select Station</option>';

        if (!this.value) return;

        const stations = getStationsByZone(this.value);
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.code;
            option.textContent = `${station.code} - ${station.name}`;
            stationSelect.appendChild(option);
        });
    });
}

/**
 * Populate system dropdown
 */
function populateSystemDropdown(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    const systems = getSystems();
    systems.forEach(system => {
        const option = document.createElement('option');
        option.value = system.id;
        option.textContent = system.name;
        select.appendChild(option);
    });
}

/**
 * Populate equipment dropdown based on selected system
 */
function populateEquipmentDropdown(systemSelectId, equipmentSelectId) {
    const systemSelect = document.getElementById(systemSelectId);
    const equipmentSelect = document.getElementById(equipmentSelectId);

    if (!systemSelect || !equipmentSelect) return;

    systemSelect.addEventListener('change', function() {
        equipmentSelect.innerHTML = '<option value="">Select Equipment</option>';

        if (!this.value) return;

        const equipment = getEquipmentBySystem(this.value);
        equipment.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (${item.type})`;
            equipmentSelect.appendChild(option);
        });
    });
}

/**
 * Populate location dropdown based on selected station
 */
function populateLocationDropdown(stationSelectId, locationSelectId) {
    const stationSelect = document.getElementById(stationSelectId);
    const locationSelect = document.getElementById(locationSelectId);

    if (!stationSelect || !locationSelect) return;

    stationSelect.addEventListener('change', function() {
        locationSelect.innerHTML = '<option value="">Select Location</option>';

        if (!this.value) return;

        const locations = getLocationsByStation(this.value);
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    });
}

/**
 * Get fault code suggestions based on system and description
 */
function getFaultCodeSuggestions(system, description = '') {
    let codes = getFaultCodesBySystem(system);

    if (description) {
        codes = codes.filter(fc => 
            fc.description.toLowerCase().includes(description.toLowerCase())
        );
    }

    return codes;
}

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMasterData);
} else {
    initializeMasterData();
}
