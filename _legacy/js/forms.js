// Enhanced Form Handling with Toast Notifications
document.addEventListener('DOMContentLoaded', function() {
    // Wait for enhancements to load
    setTimeout(function() {
        // Footer subscribe form
        const footerSubscribeForm = document.getElementById('footer-subscribe');
        if (footerSubscribeForm) {
            footerSubscribeForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                const button = this.querySelector('button[type="submit"]');
                
                if (!emailInput.value || !emailInput.value.includes('@')) {
                    if (window.showToast) {
                        window.showToast("Please enter a valid email address.", 'error');
                    } else {
                        alert("Please enter a valid email address.");
                    }
                    return;
                }

                // Show loading state
                if (window.setButtonLoading) {
                    window.setButtonLoading(button, true);
                }

                // Simulate API call
                setTimeout(() => {
                    if (window.showToast) {
                        window.showToast("Subscription successful! Welcome to The True Word community.", 'success');
                    } else {
                        alert("Subscription successful!");
                    }
                    
                    if (window.setButtonLoading) {
                        window.setButtonLoading(button, false);
                    }
                    
                    emailInput.value = '';
                }, 1000);
            });
        }

        // Question form
        const questionForm = document.getElementById('questionForm');
        if (questionForm) {
            questionForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const button = this.querySelector('button[type="submit"]');
                const questionText = this.querySelector('#questionText');
                
                if (!questionText.value.trim() || questionText.value.trim().length < 10) {
                    if (window.showToast) {
                        window.showToast("Please enter a question (at least 10 characters).", 'warning');
                    }
                    return;
                }

                if (window.setButtonLoading) {
                    window.setButtonLoading(button, true);
                }

                setTimeout(() => {
                    if (window.showToast) {
                        window.showToast("Thank you for your question! We'll get back to you soon.", 'success');
                    }
                    
                    if (window.setButtonLoading) {
                        window.setButtonLoading(button, false);
                    }
                    
                    questionForm.reset();
                }, 1000);
            });
        }

        // Comment form
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const button = this.querySelector('button[type="submit"]');
                const commentText = this.querySelector('#commentText');
                
                if (!commentText.value.trim() || commentText.value.trim().length < 5) {
                    if (window.showToast) {
                        window.showToast("Please enter a comment (at least 5 characters).", 'warning');
                    }
                    return;
                }

                if (window.setButtonLoading) {
                    window.setButtonLoading(button, true);
                }

                setTimeout(() => {
                    if (window.showToast) {
                        window.showToast("Thank you for your comment! It will be reviewed before publishing.", 'success');
                    }
                    
                    if (window.setButtonLoading) {
                        window.setButtonLoading(button, false);
                    }
                    
                    commentForm.reset();
                }, 1000);
            });
        }

        // Prayer form
        const prayerForm = document.getElementById('prayerForm');
        if (prayerForm) {
            prayerForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const button = this.querySelector('button[type="submit"]');
                const prayerRequest = this.querySelector('#prayerRequest');
                
                if (!prayerRequest.value.trim() || prayerRequest.value.trim().length < 10) {
                    if (window.showToast) {
                        window.showToast("Please enter your prayer request (at least 10 characters).", 'warning');
                    }
                    return;
                }

                if (window.setButtonLoading) {
                    window.setButtonLoading(button, true);
                }

                setTimeout(() => {
                    const isPrivate = document.getElementById('privateRequest').checked;
                    const message = isPrivate 
                        ? "Your private prayer request has been submitted. We'll be praying for you." 
                        : "Thank you for your prayer request. We'll be praying for you.";
                    
                    if (window.showToast) {
                        window.showToast(message, 'success');
                    } else {
                        alert(message);
                    }
                    
                    if (window.setButtonLoading) {
                        window.setButtonLoading(button, false);
                    }
                    
                    prayerForm.reset();
                }, 1000);
            });
        }
    }, 500);
});

