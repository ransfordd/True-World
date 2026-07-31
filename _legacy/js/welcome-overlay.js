// Show the welcome overlay first; prevent body scroll while visible.
// Use window.onload to ensure essential assets (logo) are loaded for a polished UX.
// Only add no-scroll if the welcome overlay exists on this page
const hasWelcomeOverlay = document.getElementById('welcomeOverlay');
if (hasWelcomeOverlay) {
    document.body.classList.add('no-scroll');
}

function revealWelcome() {
    const overlay = document.getElementById('welcomeOverlay');
    const inner = overlay.querySelector('.welcome-inner');
    const logo = inner.querySelector('img');
    
    // Ensure logo is visible
    if (logo) {
        logo.style.display = 'block';
        logo.style.visibility = 'visible';
        logo.style.opacity = '1';
    }
    
    // initial entrance
    requestAnimationFrame(() => {
        inner.style.opacity = '1';
        inner.style.transform = 'translateY(0)';
    });
}

function hideWelcomeThenRevealMain() {
    const overlay = document.getElementById('welcomeOverlay');
    const inner = overlay.querySelector('.welcome-inner');
    const main = document.getElementById('mainContent');

    // fade content then overlay
    inner.style.opacity = '0';
    inner.style.transform = 'translateY(-18px)';

    // small delay to let inner finish
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.setAttribute('aria-hidden', 'true');
    }, 450);

    // remove overlay and show main after fade completes
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
        main.style.visibility = 'visible';
        main.style.opacity = '1';
        main.style.pointerEvents = 'auto';
        // mark sections revealed immediately if in view
        window.dispatchEvent(new Event('scroll'));
    }, 950);
}

// Wait for full load so images/fonts are ready, then run UX sequence.
window.addEventListener('load', function () {
    // If there's no welcome overlay on this page, ensure main content is visible
    const overlay = document.getElementById('welcomeOverlay');
    const main = document.getElementById('mainContent');
    
    if (!overlay) {
        // Pages without welcome overlay (like article pages): ensure content is visible
        if (main) {
            main.style.visibility = 'visible';
            main.style.opacity = '1';
            main.style.pointerEvents = 'auto';
        }
        document.body.classList.remove('no-scroll');
        return;
    }
    
    // If we get here, welcome overlay exists - continue with normal flow
    // Ensure logo image is loaded before showing
    const logoImg = document.querySelector('#welcomeOverlay img');
    if (logoImg) {
        // If image is already loaded, proceed
        if (logoImg.complete && logoImg.naturalHeight !== 0) {
            revealWelcome();
        } else {
            // Wait for image to load
            logoImg.addEventListener('load', revealWelcome);
            logoImg.addEventListener('error', function() {
                // Even if image fails, show welcome overlay
                console.warn('Logo image failed to load, but showing welcome overlay anyway');
                revealWelcome();
            });
            // Fallback: if image takes too long, show anyway
            setTimeout(revealWelcome, 1000);
        }
    } else {
        revealWelcome();
    }

    // display duration (adjust for realism)
    const DISPLAY_TIME = 2400; // ms

    setTimeout(() => {
        hideWelcomeThenRevealMain();
    }, DISPLAY_TIME);
});

