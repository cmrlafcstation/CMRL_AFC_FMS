/**
 * Configuration file for CMRL AFC FMS
 * Update the DEPLOYMENT_ID with your actual Google Apps Script Deployment ID
 */

// ⚠️ IMPORTANT: Replace this with your Deployment ID from Apps Script Deploy → Deployments
const DEPLOYMENT_ID = 'AKfycbw1duikfe-fN0rs39JOZvNlBH8p_TwRsvd5CtQPASYjD0aze-hnh_lQUGEWf2IPIkJqFw';

// API Configuration
const API_CONFIG = {
  BASE_URL: `https://script.google.com/macros/d/${DEPLOYMENT_ID}/usercallback`,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

/**
 * Make API call to Google Apps Script
 */
async function apiCall(action, data = {}) {
  const payload = {
    action: action,
    data: data
  };

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch(error) {
    console.error('[API Error]', error);
    return {ok: false, error: error.message};
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

/**
 * Format date as DD/MM/YYYY
 */
function formatDate(date) {
  if (typeof date === 'string') date = new Date(date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format time as HH:MM AM/PM
 */
function formatTime(date) {
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'});
}
