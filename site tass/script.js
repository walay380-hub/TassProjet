// LEADER ALUMINIUM Core JavaScript Logic

// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentProducts = [];

// Product Database (Simulated)
const productsData = [
    {
        id: 1,
        name: "Premium Outdoor Pergola",
        price: 3499.00,
        category: "aluminum",
        use: "outdoor",
        image: "images/3bea3ce4-204f-4c1a-be2b-5bdff195291b.jpg",
        shortDesc: "Modern silver aluminum pergola for stylish outdoor spaces.",
        fullDesc: "Our flagship outdoor structure. Constructed with aerospace-grade aluminum, featuring a sleek silver and dark gray aesthetic. Perfect for patios.",
        stock: 5
    },
    {
        id: 2,
        name: "Realistic Ficus Plant",
        price: 149.00,
        category: "plants",
        use: "indoor",
        image: "images/4ca0e234-a52f-459d-83bf-992b177e2f6e.jpg",
        shortDesc: "Tall realistic artificial Ficus plant.",
        fullDesc: "A highly realistic artificial Ficus plant that brings life to any room without the maintenance. Includes a premium dark gray pot.",
        stock: 12
    },
    {
        id: 3,
        name: "Glass Balcony Railing",
        price: 299.00,
        category: "aluminum",
        use: "outdoor",
        image: "images/4e0505f5-1784-40e8-b637-e14b2fb58713.jpg",
        shortDesc: "Modern silver aluminum glass balcony railing.",
        fullDesc: "Sleek, robust, and premium. Our glass balcony railing system ensures safety while maximizing your view with its minimalist aluminum frame.",
        stock: 20
    },
    {
        id: 4,
        name: "Geometric Planter Pot",
        price: 89.00,
        category: "decoration",
        use: "indoor",
        image: "images/78b6bf7a-33b7-42f7-93b5-71229962fc3f.jpg",
        shortDesc: "Sleek, modern dark gray and silver decorative pot.",
        fullDesc: "Premium geometric planter pot. Made with high-quality materials, combining dark gray panels with silver accents.",
        stock: 15
    },
    {
        id: 5,
        name: "Monstera Deliciosa",
        price: 129.00,
        category: "plants",
        use: "indoor",
        image: "images/7c9b343a-3eb9-4995-ab5c-b4f7bd419a2c.jpg", // Reusing image for now
        shortDesc: "Artificial Monstera plant with large leaves.",
        fullDesc: "Lush artificial Monstera plant. Perfect for living rooms and office spaces.",
        stock: 8
    },
    {
        id: 6,
        name: "Outdoor Lounge Canopy",
        price: 1899.00,
        category: "aluminum",
        use: "outdoor",
        image: "images/82750d60-19bb-444f-9b32-341bc26cee79.jpg", // Reusing image
        shortDesc: "Compact aluminum canopy for lounging areas.",
        fullDesc: "A smaller sized canopy perfect for backyard lounges. Weather resistant silver finish.",
        stock: 3
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupMobileMenu();
    updateAuthUI();
});

// Setup Mobile Menu
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Navbar scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check stock
        if (existingItem.quantity + quantity > product.stock) {
            alert('Cannot add more of this item, stock limit reached.');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    // Dispatch event for cart page to re-render
    document.dispatchEvent(new Event('cartUpdated'));
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    const product = productsData.find(p => p.id === productId);
    
    if (item && product) {
        if (newQuantity > 0 && newQuantity <= product.stock) {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            document.dispatchEvent(new Event('cartUpdated'));
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = totalItems;
        countElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// Utility: Show Notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification-toast');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification-toast';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--secondary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Animate out
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Auth UI Helper
function updateAuthUI() {
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        if (currentUser) {
            link.innerHTML = '<i class="fas fa-user"></i> Profile';
            link.href = 'profile.html';
        } else {
            link.innerHTML = '<i class="fas fa-user"></i> Login';
            link.href = 'login.html';
        }
    });
}

// Render Products helper
function createProductCard(product) {
    return `
        <div class="product-card">
            ${product.use === 'indoor' ? '<span class="product-badge">Indoor</span>' : '<span class="product-badge">Outdoor</span>'}
            <a href="product.html?id=${product.id}" class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <a href="product.html?id=${product.id}">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                <p class="product-price">${product.price.toFixed(2)} TND</p>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-outline" style="text-align:center;">View</a>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Add</button>
                </div>
            </div>
        </div>
    `;
}
