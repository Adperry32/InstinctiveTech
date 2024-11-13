
// Cache and request limiter
const apiCache = new Map();
let requestCount = 0;
const requestLimit = 10;
const timeWindow = 60000; // 1 minute
let timeWindowStart = Date.now();

// Toggle the flip effect individually for each card
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('clicked'); // Toggle 'clicked' class on each individual item
    });
});


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

