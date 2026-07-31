// Enhanced mobile menu behavior with animations
(function () {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOpen = toggle?.querySelector('.menu-open');
    const menuClose = toggle?.querySelector('.menu-close');
    
    if (!toggle || !mobileMenu || !menuOpen || !menuClose) return;

    // Handle menu toggle
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = mobileMenu.classList.contains('active');
        
        // Toggle menu state
        mobileMenu.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icon visibility
        menuOpen.classList.toggle('hidden');
        menuClose.classList.toggle('hidden');
        
        // Update ARIA state
        toggle.setAttribute('aria-expanded', !isOpen);
        
        // Add/remove body scroll lock
        document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.premium-nav')) {
            closeMenu();
        }
    });

    // Close menu when clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu function
    function closeMenu() {
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // Handle scroll behavior
    let lastScroll = 0;
    const nav = document.querySelector('.premium-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && !mobileMenu.classList.contains('active')) {
            // Scrolling down & menu is closed
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
        // Smooth scrolling & proper mobile behavior for menu links
        // Handles: anchor links (smooth scroll) and regular links (close menu on mobile before navigating)
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');

                // If no href, nothing to do
                if (!href) return;

                // If it's a placeholder link
                if (href === '#') {
                    // Just close the menu on click
                    closeMenu();
                    return;
                }

                // If it's an anchor on the same page
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        // close mobile menu first (if open), then smooth scroll
                        closeMenu();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    return;
                }

                // If it's a link to another page, and we're on small screens, close the menu so navigation shows properly
                if (window.innerWidth <= 768) {
                    // close menu but allow the navigation to proceed
                    closeMenu();
                }
                // For larger screens, do nothing special and allow default navigation
            });
        });

    })();
