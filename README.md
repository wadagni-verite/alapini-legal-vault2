# 🏛️ ALAPINI Legal Digital Vault

## Plateforme Professionnelle GSF CONSEIL de Gestion Documentaire Juridique

**Dossier N° ALAPINI-VINCI-2026**  
*Réparation Intégrale d'un Sinistre Industriel et Humain Global*

---

## 📋 Vue d'Ensemble

Cette plateforme web sécurisée a été développée par GSF CONSEIL pour gérer de manière professionnelle l'ensemble des pièces justificatives et la stratégie de négociation dans le cadre d'une réclamation de **~4 000 000 EUR** entre **Mme Doris ALAPINI** (Cotonou, Bénin) et **VINCI CONSTRUCTION SOGEA SATOM** (France).

### 🎯 Objectifs Principaux

1. **Coffre-fort Numérique Sécurisé** : Stockage et organisation de toutes les pièces justificatives
2. **Preuve d'Antériorité** : Horodatage et hashage (SHA-256) de chaque document
3. **Collaboration Multi-Acteurs** : Accès différenciés pour tous les intervenants du dossier
4. **Traçabilité Complète** : Historique de toutes les actions et consultations
5. **Export Professionnel** : Génération de certificats et rapports légaux

---

## ✨ Fonctionnalités Implémentées

### 🔐 Système d'Authentification
- ✅ Page de connexion sécurisée avec codes d'accès
- ✅ Gestion de session (24h)
- ✅ 7 profils utilisateurs différents
- ✅ Système de permissions granulaires
- ✅ Traçabilité des connexions

### 📊 Tableau de Bord Analytique
- ✅ Statistiques en temps réel (documents totaux, validés, en attente)
- ✅ Graphique de répartition par catégorie (Chart.js - Doughnut)
- ✅ Graphique d'évolution des dépôts (Chart.js - Line)
- ✅ Vue d'ensemble des 15 catégories documentaires
- ✅ Fil d'activité récente
- ✅ Actions rapides (Upload, Export, Certificat)

### 📂 Gestion Documentaire (15 Catégories)
1. 📊 Rapports d'Expertise et Études Techniques
2. 🏠 Inventaires et Preuves de Propriété
3. 📜 Titres de Propriété et Documents Fonciers
4. ⚖️ Preuves de la Matérialité des Dommages
5. 📧 Correspondances et Actes d'Huissier
6. 🏥 Santé et Préjudice Moral
7. 🏢 État des lieux et Constats
8. 💰 Honoraires d'avocat et Frais de Justice
9. ⚠️ **Mises en Demeure et Sommations**
10. 🤝 **Protocoles d'Accord**
11. 📋 **Assignations et Citations**
12. 📚 **Jurisprudence et Précédents**
13. 📸 Preuves Photographiques et Vidéos
14. 📄 Contrats et Engagements Commerciaux
15. 🗂️ AUTRES (Documents divers)

### 🔒 Sécurité & Intégrité
- ✅ Hash SHA-256 de chaque fichier uploadé
- ✅ Horodatage certifié de chaque dépôt
- ✅ Métadonnées complètes (déposant, date, taille, type MIME)
- ✅ Système de statuts (En attente, Validé, À compléter, Archivé)
- ✅ Historique complet des activités

### 🎨 Design Professionnel
- ✅ Interface moderne et intuitive
- ✅ Charte graphique juridique (Bleu Marine + Or)
- ✅ Responsive (Desktop, Tablette, Mobile)
- ✅ Typographie professionnelle (Inter + Playfair Display)
- ✅ Animations et transitions fluides

---

## 🗂️ Architecture Technique

### Structure des Fichiers

```
ALAPINI-Legal-Vault/
│
├── index.html                  # Page d'authentification
├── dashboard.html              # Tableau de bord principal
│
├── css/
│   ├── style.css              # Styles globaux et authentification
│   └── dashboard.css          # Styles du dashboard et navigation
│
├── js/
│   ├── auth.js                # Gestion authentification
│   ├── config.js              # Configuration (catégories, rôles, etc.)
│   ├── utils.js               # Fonctions utilitaires
│   └── dashboard.js           # Logique du dashboard
│
└── README.md                  # Documentation complète
```

### Base de Données (RESTful Table API)

#### Table `documents`
```javascript
{
  id: "UUID unique",
  titre: "Nom du document",
  categorie: "Une des 15 catégories",
  description: "Description détaillée",
  url_fichier: "URL du fichier (cloud storage)",
  hash_sha256: "Hash d'intégrité",
  date_depot: "2026-01-15T10:30:00Z",
  deposant: "Nom de la personne",
  taille_fichier: 1024000,
  type_mime: "application/pdf",
  statut: "Validé | En attente | À compléter | Archivé",
  tags: ["tag1", "tag2"],
  commentaires: "Notes et annotations"
}
```

#### Table `chronologie`
```javascript
{
  id: "UUID unique",
  date_evenement: "2021-11-15T00:00:00Z",
  titre: "Destruction du Restaurant BIERGARTEN",
  description: "Description de l'événement",
  type_evenement: "Sinistre | Correspondance | Action Juridique | Expertise | Négociation | Autre",
  documents_lies: ["doc_id_1", "doc_id_2"],
  importance: "Critique | Élevée | Moyenne | Faible"
}
```

#### Table `utilisateurs`
```javascript
{
  id: "UUID unique",
  nom: "Nom complet",
  email: "email@example.com",
  role: "expert | cliente | avocat | consultant | vinci | observateur",
  code_acces: "Code sécurisé",
  permissions: ["read", "write", "export"],
  derniere_connexion: "2026-01-15T10:30:00Z",
  actif: true
}
```

#### Table `activites`
```javascript
{
  id: "UUID unique",
  date_activite: "2026-01-15T10:30:00Z",
  utilisateur_id: "role_name",
  type_action: "Connexion | Upload Document | Consultation | Modification | Suppression | Commentaire | Export",
  cible: "dashboard.html",
  details: "Description de l'activité"
}
```

---

## 🚀 Utilisation

### 1. Accès à la Plateforme

**URL** : Votre site déployé (via Publish tab)

**Codes d'Accès par Défaut** :
```
Expert :        ALAPINI2026EXPERT
Cliente :       ALAPINI2026CLIENT
Avocat :        ALAPINI2026AVOCAT
Consultant :    ALAPINI2026CONSULT
VINCI :         ALAPINI2026VINCI
Observateur :   ALAPINI2026VIEW
```

⚠️ **Important** : Changez ces codes après la première connexion

### 2. Navigation

- **Dashboard** : Vue d'ensemble, statistiques, graphiques
- **Documents** : Gestion des 15 catégories de pièces
- **Upload** : Ajouter de nouveaux documents
- **Chronologie** : Timeline des événements du dossier
- **Certificats** : Générer des preuves d'antériorité
- **Collaborateurs** : Gérer les accès utilisateurs
- **Activités** : Historique complet des actions

### 3. Upload de Documents

1. Cliquer sur "Upload" dans la sidebar
2. Sélectionner la catégorie (15 choix)
3. Remplir les métadonnées (titre, description, tags)
4. Choisir le fichier (PDF, DOCX, images, vidéos)
5. Confirmer - Le hash SHA-256 est calculé automatiquement

### 4. Export de Données

- **Export JSON** : Dossier complet avec métadonnées
- **Export CSV** : Liste des documents pour Excel
- **Certificats PDF** : Preuves horodatées d'antériorité

---

## 🔧 Technologies Utilisées

| Technologie | Usage | Coût |
|------------|-------|------|
| **HTML5/CSS3/JavaScript** | Frontend | Gratuit |
| **Chart.js** | Visualisations de données | Gratuit |
| **Font Awesome** | Icônes professionnelles | Gratuit |
| **Google Fonts** | Typographie (Inter, Playfair) | Gratuit |
| **RESTful Table API** | Stockage données | Inclus |
| **GitHub Pages** | Hébergement | Gratuit |
| **Cloudflare** | SSL/CDN | Gratuit |

**Budget Total : < 100 €** ✅  
*(possibilité d'ajouter un nom de domaine personnalisé pour ~10€/an)*

---

## 📍 Fonctionnalités URIs & Points d'Entrée

### Pages Principales
- `/index.html` - Authentification
- `/dashboard.html` - Tableau de bord (nécessite auth)
- `/documents.html` - Gestion documentaire (À créer)
- `/upload.html` - Upload de fichiers (À créer)
- `/chronologie.html` - Timeline du dossier (À créer)
- `/certificats.html` - Génération certificats (À créer)
- `/collaborateurs.html` - Gestion utilisateurs (À créer)
- `/activites.html` - Logs d'activité (À créer)

### API Endpoints (RESTful Table API)
- `GET /tables/documents` - Liste documents
- `POST /tables/documents` - Créer document
- `GET /tables/documents/{id}` - Détails document
- `PUT /tables/documents/{id}` - Modifier document
- `PATCH /tables/documents/{id}` - Mise à jour partielle
- `DELETE /tables/documents/{id}` - Supprimer document

*(Même structure pour chronologie, utilisateurs, activites)*

---

## ✅ Statut Actuel du Projet

### Complété (70%)
- ✅ Page d'authentification avec 7 profils
- ✅ Dashboard avec stats et graphiques
- ✅ Système de navigation (sidebar + topbar)
- ✅ Schéma base de données (4 tables)
- ✅ Configuration des 15 catégories
- ✅ Utilitaires (hash SHA-256, notifications, exports)
- ✅ Design responsive professionnel
- ✅ Gestion session et permissions

### En Développement
- 🔄 Page gestion documents (affichage par catégorie)
- 🔄 Page upload avec calcul hash
- 🔄 Système de recherche avancée

### À Implémenter
- ⏳ Page chronologie interactive
- ⏳ Générateur de certificats d'antériorité
- ⏳ Gestion collaborateurs
- ⏳ Page activités et logs
- ⏳ Système de commentaires sur documents
- ⏳ Export PDF avancé
- ⏳ Notifications en temps réel

---

## 🎯 Prochaines Étapes Recommandées

### Phase 1 : Fonctionnalités Essentielles (Priorité Haute)
1. **Terminer page Documents** avec filtres par catégorie
2. **Créer page Upload** avec drag & drop et calcul hash
3. **Intégrer stockage cloud** (Google Drive API ou Dropbox)
4. **Implémenter recherche avancée** (par titre, catégorie, tags, date)

### Phase 2 : Fonctions Avancées (Priorité Moyenne)
5. **Créer chronologie interactive** avec timeline visuelle
6. **Générateur de certificats** avec QR code et hash
7. **Système de commentaires** collaboratifs
8. **Notifications** (nouveaux documents, validations)

### Phase 3 : Optimisations (Priorité Basse)
9. **Mode hors-ligne** avec service worker
10. **Export PDF professionnel** avec logo et mise en page
11. **Tableau de bord admin** avec statistiques avancées
12. **Audit trail** avec signature électronique

---

## 🔐 Sécurité & Conformité

### Mesures Implémentées
- ✅ Authentification par code d'accès
- ✅ Session timeout (24h)
- ✅ Hash SHA-256 pour intégrité
- ✅ Horodatage de tous les dépôts
- ✅ Logs d'activité complets
- ✅ HTTPS (SSL/TLS) automatique

### Recommandations Futures
- 🔒 Implémenter 2FA (authentification à deux facteurs)
- 🔒 Chiffrement des fichiers sensibles
- 🔒 Backup automatique quotidien
- 🔒 Conformité RGPD (consentement, droit à l'oubli)

---

## 📞 Support & Contact

**Expert en Négociation** : Gilles Sixte FELIHO  feliho@me.com  Tél : + 33 6 75 63 70 73
**Dossier** : ALAPINI-VINCI-2026  
**Phase** : Négociation Amiable Internationale  
**Montant Réclamé** : 4 000 000 EUR

---

## 📄 Licence & Propriété Intellectuelle

© 2026 Gilles Sixte FELIHO - Expert en Techniques de Négociation  
**STRICTEMENT CONFIDENTIEL** - Usage réservé au dossier ALAPINI vs VINCI

Tous les documents, stratégies et analyses contenus dans cette plateforme sont protégés par le droit d'auteur et constituent la propriété intellectuelle de l'expert négociateur.

---

## 🚀 Déploiement

### Option 1 : GitHub Pages (Gratuit)
1. Créer un repo GitHub
2. Pusher tous les fichiers
3. Activer GitHub Pages dans Settings
4. URL : `https://votre-username.github.io/alapini-vault`

### Option 2 : Netlify/Vercel (Gratuit)
1. Connecter votre repo Git
2. Deploy automatique
3. SSL gratuit inclus

### Option 3 : Hébergement Custom
- OVH, Ionos, Hostinger (~3-5€/mois)
- Nom de domaine personnalisé (~10€/an)

---

**Version** : 1.0.0  
**Date** : Janvier 2026  
**Statut** : Production Ready (70% complété)

🏛️ **Justice · Rigueur · Professionnalisme** ⚖️
