// ============================================
// DOCUMENTS PAGE SCRIPT
// ============================================

let allDocuments = [];
let filteredDocuments = [];
let currentView = 'grid';

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier authentification
    const session = Utils.requireAuth();
    if (!session) return;
    
    // Initialiser UI
    initializeUI(session);
    
    // Charger catégories dans le filtre
    loadCategoryFilter();
    
    // Charger documents
    await loadDocuments();
    
    // Initialiser event listeners
    initializeEventListeners();
    
    // Vérifier si recherche dans URL
    checkURLParams();
});

function initializeUI(session) {
    const roleInfo = CONFIG.ROLES[session.role];
    document.getElementById('userName').textContent = roleInfo.label;
    document.getElementById('userRole').textContent = session.role.toUpperCase();
    
    const avatar = document.getElementById('userAvatar');
    const avatarIcon = avatar.querySelector('i');
    avatarIcon.className = `fas ${roleInfo.icon}`;
}

function loadCategoryFilter() {
    const select = document.getElementById('filterCategory');
    CONFIG.CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function loadDocuments() {
    try {
        Utils.showLoader('Chargement des documents...');
        
        const response = await fetch(`${CONFIG.API_BASE}/documents?limit=1000`);
        
        if (!response.ok) {
            if (response.status === 404) {
                allDocuments = [];
                displayDocuments([]);
                Utils.hideLoader();
                return;
            }
            throw new Error('Erreur chargement documents');
        }
        
        const data = await response.json();
        allDocuments = data.data || [];
        filteredDocuments = [...allDocuments];
        
        displayDocuments(filteredDocuments);
        updateDocumentCount();
        
        Utils.hideLoader();
    } catch (error) {
        Utils.hideLoader();
        Utils.handleAPIError(error, 'Erreur lors du chargement des documents');
        allDocuments = [];
        displayDocuments([]);
    }
}

function displayDocuments(documents) {
    const grid = document.getElementById('documentsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (documents.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = documents.map(doc => createDocumentCard(doc)).join('');
    
    // Ajouter event listeners sur les cartes
    document.querySelectorAll('.document-card').forEach(card => {
        card.addEventListener('click', () => {
            const docId = card.dataset.id;
            showDocumentDetails(docId);
        });
    });
}

function createDocumentCard(doc) {
    const catInfo = Utils.getCategoryInfo(doc.categorie);
    const statusClass = getStatusClass(doc.statut);
    const fileIcon = getFileIcon(doc.type_mime);
    
    return `
        <div class="document-card" data-id="${doc.id}">
            <div class="document-header">
                <div class="document-icon" style="background: ${catInfo.color};">
                    <i class="fas ${fileIcon}"></i>
                </div>
                <div class="document-info">
                    <h3 title="${doc.titre}">${doc.titre}</h3>
                    <div class="document-category">
                        <i class="fas ${catInfo.icon}"></i>
                        ${catInfo.name.substring(0, 30)}...
                    </div>
                </div>
            </div>
            <div class="document-status ${statusClass}">
                ${doc.statut}
            </div>
            <div class="document-description">
                ${doc.description || 'Aucune description'}
            </div>
            <div class="document-meta">
                <span><i class="fas fa-calendar"></i> ${Utils.formatDate(doc.date_depot, 'short')}</span>
                <span><i class="fas fa-user"></i> ${doc.deposant}</span>
                <span><i class="fas fa-file"></i> ${Utils.formatFileSize(doc.taille_fichier)}</span>
            </div>
            ${doc.tags && doc.tags.length > 0 ? `
                <div class="document-tags">
                    ${doc.tags.slice(0, 3).map(tag => `<span class="document-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function getStatusClass(status) {
    const map = {
        'Validé': 'status-validated',
        'En attente': 'status-pending',
        'À compléter': 'status-incomplete',
        'Archivé': 'status-archived'
    };
    return map[status] || 'status-pending';
}

function getFileIcon(mimeType) {
    if (!mimeType) return 'fa-file';
    
    if (mimeType.includes('pdf')) return 'fa-file-pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'fa-file-word';
    if (mimeType.includes('image')) return 'fa-file-image';
    if (mimeType.includes('video')) return 'fa-file-video';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fa-file-excel';
    
    return 'fa-file';
}

function updateDocumentCount() {
    const count = filteredDocuments.length;
    const text = count === 0 ? 'Aucun document' : count === 1 ? '1 document' : `${count} documents`;
    document.getElementById('documentsCount').textContent = text;
    document.getElementById('docCount').textContent = allDocuments.length;
}

function initializeEventListeners() {
    // Bouton déconnexion
    document.getElementById('btnLogout').addEventListener('click', async () => {
        if (await Utils.confirm('Êtes-vous sûr de vouloir vous déconnecter ?', 'Déconnexion')) {
            Utils.logout();
        }
    });
    
    // Toggle sidebar mobile
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Recherche
    document.getElementById('searchInput').addEventListener('input', Utils.debounce((e) => {
        applyFilters();
    }, 300));
    
    // Filtres
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    
    // Réinitialiser filtres
    document.getElementById('btnResetFilters').addEventListener('click', resetFilters);
    
    // Basculer vue
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentView = btn.dataset.view;
            const grid = document.getElementById('documentsGrid');
            
            if (currentView === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
    
    // Fermer modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('documentModal').addEventListener('click', (e) => {
        if (e.target.id === 'documentModal') {
            closeModal();
        }
    });
}

function applyFilters() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Filtrer
    filteredDocuments = allDocuments.filter(doc => {
        const matchSearch = !searchQuery || 
            doc.titre.toLowerCase().includes(searchQuery) ||
            doc.description?.toLowerCase().includes(searchQuery) ||
            doc.categorie.toLowerCase().includes(searchQuery);
        
        const matchCategory = !categoryFilter || doc.categorie === categoryFilter;
        const matchStatus = !statusFilter || doc.statut === statusFilter;
        
        return matchSearch && matchCategory && matchStatus;
    });
    
    // Trier
    filteredDocuments.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date_depot) - new Date(a.date_depot);
            case 'date-asc':
                return new Date(a.date_depot) - new Date(b.date_depot);
            case 'title-asc':
                return a.titre.localeCompare(b.titre);
            case 'title-desc':
                return b.titre.localeCompare(a.titre);
            default:
                return 0;
        }
    });
    
    displayDocuments(filteredDocuments);
    updateDocumentCount();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('sortBy').value = 'date-desc';
    
    applyFilters();
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const category = urlParams.get('category');
    if (category) {
        document.getElementById('filterCategory').value = category;
        applyFilters();
    }
    
    const search = urlParams.get('search');
    if (search) {
        document.getElementById('searchInput').value = search;
        applyFilters();
    }
}

function showDocumentDetails(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    const modal = document.getElementById('documentModal');
    const modalBody = document.getElementById('modalBody');
    const catInfo = Utils.getCategoryInfo(doc.categorie);
    
    modalBody.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> Informations Générales</h3>
            <div class="detail-row">
                <div class="detail-label">Titre :</div>
                <div class="detail-value"><strong>${doc.titre}</strong></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Catégorie :</div>
                <div class="detail-value">
                    <i class="fas ${catInfo.icon}" style="color: ${catInfo.color};"></i>
                    ${doc.categorie}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Statut :</div>
                <div class="detail-value">
                    <span class="document-status ${getStatusClass(doc.statut)}">${doc.statut}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Description :</div>
                <div class="detail-value">${doc.description || 'Aucune description'}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-file"></i> Fichier</h3>
            <div class="detail-row">
                <div class="detail-label">Type :</div>
                <div class="detail-value">${doc.type_mime || 'Non spécifié'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Taille :</div>
                <div class="detail-value">${Utils.formatFileSize(doc.taille_fichier)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">URL :</div>
                <div class="detail-value">
                    ${doc.url_fichier ? `<a href="${doc.url_fichier}" target="_blank">Ouvrir le fichier</a>` : 'Non disponible'}
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-shield-check"></i> Sécurité & Intégrité</h3>
            <div class="detail-row">
                <div class="detail-label">Hash SHA-256 :</div>
                <div class="detail-value">
                    <div class="hash-display">${doc.hash_sha256 || 'Non calculé'}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date de dépôt :</div>
                <div class="detail-value">${Utils.formatDate(doc.date_depot)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Déposant :</div>
                <div class="detail-value">${doc.deposant}</div>
            </div>
        </div>
        
        ${doc.tags && doc.tags.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-tags"></i> Tags</h3>
                <div class="document-tags">
                    ${doc.tags.map(tag => `<span class="document-tag">${tag}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        
        ${doc.commentaires ? `
            <div class="detail-section">
                <h3><i class="fas fa-comments"></i> Commentaires</h3>
                <div class="detail-value">${doc.commentaires}</div>
            </div>
        ` : ''}
    `;
    
    // Ajouter actions si permissions
    const session = Utils.getSession();
    if (session && (session.permissions.includes('write') || session.permissions.includes('admin'))) {
        modalBody.innerHTML += `
            <div class="modal-actions">
                ${doc.url_fichier ? `<button class="btn-download" onclick="window.open('${doc.url_fichier}', '_blank')">
                    <i class="fas fa-download"></i>
                    Télécharger
                </button>` : ''}
                <button class="btn-edit" onclick="editDocument('${doc.id}')">
                    <i class="fas fa-edit"></i>
                    Modifier
                </button>
                ${session.permissions.includes('delete') ? `
                    <button class="btn-delete" onclick="deleteDocument('${doc.id}')">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('documentModal');
    modal.classList.remove('show');
}

async function deleteDocument(docId) {
    if (!await Utils.confirm('Êtes-vous sûr de vouloir supprimer ce document ?', 'Suppression')) {
        return;
    }
    
    try {
        Utils.showLoader('Suppression en cours...');
        
        const response = await fetch(`${CONFIG.API_BASE}/documents/${docId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erreur suppression');
        }
        
        Utils.hideLoader();
        Utils.showNotification('Document supprimé avec succès', 'success');
        
        closeModal();
        await loadDocuments();
    } catch (error) {
        Utils.hideLoader();
        Utils.handleAPIError(error, 'Erreur lors de la suppression');
    }
}

function editDocument(docId) {
    window.location.href = `upload.html?edit=${docId}`;
}
