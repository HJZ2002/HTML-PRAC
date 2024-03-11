document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.nav-search-box');

    searchBox.addEventListener('keypress', function(e) {
        // Check if the key pressed is 'Enter'
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            const targetSection = document.getElementById(query); // section by ID

            if (targetSection) {
                // If the section exists, scroll to it
                targetSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Alerts the user if the section doesn't exist
                alert('Section not found: ' + query);
            }
        }
        
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide'); //  all the slides
    let slideIndex = 0; // slideIndex in this scope
    let interval;

    function showSlides() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1; }
        slides[slideIndex - 1].style.display = "block";
    }

    function startSlider() {
        if (!interval) {
            interval = setInterval(showSlides, 5000); // timer for the animation
        }
    }

    function stopSlider() {
        clearInterval(interval);
        interval = null;
        slideIndex = 0; // Reset slideIndex to 0
        showSlides(); // Call showSlides to reset to the first slide
    }

    // Adjusted to directly call startSlider without checking for interval existence
    startSlider();

    // Event listeners for previous and next buttons
    document.querySelector('.prev').addEventListener('click', function() {
        slideIndex -= 2; // slideIndex to show the previous slide
        showSlides();
    });

    document.querySelector('.next').addEventListener('click', function() {
        showSlides(); 
    });
    function checkWindowSize(){
        if (window.innerWidth < 768){
            startSlider();
        } else {
            stopSlider();
        }
    }
    checkWindowSize();

    window.addEventListener('resize',checkWindowSize);
    
    function updateQuantityDisplay(container, quantity) {
        const quantityDisplay = container.querySelector('.quantity-display');
        quantityDisplay.textContent = quantity;

        // Update the subtotal for the item
        const itemId = container.getAttribute('data-id');
        const itemPrice = itemPrices[itemId] || 0;
        const subtotal = quantity * itemPrice;
        const subtotalDisplay = container.querySelector('.item-subtotal');
        subtotalDisplay.textContent = `${subtotal} pesos`; // Update the subtotal display
    }
    
     //prices for each gallery item
    const itemPrices = {
        'one-piece-chicken': 35,
        'bottle-of-water': 20,
        '2pc-chicken-with-rice': 50,
        'takoyaki': 20,
        'beef-pares-with-rice': 50,
        'lumpia': 5
    };

    // Function to calculate the total price of the items in the gallery
    function calculateTotalPrice() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let totalPrice = 0;
        galleryItems.forEach(item => {
            const quantity = parseInt(item.getAttribute('data-quantity')) || 0;
            const itemId = item.getAttribute('data-id');
            const itemPrice = itemPrices[itemId] || 0;
            totalPrice += quantity * itemPrice;
        });
        return totalPrice; // Return the calculated total price
    }

   //total price items
    function updateTotalPrice() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let totalPrice = 0;
        galleryItems.forEach(item => {
            const quantity = parseInt(item.getAttribute('data-quantity')) || 0;
            const itemId = item.getAttribute('data-id'); 
            const itemPrice = itemPrices[itemId] || 0;
            totalPrice += quantity * itemPrice;
        });
        document.querySelector('.total-price-display').textContent = `Total: ${totalPrice} pesos`;

        // Enable or disable order and cancel buttons
        const orderButton = document.querySelector('#order-btn');
        const cancelButton = document.querySelector('#cancel-btn');
        if (totalPrice > 0) {
            orderButton.disabled = false;
            cancelButton.disabled = false;
        } else {
            orderButton.disabled = true;
            cancelButton.disabled = true;
        }
    }

    // Call upon the totalprice initially to set the correct state on how much is the total
    updateTotalPrice();

    function onGalleryImageClick(event) {
        const container = event.currentTarget;
        // Enable the buttons by setting a flag
        container.setAttribute('data-active', 'true');
        let quantity = parseInt(container.getAttribute('data-quantity')) || 0;
        if (quantity === 0) { // default number
            quantity = 1; // Set quantity to 1 
            container.setAttribute('data-quantity', quantity);
            updateQuantityDisplay(container, quantity);
        }
        updateTotalPrice(); 
        // Enable the increase and decrease buttons if once click the img
        const increaseButton = container.querySelector('.increase');
        const decreaseButton = container.querySelector('.decrease');
        increaseButton.disabled = false;
        decreaseButton.disabled = false;
    }

    function onQuantityButtonClick(event) {
        const button = event.currentTarget;
        const container = button.closest('.gallery-item');
        // Check if the container is active before proceeding
        if (container.getAttribute('data-active') === 'true') {
            let quantity = parseInt(container.getAttribute('data-quantity')) || 0;

            if (button.classList.contains('increase')) {
                quantity += 1;
            } else if (button.classList.contains('decrease') && quantity > 0) { 
                quantity -= 1;
            }

            container.setAttribute('data-quantity', quantity);
            updateQuantityDisplay(container, quantity);
            updateTotalPrice(); 
            // After updating, disable the buttons again and reset
            container.setAttribute('data-active', 'false');
            const increaseButton = container.querySelector('.increase');
            const decreaseButton = container.querySelector('.decrease');
            increaseButton.disabled = true;
            decreaseButton.disabled = true;
        }
    }
    // Attach event listeners to gallery images
    const galleryImages = document.querySelectorAll('.gallery-item');
    galleryImages.forEach(container => {
        container.addEventListener('click', onGalleryImageClick);
        container.setAttribute('data-quantity', 0); // Initialize quantity
        container.setAttribute('data-active', 'false'); // Initialize as not active
    
      
        const increaseButton = container.querySelector('.increase');
        const decreaseButton = container.querySelector('.decrease');
        increaseButton.addEventListener('click', onQuantityButtonClick);
        decreaseButton.addEventListener('click', onQuantityButtonClick);
        increaseButton.disabled = true; // Initially disable the increase button
        decreaseButton.disabled = true; // Initially disable the decrease button
    });
    const orderButton = document.querySelector('#order-btn'); 
    const cancelButton = document.querySelector('#cancel-btn');
    const paymentInput = document.getElementById('payment'); 

    // Function to process the order
    
    function processOrder() {
        const orderButton = document.querySelector('#order-btn');
        if (orderButton.disabled) {
            return;
        }

        const paymentAmount = parseInt(paymentInput.value, 10); // Get the payment amount
        const totalPrice = calculateTotalPrice();

        if (isNaN(paymentAmount) || paymentAmount < totalPrice) {
            alert('Please enter a valid amount');
            return;
        }

        const change = paymentAmount - totalPrice;
        let orderedItemsSummary = '';
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const quantity = parseInt(item.getAttribute('data-quantity')) || 0;
            if (quantity > 0) {
                const itemId = item.getAttribute('data-id');
                orderedItemsSummary += `${quantity}x ${itemId}, `;
            }
        });
        // Remove the comma and space
        orderedItemsSummary = orderedItemsSummary.replace(/, $/, '');
        //message 
        alert(`Thank you for your order. Here is your change: ${change} pesos.`);
        // Create a Blob from the order summary
        const message = `Your order has been processed. Here are the items you ordered: ${orderedItemsSummary}`;
        const blob = new Blob([message], { type: 'text/plain' });

        
        const reader = new FileReader();
        reader.onload = function(event) {
            console.log(event.target.result);
        };
        reader.readAsText(blob);

        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'order-summary.txt and receipt'; // file for the text and to be downloaded
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    function resetOrder() {
        const cancelButton = document.querySelector('#cancel-btn');
        if (cancelButton.disabled) {
            return;
        }

        // Reset the payment input
        paymentInput.value = '';
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.setAttribute('data-quantity', 0);
            updateQuantityDisplay(item, 0);
        });
        updateTotalPrice();
        alert('Your order has been canceled, therefore there are no changes.');
    }
    orderButton.addEventListener('click', processOrder);
    cancelButton.addEventListener('click', resetOrder);
});