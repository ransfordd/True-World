// Course Interface JavaScript
(function() {
    'use strict';

    // Initialize course functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeCourseCards();
        initializeProgressTracking();
        initializeEnrollmentButtons();
    });

    // Toggle course tier cards (expand/collapse)
    function initializeCourseCards() {
        const tierCards = document.querySelectorAll('.course-tier-card');
        
        tierCards.forEach(card => {
            const header = card.querySelector('.tier-header');
            if (!header) return;

            header.addEventListener('click', function() {
                const isActive = card.classList.contains('active');
                
                // Close all other cards (optional - remove if you want multiple open)
                if (!isActive) {
                    tierCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('active');
                        }
                    });
                }
                
                // Toggle current card
                card.classList.toggle('active');
                
                // Smooth scroll to card if opening
                if (!isActive) {
                    setTimeout(() => {
                        card.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 100);
                }
            });

            // Prevent header click from triggering if clicking on buttons
            const actions = card.querySelector('.tier-actions');
            if (actions) {
                actions.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        });
    }

    // Initialize progress tracking (stored in localStorage)
    function initializeProgressTracking() {
        const progressKey = 'ttw_course_progress';
        
        // Load saved progress
        function loadProgress() {
            try {
                const saved = localStorage.getItem(progressKey);
                return saved ? JSON.parse(saved) : {
                    tier1: 0,
                    tier2: 0,
                    tier3: 0,
                    total: 0
                };
            } catch (e) {
                return {
                    tier1: 0,
                    tier2: 0,
                    tier3: 0,
                    total: 0
                };
            }
        }

        // Save progress
        function saveProgress(progress) {
            try {
                localStorage.setItem(progressKey, JSON.stringify(progress));
            } catch (e) {
                console.warn('Could not save progress:', e);
            }
        }

        // Update progress display
        function updateProgressDisplay(progress) {
            // Update tier progress bars
            ['tier1', 'tier2', 'tier3'].forEach((tier, index) => {
                const card = document.querySelector(`.course-tier-card:nth-child(${index + 1})`);
                if (card) {
                    const progressBar = card.querySelector('.tier-progress-fill');
                    if (progressBar) {
                        progressBar.style.width = progress[tier] + '%';
                    }

                    // Add completion badge if tier is complete
                    const header = card.querySelector('.tier-header');
                    if (progress[tier] >= 100 && !card.querySelector('.completed-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'completed-badge';
                        badge.textContent = 'Completed';
                        if (header) {
                            header.appendChild(badge);
                        }
                    }
                }
            });

            // Update overview stats
            const totalProgress = progress.total || 0;
            const enrolledTiers = Object.values(progress).filter((val, idx) => idx < 3 && val > 0).length;
            
            const totalEl = document.getElementById('total-progress');
            const enrolledEl = document.getElementById('enrolled-tiers');
            
            if (totalEl) totalEl.textContent = totalProgress + '%';
            if (enrolledEl) enrolledEl.textContent = enrolledTiers;
        }

        // Initialize with saved progress
        const progress = loadProgress();
        updateProgressDisplay(progress);

        // Simulate progress on enrollment (for demo)
        window.markTierProgress = function(tierNumber, percentage) {
            const progress = loadProgress();
            const tierKey = `tier${tierNumber}`;
            progress[tierKey] = Math.max(progress[tierKey] || 0, percentage);
            
            // Calculate total progress
            const tierProgress = [progress.tier1, progress.tier2, progress.tier3];
            progress.total = Math.round(
                tierProgress.reduce((a, b) => a + b, 0) / tierProgress.length
            );
            
            saveProgress(progress);
            updateProgressDisplay(progress);
        };

        // Expose progress functions globally
        window.getCourseProgress = loadProgress;
        window.updateCourseProgress = saveProgress;
    }

    // Initialize enrollment buttons
    function initializeEnrollmentButtons() {
        const enrollButtons = document.querySelectorAll('.enroll-btn');
        
        enrollButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get tier number from button's data attribute or parent card
                const card = btn.closest('.course-tier-card');
                if (!card) return;
                
                const tierIndex = Array.from(document.querySelectorAll('.course-tier-card')).indexOf(card);
                const tierNumber = tierIndex + 1;
                
                // Simulate enrollment
                handleEnrollment(tierNumber, card);
            });
        });

        // View details buttons
        const viewButtons = document.querySelectorAll('.view-details-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = btn.closest('.course-tier-card');
                if (card) {
                    card.classList.add('active');
                    setTimeout(() => {
                        card.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 100);
                }
            });
        });
    }

    // Handle enrollment process
    function handleEnrollment(tierNumber, card) {
        // Show enrollment confirmation
        const tierNames = {
            1: "Seeker's Path",
            2: "Disciple's Path",
            3: "Master's Path"
        };

        const tierName = tierNames[tierNumber] || `Tier ${tierNumber}`;
        
        // Check if already enrolled
        const progress = window.getCourseProgress ? window.getCourseProgress() : {};
        const tierKey = `tier${tierNumber}`;
        const isEnrolled = progress[tierKey] > 0;

        if (isEnrolled) {
            alert(`You are already enrolled in ${tierName}! Continue your journey.`);
            // Expand card to show content
            card.classList.add('active');
            return;
        }

        // Confirmation dialog
        const confirmEnroll = confirm(
            `Enroll in ${tierName} (Tier ${tierNumber})?\n\n` +
            `This will begin your journey through this level of awakening.`
        );

        if (confirmEnroll) {
            // Mark as enrolled (10% initial progress for enrollment)
            if (window.markTierProgress) {
                window.markTierProgress(tierNumber, 10);
            }

            // Show success message
            showEnrollmentSuccess(tierName, card);
            
            // Expand the card
            card.classList.add('active');
            
            // Scroll to card
            setTimeout(() => {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        }
    }

    // Show enrollment success message
    function showEnrollmentSuccess(tierName, card) {
        // Create a temporary success indicator
        const successMsg = document.createElement('div');
        successMsg.className = 'enrollment-success';
        successMsg.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #C0A04C, #A88A3F);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(192, 160, 76, 0.4);
            z-index: 10000;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;
        successMsg.textContent = `✓ Successfully enrolled in ${tierName}!`;

        document.body.appendChild(successMsg);

        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.parentNode.removeChild(successMsg);
                }
            }, 300);
        }, 3000);
    }

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);

})();

