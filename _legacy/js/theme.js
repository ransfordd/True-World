// Theme toggle (stores preference)
(function() {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    const LS_KEY = 'ttw_theme';
    
    function applyTheme(t) {
        if (t === 'light') {
            body.classList.remove('bg-black', 'text-white');
            body.classList.add('bg-white', 'text-black');
            document.documentElement.style.setProperty('--ttw-bg', '#ffffff');
        } else {
            body.classList.remove('bg-white', 'text-black');
            body.classList.add('bg-black', 'text-white');
        }
    }
    
    const saved = localStorage.getItem(LS_KEY) || 'dark';
    applyTheme(saved);
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = localStorage.getItem(LS_KEY) || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(LS_KEY, next);
            applyTheme(next);
        });
    }
})();

