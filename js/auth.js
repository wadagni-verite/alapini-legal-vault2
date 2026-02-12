// ============================================
// ALAPINI LEGAL DIGITAL VAULT - AUTH SCRIPT
// Gestion de l'authentification
// ============================================

// Codes d'accès par profil (à personnaliser)
const ACCESS_CODES = {
    'expert': 'AL4P1N1-EXP3RT-N3G0C14T10N-2026#BJ-FR',
    'cliente': 'D0R1S-AL4P1N1-CL13NT3-PR1V4T3-2026!',
    'avocat': 'AV0C4T-JURD1QU3-AL4P1N1-S3CUR3-2026$',
    'consultant': 'C0NSULT4NT-T3CHN1QU3-DOSS13R-2026@',
    'conseil': 'C0NS31L-3XP3RT1S3-AL4P1N1-4M-EUR0-2026%',
    'vinci': 'V1NC1-S4T0M-P4RT13-N3G0C14T10N-2026&',
    'observateur': '0BS3RV4T3UR-4UTH0R1S3-R34D-0NLY-2026*'
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
            c<span class="cursor">█</span>
