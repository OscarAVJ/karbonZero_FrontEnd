import { auth, renderKarbonZeroData } from "./controllers/sessionController";
import * as AuthService from './services/authService.js'
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper = document.querySelector(".main-content");
const sideBarLabels = document.querySelectorAll(".nav-label-info");
const body = document.getElementsByTagName('body')[0];
const logoutBtn = document.getElementById('logout')

/// Aca esta el comportamiento al hacer click y hacer pequenio el sidebar
if (localStorage.getItem('sideBarCollapsed') === 'true') {
    sidebar.classList.add("collapsed");
    mainWrapper.classList.add("collapsed");
    sideBarLabels.forEach(label => label.classList.add("collapsed"));
}

sidebarToggler.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");
    mainWrapper.classList.toggle("collapsed");
    sideBarLabels.forEach(label => label.classList.toggle("collapsed"));

    if (isCollapsed) {
        localStorage.setItem('sideBarCollapsed', 'true');
    } else {
        localStorage.removeItem('sideBarCollapsed');
    }
});
// window.addEventListener('DOMContentLoaded', () => {
//         logoutBtn.addEventListener("click", async () => {
//             console.log('here')
//             await AuthService.logout();
//             auth.ok = false;
//             auth.user = null;
//             window.location.replace("login.html");
//         });
    
// })

