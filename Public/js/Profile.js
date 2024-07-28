
document.addEventListener('DOMContentLoaded', () => {
    const profileInfoContainer = document.querySelector('.profile-info');
    const updateForm = document.getElementById('update-form');
    const editProfileButton = document.querySelector('.edit-profile');
    const deleteAccountButton = document.querySelector('.delete-account');
    const loadingPage = document.getElementById('loading-page');
    const courseInfoContainer = document.querySelector('.course-info');

    // Show or hide the loading animation
    const showLoading = (show) => {
        loadingPage.style.display = show ? 'flex' : 'none';
    };

    // Function to get values from local storage
    function getLocalStorageData() {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        return { token, userId };
    }

    // Fetch profile information from the server
    async function fetchProfileInfo() {
        const { token, userId } = getLocalStorageData();

        if (!token || !userId) {
            alert('User not authenticated.');
            return;
        }

        showLoading(true); // Show loading animation

        try {
            const response = await fetch(`/account/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                displayProfileInfo(data);
            } else {
                const errorData = await response.json();
                alert(`Failed to fetch profile information: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error fetching profile info:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    }

    // Display profile information
    function displayProfileInfo(data) {
        profileInfoContainer.innerHTML = `
            <div class="details">
                <p><strong>Full Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone Number:</strong> ${data.contact}</p>
            </div>
        `;
        // Populate update form with current user data
        document.getElementById('fullName').value = data.name;
        document.getElementById('email').value = data.email;
        document.getElementById('phoneNumber').value = data.contact;
       
       
    }

    // Handle edit profile button click
    editProfileButton.addEventListener('click', () => {
        updateForm.style.display = updateForm.style.display === 'none' ? 'block' : 'none';
    });

    // Handle update profile form submission
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { token, userId } = getLocalStorageData();

        if (!token || !userId) {
            alert('User not authenticated.');
            return;
        }

        const updatedData = {
            name: document.getElementById('fullName').value, 
            email: document.getElementById('email').value,
            contactNumber: document.getElementById('phoneNumber').value,
            
            
        };

        showLoading(true); // Show loading animation

        try {
            const response = await fetch(`/account/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                updateForm.style.display = updateForm.style.display === 'none' ? 'block' : 'none';
                alert('Profile updated successfully!');
                fetchProfileInfo(); // Refresh profile info
            } else {
                const errorData = await response.json();
                alert(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    });

    // Handle delete account button click
    deleteAccountButton.addEventListener('click', async () => {
        const { token, userId } = getLocalStorageData();

        if (!token || !userId) {
            alert('User not authenticated.');
            return;
        }

        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        showLoading(true); // Show loading animation

        try {
            const response = await fetch(`/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Account deleted successfully!');
                // Optionally, redirect to another page
                localStorage.clear();
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                alert(`Failed to delete account: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    });

       // Fetch course information from the server
    async function fetchCourseInfo() {
        const { token, userId } = getLocalStorageData();

        if (!token || !userId) {
            alert('User not authenticated.');
            return;
        }

        showLoading(true); // Show loading animation

        try {
            const response = await fetch(`/course/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                displayCourseInfo(data);
            } else {
                const errorData = await response.json();
                alert(`Failed to fetch course information: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error fetching course info:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            showLoading(false); // Hide loading animation
        }
    }
    // Display course information
    function displayCourseInfo(data) {
        if (!data.courses || data.courses.length === 0) {
            courseInfoContainer.innerHTML = '<p>No courses found.</p>';
            return;
        }

        courseInfoContainer.innerHTML = data.courses.map(course => `
            <div class="course-details">
                <p><strong>Course Title:</strong> ${course.title}</p>
                <p><strong>Viewed At:</strong> ${new Date(course.viewedAt).toLocaleString()}</p>
            </div>
        `).join('');
    }


    // Initial data fetch
    fetchProfileInfo();
     fetchCourseInfo(); 
});
