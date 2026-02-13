// ============================================
// THEME TOGGLE - Dark Mode / Light Mode
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initTheme);

    function initTheme() {
        const savedTheme = localStorage.getItem('alapini_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        applyTheme(theme);
        createThemeToggle();
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('alapini_theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    function createThemeToggle() {
        if (document.querySelector('.theme-toggle')) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
            <i class="fas fa-sun"></i>
            <i class="fas fa-moon"></i>
        `;
        
        toggle.addEventListener('click', toggleTheme);
        document.body.appendChild(toggle);
        updateToggleState();
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('alapini_theme', newTheme);
        
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
        if (typeof Chart === 'undefined') return;
        
        const isDark = theme === 'dark';
        const colors = isDark ? {
            text: '#ffffff',
            gridLines: 'rgba(255, 255, 255, 0.1)',
            tooltipBg: 'rgba(21, 25, 50, 0.9)'
        } : {
            text: '#1e3a8a',
            gridLines: 'rgba(30, 58, 138, 0.1)',
            tooltipBg: 'rgba(255, 255, 255, 0.9)'
        };
        
        if (Chart.defaults) {
            Chart.defaults.color = colors.text;
            Chart.defaults.borderColor = colors.gridLines;
        }
    }

    window.ThemeManager = {
        toggle: toggleTheme,
        set: applyTheme,
        get: () => document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };

})();

// Styles pour le toggle
const toggleStyles = document.createElement('style');
toggleStyles.textContent = `
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
document.head.appendChild(toggleStyles);
