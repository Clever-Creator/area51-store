// payment.js
let currentQty = 1;
let currentBasePrice = 0;

// payment.js

// 1. Inafungua Modal ya Bidhaa (Product Details)
function openProduct(name, priceStr, img) {
    // Kusafisha bei iwe namba tu
    let cleanPrice = priceStr.replace(/[^0-9]/g, '');
    currentBasePrice = parseInt(cleanPrice) || 0;
    currentQty = 1;

    // Hakikisha hizi ID zipo kwenye HTML yako
    if(document.getElementById('mName')) document.getElementById('mName').innerText = name;
    if(document.getElementById('mPrice')) document.getElementById('mPrice').innerText = priceStr;
    if(document.getElementById('mImg')) document.getElementById('mImg').src = img;
    if(document.getElementById('qtyDisplay')) document.getElementById('qtyDisplay').innerText = currentQty;

    updateTotal();
    const pModal = document.getElementById('productModal');
    if(pModal) pModal.style.display = 'flex';
}

// 2. INAFUNGUA CHECKOUT (Hapa ndipo Buy Now inapogoma)
function openCheckout() {
    // Funga modal ya bidhaa kwanza
    const pModal = document.getElementById('productModal');
    if(pModal) pModal.style.display = 'none';
    
    // Onyesha modal ya malipo
    const cModal = document.getElementById('checkoutModal');
    if (cModal) {
        cModal.style.display = 'flex';
    } else {
        alert("Oya! Checkout Modal haipo kwenye HTML. Ongeza id='checkoutModal'");
    }
}

// 3. CHAGUA NJIA YA MALIPO
function selectPay(method) {
    const details = document.getElementById('paymentDetails');
    if (!details) return;
    details.style.display = 'block';
    
    if (method === 'qr') {
        details.innerHTML = `
            <div style="text-align:center; color:white; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px; border:1px solid var(--area51-accent);">
                <p>Lipa Namba: <strong style="color:var(--area51-accent);">52389305</strong></p>
                <p>Jina: AREA51 STORE</p>
                <img src="images/qr_code.jpeg" style="width:150px; border-radius:10px; margin-top:10px;">
            </div>`;
    } else if (method === 'mobile') {
        details.innerHTML = `
            <select class="pay-input" style="width:100%; padding:12px; margin-bottom:10px; border-radius:8px; background:#111; color:white; border:1px solid #444;">
                <option>M-PESA</option><option>TIGO PESA</option><option>AIRTEL MONEY</option>
            </select>
            <input type="tel" class="pay-input" placeholder="07XXXXXXXX" style="width:100%; padding:12px; border-radius:8px; background:#111; color:white; border:1px solid #444;">`;
    }
}
function changeQty(val) {
    currentQty += val;
    if (currentQty < 1) currentQty = 1;
    document.getElementById('qtyDisplay').innerText = currentQty;
    updateTotal();
}

function updateTotal() {
    let total = currentQty * currentBasePrice;
    document.getElementById('totalDisplay').innerText = `Tsh ${new Intl.NumberFormat().format(total)}`;
}

function processPayment() {
    let message = "🛡️ *AREA 51 - NEW ORDER* 🛡️\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (x${item.qty}) - Tsh ${ (item.price * item.qty).toLocaleString() }\n`;
        total += (item.price * item.qty);
    });

    message += `\n💰 *TOTAL: Tsh ${total.toLocaleString()}*`;
    message += `\n📍 *Method:* Mobile Money Push / QR`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/255759515115?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}
function sendOrderToWhatsApp() {
    if (cart.length === 0) return alert("Inventory is empty!");

    let message = "🛡️ *AREA 51 - NEW GEAR ORDER* 🛡️\n";
    message += "----------------------------\n";
    
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `${index + 1}. *${item.name}* \n   Qty: ${item.qty} | Price: ${subtotal.toLocaleString()} \n`;
    });

    message += "----------------------------\n";
    message += `💰 *TOTAL AMOUNT: Tsh ${total.toLocaleString()}*\n`;
    message += "----------------------------\n";
    message += "📍 _Please confirm the delivery location and payment status._";

    const phone = "255759515115"; // WEKA NAMBA YAKO HAPA (Anza na 255)
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    
    // Clear cart baada ya order kutumwa
    localStorage.removeItem('area51_cart');
    cart = [];
    updateCartCount();
}