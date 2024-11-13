// Scroll-triggered fade-in effect
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
});

// Cache and request limiter
const apiCache = new Map();
let requestCount = 0;
const requestLimit = 10;
const timeWindow = 60000; // 1 minute
let timeWindowStart = Date.now();

function makeApiRequest(endpoint, options) {
    const now = Date.now();

    if (requestCount >= requestLimit && now - timeWindowStart < timeWindow) {
        console.log("Request limit reached. Try again later.");
        return Promise.reject("Request limit reached");
    } else if (now - timeWindowStart >= timeWindow) {
        requestCount = 0;
        timeWindowStart = now;
    }

    if (apiCache.has(endpoint)) {
        return Promise.resolve(apiCache.get(endpoint));
    }

    requestCount++;
    return fetch(endpoint, options)
        .then(response => response.json())
        .then(data => {
            apiCache.set(endpoint, data);
            return data;
        });
}
