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

    function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to the cart before checking out.');
        return;
    }

    let cartSummary = 'You have the following items in your cart:\n\n';
    cart.forEach((item, index) => {
        cartSummary += `${index + 1}. ${item.name} - $${item.price.toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartSummary += `\nTotal: $${total.toFixed(2)}\n\n`;

    const confirmCheckout = confirm(cartSummary + 'Proceed to checkout?');
    if (confirmCheckout) {
        alert('Thank you for your purchase! Your order is being processed.');
        cart = []; // Clear the cart
        updateCart(); // Update the cart display
    }
}
// Attach event listeners to buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});
document.getElementById('checkout').addEventListener('click', checkout);
