// ============================================
// THEME TOGGLE - Dark Mode / Light Mode
// ============================================

(function() {
    'use strict';

    // Initialiser le thème au chargement
    document.addEventListener('DOMContentLoaded', initTheme);

    function initTheme() {
        // Récupérer le thème sauvegardé ou utiliser le thème système
        const savedTheme = localStorage.getItem('alapini_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        // Appliquer le thème
        applyTheme(theme);
        
        // Créer le bouton toggle
        createThemeToggle();
        
        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('alapini_theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    function createThemeToggle() {
        // Vérifier si le toggle existe déjà
        if (document.querySelector('.theme-toggle')) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
            <i class="fas fa-sun"></i>
            <i class="fas fa-moon"></i>
        `;
        
        // Positionner en fonction de la page
        const isLoginPage = document.querySelector('.login-container');
        if (isLoginPage) {
            toggle.style.position = 'absolute';
        }
        
        toggle.addEventListener('click', toggleTheme);
        document.body.appendChild(toggle);
        
        // Mettre à jour l'état initial
        updateToggleState();
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('alapini_theme', newTheme);
        
        // Animation de transition
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
        
        updateToggleState();
        
        // Mettre à jour les graphiques si Chart.js est présent
        updateChartTheme(theme);
    }

    function updateToggleState() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;
        
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            toggle.classList.add('dark-mode');
            toggle.querySelector('.fa-sun').style.opacity = '0';
            toggle.querySelector('.fa-moon').style.opacity = '1';
        } else {
            toggle.classList.remove('dark-mode');
            toggle.querySelector('.fa-sun').style.opacity = '1';
            toggle.querySelector('.fa-moon').style.opacity = '0';
        }
    }

    function updateChartTheme(theme) {
        // Si Chart.js est chargé, mettre à jour les couleurs des graphiques
        if (typeof Chart === 'undefined') return;
        
        const isDark = theme === 'dark';
        
        // Couleurs pour le thème sombre
        const darkColors = {
            text: '#ffffff',
            gridLines: 'rgba(255, 255, 255, 0.1)',
            tooltipBg: 'rgba(21, 25, 50, 0.9)'
        };
        
        // Couleurs pour le thème clair
        const lightColors = {
            text: '#1e3a8a',
            gridLines: 'rgba(30, 58, 138, 0.1)',
            tooltipBg: 'rgba(255, 255, 255, 0.9)'
        };
        
        const colors = isDark ? darkColors : lightColors;
        
        // Mettre à jour les defaults de Chart.js
        if (Chart.defaults) {
            Chart.defaults.color = colors.text;
            Chart.defaults.borderColor = colors.gridLines;
            Chart.defaults.plugins.tooltip.backgroundColor = colors.tooltipBg;
        }
        
        // Redessiner tous les graphiques existants
        Chart.instances.forEach(chart => {
            if (chart && chart.options) {
                // Mettre à jour les options
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) scale.ticks.color = colors.text;
                        if (scale.grid) scale.grid.color = colors.gridLines;
                    });
                }
                
                // Forcer la mise à jour
                chart.update();
            }
        });
    }

    // Exposer les fonctions globalement pour usage externe
    window.ThemeManager = {
        toggle: toggleTheme,
        set: applyTheme,
        get: () => document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };

})();

// ============================================
// ANIMATIONS & EFFECTS
// ============================================

// Ajouter des animations d'apparition progressive
function addStaggerAnimations() {
    const items = document.querySelectorAll('.stat-card, .category-card, .document-card');
    items.forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.animationDelay = `${index * 0.05}s`;
    });
}

// Ajouter effet de particules au survol des cartes
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'card-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Effet parallax subtil sur le fond
function addParallaxEffect() {
    if (window.innerWidth < 768) return; // Désactiver sur mobile
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const bg = document.querySelector('body::before');
        if (bg) {
            document.body.style.setProperty('--mouse-x', `${x}px`);
            document.body.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}

// Initialiser les effets au chargement
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addStaggerAnimations();
        addCardHoverEffects();
        addParallaxEffect();
    }, 100);
});

// ============================================
// STYLES POUR EFFETS RIPPLE
// ============================================

// Injecter les styles pour l'effet ripple
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .card-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.3);
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    }
    
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
    
    .theme-toggle {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .theme-toggle i {
        position: absolute;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .theme-toggle .fa-moon {
        opacity: 0;
        transform: rotate(-180deg);
    }
    
    .theme-toggle.dark-mode .fa-moon {
        opacity: 1;
        transform: rotate(0deg);
    }
    
    .theme-toggle.dark-mode .fa-sun {
        opacity: 0;
        transform: rotate(180deg);
    }
`;
document.head.appendChild(rippleStyles);
