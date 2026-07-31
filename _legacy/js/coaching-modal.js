// Coaching Package Contact Modal JavaScript

(function() {
    'use strict';

    const modal = document.getElementById('coachingModal');
    const form = document.getElementById('coachingContactForm');
    const closeBtn = document.querySelector('.coaching-modal-close');
    const successDiv = document.getElementById('coachingSuccess');
    const packageNameEl = document.getElementById('modal-package-name');
    const packageSubtitleEl = document.getElementById('modal-package-subtitle');
    const selectedPackageInput = document.getElementById('selectedPackage');
    const actionTypeInput = document.getElementById('actionType');
    const successPackageName = document.getElementById('success-package-name');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Package information mapping
    const packageInfo = {
        'Awakening Coaching': {
            subtitle: 'Seeker\'s Path - Beginner Level',
            duration: '4 Weeks'
        },
        'Transformation Coaching': {
            subtitle: 'Disciple\'s Path - Intermediate Level',
            duration: '8 Weeks'
        },
        'Impact Mentorship': {
            subtitle: 'Master\'s Path - Advanced Level',
            duration: '12 Weeks'
        }
    };

    // Open modal
    function openModal(packageName, action) {
        const info = packageInfo[packageName] || { subtitle: '', duration: '' };
        
        packageNameEl.textContent = packageName;
        packageSubtitleEl.textContent = `${info.subtitle} (${info.duration})`;
        selectedPackageInput.value = packageName;
        actionTypeInput.value = action;
        successPackageName.textContent = packageName;

        // Reset form
        form.reset();
        form.style.display = 'block';
        successDiv.classList.remove('active');

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after animation
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successDiv.classList.remove('active');
            
            // Clear errors
            document.querySelectorAll('.coaching-form-error').forEach(el => {
                el.classList.remove('show');
            });
            document.querySelectorAll('.coaching-form-input, .coaching-form-textarea').forEach(el => {
                el.classList.remove('error');
            });
        }, 300);
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        
        // Validate name
        if (!name) {
            showError('nameError', 'Please enter your name');
            document.getElementById('contactName').classList.add('error');
            isValid = false;
        } else {
            hideError('nameError');
            document.getElementById('contactName').classList.remove('error');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('emailError', 'Please enter your email address');
            document.getElementById('contactEmail').classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            document.getElementById('contactEmail').classList.add('error');
            isValid = false;
        } else {
            hideError('emailError');
            document.getElementById('contactEmail').classList.remove('error');
        }

        // Validate phone
        if (!phone) {
            showError('phoneError', 'Please enter your phone number');
            document.getElementById('contactPhone').classList.add('error');
            isValid = false;
        } else {
            hideError('phoneError');
            document.getElementById('contactPhone').classList.remove('error');
        }

        return isValid;
    }

    function showError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }

    function hideError(errorId) {
        const errorEl = document.getElementById(errorId);
        errorEl.classList.remove('show');
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Collect form data
        const formData = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            phone: document.getElementById('contactPhone').value.trim(),
            message: document.getElementById('contactMessage').value.trim(),
            package: selectedPackageInput.value,
            action: actionTypeInput.value,
            timestamp: new Date().toISOString()
        };

        // Send email using EmailJS or similar service
        // For now, we'll use a simple mailto fallback, but you should integrate with a proper service
        sendEmail(formData);
    });

    function sendEmail(data) {
        // Email configuration - UPDATE THIS WITH YOUR EMAIL
        const RECIPIENT_EMAIL = 'info@thetrueword.com'; // Change this to your email
        
        // Prepare email content
        const subject = `${data.action === 'enroll' ? 'Enrollment' : 'Information'} Request - ${data.package}`;
        const emailBody = `
New ${data.action === 'enroll' ? 'Enrollment' : 'Information'} Request

Package: ${data.package}
Action: ${data.action === 'enroll' ? 'Enrollment Request' : 'Learn More Request'}

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Message:
${data.message || 'No message provided'}

Submitted: ${new Date().toLocaleString()}
        `.trim();

        // Method 1: Send via mailto (opens email client) - Works immediately
        const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Try to send via backend API first (if available)
        fetch('/api/coaching-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                recipient: RECIPIENT_EMAIL,
                subject: subject
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Backend not available');
        }).then(result => {
            // Success via backend
            showSuccess(data);
        }).catch(err => {
            // Fallback to mailto
            console.log('Backend API not configured. Using mailto fallback.');
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = mailtoLink;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success message
            showSuccess(data);
        });
    }

    function showSuccess(data) {
        // Show success message
        form.style.display = 'none';
        successDiv.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');

        // Auto close after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);

        // Show toast notification
        if (window.showToast) {
            window.showToast(
                `Thank you! We've received your ${data.action === 'enroll' ? 'enrollment' : 'information'} request for ${data.package}. We'll contact you soon!`,
                'success',
                5000
            );
        }
    }

    // Attach event listeners to all CTA buttons
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.cta-button, .cta-button-secondary');
        if (button && button.hasAttribute('data-package')) {
            const packageName = button.getAttribute('data-package');
            const action = button.getAttribute('data-action');
            openModal(packageName, action);
        }
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateForm();
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateForm();
            }
        });
    });
})();

