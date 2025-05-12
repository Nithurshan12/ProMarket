    const response = await fetch('https://your-backend-url/best-product');function filterByCategory() {
    
    const selectedCategory = document.getElementById('category').value;
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (selectedCategory === 'all' || productCategory === selectedCategory) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
// Initialize an empty cart
let cart = [];

// Function to add items to the cart
function addToCart(event) {
    const productElement = event.target.parentElement;
    const productName = productElement.querySelector('h2').textContent;
    const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('Price: $', ''));

    // Add product to the cart
    cart.push({ name: productName, price: productPrice });
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Clear the cart display
    cartItemsContainer.innerHTML = '';

    // Add each item to the cart display
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    // Update the total price
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Thank you for your purchase!');
    cart = []; // Clear the cart
    updateCart();
}

// Attach event listeners to buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});
document.getElementById('checkout').addEventListener('click', checkout);
