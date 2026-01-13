// Cart functionality
let cart = [];
let cartCount = 0;

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShopping = document.getElementById('continueShopping');

// Product data
const products = {
    'summer-honey': {
        name: 'Летний мед - 227г/8oz',
        price: 650
    },
    'soft-set-honey': {
        name: 'Крем-мед - 227г/8oz',
        price: 650
    },
    'beeswax': {
        name: '100% пчелиный воск для творческих проектов 1oz/28г блок',
        price: 250
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
    updateCartDisplay();
});

// Event Listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    continueShopping.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const productId = e.target.getAttribute('data-product');
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product');
            const name = e.target.getAttribute('data-name');
            const price = parseInt(e.target.getAttribute('data-price'));
            addToCart(productId, name, price);
        });
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время для подтверждения заказа.');
            clearCart();
            cartModal.classList.remove('active');
        }
    });
}

// Cart Functions
function addToCart(productId, name, price) {
    const qtyInput = document.getElementById(`${productId}-qty`);
    const quantity = parseInt(qtyInput.value) || 0;
    
    if (quantity <= 0) {
        alert('Пожалуйста, выберите количество');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: quantity
        });
    }

    // Reset quantity
    qtyInput.value = 0;
    
    saveCart();
    updateCartDisplay();
    
    // Show notification
    showNotification('Товар добавлен в корзину!');
}

function updateQuantity(productId, change) {
    const qtyInput = document.getElementById(`${productId}-qty`);
    let currentQty = parseInt(qtyInput.value) || 0;
    currentQty = Math.max(0, currentQty + change);
    qtyInput.value = currentQty;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = cartCount;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Ваша корзина пуста</p>';
        cartTotal.textContent = '0';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽ за шт.</div>
                </div>
                <div class="cart-item-qty">
                    <button onclick="updateCartItemQuantity('${item.id}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">${item.price * item.quantity} ₽</div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Удалить">×</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total;
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2c2c2c;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Make functions available globally for onclick handlers
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
