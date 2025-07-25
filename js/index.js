const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper = document.querySelector(".main-content");
const sideBarLabels = document.querySelectorAll(".nav-label-info");
const body = document.getElementsByTagName('body')[0];


/// Aca esta el comportamiento al hacer click y hacer pequenio el sidebar
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sideBarLabels.forEach(label => label.classList.toggle("collapsed"));
    if (mainWrapper) {
        mainWrapper.classList.toggle("collapsed");
    }
});


function open_login() {
    window.location.href = "login.html";
};

document.getElementById('logout').addEventListener('click', () => {
    setTimeout(function () {
        body.style.opacity = 1;
        (function fade() {
            var opacity = parseFloat(body.style.opacity);

            (body.style.opacity = opacity - 0.01) < 0.1 ? open_login() : setTimeout(fade, 1)
        })();
    }, 100);
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
});

