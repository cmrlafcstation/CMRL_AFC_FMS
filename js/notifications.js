/**
 * Notification Manager - Toast and alert notifications
 */

class NotificationManager {
    constructor() {
        this.containerId = 'toastContainer';
        this.defaultDuration = 5000;
        this.shownNotifications = new Set();
    }

    showToast(type, title, message, duration = this.defaultDuration) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Toast container not found');
            return;
        }

        const notificationKey = `${type}-${title}`;
        if (this.shownNotifications.has(notificationKey)) {
            return;
        }
        this.shownNotifications.add(notificationKey);

        const bgClass = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';

        const icon = {
            'success': '<i class="fas fa-check-circle"></i>',
            'error': '<i class="fas fa-exclamation-circle"></i>',
            'warning': '<i class="fas fa-exclamation-triangle"></i>',
            'info': '<i class="fas fa-info-circle"></i>'
        }[type] || '<i class="fas fa-info-circle"></i>';

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-header ${bgClass} text-white">
                <span class="me-2">${icon}</span>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        container.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        setTimeout(() => {
            this.shownNotifications.delete(notificationKey);
            toast.remove();
        }, duration);
    }

    showAlert(type, title, message, buttons = []) {
        const alertHtml = `
            <div class="alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show" role="alert">
                <strong>${title}</strong><br>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.insertAdjacentHTML('beforeend', alertHtml);
        }
    }

    showConfirm(title, message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">${message}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const bsModal = new bootstrap.Modal(modal);
        document.getElementById('confirmBtn').onclick = () => {
            onConfirm();
            bsModal.hide();
            modal.remove();
        };
        modal.addEventListener('hidden.bs.modal', () => {
            if (onCancel) onCancel();
            modal.remove();
        });
        bsModal.show();
    }
}

const notificationManager = new NotificationManager();

function showToast(type, title, message) {
    notificationManager.showToast(type, title, message);
}

function showAlert(type, title, message) {
    notificationManager.showAlert(type, title, message);
}
