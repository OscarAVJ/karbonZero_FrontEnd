import * as Alerts from "../utils/alerts.js";
import * as loginService from "./services/loginService.js";

document.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem("isRemembered") == "true") {
      window.location.href = "index.html";
    }
})

const password_input = document.getElementById("contraseñatxt");
const hide_password = document.getElementById("hide-password");
const icon = hide_password.getElementsByTagName("i")[0];

hide_password.addEventListener("click", (e) => {
  if (icon.className == "bi bi-eye-fill") {
    icon.className = "bi bi-eye-slash-fill";
    password_input.setAttribute("type", "text");
  } else {
    icon.className = "bi bi-eye-fill";
    password_input.setAttribute("type", "password");
  }
});

document.getElementById("login-button").addEventListener("click", async () => {
  const email = document.getElementById("emailtxt").value.trim();
  const password = document.getElementById("contraseñatxt").value.trim();

  if (!email) {
    Alerts.showToastCloseInfo("El correo electrónico es obligatorio");
    return;
  }

  if (!password) {
    Alerts.showToastCloseInfo("La contraseña es obligatoria");
    return;
  }

  const validate = await loginService.validateLogin(email, password);
  if (validate.authenticated) {
    const remember = document.querySelector("#remenberCheckbox");
    if (remember.checked) {
        localStorage.setItem("isRemembered", "true");
    }
        
    localStorage.setItem("isAuthenticated", "true");

    const user = await loginService.getUserByEmail(email);
    localStorage.setItem("user", user.idUser);
    window.location.href = "index.html";
  } else {
    Alerts.showToastCloseError("Usuario o contraseña incorrectos");
  }

});
