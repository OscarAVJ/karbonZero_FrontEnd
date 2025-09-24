import { renderKarbonZeroData } from "./controllers/sessionController";

const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper = document.querySelector(".main-content");
const sideBarLabels = document.querySelectorAll(".nav-label-info");
const body = document.getElementsByTagName('body')[0];
// window.addEventListener("pageshow", async () => {
//     await renderKarbonZeroData();
// });
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


