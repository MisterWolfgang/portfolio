document.addEventListener('DOMContentLoaded', function () {
    console.log('[UXUI] Script chargé');

    // --- Theme clair/sombre ---
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && themeIcon) {
        console.log('[UXUI] Bouton .theme-toggle et icône trouvés');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const userTheme = localStorage.getItem('theme');

        function setTheme(mode) {
            document.body.classList.remove('theme-dark', 'theme-light');
            document.documentElement.classList.remove('theme-dark', 'theme-light');
            let iconClass = 'fa-moon'; // Default for light mode
            if (mode === 'dark') {
                document.body.classList.add('theme-dark');
                document.documentElement.classList.add('theme-dark');
                iconClass = 'fa-sun';
            } else {
                document.body.classList.add('theme-light');
                document.documentElement.classList.add('theme-light');
            }
            themeIcon.className = `fas ${iconClass}`; // Update classes instead of innerHTML
            themeIcon.setAttribute('aria-hidden', 'true'); // Ensure aria-hidden is preserved
            console.log('[UXUI] Classe <html> :', document.documentElement.className);
        }

        if (userTheme === 'dark' || userTheme === 'light') {
            setTheme(userTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }

        themeToggle.addEventListener('click', function () {
            const isDarkEnabled = document.body.classList.contains('theme-dark');
            const newTheme = isDarkEnabled ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            setTheme(newTheme);
            console.log('[UXUI] Classe body :', document.body.className);
        });
    } else {
        console.warn('[UXUI] Bouton .theme-toggle ou son icône introuvable');
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.getElementById('main-nav-links');

    if (menuToggle && navLinksContainer) {
        console.log('[UXUI] Mobile menu toggle and nav links container found.');
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            const isOpen = navLinksContainer.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen.toString());
            console.log('[UXUI] Mobile menu toggled. Is open:', isOpen);
        });
    } else {
        console.warn('[UXUI] Mobile menu toggle or nav links container not found.');
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        console.log('[UXUI] Initializing scroll animations for', animatedElements.length, 'elements.');
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                    console.log('[UXUI] Element is visible and animated:', entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    } else {
        console.log('[UXUI] No elements found with .animate-on-scroll class.');
    }

    // --- Scroll Spy for Navigation ---
    const navLinks = Array.from(navLinksContainer ? navLinksContainer.querySelectorAll('a[href^="#"]') : []);
    const sections = navLinks.map(link => {
        const id = link.getAttribute('href');
        if (id === '#top') {
            // #top corresponds to the intro-hero section or the very top of the page
            const topSection = document.getElementById('intro-hero') || document.body;
            return { link, element: topSection, id: '#top' };
        }
        const sectionElement = document.querySelector(id);
        return sectionElement ? { link, element: sectionElement, id } : null;
    }).filter(s => s !== null && s.element);

    if (navLinks.length > 0 && sections.length > 0) {
        console.log('[UXUI] Initializing scroll spy for navigation. Links:', navLinks.length, 'Sections:', sections.length);
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollOffset = headerHeight + 60; // Offset to ensure section title is visible past header

        function updateActiveLink() {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            let currentSectionId = null;

            // Check if at the very bottom of the page
            if (window.innerHeight + scrollPosition >= document.body.offsetHeight - 50) { // 50px buffer
                currentSectionId = sections[sections.length - 1].id;
            } else {
                // Iterate from bottom to top to find the current section
                for (let i = sections.length - 1; i >= 0; i--) {
                    const sectionData = sections[i];
                    const sectionTop = sectionData.element.offsetTop - scrollOffset;

                    if (scrollPosition >= sectionTop) {
                        currentSectionId = sectionData.id;
                        break;
                    }
                }
            }
            
            // Fallback to #top if no other section is determined (e.g., above all sections after offset)
            // or if the calculated currentSectionId is null and we are near the top.
            if (currentSectionId === null && scrollPosition < (sections[0].element.offsetTop - scrollOffset + sections[0].element.offsetHeight)) {
                 currentSectionId = sections[0].id; // Default to the first link's section (usually #top)
            }


            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === currentSectionId) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
             // console.log('[UXUI] Scroll Spy - Current Active Section ID:', currentSectionId);
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink(); // Initial call
    } else {
        console.warn('[UXUI] Scroll spy not initialized: Nav links or sections not found/mapped.');
    }

    // --- Onglets (already present, kept for completeness) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const pane = document.getElementById(tabId);
                if (pane) pane.classList.add('active');
            });
        });
    }

    // --- Affichage/masquage du mot de passe (already present, kept for completeness) ---
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    if (togglePasswordBtns.length > 0) {
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const input = btn.closest('.password-input').querySelector('input[type="password"], input[type="text"]');
                if (input) {
                    const icon = btn.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
                    } else {
                        input.type = 'password';
                        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
                    }
                }
            });
        });
    }

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('[SW] Service Worker registered successfully with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('[SW] Service Worker registration failed:', error);
                });
        });
    } else {
        console.log('[SW] Service Worker not supported by this browser.');
    }
});
