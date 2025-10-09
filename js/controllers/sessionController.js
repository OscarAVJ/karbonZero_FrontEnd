import * as AuthService from "../services/authService";
import * as ChannelService from "../services/channelService";

///Objeto con la informacion del usuario
export const auth = {
  ok: false, /// Sesion activa
  user: null, /// Datos del usuario,
  company: null, // Datos del canal
};

/// Renderiza la caja de usuario y ajusta el menú según el estado de autenticación
export async function renderKarbonZeroData() {
  try {
    const isLogin = /\/login(\.html)?$/.test(location.pathname);
    if (isLogin) {
      auth.ok = false;
      auth.user = null;
      auth.company = null;
      return;
    }
    const info = await AuthService.getLoggedUser();
    auth.ok = !!info?.authenticated;
    auth.user = info?.user ?? null;
    const company = await ChannelService.getCompany();
    auth.company = company?.company ?? null;
    if (auth.ok) {
      document.getElementById("logout")?.addEventListener("click", async () => {
        await AuthService.logout();
        auth.ok = false;
        auth.user = null;
        auth.company = null;
        window.location.replace("login.html");
      });
    } else {
      auth.ok = false;
      auth.user = null;
      auth.company = null;
    }
  } catch {
    auth.ok = false;
    auth.user = null;
    auth.company = null;
  }
}

///Esta funcion nos sirve para poder saber el usuario esta auth y si no mandarlo al login
export async function isAuth(redirect = true) {
  try {
    const info = await AuthService.getLoggedUser();
    auth.ok = !!info?.authenticated;
    auth.user = info.user ?? null;
    const company = await ChannelService.getCompany();
    auth.company = company?.company ?? null;
  } catch {
    auth.ok = false;
    auth.user = null;
    auth.company = null;
  }
  if (!auth.ok && redirect) {
    window.location.replace("login.html");
  }
  return auth.ok; ///retornamos el valor de auth.ok(true o false), aunque siempre si es false se manda al login
}

export function getUserStatus() {
  return auth.user?.status;
}
export function getUserAuthorities(authority) {
  ///Devuelve las authorities del usuario
  return Array.isArray(auth.user?.authorities)
    ? auth.user.authorities.includes(authority)
    : false;
}

export const role = {
  hasStatus0: () => getUserStatus() === 0 || getUserAuthorities("ROLE_0"),
  hasStatus1: () => getUserStatus() === 1 || getUserAuthorities("ROLE_1"),

  applyPermissions() {
    if (this.hasStatus0()) {
      document
        .querySelectorAll(".kz-button-create")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-consumption")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-consumption")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-resource")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-resource")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-purity")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-purity")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-measure")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-measure")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-conversionUnit")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-conversionUnit")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-measureUnit")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-measureUnit")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-user")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-user")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-ban-user")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-delete-rol")
        .forEach((btn) => (btn.style.display = "none"));
      document
        .querySelectorAll(".btn-edit-rol")
        .forEach((btn) => (btn.style.display = "none"));
    }
  },
};

// ///El evento pageshow se dispara siempre que se cargue la pagina, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE
window.addEventListener("pageshow", async () => {
  await renderKarbonZeroData();
  //Se pone aca para qué cuando se refresque la pagina se vuelva a ejecutar el metodo y se aplique la condicion
  role.applyPermissions();
});
