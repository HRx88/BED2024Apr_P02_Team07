document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const accountList = document.getElementById('accountList');
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

    // Function to fetch all messages
    async function fetchMessages() {
        showLoading(true); // Show loading animation

        const { token } = getLocalStorageData(); // Get token from local storage

        try {
            const response = await fetch('/Msg', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token if needed
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const messages = await response.json();
                displayMessages(messages);
            } else {
                console.error('Failed to load messages', response.status);
                const errorData = await response.json();
                alert(`Failed to load messages: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while loading messages. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    }

    // Function to fetch accounts with messages
    async function fetchAccountsWithMessages() {
        showLoading(true); // Show loading animation

        const { token } = getLocalStorageData(); // Get token from local storage

        try {
            const response = await fetch('/Msg/acc', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token if needed
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const accounts = await response.json();
                displayAccounts(accounts);
            } else {
                console.error('Failed to load accounts with messages', response.status);
                const errorData = await response.json();
                alert(`Failed to load accounts: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while loading accounts. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    }

    // Function to display messages
    function displayMessages(messages) {
        messageList.innerHTML = ''; // Clear existing list
        messages.forEach((msg) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <strong>Message:</strong> ${msg.message}<br>
                <strong>Created At:</strong> ${new Date(msg.dateTime).toLocaleString()}
            `;
            messageList.appendChild(listItem);
        });
    }

    // Function to display accounts with messages
    function displayAccounts(accounts) {
        accountList.innerHTML = ''; // Clear existing list
        accounts.forEach((acc) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            let messagesHtml = acc.messages.map(msg => `
                    <strong>Message ID:</strong> ${msg.id}<br>
                    <strong>Message:</strong> ${msg.text}<br>
                    <strong>Created At:</strong> ${new Date(msg.createdAt).toLocaleString()}    
            `).join('');

            listItem.innerHTML = `
                <strong>Account ID:</strong> ${acc.id}<br>
                <strong>Username:</strong> ${acc.username}<br>
                <strong>Contact Number:</strong> ${acc.contactNumber}<br>
                <strong>Email:</strong> ${acc.email}<br>
                ${messagesHtml}
            `;
            accountList.appendChild(listItem);
        });
    }

    // Fetch data on page load
    fetchMessages();
    fetchAccountsWithMessages();
});
