// Product Data
const products = [
    {
        id: 1,
        name: "PLESETAN TEES #01",
        price: 250000,
        category: "tshirt",
        image: "assets/prod1.jpg"
    },
    {
        id: 2,
        name: "NOT GUCCI HOODIE",
        price: 450000,
        category: "hoodie",
        image: "assets/prod2.jpg"
    },
    {
        id: 3,
        name: "SUPREME-LY BAD",
        price: 250000,
        category: "tshirt",
        image: "assets/prod3.jpg"
    },
    {
        id: 4,
        name: "JUST DON'T IT",
        price: 275000,
        category: "tshirt",
        image: "assets/prod4.jpg"
    },
    {
        id: 5,
        name: "OFF-WHITE-ISH",
        price: 480000,
        category: "hoodie",
        image: "assets/prod5.jpg"
    },
    {
        id: 6,
        name: "UNBRANDED CAP",
        price: 150000,
        category: "acc",
        image: "assets/prod6.jpg"
    }
];

// Shopping Cart State
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const productsGrid = document.getElementById('products-grid');

// Format Currency
const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

// Toggle Sidebar
cartBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Generate SVG Placeholder
function generatePlaceholder(text, color) {
    const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#111"/>
        <rect x="50" y="50" width="300" height="300" stroke="${color}" stroke-width="2" fill="none" rx="20"/>
        <text x="50%" y="45%" font-family="monospace" font-size="24" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
        <text x="50%" y="55%" font-family="monospace" font-size="14" fill="${color}" text-anchor="middle" dy=".3em">PLESETAN.CLUB</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Render Products
function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    filteredProducts.forEach((product, index) => {
        // Generate a random-ish neon color for variety
        const colors = ['#ccff00', '#ff0055', '#00ffff', '#ffff00'];
        const accent = colors[index % colors.length];
        const imageUrl = generatePlaceholder(product.name, accent);

        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        productEl.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}">
                <div class="add-to-cart-overlay" onclick="addToCart(${product.id})">ADD TO STASH</div>
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.name}</h4>
                <div class="product-price">${formatIDR(product.price)}</div>
            </div>
        `;
        productsGrid.appendChild(productEl);
    });
}

// Add to Cart
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    sidebar.classList.add('active');
};

// Remove from Cart
window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCart();
};

// Update Cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; color:#666;">YOUR CART IS EMPTY. SAD.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x ${formatIDR(item.price)}</p>
                </div>
                <div class="remove-item" onclick="removeFromCart(${item.id})">REMOVE</div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    cartTotalEl.innerText = formatIDR(total);
    cartCountEl.innerText = count;
}

// Filter Logic
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.dataset.filter);
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add slight delay for outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Stats Animation
const stats = document.querySelectorAll('.stat-num');
let hasAnimated = false;

window.addEventListener('scroll', () => {
    const section = document.querySelector('.about-section');
    const sectionPos = section.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !hasAnimated) {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-val');
            const increment = target / 100;

            let current = 0;
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.innerText = Math.ceil(current);
                    setTimeout(updateCount, 20);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
        hasAnimated = true;
    }
});

// Gallery logic replaced by manual HTML/CSS
// const galleryItems = document.querySelectorAll('.gallery-item');
// galleryItems.forEach((item, index) => {
//    ... removed ...
// });

// Init
renderProducts();

