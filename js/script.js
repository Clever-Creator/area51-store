// 1. DATA NA VARIABLES (Area 51 Base Config)
let cart = [];
let currentQty = 1;
let currentBasePrice = 0;


// 2. INITIALIZE (Duka likifunguka)
document.addEventListener("DOMContentLoaded", () => {
    // Kurudisha Theme ya mteja
    const savedTheme = localStorage.getItem('area51_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    filterCategory('ALL');
    
    // Toa Loader kistaarabu
    setTimeout(() => {
        const loader = document.getElementById('preloader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1500);
});

// 3. THEME LOGIC (Dark/Light Mode)
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = (current === 'dark') ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('area51_theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-btn');
    if(btn) btn.innerText = (theme === 'dark') ? '☀️' : '🌘';
}

// 4. NAVIGATION (Side Buttons Fix)
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    if(menu) menu.classList.toggle("nav-open");
}

function showSection(name, element) {
    // Ficha page zote
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    
    // Onyesha page husika
    const target = document.getElementById(name + '-section');
    if (target) target.style.display = 'block';

    // Update Menu Buttons (Rangi ya Gold)
    document.querySelectorAll('.link').forEach(l => l.classList.remove('active'));
    if(element) element.classList.add('active');

    // Funga side menu (kama ipo wazi kwenye mobile)
    const menu = document.getElementById("sideMenu");
    if(menu) menu.classList.remove("nav-open");

    // Load Data kulingana na page
    if (name === 'drops') renderDrops();
    if (name === 'cart') renderCartPage();
    if (name === 'me') renderProfile();
    
    window.scrollTo(0,0);
}

// 5. PRODUCT & FILTER LOGIC
function filterCategory(cat) {
    const grid = document.getElementById('mainGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = (cat === 'ALL') ? allProducts : allProducts.filter(p => p.cat === cat);
    
    filtered.forEach(p => {
        const isSoldOut = p.soldOut === true;
        const soldOutTag = isSoldOut ? `<div class="sold-out-badge">SOLD OUT</div>` : '';
        const clickAction = isSoldOut ? '' : `onclick="openProduct('${p.name}', '${p.price}', '${p.img}')"`;
        const grayscaleStyle = isSoldOut ? 'filter: grayscale(1); opacity: 0.6; pointer-events: none;' : '';

        grid.innerHTML += `
            <div class="p-card" ${clickAction} style="position: relative; ${grayscaleStyle}">
                ${soldOutTag}
                <img src="${p.img}" loading="lazy">
                <div class="p-info">
                    <div class="p-name" style="font-size:12px; font-weight:600;">${p.name}</div>
                    <div class="p-price" style="color:var(--area51-accent); font-weight:800;">${p.price}</div>
                </div>
            </div>`;
    });
}

function openProduct(name, priceStr, img) {
    let cleanPrice = priceStr.replace(/[^0-9]/g, '');
    currentBasePrice = parseInt(cleanPrice);
    currentQty = 1;

    document.getElementById('mName').innerText = name;
    document.getElementById('mPrice').innerText = priceStr;
    document.getElementById('mImg').src = img;
    document.getElementById('qtyDisplay').innerText = currentQty;

    updateTotalAmount();
    document.getElementById('productModal').style.display = 'flex';
}

function changeQty(val) {
    currentQty += val;
    if (currentQty < 1) currentQty = 1;
    document.getElementById('qtyDisplay').innerText = currentQty;
    updateTotalAmount();
}

function updateTotalAmount() {
    let total = currentQty * currentBasePrice;
    let formatted = new Intl.NumberFormat().format(total);
    document.getElementById('totalDisplay').innerText = `Tsh ${formatted}`;
}

// 6. WHATSAPP & CHECKOUT
function openCheckout() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('checkoutModal').style.display = 'flex';
}

function selectPay(method) {
    const details = document.getElementById('paymentDetails');
    details.style.display = 'block';
    
    if (method === 'qr') {
        details.innerHTML = `<div style="text-align:center; color:white; animation: fadeIn 0.3s;">
            <p>Lipa Namba: <strong style="font-size:20px; color:var(--area51-accent);">52389305</strong></p>
            <p>Jina: AREA51 STORE</p>
            <img src="images/qr_code.jpeg" style="width:160px; border:3px solid white; border-radius:10px; margin-top:10px;">
        </div>`;
    } else if (method === 'mobile') {
        details.innerHTML = `
            <select class="pay-input"><option>M-PESA</option><option>TIGO PESA</option></select>
            <input type="tel" class="pay-input" placeholder="07XXXXXXXX">`;
    }
}

function processPayment() {
    const amount = document.getElementById('totalDisplay').innerText;
    const item = document.getElementById('mName').innerText;
    const qty = document.getElementById('qtyDisplay').innerText;
    const msg = `Habari AREA51! 👋 Nimefanya malipo ya ${amount}.\n\nOda yangu:\n- ${item} (Qty: ${qty})\n\nNaomba nithibitishiwe.`;
    window.open(`https://wa.me/255753556426?text=${encodeURIComponent(msg)}`, '_blank');
}

function closeModal() { document.getElementById('productModal').style.display = 'none'; }
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

// 1. Ongeza Bidhaa
function addToCart() {
    const product = {
        name: document.getElementById('mName').innerText,
        price: parseInt(document.getElementById('mPrice').innerText.replace(/[^0-9]/g, '')),
        img: document.getElementById('mImg').src,
        qty: parseInt(document.getElementById('qtyDisplay').innerText)
    };

    // Angalia kama ipo tayari
    const exists = cart.find(item => item.name === product.name);
    if (exists) {
        exists.qty += product.qty;
    } else {
        cart.push(product);
    }

    saveCart();
    closeModal();
    updateCartUI();
    
    // Animation fupi ya kuonyesha imeingia
    alert("📦 Imewekwa kwenye Inventory!");
}

// 2. Hifadhi na Update Counter
function saveCart() {
    localStorage.setItem('area51_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').innerText = count;
}
// Hii itafanya kazi kila page ikifunguliwa
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartUI();
});
// js/script.js

function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    // Chota bidhaa kutoka Admin (localStorage)
    const storedProducts = JSON.parse(localStorage.getItem('area51_products')) || [];
    
    if (storedProducts.length === 0) {
        productGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; opacity: 0.5;'>No products deployed yet...</p>";
        return;
    }

    productGrid.innerHTML = storedProducts.map(p => `
        <div class="p-card" onclick="openModal('${p.name}', ${p.price}, '${p.img}')">
            <img src="${p.img}" alt="${p.name}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <p>Tsh ${p.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}
// Badilisha sehemu ya loadProducts()
productGrid.innerHTML = storedProducts.map(p => `
    <div class="p-card ${p.inStock ? '' : 'sold-out'}" onclick="${p.inStock ? `openModal('${p.name}', ${p.price}, '${p.img}')` : ''}">
        <div class="img-container" style="position:relative;">
            <img src="${p.img}" alt="${p.name}" style="filter: ${p.inStock ? 'none' : 'grayscale(100%) brightness(0.5)'}">
            ${p.inStock ? '' : '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:red; color:white; padding:5px 10px; font-weight:800; border-radius:5px; font-size:12px;">SOLD OUT</div>'}
        </div>
        <div class="p-info">
            <h3>${p.name}</h3>
            <p>Tsh ${p.price.toLocaleString()}</p>
        </div>
    </div>
`).join('');
// Hakikisha loadProducts() inaitwa ukifungua duka
document.addEventListener('DOMContentLoaded', loadProducts);