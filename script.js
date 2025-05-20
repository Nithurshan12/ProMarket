// --------- Category Filtering (Buttons) ---------
document.addEventListener('DOMContentLoaded', () => {
    const categoryBar = document.getElementById('categoryBar');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product');

    categoryBar.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.getAttribute('data-category'));
        }
    });

    function filterByCategory(selectedCategory) {
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            product.style.display = (selectedCategory === 'all' || productCategory === selectedCategory) ? 'block' : 'none';
        });
    }

    // --------- Product Search -----------
    document.getElementById('searchForm').addEventListener('submit', searchProducts);

    function searchProducts(event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.toLowerCase();
        products.forEach(product => {
            const name = product.getAttribute('data-name').toLowerCase();
            product.style.display = name.includes(query) ? 'block' : 'none';
        });
    }

    // --------- Cart Logic -----------
    let cart = [];

    function addToCart(event) {
        const productElement = event.target.closest('.product');
        const productName = productElement.getAttribute('data-name');
        const productPrice = parseFloat(productElement.getAttribute('data-price'));
        cart.push({ name: productName, price: productPrice });
        updateCart();
    }

    function updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartItemsContainer.appendChild(itemElement);
            total += item.price;
        });
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

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
            cart = [];
            updateCart();
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    document.getElementById('checkout').addEventListener('click', checkout);
    document.getElementById('signUpBtn').addEventListener('click', () => {
        alert('Sign-up functionality is coming soon!');
    });

    // --------- Chatbot Logic -----------
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const messagesDiv = document.getElementById('chatMessages');
    const chatTypingDiv = document.getElementById('chatTyping');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatQuickBtnsDiv = document.getElementById('chatQuickBtns');

    // Quick action buttons for chatbot
    const quickActions = [
        { label: "Show Electronics", action: "show electronics" },
        { label: "Show Fashion", action: "show fashion" },
        { label: "View Cart", action: "view cart" },
        { label: "Help", action: "help" }
    ];

    function renderQuickButtons() {
        chatQuickBtnsDiv.innerHTML = '';
        quickActions.forEach(({ label, action }) => {
            const btn = document.createElement('button');
            btn.className = 'chatbot-quick-btn';
            btn.textContent = label;
            btn.onclick = () => handleQuickAction(action);
            chatQuickBtnsDiv.appendChild(btn);
        });
    }

    function handleQuickAction(action) {
        chatInput.value = action;
        sendMessage();
    }

    function getResponse(message) {
        message = message.toLowerCase();
        if (["hello", "hi", "hey"].includes(message)) {
            return "Hi! How can I assist you today? You can ask for help, browse categories, or view your cart.";
        }
        if (["help", "what can you do"].some(q => message.includes(q))) {
            return "I can help you search for products, filter by category, add items to your cart, show your cart, or answer questions about ProMarket!";
        }
        if (message.includes("electronics")) {
            simulateCategoryClick('electronics');
            return "Here are the electronics products!";
        }
        if (message.includes("fashion")) {
            simulateCategoryClick('fashion');
            return "Showing you the latest in fashion!";
        }
        if (message.includes("drawing tools")) {
            simulateCategoryClick('drawing-tools');
            return "Here are the drawing tools!";
        }
        if (message.includes("books")) {
            simulateCategoryClick('books');
            return "Currently, there are no books listed. Check back soon!";
        }
        if (message.includes("cart") || message.includes("view cart")) {
            if (cart.length === 0) return "Your cart is empty.";
            let reply = "Your cart items:<br>";
            cart.forEach(item => reply += `• ${item.name} - $${item.price.toFixed(2)}<br>`);
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            reply += `<b>Total:</b> $${total.toFixed(2)}`;
            return reply;
        }
        if (message.includes("add") && message.includes("cart")) {
            return "To add a product, just click the 'Add to Cart' button for that item.";
        }
        if (message.includes("bye")) {
            return "Goodbye! Have a great day!";
        }
        if (message.includes("what is promarket")) {
            return "ProMarket is a safe and reliable online marketplace where you can buy and sell with confidence.";
        }
        return "I'm not sure how to respond to that. Try using the quick action buttons, or ask me about products, categories, or your cart!";
    }

    // Populate chat history and quick buttons on load
    chatHistory.forEach(({ sender, message }) => addMessage(sender, message, true));
    renderQuickButtons();

    window.toggleChatbot = function() {
        const chatbot = document.getElementById('chatbot');
        const toggleButton = document.getElementById('toggleButton');
        if (chatbot.style.maxHeight === '40px') {
            chatbot.style.maxHeight = '440px';
            toggleButton.textContent = '-';
            renderQuickButtons();
        } else {
            chatbot.style.maxHeight = '40px';
            toggleButton.textContent = '+';
            chatQuickBtnsDiv.innerHTML = '';
        }
    };

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        addMessage('You', userMessage);
        chatInput.value = '';
        chatTypingDiv.style.display = 'block';
        setTimeout(() => {
            const botResponse = getResponse(userMessage);
            addMessage('Bot', botResponse);
            chatTypingDiv.style.display = 'none';
        }, 700);
    }

    function addMessage(sender, message, skipSave) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'You' ? 'user' : 'bot');
        messageDiv.innerHTML = `<span>${sender}:</span> ${message}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        if (!skipSave) {
            chatHistory.push({ sender, message });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Simulated category click for chatbot
    function simulateCategoryClick(category) {
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });
        filterByCategory(category);
    }
});  
