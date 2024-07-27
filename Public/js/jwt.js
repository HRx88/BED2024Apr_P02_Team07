document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                console.log('Token has expired');
                localStorage.clear();
                handleTokenExpiration();
            } else {
                console.log('Token is valid');
                
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            // Handle decoding error (possibly invalid token)
            handleInvalidToken();
        }
    } else {
        console.log('No token found');
        // Redirect to login or handle as per application logic
        redirectToLogin();
    }
});

function handleTokenExpiration() {
    alert('Your session has expired. Please log in again.');
    // Redirect to login page or attempt token refresh
    redirectToLogin();
}

function handleInvalidToken() {
    alert('Invalid token detected. Please log in again.');
    redirectToLogin();
}

function redirectToLogin() {
    // Redirect the user to the login page
    window.location.href = 'login.html';
}


