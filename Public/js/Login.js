const APIKEY = "65c2477d514d39bbd55fdb3d";
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
      const response = await fetch("/Login");
      const users = await response.json();
      document.getElementById("users").innerText = JSON.stringify(
        users,
        null,
        2
      );
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
