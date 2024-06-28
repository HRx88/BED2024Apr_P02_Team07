const APIKEY = "65c2477d514d39bbd55fdb3d";
document.addEventListener("DOMContentLoaded", function () {
  // [STEP 1]: Create our submit form listener
  document
    .querySelector(".btn-primary")
    .addEventListener("click", function (e) {
      // Prevent default action of the button
      e.preventDefault();
    });

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
