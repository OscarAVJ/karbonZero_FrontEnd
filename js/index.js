import { auth, renderKarbonZeroData } from "./controllers/sessionController";
import * as AuthService from './services/authService.js';

const sidebar        = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper    = document.querySelector(".main-content");
const sideBarLabels  = document.querySelectorAll(".nav-label-info");

const btnMobileOpen  = document.querySelector(".btn-mobile-open");
const btnCloseMobile = document.querySelector(".sidebar-close");
const backdrop       = document.querySelector(".sidebar-backdrop");

const MQ_DESKTOP = window.matchMedia("(min-width: 992px)");

function applyInitialState(){
  const isDesktop = MQ_DESKTOP.matches;
  if (isDesktop && localStorage.getItem('sideBarCollapsed') === 'true') {
    sidebar.classList.add("collapsed");
    mainWrapper.classList.add("collapsed");
    sideBarLabels.forEach(label => label.classList.add("collapsed"));
  } else {
    sidebar.classList.remove("collapsed");
    mainWrapper.classList.remove("collapsed");
    sideBarLabels.forEach(label => label.classList.remove("collapsed"));
  }
  if (!isDesktop){
    sidebar.classList.remove("open");
    hideBackdrop();
  }
}
applyInitialState();

MQ_DESKTOP.addEventListener("change", applyInitialState);

if (sidebarToggler){
  sidebarToggler.addEventListener("click", () => {
    if (!MQ_DESKTOP.matches) return;          
    const isCollapsed = sidebar.classList.toggle("collapsed");
    mainWrapper.classList.toggle("collapsed");
    sideBarLabels.forEach(label => label.classList.toggle("collapsed"));
    if (isCollapsed) localStorage.setItem('sideBarCollapsed','true');
    else localStorage.removeItem('sideBarCollapsed');
  });
}

function showBackdrop(){
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}
function hideBackdrop(){
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

function openMobile(){
  sidebar.classList.add("open");
  btnMobileOpen.setAttribute("aria-expanded","true");
  sidebar.setAttribute("aria-hidden","false");
  showBackdrop();
}
function closeMobile(){
  sidebar.classList.remove("open");
  btnMobileOpen.setAttribute("aria-expanded","false");
  sidebar.setAttribute("aria-hidden","true");
  hideBackdrop();
}

btnMobileOpen?.addEventListener("click", openMobile);
btnCloseMobile?.addEventListener("click", closeMobile);
backdrop?.addEventListener("click", closeMobile);
window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeMobile(); });

document.querySelectorAll(".sidebar .nav-link").forEach(a=>{
  a.addEventListener("click", ()=>{
    if (!MQ_DESKTOP.matches) closeMobile();
  });
});
