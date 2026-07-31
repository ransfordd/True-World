// Enhanced FAQ JavaScript with Search and Better Interactions
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initializeFAQSearch();
        initializeFAQCategories();
        enhanceFAQAnimations();
        initializeFAQAccordion();
    });

    // FAQ Search Functionality
    function initializeFAQSearch() {
        const searchInput = document.querySelector('.faq-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const faqItems = document.querySelectorAll('.faq-item');

            if (searchTerm === '') {
                // Show all FAQs
                faqItems.forEach(item => {
                    item.style.display = '';
                    removeHighlights(item);
                });
                updateEmptyState(false);
                return;
            }

            let hasMatches = false;

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question-text').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                const matches = question.includes(searchTerm) || answer.includes(searchTerm);

                if (matches) {
                    item.style.display = '';
                    hasMatches = true;
                    // Open matching items
                    item.setAttribute('open', '');
                    // Highlight search term
                    highlightSearchTerm(item, searchTerm);
                } else {
                    item.style.display = 'none';
                    removeHighlights(item);
                }
            });

            updateEmptyState(!hasMatches);
        });

        // Clear search on Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.target.value = '';
                e.target.dispatchEvent(new Event('input'));
            }
        });
    }

    // Highlight search terms in FAQ content
    function highlightSearchTerm(item, searchTerm) {
        const answer = item.querySelector('.faq-answer');
        if (!answer || answer.dataset.originalText) return;

        // Store original HTML
        if (!answer.dataset.originalHTML) {
            answer.dataset.originalHTML = answer.innerHTML;
        }

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const originalHTML = answer.dataset.originalHTML;
        const highlightedHTML = originalHTML.replace(regex, '<span class="faq-highlight">$1</span>');
        answer.innerHTML = highlightedHTML;
    }

    // Remove highlights
    function removeHighlights(item) {
        const answer = item.querySelector('.faq-answer');
        if (!answer || !answer.dataset.originalHTML) return;

        answer.innerHTML = answer.dataset.originalHTML;
    }

    // Update empty state
    function updateEmptyState(show) {
        let emptyState = document.querySelector('.faq-empty');
        
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'faq-empty';
            emptyState.innerHTML = `
                <svg class="faq-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>No questions found matching your search.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Try different keywords or browse all questions.</p>
            `;
            const faqList = document.querySelector('.faq-list');
            if (faqList) {
                faqList.appendChild(emptyState);
            }
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }

    // FAQ Categories (Optional Enhancement)
    function initializeFAQCategories() {
        const categoryBtns = document.querySelectorAll('.faq-category-btn');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const category = this.dataset.category;
                const faqItems = document.querySelectorAll('.faq-item');

                if (category === 'all') {
                    faqItems.forEach(item => {
                        item.style.display = '';
                    });
                } else {
                    faqItems.forEach(item => {
                        const itemCategory = item.dataset.category || 'general';
                        if (itemCategory === category) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // Enhance FAQ animations
    function enhanceFAQAnimations() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            // Add click animation
            question.addEventListener('click', function() {
                const isOpening = !item.hasAttribute('open');
                
                if (isOpening) {
                    // Smooth scroll into view
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 100);
                }
            });

            // Add keyboard navigation
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.toggleAttribute('open');
                }
            });
        });
    }

    // Initialize accordion behavior (close others when one opens)
    function initializeFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            item.addEventListener('toggle', function() {
                // Optional: Close other items when one opens (remove if you want multiple open)
                // Uncomment the code below if you want accordion behavior
                
                // if (item.hasAttribute('open')) {
                //     faqItems.forEach(otherItem => {
                //         if (otherItem !== item) {
                //             otherItem.removeAttribute('open');
                //         }
                //     });
                // }
            });
        });
    }

    // Smooth scroll to FAQ item from URL hash
    function scrollToFAQ() {
        const hash = window.location.hash;
        if (hash) {
            const faqItem = document.querySelector(hash);
            if (faqItem && faqItem.classList.contains('faq-item')) {
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    faqItem.setAttribute('open', '');
                }, 300);
            }
        }
    }

    // Scroll to FAQ on page load if hash exists
    window.addEventListener('load', scrollToFAQ);
    window.addEventListener('hashchange', scrollToFAQ);

})();

