// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
    // Obtenir session utilisateur
    getSession() {
        const session = sessionStorage.getItem('alapini_session');
        if (session) {
            try {
                return JSON.parse(session);
            } catch (e) {
                console.error('Erreur parsing session:', e);
                return null;
            }
        }
        return null;
    },
    
    // Vérifier authentification
    requireAuth() {
        const session = this.getSession();
        if (!session) {
            window.location.href = 'index.html';
            return false;
        }
        return session;
    },
    
    // Vérifier permission
    hasPermission(permission) {
        const session = this.getSession();
        if (!session) return false;
        return session.permissions && session.permissions.includes(permission);
    },
    
    // Déconnexion
    logout() {
        sessionStorage.removeItem('alapini_session');
        localStorage.removeItem('cached_documents');
        window.location.href = 'index.html';
    },
    
    // Formater date
    formatDate(dateString, format = 'full') {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const options = {
            full: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            },
            short: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            time: { 
                hour: '2-digit', 
                minute: '2-digit' 
            }
        };
        
        return date.toLocaleDateString('fr-FR', options[format] || options.full);
    },
    
    // Formater taille fichier
    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },
    
    // Calculer hash SHA-256 d'un fichier
    async calculateSHA256(file) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    
    // Afficher notification
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    // Afficher loader
    showLoader(message = 'Chargement...') {
        let loader = document.getElementById('globalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'global-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p class="loader-message">${message}</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else {
            loader.querySelector('.loader-message').textContent = message;
        }
        
        setTimeout(() => loader.classList.add('show'), 10);
    },
    
    // Cacher loader
    hideLoader() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.classList.remove('show');
            setTimeout(() => loader.remove(), 300);
        }
    },
    
    // Confirmer action
    async confirm(message, title = 'Confirmation') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.innerHTML = `
                <div class="confirm-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="confirm-actions">
                        <button class="btn-cancel">Annuler</button>
                        <button class="btn-confirm">Confirmer</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
            
            modal.querySelector('.btn-cancel').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
                resolve(false);
            });
            
            modal.querySelector('.btn-confirm').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
                resolve(true);
            });
        });
    },
    
    // Gérer erreurs API
    handleAPIError(error, customMessage = null) {
        console.error('API Error:', error);
        const message = customMessage || 'Une erreur est survenue. Veuillez réessayer.';
        this.showNotification(message, 'error');
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Télécharger fichier
    downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    
    // Générer ID unique
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Obtenir info catégorie
    getCategoryInfo(categoryName) {
        return CONFIG.CATEGORIES.find(cat => cat.name === categoryName) || CONFIG.CATEGORIES[CONFIG.CATEGORIES.length - 1];
    },
    
    // Obtenir couleur statut
    getStatusColor(status) {
        return CONFIG.STATUS[status]?.color || '#6b7280';
    },
    
    // Obtenir icône statut
    getStatusIcon(status) {
        return CONFIG.STATUS[status]?.icon || 'fa-circle';
    },
    
    // Exporter en JSON
    exportToJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, filename);
        URL.revokeObjectURL(url);
    },
    
    // Exporter en CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            this.showNotification('Aucune donnée à exporter', 'warning');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    let value = row[header];
                    if (value === null || value === undefined) value = '';
                    value = String(value).replace(/"/g, '""');
                    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                        value = `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, filename);
        URL.revokeObjectURL(url);
    }
};

// Styles pour utilities
const utilityStyles = document.createElement('style');
utilityStyles.textContent = `
    .global-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    .global-loader.show {
        opacity: 1;
    }
    
    .loader-content {
        text-align: center;
        color: white;
    }
    
    .loader-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .loader-message {
        font-size: 1.1rem;
        font-weight: 500;
    }
    
    .confirm-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    .confirm-modal.show {
        opacity: 1;
    }
    
    .confirm-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .confirm-content h3 {
        margin: 0 0 1rem 0;
        color: #1e3a8a;
        font-size: 1.5rem;
    }
    
    .confirm-content p {
        margin: 0 0 1.5rem 0;
        color: #4b5563;
        line-height: 1.6;
    }
    
    .confirm-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .confirm-actions button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-cancel {
        background: #e5e7eb;
        color: #374151;
    }
    
    .btn-cancel:hover {
        background: #d1d5db;
    }
    
    .btn-confirm {
        background: #1e3a8a;
        color: white;
    }
    
    .btn-confirm:hover {
        background: #1e40af;
    }
`;
document.head.appendChild(utilityStyles);

// Export global
window.Utils = Utils;
