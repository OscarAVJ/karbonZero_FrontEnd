const button = document.getElementById("login-button");

function open_layout () {
    window.location.href = "index.html";
};

button.addEventListener("click", e => {
    open_layout();
});


const password_input = document.getElementById("contraseñatxt")
const hide_password = document.getElementById("hide-password");
const icon = hide_password.getElementsByTagName("i")[0];


hide_password.addEventListener("click", e => {
    if (icon.className == "bi bi-eye-fill") {
        icon.className = "bi bi-eye-slash-fill";
        password_input.setAttribute("type", "text");
    }
    else {
        icon.className = "bi bi-eye-fill";
        password_input.setAttribute("type", "password");

    };
});

document.getElementById('login-button').addEventListener('click', () => {
  const usuario = document.getElementById('usuariotxt').value;
  const contraseña = document.getElementById('contraseñatxt').value;
    window.location.href = 'index.html';

  if (usuario === 'admin' && contraseña === '1234') {
    localStorage.setItem('isAuthenticated', 'true');
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});
// document.getElementById('login-button').addEventListener('click', () => {
//   // A futuro podrías validar aquí
//   window.location.href = 'index.html';
// });