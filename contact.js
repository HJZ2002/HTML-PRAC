document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');
    const inputReason = document.querySelector('#reason'); 
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red'; 
    form.insertBefore(errorMessage, form.firstChild); 

    form.addEventListener('submit', function(e){
        e.preventDefault();
        // Regular expression to match allowed characters
        const allowedPattern = /^[a-zA-Z0-9 .,!?-]+$/;
        // Regular expression to detect email-like patterns.
        const emailPattern = /\S+@\S+\.\S+/;
        // Check for minimum length for a reasonable input.
        const minLength = 30; 

        // Check for invalid characters
        if (!allowedPattern.test(inputReason.value)) {
            errorMessage.textContent = 'Error: Input contains invalid characters. Only letters, numbers, spaces, and . , ! ? - are not allowed.';
            return; // Stop the form submission
        }

        // Check for email-like patterns to disallow emails
        if (emailPattern.test(inputReason.value)) {
            errorMessage.textContent = 'Error: Providing emails or similar information is not allowed.';
            return; // Stop the form submission
        }

        // Check for minimum length to avoid non-sensible input
        if (inputReason.value.length < minLength) {
            errorMessage.textContent = 'Error: The reason provided is too short. Please provide a more detailed explanation Ty';
            return; // Stop the form submission
        }

        // If input is valid, clear any error message and proceed
        errorMessage.textContent = '';
        alert('Your response has been submitted. Thank you for your patience.');
        window.location.href = 'index.html';

        function downloadReason(reason) {
            const blob = new Blob([reason], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Reason.txt'; // Name of the file to be downloaded
            document.body.appendChild(link); 
            link.click(); // Simulate click to trigger download
            document.body.removeChild(link); // Clean up
        }
        
        if (inputReason.value.length >= minLength) {
            downloadReason(inputReason.value);
            window.location.href = 'index.html';
        }
    });
});