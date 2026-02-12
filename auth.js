// ============================================
// ALAPINI LEGAL DIGITAL VAULT - AUTH SCRIPT
// Gestion de l'authentification
// ============================================

// Codes d'accès par profil
const ACCESS_CODES = {
    'expert': 'ALAPINI2026EXPERT',
    'cliente': 'ALAPINI2026CLIENT',
    'avocat': 'ALAPINI2026AVOCAT',
    'consultant': 'ALAPINI2026CONSULT',
    'conseil': 'ALAPINI2026CONSULT',
    'vinci': 'ALAPINI2026VINCI',
    'observateur': 'ALAPINI2026VIEW'
};

// Permissions par profil
const PERMISSIONS = {
    'expert': ['read', 'write', 'delete', 'admin', 'export', 'manage_users'],
    'cliente': ['read', 'write', 'export'],
    'avocat': ['read', 'write', 'export', 'comment'],
    'consultant': ['read', 'export', 'comment'],
    'conseil': ['read', 'export', 'comment'],
    'vinci': ['read'],
    'observateur': ['read']
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Vérifier session existante
function checkExistingSession() {
    const session = sessionStorage.getItem('alapini_session');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const sessionTime = new Date(sessionData.timestamp).getTime();
            const currentTime = new Date().getTime();
            const hoursPassed = (currentTime - sessionTime) / (1000 * 60 * 60);
            
            if (hoursPassed < 24) {
                window.location.href = 'dashboard.html';
            } else {
                sessionStorage.removeItem('alapini_session');
            }
        } catch (e) {
            sessionStorage.removeItem('alapini_session');
        }
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    
    const userRole = document.getElementById('userRole').value;
    const accessCode = document.getElementById('accessCode').value;
    
    if (!userRole) {
        showNotification('Veuillez sélectionner votre profil', 'warning');
        return;
    }
    
    if (!accessCode) {
        showNotification('Veuillez entrer votre code d\'accès', 'warning');
        return;
    }
    
    if (ACCESS_CODES[userRole] !== accessCode) {
        showNotification('Code d\'accès incorrect', 'error');
        return;
    }
    
    const sessionData = {
        role: userRole,
        permissions: PERMISSIONS[userRole],
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
    };
    
    sessionStorage.setItem('alapini_session', JSON.stringify(sessionData));
    showNotification('Connexion réussie ! Redirection...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas fa-${getIconForType(type)}"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Styles pour notifications (injectés dynamiquement)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-in-out;
        border-left: 4px solid;
        min-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #10b981;
        color: #065f46;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error {
        border-left-color: #ef4444;
        color: #991b1b;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification-warning {
        border-left-color: #f59e0b;
        color: #92400e;
    }
    
    .notification-warning i {
        color: #f59e0b;
    }
    
    .notification-info {
        border-left-color: #3b82f6;
        color: #1e3a8a;
    }
    
    .notification-info i {
        color: #3b82f6;
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification span {
        font-weight: 500;
        font-size: 0.95rem;
    }
    
    @media (max-width: 640px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(notificationStyles);
