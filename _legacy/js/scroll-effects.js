// Scroll progress (if needed in the future, can be added to main menu)

// Smooth reveal on scroll
const reveals = document.querySelectorAll('section');
const revealOnScroll = () => {
    reveals.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (!section.classList.contains('revealed') && sectionTop < windowHeight - 150) {
            section.classList.add('revealed');
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
};

// Add initial styles to sections
reveals.forEach(section => {
    if (!section.classList.contains('revealed')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
    }
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

