import * as Alerts from "../utils/alerts.js";
import { renderKarbonZeroData } from "./controllers/sessionController.js";
import * as AuthService from "./services/authService.js";


document.addEventListener('DOMContentLoaded', async () => {
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
    const userPassword = document.getElementById("contraseñatxt").value.trim();
    const btnLogIn = document.querySelector('#login-button');
    console.log(email, userPassword)

    if (!email) {
      Alerts.showToastCloseInfo("El correo electrónico es obligatorio");
      return;
    }

    if (!userPassword) {
      Alerts.showToastCloseInfo("La contraseña es obligatoria");
      return;
    }

    let placeholderText;

    try {
      if (btnLogIn) {
        placeholderText = btnLogIn.innerHTML;
        btnLogIn.setAttribute("disabled", "disabled")
        btnLogIn.innerHTML = "Ingresando...";
      }
      await AuthService.login(email, userPassword)

      const userInfo = await AuthService.getLoggedUser();
      console.log(userInfo)

      if (userInfo.authenticated) {
        window.location.href = 'index.html';
      } else {
        Alerts.showToastCloseError('Error de autenticación')
      }
    } catch (e) {
      Alerts.showToastCloseError('No fue posible ingresar al sistema')
    } finally {
      if (btnLogIn) {
        btnLogIn.removeAttribute("disabled");
        if (placeholderText) btnLogIn.innerHTML = placeholderText;
      }
    }
  });

})

