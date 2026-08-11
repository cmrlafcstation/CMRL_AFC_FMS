/**
 * UI Utilities - Date, badge, table, form, export functions
 */

class UIUtils {
    static formatDate(date) {
        return moment(date).format('DD MMM YYYY');
    }

    static formatTime(date) {
        return moment(date).format('HH:mm');
    }

    static formatDateTime(date) {
        return moment(date).format('DD MMM YYYY, HH:mm');
    }

    static getTimeAgo(date) {
        return moment(date).fromNow();
    }

    static calculateAge(createdAt) {
        return moment().diff(moment(createdAt), 'hours');
    }

    static createStatusBadge(status) {
        const colors = {
            'Open': 'danger',
            'Acknowledged': 'warning',
            'In Progress': 'info',
            'Pending': 'secondary',
            'Closed': 'success'
        };
        const color = colors[status] || 'secondary';
        return `<span class="badge bg-${color}">${status}</span>`;
    }

    static createPriorityBadge(priority) {
        const colors = {
            'High': 'danger',
            'Medium': 'warning',
            'Low': 'info',
            'NoCritical': 'secondary'
        };
        const color = colors[priority] || 'secondary';
        return `<span class="badge bg-${color}">${priority}</span>`;
    }

    static createSeverityBadge(severity) {
        const colors = {
            'High': 'danger',
            'Medium': 'warning',
            'Low': 'info',
            'Critical': 'danger'
        };
        const color = colors[severity] || 'secondary';
        return `<span class="badge bg-${color}">${severity}</span>`;
    }

    static createTableRow(data) {
        let html = '<tr>';
        for (const [key, value] of Object.entries(data)) {
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
        return html;
    }

    static formatTableCell(value, type) {
        if (!value) return '-';
        
        switch(type) {
            case 'date':
                return this.formatDate(value);
            case 'datetime':
                return this.formatDateTime(value);
            case 'time-ago':
                return this.getTimeAgo(value);
            case 'status':
                return this.createStatusBadge(value);
            case 'priority':
                return this.createPriorityBadge(value);
            default:
                return value;
        }
    }

    static createPagination(current, total) {
        if (total <= 1) return '';
        
        let html = '<nav><ul class="pagination">';
        
        if (current > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" data-page="${current - 1}">Previous</a></li>`;
        }
        
        for (let i = 1; i <= total; i++) {
            const active = i === current ? 'active' : '';
            html += `<li class="page-item ${active}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        
        if (current < total) {
            html += `<li class="page-item"><a class="page-link" href="#" data-page="${current + 1}">Next</a></li>`;
        }
        
        html += '</ul></nav>';
        return html;
    }

    static enableFormField(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = false;
            element.classList.remove('disabled');
        }
    }

    static disableFormField(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = true;
            element.classList.add('disabled');
        }
    }

    static clearFormField(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
        }
    }

    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            showToast('warning', 'No Data', 'No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            });
            csv.push(values.join(','));
        });

        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    }

    static exportToExcel(data, filename) {
        if (!data || data.length === 0) {
            showToast('warning', 'No Data', 'No data to export');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${filename}.xlsx`);
    }

    static printTable(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const printWindow = window.open('', '', 'width=900,height=600');
        printWindow.document.write(`<html><head><title>Print</title></head><body>${table.outerHTML}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    }
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        if (backdrop) backdrop.remove();
    } else {
        sidebar.classList.add('show');
        const bd = document.createElement('div');
        bd.className = 'sidebar-backdrop';
        bd.onclick = toggleSidebar;
        document.body.appendChild(bd);
    }
}

// Setup sidebar toggles
document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggleBtns = document.querySelectorAll('.sidebar-toggle');
    sidebarToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleSidebar);
    });
});
