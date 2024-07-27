/*
document.addEventListener("DOMContentLoaded", function () {
  HideMsgalert();

  // [STEP 1]: Create our submit form listener
  document.querySelector(".btn-Create").addEventListener("click", function (e) {
    // Prevent default action of the button
    e.preventDefault();

    // [STEP 2]: Call your function to fetch and process data
    getdata();
    Createdata();
    getdata();
  });
  let datas = [];
  function getdata() {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache",
      },
    };
    fetch("https://fed23-25a3.restdb.io/rest/account", settings)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        datas = data;
        console.log(datas);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  function Createdata() {
    let names = document.getElementById("name").value;
    let phonenumber = document.getElementById("number").value;
    let passwords = "";
    for (i = 0; i < datas.length; i++) {
      if (datas[i] === phonenumber) {
      } else {
        if (
          document.getElementById("Password1").value ===
          document.getElementById("Password2").value
        ) {
          passwords = document.getElementById("Password2").value;
        } else {
          showMsgalert();
          setTimeout(HideMsgalert, 8000);
        }
      }
    }

    let jsondata = {
      name: names,
      number: phonenumber,

      password: passwords,
    };
    let settings1 = {
      method: "POST", //[cher] we will use post to send info
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(jsondata),
      beforeSend: function () {
        //@TODO use loading bar instead
        // Disable our button or show loading bar
        document.querySelector(".btn-Create").disabled = true;
        // Clear our form using the form ID and triggering its reset feature
        document.getElementById("add-form").reset();
      },
    };
    fetch("https://fed23-25a3.restdb.io/rest/account", settings1)
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log(data);
        document.querySelector(".btn-Create").disabled = false;
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  const Password1 = document.querySelector("#Password1");
  const Password2 = document.querySelector("#Password2");
  const Checkbox = document.getElementById("Check");
  Checkbox.onclick = function () {
    if (Password1.type == "password") {
      // Show password
      Password1.type = "text";
      Password2.type = "text";
    } else {
      // Hide password
      Password1.type = "password";
      Password2.type = "password";
    }
  };

  function showMsgalert() {
    const alertMsg = document.querySelector("#msg-alert");
    alertMsg.style.display = "block";
  }
  function HideMsgalert() {
    const alertMsg = document.querySelector("#msg-alert");
    alertMsg.style.display = "none";
  }
});*/
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('add-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const numberInput = document.getElementById('number');
  const passwordInput1 = document.getElementById('Password1');
  const passwordInput2 = document.getElementById('Password2');
  const showPasswordCheckbox = document.getElementById('Check');
  const alertMsg = document.getElementById('msg-alert');
  const loadingPage = document.getElementById('loading-page');

  // Show or hide passwords based on checkbox
  showPasswordCheckbox.addEventListener('change', () => {
    const type = showPasswordCheckbox.checked ? 'text' : 'password';
    passwordInput1.type = type;
    passwordInput2.type = type;
  });

  // Handle form submission
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = numberInput.value.trim();
    const password1 = passwordInput1.value.trim();
    const password2 = passwordInput2.value.trim();
    

    // Validate form inputs
    if (!name || !email || !phone || !password1 || !password2) {
      alertMsg.textContent = 'Please fill in all the required fields.';
      alertMsg.style.display = 'block';
      return;
    }

    if (password1 !== password2) {
      alertMsg.textContent = 'Passwords do not match.';
      alertMsg.style.display = 'block';
      return;
    }

    // Show loading animation
    loadingPage.style.display = 'flex';
 

    try {
      // Send a POST request to the server for registration
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username:name, password:password1, contactNumber:phone, email:email ,role:"member" }),
      });

      // Hide loading animation
      loadingPage.style.display = 'none';

      if (response.ok) {
        // Handle successful registration
        const data = await response.json();
        alert('Registration successful! Please log in.');
        window.location.href = '../Html/Login.html';
      } else {
        const error = await response.text();
        alertMsg.textContent = 'Registration failed: ' + error;
        alertMsg.style.display = 'block';
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alertMsg.textContent = 'An unexpected error occurred. Please try again later.';
      alertMsg.style.display = 'block';
      loadingPage.style.display = 'none';
    }
  });
});


