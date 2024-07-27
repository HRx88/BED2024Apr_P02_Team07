/*
document.addEventListener("DOMContentLoaded", function () {
  // [STEP 1]: Create our submit form listener
  document
    .querySelector(".btn-primary")
    .addEventListener("click", function (e) {
      // Prevent default action of the button
      e.preventDefault();
      fetchUsers();
    });
  async function fetchUsers() {
    try {
       const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        // Store token and redirect or perform other actions
        localStorage.setItem('token', data.token);
        localStorage.setItem("id",data.id)
        window.location.href = "../Html/Account.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  const checkbox = document.querySelector("#Check");
  const show = document.getElementById("Password");
  checkbox.onclick = function () {
    if (show.type == "password") {
      // Show password
      show.type = "text";
    } else {
      // Hide password
      show.type = "password";
    }
  };
});
*/


document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const showPasswordCheckbox = document.getElementById('showPassword');
  const loadingPage = document.getElementById('loading-page');

  // Toggle password visibility
  showPasswordCheckbox.addEventListener('change', () => {
    passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
  });

  // Handle form submission
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = nameInput.value.trim();
    const password = passwordInput.value.trim();

    // Form validation
    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }

    // Show loading animation
    loadingPage.style.display = 'flex';

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      loadingPage.style.display = 'none';

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.user.id);
          // Store token and user ID in local storage
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userId', data.user.id);
        
        window.location.href = "../Html/Account.html";
      } else {
        const error = await response.text();
        alert('Login failed: ' + error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An unexpected error occurred. Please try again later.');
      loadingPage.style.display = 'none';
    }
  });
});

