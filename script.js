document.addEventListener('DOMContentLoaded', () => {
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    const themeToggle = document.getElementById('themeToggle');

    const navHamburger = document.getElementById('navHamburger');
    const mobileNav = document.getElementById('mobileNav');


    if (navHamburger && mobileNav) {
        navHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileNav.classList.toggle('open');
            navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.classList.contains('open')) return;
            if (!mobileNav.contains(e.target) && e.target !== navHamburger) {
                mobileNav.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            }
        });


        // close on link click
        mobileNav.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // Load saved theme
    let savedTheme = localStorage.getItem('theme') || 'dark';

    // Ensure only dark or light is used (remove any legacy ocean theme)
    if (savedTheme !== 'dark' && savedTheme !== 'light') {
        savedTheme = 'dark';
    }

    applyTheme(savedTheme);

    // Save and apply on slider change
    themeInputs.forEach(input => {
        input.addEventListener('change', () => {
            applyTheme(input.value);
        });
    });

    // Mobile toggle button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const inputToCheck = document.getElementById(theme);
        if (inputToCheck) {
            inputToCheck.checked = true;
        }
    }
});

