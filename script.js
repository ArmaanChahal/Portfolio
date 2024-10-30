
const backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Ensure the body fades in on page load
window.addEventListener('load', () => {
    document.body.classList.add('fade-in');
});

// Add fade-out effect before navigating away
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only apply the fade-out if it's an internal link
        if (href && !href.startsWith('http') && !link.hasAttribute('target')) {
            e.preventDefault();
            document.body.classList.remove('fade-in'); // Trigger fade-out
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Wait for the fade-out to complete (same duration as CSS transition)
        }
    });
});

