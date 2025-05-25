// Gestion des onglets interactifs et du thème clair/sombre
document.addEventListener('DOMContentLoaded', function () {
    console.log('[UXUI] Script chargé');
    // --- Thème clair/sombre ---
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
        console.warn('[UXUI] Bouton .theme-toggle introuvable');
        return;
    }
    console.log('[UXUI] Bouton .theme-toggle trouvé');
    if (!themeToggle) return; // Sécurité : ne rien faire si le bouton n'existe pas
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const userTheme = localStorage.getItem('theme');
    function setTheme(mode) {
        document.body.classList.remove('theme-dark', 'theme-light');
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        if (mode === 'dark') {
            document.body.classList.add('theme-dark');
            document.documentElement.classList.add('theme-dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.add('theme-light');
            document.documentElement.classList.add('theme-light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        // Debug : log la classe de <html>
        console.log('[UXUI] Classe <html> :', document.documentElement.className);
    }
    // Initialisation
    if (userTheme === 'dark' || userTheme === 'light') {
        setTheme(userTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
    // Toggle au clic
    themeToggle.addEventListener('click', function () {
        const isDark = !document.body.classList.contains('theme-dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        setTheme(isDark ? 'dark' : 'light');
        console.log('[UXUI] Classe body :', document.body.className);
    });
    // Onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Désactive tous les onglets et contenus
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            // Active l'onglet cliqué et le contenu associé
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const pane = document.getElementById(tabId);
            if (pane) pane.classList.add('active');
        });
    });

    // Affichage/masquage du mot de passe
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = btn.closest('.password-input').querySelector('input[type="password"], input[type="text"]');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.querySelector('i').classList.remove('fa-eye');
                    btn.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    btn.querySelector('i').classList.remove('fa-eye-slash');
                    btn.querySelector('i').classList.add('fa-eye');
                }
            }
        });
    });
});
