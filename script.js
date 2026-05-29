document.addEventListener('DOMContentLoaded', () => {
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    const themeToggle = document.getElementById('themeToggle');

    const navHamburger = document.getElementById('navHamburger');
    const mobileNav = document.getElementById('mobileNav');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const contactToast = document.getElementById('contactToast');
    let toastTimer;

    const emailJsConfig = {
        publicKey: 'TczcUeXApwGlQZB13',
        serviceId: 'service_cqgca7g',
        adminTemplateId: 'template_7mehugg',
        autoReplyTemplateId: 'template_pr972id'
    };


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

    if (contactForm && formStatus) {
        if (window.emailjs && !emailJsConfig.publicKey.includes('YOUR_')) {
            emailjs.init({ publicKey: emailJsConfig.publicKey });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            clearFormStatus();

            if (!validateContactForm(contactForm)) {
                showFormStatus('Please complete all fields with a valid email address.', 'error');
                return;
            }

            if (!window.emailjs) {
                showFormStatus('Email service is still loading. Please try again in a moment.', 'error');
                return;
            }

            if (emailJsConfig.publicKey.includes('YOUR_') || emailJsConfig.serviceId.includes('YOUR_')) {
                showFormStatus('Add your EmailJS public key and service ID in script.js before sending messages.', 'error');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            const templateParams = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                phoneNumber: (formData.get('phoneNumber') || '').toString().trim(),
                visitors: (formData.get('visitors') || '').toString().trim(),
                message: formData.get('message').trim()
            };

            contactForm.classList.add('is-submitting');
            submitButton.disabled = true;
            let adminEmailSent = false;

            try {
                await emailjs.send(
                    emailJsConfig.serviceId,
                    emailJsConfig.adminTemplateId,
                    templateParams
                );
                adminEmailSent = true;

                await emailjs.send(
                    emailJsConfig.serviceId,
                    emailJsConfig.autoReplyTemplateId,
                    templateParams
                );

                contactForm.reset();
                showFormStatus('Thank you. Your feedback has been sent successfully. A confirmation email will arrive shortly.', 'success');
            } catch (error) {
                const message = adminEmailSent
                    ? 'Your feedback was received, but the confirmation email could not be sent.'
                    : 'Something went wrong. Please try again shortly.';
                showFormStatus(error.message || message, 'error');
            } finally {
                contactForm.classList.remove('is-submitting');
                submitButton.disabled = false;
            }
        });

        contactForm.querySelectorAll('input, textarea').forEach((field) => {
            field.addEventListener('input', () => {
                field.classList.remove('field-error');
            });
        });
    }

    function validateContactForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');

        requiredFields.forEach((field) => {
            const value = field.value.trim();
            const isEmail = field.type === 'email';
            const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const fieldIsValid = value && (!isEmail || emailIsValid);

            field.classList.toggle('field-error', !fieldIsValid);
            if (!fieldIsValid) {
                isValid = false;
            }
        });

        return isValid;
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status show ${type}`;
        showContactToast(message, type);
    }

    function clearFormStatus() {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    }

    function showContactToast(message, type) {
        if (!contactToast) return;

        window.clearTimeout(toastTimer);
        contactToast.textContent = message;
        contactToast.className = `contact-toast show ${type}`;

        toastTimer = window.setTimeout(() => {
            contactToast.className = 'contact-toast';
        }, 4200);
    }
});
