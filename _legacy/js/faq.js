// Small UX: enable details summary keyboard accessibility (optional)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#faqList details').forEach(d => {
        d.addEventListener('toggle', () => {
            // close others when one opens
            if (d.open) {
                document.querySelectorAll('#faqList details').forEach(other => { 
                    if (other !== d) other.open = false; 
                });
            }
        });
    });
});

