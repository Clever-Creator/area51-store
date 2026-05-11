// js/admin.js

// 1. Orodha ya bidhaa zako za mwanzo (Zile za demo)
const initialProducts = [
    { id: 1, name: "Raw Denim Jacket", price: 85000, category: "DENIM", img: "images/p1.jpg", inStock: true },
    { id: 2, name: "Silver Stealth Ring", price: 45000, category: "JEWELRY", img: "images/p2.jpg", inStock: true },
    { id: 3, name: "Midnight Fragrance", price: 120000, category: "SPRAYS", img: "images/p3.jpg", inStock: true }
];

// 2. Angalia kama kuna bidhaa tayari, kama hamna, weka hizi za mwanzo
let products = JSON.parse(localStorage.getItem('area51_products'));

if (!products || products.length === 0) {
    products = initialProducts;
    localStorage.setItem('area51_products', JSON.stringify(products));
}

// ... kodi nyingine ya admin.js inaendelea hapa chini ...


function deployProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const category = document.getElementById('pCategory').value;
    const img = document.getElementById('pImg').value;

    if (!name || !price || !img) {
        alert("🚨 Agent, you missed some data fields!");
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: parseInt(price),
        category: category,
        img: img
    };

    products.push(newProduct);
    localStorage.setItem('area51_products', JSON.stringify(products));
    
    // Refresh list pekee bila kurefresh page nzima
    renderAdminProducts();
    
    // Clear inputs
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pImg').value = '';
    
    alert("🔥 GEAR DEPLOYED SUCCESSFULLY!");
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to terminate this item from inventory?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('area51_products', JSON.stringify(products));
        renderAdminProducts();
    }
}

function renderAdminProducts() {
    const listDiv = document.getElementById('adminProductList');
    listDiv.innerHTML = '';
    
    if(products.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; opacity:0.3; padding:20px;">No gear in stock...</p>';
        return;
    }

    products.forEach(p => {
        listDiv.innerHTML += `
            <div class="admin-p-card">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/50?text=Error'">
                <div class="admin-p-info">
                    <h4>${p.name}</h4>
                    <span>Tsh ${p.price.toLocaleString()}</span>
                </div>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
}

// Pakia list mara ya kwanza
document.addEventListener('DOMContentLoaded', renderAdminProducts);
// Ongeza hii sehemu ya kuokoa (ndani ya deployProduct)
const newProduct = {
    id: Date.now(),
    name: name,
    price: parseInt(price),
    category: category,
    img: img,
    inStock: true // Kila bidhaa mpya inaanza ikiwa ipo stock
};

// Ongeza hii function mpya ya kubadili hali ya stock
function toggleStock(id) {
    products = products.map(p => {
        if (p.id === id) p.inStock = !p.inStock;
        return p;
    });
    localStorage.setItem('area51_products', JSON.stringify(products));
    renderAdminProducts();
}

// Update renderAdminProducts() ionyeshe button ya Stock
// js/admin.js

function renderAdminProducts() {
    const listDiv = document.getElementById('adminProductList');
    listDiv.innerHTML = ''; // Safisha list ya zamani
    
    if(products.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; opacity:0.3; padding:20px;">No gear in stock...</p>';
        return;
    }

    products.forEach(p => {
        listDiv.innerHTML += `
            <div class="admin-p-card" style="opacity: ${p.inStock ? '1' : '0.6'}; border-left: 4px solid ${p.inStock ? 'var(--accent)' : '#ff3232'};">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/50?text=Error'">
                <div class="admin-p-info">
                    <h4>${p.name} ${p.inStock ? '' : '<span style="color:#ff3232; font-size:10px;">[OFF-STOCK]</span>'}</h4>
                    <span>Tsh ${p.price.toLocaleString()}</span>
                </div>
                
                <div style="display:flex; gap:8px;">
                    <button onclick="editProduct(${p.id})" title="Edit Gear" style="background:none; border:none; color:#0096ff; cursor:pointer;">
                        <i class="fas fa-edit"></i>
                    </button>

                    <button onclick="toggleStock(${p.id})" title="Toggle Stock" style="background:none; border:none; color:${p.inStock ? '#00ff64' : '#ff3232'}; cursor:pointer;">
                        <i class="fas ${p.inStock ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>

                    <button onclick="deleteProduct(${p.id})" title="Delete Gear" style="background:none; border:none; color:#ff3232; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Rudisha data kwenye form
        document.getElementById('pName').value = product.name;
        document.getElementById('pPrice').value = product.price;
        document.getElementById('pCategory').value = product.category;
        document.getElementById('pImg').value = product.img;

        // Futa ile ya zamani (Ili uki-Deploy iwe kama mpya iliyofanyiwa update)
        products = products.filter(p => p.id !== id);
        localStorage.setItem('area51_products', JSON.stringify(products));
        renderAdminProducts();
        
        // Focus kwenye input ya kwanza
        document.getElementById('pName').focus();
        alert("Editing: " + product.name + ". Make changes and click Deploy.");
    }
}
// Hii inabadilisha picha kuwa "Data URL" ambayo unaweza kuitumia dukani
let base64Image = "";

document.getElementById('productImageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        base64Image = reader.result;
        // Onyesha picha kidogo mteja ajue imekubali
        const preview = document.getElementById('previewImg');
        preview.src = base64Image;
        preview.style.display = "block";
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

// Kwenye ile function yako ya ku-save bidhaa (Submit)
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    
    // Tumia 'base64Image' badala ya ile link ya zamani
    const newProduct = {
        name: productName,
        price: productPrice,
        image: base64Image // Hapa ndio picha yenyewe kutoka kwenye device
    };

    // Hapa endelea na kodi zako za ku-save kwenye LocalStorage au Array
    console.log("Bidhaa imeongezwa!", newProduct);
    alert("Product Uploaded Successfully!");
}