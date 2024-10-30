
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
// Fade in when the page loads
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
});

// Fade out before navigating away
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // If it's an internal link (not a new tab)
        if (href && !href.startsWith('http')) {
            e.preventDefault();
            document.body.classList.remove('fade-in');
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Match with CSS transition duration
        }
    });
});
