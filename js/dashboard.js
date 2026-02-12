{
        categoryCounts[cat.name] = 0;
    });
    
    allDocuments.forEach(doc => {
        if (categoryCounts[doc.categorie] !== undefined) {
            categoryCounts[doc.categorie]++;
        }
    });
    
    // Afficher les 8 premières catégories
    const html = CONFIG.CATEGORIES.slice(0, 8).map(cat => {
        const count = categoryCounts[cat.name] || 0;
        const total = 10; // Objectif arbitraire
        const progress = Math.min((count / total) * 100, 100);
        
        return `
            <div class="category-item" onclick="window.location.href='documents.html?category=${encodeURIComponent(cat.name)}'">
                <div class="category-header">
                    <div class="category-icon" style="background: ${cat.color};">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <div class="category-info">
                        <h4>${cat.name.length > 40 ? cat.name.substring(0, 40) + '...' : cat.name}</h4>
                        <span class="category-count">${count} document${count > 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${progress}%; background: ${cat.color};"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Afficher activités récentes
function renderRecentActivities() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    if (allActivities.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#6b7280;padding:2rem;">Aucune activité récente</p>';
        return;
    }
    
    const iconMap = {
        'Connexion': { icon: 'fa-sign-in-alt', class: 'icon-upload' },
        'Upload Document': { icon: 'fa-upload', class: 'icon-upload' },
        'Consultation': { icon: 'fa-eye', class: 'icon-edit' },
        'Modification': { icon: 'fa-edit', class: 'icon-edit' },
        'Suppression': { icon: 'fa-trash', class: 'icon-delete' },
        'Commentaire': { icon: 'fa-comment', class: 'icon-edit' },
        'Export': { icon: 'fa-download', class: 'icon-upload' }
    };
    
    const html = allActivities.slice(0, 5).map(activity => {
        const iconInfo = iconMap[activity.type_action] || { icon: 'fa-info-circle', class: 'icon-upload' };
        const timeAgo = getTimeAgo(activity.date_activite);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconInfo.class}">
                    <i class="fas ${iconInfo.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.type_action}</h4>
                    <p>${activity.details || activity.cible}</p>
                </div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Calculer temps écoulé
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
}

// Initialiser event listeners
function initializeEventListeners() {
    // Bouton déconnexion
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            const confirmed = await Utils.confirm(
                'Êtes-vous sûr de vouloir vous déconnecter ?',
                'Déconnexion'
            );
            if (confirmed) {
                Utils.logout();
            }
        });
    }
    
    // Toggle sidebar mobile
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Export dossier complet
    const btnExportAll = document.getElementById('btnExportAll');
    if (btnExportAll) {
        btnExportAll.addEventListener('click', exportCompleteDossier);
    }
    
    // Recherche globale
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.toLowerCase();
            if (query.length >= 3) {
                searchDocuments(query);
            }
        }, 300));
    }
}

// Recherche de documents
function searchDocuments(query) {
    const results = allDocuments.filter(doc => 
        doc.titre.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.categorie.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        Utils.showNotification(`${results.length} document(s) trouvé(s)`, 'info');
        // Rediriger vers page documents avec résultats
        window.location.href = `documents.html?search=${encodeURIComponent(query)}`;
    } else {
        Utils.showNotification('Aucun document trouvé', 'warning');
    }
}

// Exporter dossier complet
async function exportCompleteDossier() {
    try {
        Utils.showLoader('Préparation de l\'export...');
        
        const exportData = {
            dossier: 'ALAPINI-VINCI-2026',
            date_export: new Date().toISOString(),
            documents: allDocuments,
            statistiques: {
                total_documents: allDocuments.length,
                par_categorie: {},
                par_statut: {}
            }
        };
        
        // Calculer statistiques
        CONFIG.CATEGORIES.forEach(cat => {
            const count = allDocuments.filter(doc => doc.categorie === cat.name).length;
            exportData.statistiques.par_categorie[cat.name] = count;
        });
        
        Object.keys(CONFIG.STATUS).forEach(status => {
            const count = allDocuments.filter(doc => doc.statut === status).length;
            exportData.statistiques.par_statut[status] = count;
        });
        
        // Export JSON
        const filename = `ALAPINI_Dossier_Complet_${new Date().toISOString().split('T')[0]}.json`;
        Utils.exportToJSON(exportData, filename);
        
        Utils.hideLoader();
        Utils.showNotification('Export réussi !', 'success');
    } catch (error) {
        Utils.hideLoader();
        Utils.handleAPIError(error, 'Erreur lors de l\'export');
    }
}
