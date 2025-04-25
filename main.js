// main.js

// Function to go to cart page
function goToCart() {
    window.location.href = 'cart.html';
}

// Function to add item to cart
function addToCart(name, price, id) {
    const quantityInput = document.getElementById(id + '-quantity');
    let quantity = 1; // Default quantity if input is not found or invalid

    if (quantityInput) {
        const parsedQuantity = parseInt(quantityInput.value);
        quantity = isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;
    }

    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    const item = {
        name,
        price,
        quantity: quantity,
        total: price * quantity
    };

    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === name && cartItem.price === price);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].total = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
    } else {
        cart.push(item);
    }
    //adding local storage

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated:', JSON.parse(localStorage.getItem('cart')));

    // Display the "Added to cart" message next to the button
    const addButton = document.querySelector(`.add-to-cart[onclick="addToCart('${name}', ${price}, '${id}')"]`);
    if (addButton) {
        const messageSpan = document.createElement('span');
        messageSpan.textContent = ' Added to cart!';
        messageSpan.style.marginLeft = '5px';
        messageSpan.style.color = 'green';
        messageSpan.style.display = 'inline-block';
        addButton.parentNode.insertBefore(messageSpan, addButton.nextSibling);

        // Optionally, remove the message after a short delay
        setTimeout(() => {
            messageSpan.remove();
        }, 2000);
    }
}


function processPayment() {
    // Get references to the input fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postal-code');
    const cardNumberInput = document.getElementById('card-number');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    let isValid = true;
    let errorMessage = "";

    // Function to check if a value is a string
    function isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    // Function to check if a value is a number (and not NaN)
    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    // Function to check if a value is a valid email format (basic check)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Data Type and Basic Validation ---

    // Full Name (should be a string)
    if (!isString(nameInput.value.trim()) || nameInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Please enter a valid Full Name.\n";
    }

    // Email Address (should be a string and a valid email format)
    if (!isString(emailInput.value.trim()) || !isValidEmail(emailInput.value.trim())) {
        isValid = false;
        errorMessage += "Please enter a valid Email Address.\n";
    }

    // Phone Number 
    if (!isString(phoneInput.value.trim()) || phoneInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Please enter a valid Phone Number.\n";
    }

    // Shipping Address (should be a string)
    if (!isString(addressInput.value.trim()) || addressInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Please enter a valid Shipping Address.\n";
    }

    // City (should be a string)
    if (!isString(cityInput.value.trim()) || cityInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Please enter a valid City.\n";
    }

    // Postal Code 
    if (!isString(postalCodeInput.value.trim()) || postalCodeInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Please enter a valid Postal Code.\n";
    }

    // Payment Method
    const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedPayment) {
        isValid = false;
        errorMessage += "Please select a Payment Method.\n";
    } else if (selectedPayment.value === 'visa' || selectedPayment.value === 'mastercard') {
        // Card Number
        if (!isString(cardNumberInput.value.trim()) || cardNumberInput.value.trim() === "") {
            isValid = false;
            errorMessage += "Please enter a valid Card Number.\n";
        }

        // Expiry Date 
        if (!isString(expiryDateInput.value.trim()) || expiryDateInput.value.trim() === "") {
            isValid = false;
            errorMessage += "Please enter a valid Expiry Date (MM/YY).\n";
        }

        // CVV 
        if (!isString(cvvInput.value.trim()) || !/^\d{3,4}$/.test(cvvInput.value.trim())) {
            isValid = false;
            errorMessage += "Please enter a valid CVV.\n";
        }
    }

    if (!isValid) {
        alert(errorMessage);
        return; // Stop the process if there are validation errors
    }

    // If all data types and basic required checks pass:
    // Calculate the delivery date (example: 3 business days from now)
    const today = new Date();
    let deliveryDate = new Date(today);
    let businessDaysAdded = 0;
    const deliveryDays = 3; // Number of business days for delivery

    while (businessDaysAdded < deliveryDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        const dayOfWeek = deliveryDate.getDay(); // 0=Sunday, 6=Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
            businessDaysAdded++;
        }
    }

    const deliveryDateString = deliveryDate.toLocaleDateString();

    // Display the confirmation message
    document.getElementById('delivery-date').textContent = deliveryDateString;
    document.getElementById('confirmation-message').style.display = 'block';

    // Clear the cart from localStorage after successful (simulated) payment
    localStorage.removeItem('cart');

    // Optionally, update the cart display on the shipping page if it's visible
    const orderItemsList = document.getElementById('order-items');
    if (orderItemsList) {
        orderItemsList.innerHTML = '';
    }
    const orderTotalSpan = document.getElementById('order-total');
    if (orderTotalSpan) {
        orderTotalSpan.textContent = '';
    }


}

document.addEventListener('DOMContentLoaded', function() {
    // Call displayCart on page load to show the initial cart
    displayCart();

    // Load favorites on page load (if needed)
    const favoritesData = localStorage.getItem('favorites');
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];
    console.log('Loaded favorites:', favorites); 
});

// Proceed to checkout
function goToCheckout() {
    window.location.href = 'processor.html';
}


// Get all product elements
const productContainers = document.querySelectorAll('.product-container');
let allProducts = [];

// Extract product data from the HTML
productContainers.forEach(container => {
    const products = container.querySelectorAll('.product');
    products.forEach(product => {
        const img = product.querySelector('img');
        const h3 = product.querySelector('h3');
        const pDesc = product.querySelector('p:nth-child(3)'); // Assuming description is the 3rd <p>
        const pPrice = product.querySelector('.price');

        if (img && h3 && pDesc && pPrice) {
            allProducts.push({
                name: h3.textContent.toLowerCase(),
                description: pDesc.textContent.toLowerCase(),
                price: pPrice.textContent.toLowerCase(),
                element: product // Store the DOM element for display/hiding
            });
        }
    });
});

function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const searchResultsDiv = document.getElementById("searchResults");
    searchResultsDiv.innerHTML = ""; // Clear previous results

    // Hide all products initially
    allProducts.forEach(product => {
        product.element.style.display = 'none';
    });

    if (!searchTerm) {
        // If search term is empty, show all products again
        allProducts.forEach(product => {
            product.element.style.display = 'block';
        });
        searchResultsDiv.style.display = 'none'; // Hide the search results div
        return;
    }

    const results = allProducts.filter(product => {
        return (
            product.name.includes(searchTerm) ||
            product.description.includes(searchTerm) ||
            product.price.includes(searchTerm.replace('$', '')) // Search price without '$'
        );
    });

    if (results.length > 0) {
        searchResultsDiv.style.display = 'block';
        results.forEach(product => {
            product.element.style.display = 'block'; // Show matching products
        });
    } else {
        searchResultsDiv.style.display = 'block';
        searchResultsDiv.innerHTML = "<p>No results found.</p>";
    }
}
// Optional: Trigger search on Enter key press
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");
  
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");
      hamburger.classList.toggle("open");
    });
  });

// Close the navigation menu if a link is clicked 
navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open'); 
    }
});

//shipping page

// Handle payment method selection to show/hide card details
const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
const cardDetailsDiv = document.getElementById('card-details');
const cardNumberInput = document.getElementById('card-number');
const expiryDateInput = document.getElementById('expiry-date');
const cvvInput = document.getElementById('cvv');

paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'visa' || radio.value === 'mastercard') {
            cardDetailsDiv.style.display = 'block';
            cardNumberInput.required = true;
            expiryDateInput.required = true;
            cvvInput.required = true;
        } else {
            cardDetailsDiv.style.display = 'none';
            cardNumberInput.required = false;
            expiryDateInput.required = false;
            cvvInput.required = false;
        }
    });
});


function removeFromCart(name, price) {
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    const updatedCart = cart.filter(item => !(item.name === name && item.price === price));

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Item removed from cart:', name, price);

    // Re-render the cart table
    displayCart();
}

function displayCart() {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;

    if (cartTableBody) {
        cartTableBody.innerHTML = '';   // Clear existing cart items

        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                
                <td>$${item.total}</td>
                <td><button class="remove-item" onclick="removeFromCart('${item.name}', ${item.price})">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.total;
        });
    }

    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice;
    }
}



//Add to favourites table 

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//add to favourite button function
function saveFavouriteOrder(category) {
    const items = document.querySelectorAll(`#${category} .product`);
    const favouriteOrder = [];

    items.forEach(item => {
        const name = item.querySelector('h3').textContent;
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        const quantityInput = item.querySelector('input[type="number"]');
        const quantity = parseInt(quantityInput.value);

        if (!isNaN(quantity) && quantity > 0) {
            favouriteOrder.push({
                name,
                price,
                quantity,
                
            });
        }
    });

    if (favouriteOrder.length > 0) {
        localStorage.setItem(`favourite_${category}_order`, JSON.stringify(favouriteOrder));
        alert(`${category.charAt(0).toUpperCase() + category.slice(1)} favourite order saved!`);
    } else {
        alert("Please enter quantities before saving as favourite.");
    }
}









