/// Cache and request limiter
const apiCache = new Map();
let requestCount = 0;
const requestLimit = 10;
const timeWindow = 60000; // 1 minute
let timeWindowStart = Date.now();

// Toggle the flip effect individually for each card
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('clicked');
    });
});

// Function to make an API request with caching and rate limiting
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

// Function to fetch OpenGraph metadata from an API with request limiting
async function fetchLinkPreview(url) {
    try {
        const endpoint = `https://api.linkpreview.net/?key=590a461bbaa3aa105fb6374ed426221a&q=${encodeURIComponent(url)}`;
        const data = await makeApiRequest(endpoint);

        const previewText = data.description.length > 100 ? data.description.substring(0, 100) + '...' : data.description;

        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.innerHTML = `
            <a href="${data.url}" target="_blank">
                <img src="${data.image}" alt="Preview Image" class="topic-image">
                <h3>${data.title}</h3>
                <p>${previewText}</p>
            </a>
        `;

        document.querySelector('.topics-container').appendChild(topicItem);
    } catch (error) {
        console.error('Error fetching link preview:', error);
    }
}

// List of URLs to fetch and display in the recent topics section
const urls = [
    'https://theclose.com/real-estate-blogs/',
    'https://geekestateblog.com/',
    'https://www.bigcommerce.com/articles/ecommerce/ecommerce-trends/',
    'https://www.syskit.com/blog/microsoft-power-platform-in-numbers/#:~:text=The%20Power%20Platform%20Community%20also,from%205.2%20million%20in%202023.&text=On%20the%20Copilot%20side%2C%20it',
    'https://toolyt.com/blog/ai-artificial-intelligence/role-of-ai-and-machine-learning-in-modern-crm-platforms/',
    'https://educate360.com/blog/benefits-of-continuous-learning-and-development/',
    'https://www.revfine.com/technology-trends-hospitality-industry/',
    'https://corehandf.com/2024-fitness-trends-personalization-wellness-digital-technology/'
];

// Fetch OpenGraph metadata for each URL
urls.forEach(url => fetchLinkPreview(url));

// Function to check if an element is within the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Function to add a 'visible' class to elements when they are in the viewport
function handleScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Add an event listener for scrolling to handle elements entering the viewport
window.addEventListener('scroll', handleScroll);

// Trigger the scroll handler initially to account for elements already in view
handleScroll();
