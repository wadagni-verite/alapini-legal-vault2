r: '#8b5cf6'
        },
        {
            id: 'cat_13',
            name: "Preuves Photographiques et Vidéos",
            icon: 'fa-camera',
            color: '#f43f5e'
        },
        {
            id: 'cat_14',
            name: "Contrats et Engagements Commerciaux",
            icon: 'fa-file-signature',
            color: '#14b8a6'
        },
        {
            id: 'cat_15',
            name: "AUTRES (Documents divers)",
            icon: 'fa-folder',
            color: '#64748b'
        }
    ],
    
    // Profils utilisateurs
    ROLES: {
        'expert': {
            label: 'Expert en Négociation',
            icon: 'fa-user-tie',
            permissions: ['read', 'write', 'delete', 'admin', 'export', 'manage_users']
        },
        'cliente': {
            label: 'Mme ALAPINI (Cliente)',
            icon: 'fa-user',
            permissions: ['read', 'write', 'export']
        },
        'avocat': {
            label: 'Avocat Conseil',
            icon: 'fa-scale-balanced',
            permissions: ['read', 'write', 'export', 'comment']
        },
        'consultant': {
            label: 'Consultant / Expert',
            icon: 'fa-user-graduate',
            permissions: ['read', 'export', 'comment']
        },
        'conseil': {
            label: 'Expert Technique',
            icon: 'fa-user-graduate',
            permissions: ['read', 'export', 'comment']
        },
        'vinci': {
            label: 'Partie Adverse (VINCI)',
            icon: 'fa-building',
            permissions: ['read']
        },
        'observateur': {
            label: 'Observateur',
            icon: 'fa-eye',
            permissions: ['read']
        }
    },
    
    // Statuts de documents
    STATUS: {
        'En attente': { color: '#f59e0b', icon: 'fa-clock' },
        'Validé': { color: '#10b981', icon: 'fa-check-circle' },
        'À compléter': { color: '#ef4444', icon: 'fa-exclamation-circle' },
        'Archivé': { color: '#6b7280', icon: 'fa-archive' }
    },
    
    // Types d'événements chronologie
    EVENT_TYPES: {
        'Sinistre': { color: '#ef4444', icon: 'fa-fire' },
        'Correspondance': { color: '#3b82f6', icon: 'fa-envelope' },
        'Action Juridique': { color: '#8b5cf6', icon: 'fa-gavel' },
        'Expertise': { color: '#06b6d4', icon: 'fa-microscope' },
        'Négociation': { color: '#10b981', icon: 'fa-handshake' },
        'Autre': { color: '#6b7280', icon: 'fa-info-circle' }
    },
    
    // API Base URL (utilise l'API REST Table intégrée)
    API_BASE: '/tables',
    
    // Formats de fichiers acceptés
    ALLOWED_FILE_TYPES: {
        'application/pdf': 'PDF',
        'image/jpeg': 'JPEG',
        'image/png': 'PNG',
        'application/msword': 'DOC',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
        'video/mp4': 'MP4'
    },
    
    // Taille max fichier (en octets) - 50MB
    MAX_FILE_SIZE: 50 * 1024 * 1024
};

// Export global
window.CONFIG = CONFIG;
