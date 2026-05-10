function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");
    
    if (menu.classList.contains("nav-open")) {
        menu.classList.remove("nav-open");
        overlay.style.opacity = "0";
        setTimeout(() => { overlay.style.display = "none"; }, 300);
    } else {
        overlay.style.display = "block";
        setTimeout(() => { overlay.style.opacity = "1"; }, 10);
        menu.classList.add("nav-open");
    }
}

// Function maalum ya Side Bar Categories
function filterAndClose(cat, element) {
    // 1. Chuja bidhaa (Hii inaita function ya ui-handler)
    filterCategory(cat);
    
    // 2. Update muonekano wa chip iliyobonyezwa
    document.querySelectorAll('.s-cat').forEach(c => c.classList.remove('active'));
    element.classList.add('active');

    // 3. Funga menu kinyama
    setTimeout(() => {
        toggleMenu();
        // Hakikisha tuko home kuona bidhaa
        showSection('home');
    }, 150);
}
// navigation.js

function showSection(name, element) {
    // 1. Ficha sehemu zote
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.style.display = 'none');

    // 2. Onyesha iliyochaguliwa
    const target = document.getElementById(name + '-section');
    if (target) {
        target.style.display = 'block';
    }

    // 3. FUNGA MENU KAMA IKO WAZI
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");
    
    if (menu && menu.classList.contains("nav-open")) {
        menu.classList.remove("nav-open");
        if (overlay) overlay.style.display = "none";
    }

    // 4. Update rangi ya button za chini
    const links = document.querySelectorAll('.menu .link');
    links.forEach(l => l.classList.remove('active'));
    if (element) element.classList.add('active');
}
// navigation.js

function accessAdmin() {
    // 1. Password unayotaka wewe (Badilisha 'Area51Agent' iwe unavyotaka)
    const secretKey = "Thue"; 
    
    // 2. Uliza password
    let input = prompt("🚨 RESTRICTED AREA: Enter Agent Access Code:");

    // 3. Hakiki kama password ni sahihi
    if (input === secretKey) {
        alert("✅ ACCESS GRANTED. Welcome, Commander.");
        window.location.href = "admin.html"; // Inampeleka kwenye admin page
    } else if (input === null) {
        // Mtumiaji akibonyeza Cancel, usifanye kitu
        return;
    } else {
        alert("❌ ACCESS DENIED. Intruder alert!");
// navigation.js - LINE 71
window.location.href = "admin.html";    }
}