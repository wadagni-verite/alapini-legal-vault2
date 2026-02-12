// ============================================
// ALAPINI LEGAL DIGITAL VAULT - AUTH SCRIPT
// Gestion de l'authentification
// ============================================

// Codes d'accès par profil (à personnaliser)
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

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si déjà connecté
    checkExistingSession();
    
    // Gestionnaire de soumission du formulaire
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Vérifier session existante
function checkExistingSession() {
    const session = sessionStorage.getItem('alapini_session');
    if (session) {
        const sessionData = JSON.parse(session);
        // Vérifier validité de la session (24h)
        const sessionTime = new Date(sessionData.timestamp).getTime();
        const currentTime = new Date().getTime();
        const hoursPassed = (currentTime - sessionTime) / (1000 * 60 * 60);
        
        if (hoursPassed < 24) {
            // Session valide, rediriger vers dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Session expirée
            sessionStorage.removeItem('alapini_session');
        }
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    
    const userRole = document.getElementById('userRole').value;
    const accessCode = document.getElementById('accessCode').value;
    
    // Validation
    if (!userRole) {
        showNotification('Veuillez sélectionner votre profil', 'warning');
        return;
    }
    
    if (!accessCode) {
        showNotification('Veuillez entrer votre code d\'accès', 'warning');
        return;
    }
    
    // Vérifier code d'accès
    if (ACCESS_CODES[userRole] !== accessCode) {
        showNotification('Code d\'accès incorrect', 'error');
        // Ajouter tentative échouée au log
        logFailedAttempt(userRole);
        return;
    }
    
    // Créer session
    const sessionData = {
        role: userRole,
        permissions: PERMISSIONS[userRole],
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
    };
    
    // Sauvegarder session
    sessionStorage.setItem('alapini_session', JSON.stringify(sessionData));
    
    // Logger l'activité
    await logActivity('Connexion', userRole);
    
    // Afficher message de succès
    showNotification('Connexion réussie ! Redirection...', 'success');
    
    // Rediriger après 1 seconde
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Générer ID de session unique
function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Logger une activité
async function logActivity(action, role) {
    try {
        const activity = {
            date_activite: new Date().toISOString(),
            utilisateur_id: role,
            type_action: 'Connexion',
            cible: 'Page d\'authentification',
            details: `Connexion réussie avec le profil: ${role}`
        };
        
        const response = await fetch('/tables/activites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        });
        
        if (!response.ok) {
            console.error('Erreur lors du logging de l\'activité');
        }
    } catch (error) {
        console.error('Erreur réseau lors du logging:', error);
    }
}

// Logger tentative échouée
function logFailedAttempt(role) {
    const attempts = JSON.parse(localStorage.getItem('failed_attempts') || '[]');
    attempts.push({
        role: role,
        timestamp: new Date().toISOString(),
        ip: 'client-side' // Note: IP réelle nécessiterait backend
    });
    localStorage.setItem('failed_attempts', JSON.stringify(attempts));
    
    // Alerte après 3 tentatives échouées
    if (attempts.length >= 3) {
        showNotification('Attention: Plusieurs tentatives échouées détectées', 'error');
    }
}

// Afficher notification
function showNotification(message, type = 'info') {
    // Créer élément notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconForType(type)}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Retirer après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Obtenir icône selon le type
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
