// ui-handler.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('area51_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 2. Load Home Products
    filterCategory('ALL');
    
    // 3. Kill Loader
    setTimeout(() => {
        const loader = document.getElementById('preloader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1500);
});

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");
    menu.classList.toggle("nav-open");
    overlay.style.display = menu.classList.contains("nav-open") ? "block" : "none";
}

function showSection(name, element) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(name + '-section');
    if (target) target.style.display = 'block';

    document.querySelectorAll('.link').forEach(l => l.classList.remove('active'));
    if(element) element.classList.add('active');

    toggleMenu(); // Funga menu baada ya kuchagua
    window.scrollTo(0,0);
}

function filterCategory(cat) {
    const grid = document.getElementById('mainGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = (cat === 'ALL') ? allProducts : allProducts.filter(p => p.cat === cat);
    
    filtered.forEach(p => {
        const isSoldOut = p.soldOut === true;
        const soldOutTag = isSoldOut ? `<div class="sold-out-badge">SOLD OUT</div>` : '';
        const clickAction = isSoldOut ? '' : `onclick="openProduct('${p.name}', '${p.price}', '${p.img}')"`;
        const style = isSoldOut ? 'filter: grayscale(1); opacity: 0.6; pointer-events: none;' : '';

        grid.innerHTML += `
            <div class="p-card" ${clickAction} style="position: relative; ${style}">
                ${soldOutTag}
                <img src="${p.img}" loading="lazy">
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">${p.price}</div>
                </div>
            </div>`;
    });
}
function showFakeNotification() {
    const names = ['Agent-X', 'Agent-007', 'G-Unit', 'Mnyamwezi', 'Classified'];
    const items = ['Raw Denim', 'Oud Spray', 'Gold Link', 'Stealth Cargo'];
    
    const notification = document.createElement('div');
    notification.style = `
        position: fixed; bottom: 80px; left: 20px; 
        background: rgba(0,0,0,0.9); color: white; padding: 10px 20px;
        border-radius: 30px; border-left: 4px solid var(--area51-accent);
        font-size: 12px; z-index: 5000; transition: 0.5s; opacity: 0;
    `;
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    notification.innerHTML = `🛡️ <b>${randomName}</b> amenunua <b>${randomItem}</b> sasa hivi`;
    document.body.appendChild(notification);

    setTimeout(() => { notification.style.opacity = '1'; }, 100);
    setTimeout(() => { 
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Inatokea kila baada ya sekunde 15
setInterval(showFakeNotification, 15000);
function updateCartUI() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:50px; opacity:0.5;">
            <i class="fas fa-shopping-bag" style="font-size:50px;"></i>
            <p>Inventory yako haina kitu, Agent.</p>
        </div>`;
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="cart-item" style="display:flex; gap:15px; background:var(--card); padding:15px; border-radius:15px; margin-bottom:15px; border:1px solid var(--border);">
                <img src="${item.img}" style="width:80px; height:80px; object-fit:cover; border-radius:10px;">
                <div style="flex:1;">
                    <h4 style="margin:0; font-size:14px;">${item.name}</h4>
                    <p style="color:var(--area51-accent); font-weight:800; margin:5px 0;">Tsh ${item.price.toLocaleString()}</p>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="updateQty(${index}, -1)" style="background:#333; color:white; border:none; padding:5px 10px; border-radius:5px;">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${index}, 1)" style="background:#333; color:white; border:none; padding:5px 10px; border-radius:5px;">+</button>
                        <i class="fas fa-trash" onclick="removeFromCart(${index})" style="margin-left:auto; color:#ff4444; cursor:pointer;"></i>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        <div style="margin-top:20px; padding:20px; background:rgba(212,175,55,0.1); border-radius:15px; border:1px dashed var(--area51-accent);">
            <div style="display:flex; justify-content:space-between; font-weight:800;">
                <span>TOTAL:</span>
                <span style="color:var(--area51-accent);">Tsh ${total.toLocaleString()}</span>
            </div>
            <button class="buy-now-btn" style="width:100%; margin-top:15px;" onclick="openCheckoutFromCart()">PROCEED TO CHECKOUT</button>
        </div>
    `;

    container.innerHTML = html;
}

function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty < 1) return removeFromCart(index);
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}