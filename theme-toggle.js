// ALAPINI Legal Vault - Theme Toggle
// Version simplifiée et robuste

(function() {
    'use strict';
    
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    function initTheme() {
        console.log('🎨 Theme Toggle: Initialisation...');
        
        // Récupérer le thème sauvegardé
        const savedTheme = localStorage.getItem('alapini_theme') || 'light';
        console.log('📝 Thème sauvegardé:', savedTheme);
        
        // Appliquer le thème
        applyTheme(savedTheme);
        
        // Créer le bouton toggle
        setTimeout(createThemeToggle, 100);
    }

    function createThemeToggle() {
        // Vérifier si le toggle existe déjà
        if (document.querySelector('.theme-toggle')) {
            console.log('✅ Toggle déjà créé');
            return;
        }
        
        console.log('🔨 Création du bouton toggle...');
        
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Basculer le mode sombre');
        toggle.innerHTML = `
            <i class="fas fa-sun" style="font-size: 1.25rem;"></i>
            <i class="fas fa-moon" style="font-size: 1.25rem;"></i>
        `;
        
        // Styles inline pour s'assurer qu'il soit visible
        toggle.style.cssText = `
            position: fixed !important;
            top: 1rem !important;
            right: 1rem !important;
            z-index: 99999 !important;
            background: rgba(30, 58, 138, 0.9) !important;
            border: 2px solid rgba(251, 191, 36, 0.5) !important;
            border-radius: 50px !important;
            padding: 0.75rem 1.25rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            cursor: pointer !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
            transition: all 0.3s ease !important;
        `;
        
        toggle.addEventListener('click', toggleTheme);
        document.body.appendChild(toggle);
        
        console.log('✅ Bouton toggle créé !');
        
        updateToggleState();
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log(`🔄 Changement de thème: ${currentTheme} → ${newTheme}`);
        
        applyTheme(newTheme);
        localStorage.setItem('alapini_theme', newTheme);
    }

    function applyTheme(theme) {
        console.log('🎨 Application du thème:', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
        
        updateToggleState();
    }

    function updateToggleState() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;
        
        const isDark = document.body.classList.contains('dark-mode');
        const sunIcon = toggle.querySelector('.fa-sun');
        const moonIcon = toggle.querySelector('.fa-moon');
        
        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                moonIcon.style.color = '#fbbf24';
            } else {
                sunIcon.style.display = 'block';
                sunIcon.style.color = '#fbbf24';
                moonIcon.style.display = 'none';
            }
        }
    }

    // Exposer pour debug
    window.ThemeDebug = {
        init: initTheme,
        toggle: toggleTheme,
        create: createThemeToggle
    };

})();

console.log('✅ Script theme-toggle.js chargé');
