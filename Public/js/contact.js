
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    const messageInput = document.getElementById('message');
    const loadingPage = document.getElementById('loading-page');

    // Function to get values from local storage
    function getLocalStorageData() {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        
        return { token, userId };
    }

    // Show or hide the loading animation
    const showLoading = (show) => {
        loadingPage.style.display = show ? 'flex' : 'none';
    };

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const message = messageInput.value.trim();
        const { token, userId } = getLocalStorageData();
        console.log(token,userId)

        // Basic validation
        if (!message) {
            alert('Please enter a message.');
            return;
        }

        showLoading(true); // Show loading animation

        try {
            // Replace the URL with your actual endpoint
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token if needed
                },
                body: JSON.stringify({  userId:userId, messageText:message }), // Send userId if needed
            });

            showLoading(false); // Hide loading animation

            if (response.ok) {
                // Handle successful response
                alert('Message sent successfully!');
                messageInput.value = ''; // Clear the message input
            } else {
                // Handle server error response
                const errorData = await response.json();
                alert(`Failed to send message: ${errorData.message || 'Unknown error'},Requires a minimum of 9 characters and a maximum of 255 characters.`);
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('An unexpected error occurred. Please try again later.');
            showLoading(false); // Hide loading animation
        }
    });
});
