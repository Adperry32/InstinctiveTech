document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    });

    fadeElements.forEach(el => observer.observe(el));

    // Smooth scroll only if on `servicesPage.html`
    if (window.location.pathname.includes("servicesPage.html")) {
        const links = document.querySelectorAll('.dropdown-content a');
        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute("href").split("#")[1];
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }
});
