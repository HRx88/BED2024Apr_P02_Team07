document.addEventListener("DOMContentLoaded", function () {
  setTimeout(Loadingpage, 3000);
  Login();
  let isLoggedIn = false;
});

function Loadingpage() {
  // Hide the loading page
  document.getElementById("loading-page").style.display = "none";
}

function Login() {
  const login = document.querySelector("#login");
  login.addEventListener("click", function () {
    window.location.href = "../Html/Login.html";
  });
}
