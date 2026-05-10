// js/languages.js

const translations = {
    'en': {
        'hero-title': 'Classified Drops',
        'trending': 'Trending Now',
        'cart-title': 'Your Inventory',
        'search-placeholder': 'Search products...'
    },
    'sw': {
        'hero-title': 'Mizigo ya Siri',
        'trending': 'Zinazovuma Sasa',
        'cart-title': 'Mzigo Wako',
        'search-placeholder': 'Tafuta bidhaa...'
    }
};

window.changeLanguage = function(lang) {
    console.log("Lugha inabadilishwa kwenda:", lang);
    localStorage.setItem('area51_lang', lang);

    // 1. Tafuta maneno yote yenye data-key
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            // Badili neno
            el.textContent = translations[lang][key];
            // Kama ni input ya search, badili placeholder
            if (el.tagName === 'INPUT') el.placeholder = translations[lang][key];
        }
    });

    // 2. Update rangi ya button
    document.querySelectorAll('.lang-dot').forEach(dot => {
        dot.style.color = (dot.innerText.toLowerCase() === lang) ? 'var(--area51-accent)' : 'gray';
    });
};

// Pakia lugha mteja aliyoacha mara ya mwisho
document.addEventListener('DOMContentLoaded', () => {
    const lastLang = localStorage.getItem('area51_lang') || 'en';
    window.changeLanguage(lastLang);
});