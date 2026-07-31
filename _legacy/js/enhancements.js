// Modern Website Enhancements JavaScript

(function() {
    'use strict';

    // Initialize all enhancements when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initBackToTop();
        initReadingProgress();
        initScrollAnimations();
        initFormValidation();
        initLazyLoading();
        initTooltips();
        initSmoothScroll();
        initActiveNav();
        initImageZoom();
        initSocialSharing();
    });

    // Back to Top Button
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>';
        document.body.appendChild(backToTop);

        // Show/hide based on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Reading Progress Bar
    function initReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Scroll Animations using Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after animation to improve performance
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
        animatedElements.forEach(el => {
            observer.observe(el);
            // Immediately trigger visibility for elements already in viewport
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });

        // Add animation classes to sections
        const sections = document.querySelectorAll('section:not(.no-animate)');
        sections.forEach((section, index) => {
            if (!section.classList.contains('fade-in-up')) {
                section.classList.add('fade-in-up');
                if (index > 0) {
                    section.classList.add(`animate-delay-${Math.min(index % 4, 4)}`);
                }
            }
            observer.observe(section);
        });
    }

    // Enhanced Form Validation
    function initFormValidation() {
        const forms = document.querySelectorAll('form[id]');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', function() {
                    validateInput(input);
                });

                input.addEventListener('input', function() {
                    if (input.classList.contains('input-error')) {
                        validateInput(input);
                    }
                });
            });

            // Form submission validation
            form.addEventListener('submit', function(e) {
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    showToast('Please correct the errors in the form', 'error');
                }
            });
        });

        function validateInput(input) {
            const value = input.value.trim();
            const type = input.type;
            const required = input.hasAttribute('required');
            const formGroup = input.closest('.form-group') || input.parentElement;
            
            // Remove existing error
            const existingError = formGroup.querySelector('.form-error');
            if (existingError) existingError.remove();
            
            // Create icon wrapper if needed
            let iconWrapper = formGroup.querySelector('.input-icon-wrapper');
            if (!iconWrapper) {
                iconWrapper = document.createElement('div');
                iconWrapper.className = 'input-icon-wrapper';
                iconWrapper.style.position = 'relative';
                formGroup.appendChild(iconWrapper);
            }

            // Validation checks
            let error = '';
            
            if (required && !value) {
                error = 'This field is required';
            } else if (type === 'email' && value && !isValidEmail(value)) {
                error = 'Please enter a valid email address';
            } else if (input.hasAttribute('minlength') && value.length < parseInt(input.getAttribute('minlength'))) {
                error = `Minimum ${input.getAttribute('minlength')} characters required`;
            } else if (input.hasAttribute('maxlength') && value.length > parseInt(input.getAttribute('maxlength'))) {
                error = `Maximum ${input.getAttribute('maxlength')} characters allowed`;
            }

            // Update UI
            input.classList.remove('input-error', 'input-success');
            const icon = formGroup.querySelector('.input-icon');
            
            if (error) {
                input.classList.add('input-error');
                if (!icon) {
                    const errorIcon = document.createElement('div');
                    errorIcon.className = 'input-icon error show';
                    errorIcon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
                    formGroup.appendChild(errorIcon);
                }
                
                if (!formGroup.querySelector('.form-error')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'form-error show';
                    errorMsg.textContent = error;
                    formGroup.appendChild(errorMsg);
                }
                return false;
            } else if (value) {
                input.classList.add('input-success');
                if (!icon) {
                    const successIcon = document.createElement('div');
                    successIcon.className = 'input-icon success show';
                    successIcon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                    formGroup.appendChild(successIcon);
                }
            }
            
            return true;
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    // Lazy Loading Enhancement
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            if (!el.querySelector('.tooltip-text')) {
                const tooltipText = document.createElement('span');
                tooltipText.className = 'tooltip-text';
                tooltipText.textContent = el.dataset.tooltip;
                el.classList.add('tooltip');
                el.appendChild(tooltipText);
            }
        });
    }

    // Smooth Scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 100; // Account for fixed nav
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Active Navigation State
    function initActiveNav() {
        const navLinks = document.querySelectorAll('.menu-link[href^="#"]');
        const sections = document.querySelectorAll('section[id]');

        function updateActiveNav() {
            const scrollPosition = window.pageYOffset + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial call
    }

    // Image Zoom on Hover
    function initImageZoom() {
        const images = document.querySelectorAll('img:not(.no-zoom)');
        
        images.forEach(img => {
            img.style.transition = 'transform 0.3s ease';
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Social Sharing
    function initSocialSharing() {
        const shareButtons = document.querySelectorAll('[data-share]');
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.share;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

                let shareUrl = '';
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${title} ${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=${text} ${url}`;
                        break;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    // Toast Notification System
    window.showToast = function(message, type = 'info', duration = 4000) {
        const container = document.querySelector('.toast-container') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
            info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        const autoRemove = setTimeout(() => {
            removeToast(toast);
        }, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeToast(toast);
        });
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    function removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }

    // Button Loading State
    window.setButtonLoading = function(button, isLoading) {
        if (isLoading) {
            button.classList.add('button-loading');
            button.disabled = true;
        } else {
            button.classList.remove('button-loading');
            button.disabled = false;
        }
    };

    // Performance: Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll events
    const optimizedScroll = debounce(() => {
        // Scroll-based functions already optimized
    }, 10);

    window.addEventListener('scroll', optimizedScroll);

})();

