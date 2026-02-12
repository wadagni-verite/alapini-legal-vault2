'Attention: Plusieurs tentatives échouées détectées', 'error');
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
