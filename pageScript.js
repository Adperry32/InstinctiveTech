// Smooth scroll to sections on the Services page
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.dropdown-content a');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute("href").split("#")[1];
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Scroll smoothly to the target section
                targetSection.scrollIntoView({ behavior: "smooth" });
                // Update the URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
});
