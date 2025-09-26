import * as AuthService from '../services/authService'

///Objeto con la informacion del usuario
export const auth = {
    ok: false, ///Sesion activa
    user: null ///Datos del usuario
}

/// Renderiza la caja de usuario y ajusta el menú según el estado de autenticación
export async function renderKarbonZeroData() {;
  try {
        const isLogin = /\/login(\.html)?$/.test(location.pathname);
    if (isLogin) {
      auth.ok = false;
      auth.user = null;
      return;
    }
    const info = await AuthService.getLoggedUser();
    auth.ok = !!info?.authenticated; 
    auth.user = info?.user ?? null;
    if (auth.ok) {
        document.getElementById("logout")?.addEventListener("click", async () => {
          await AuthService.logout();            
          auth.ok = false;
          auth.user = null;
          window.location.replace("login.html");
        });
    } else {
      auth.ok = false;
      auth.user = null;
    }
  } catch {
    auth.ok = false;
    auth.user = null;
  }
}


///Esta funcion nos sirve para poder saber el usuario esta auth y si no mandarlo al login
export async function isAuth(redirect = true) {
    try {
        const info = await AuthService.getLoggedUser()
        auth.ok = !!info?.authenticated
        auth.user = info.user ?? null;
    } catch {
        auth.ok = false;
        auth.user = null;
    }
    if (!auth.ok && redirect) {
        window.location.replace('login.html')
    }
    return auth.ok ///retornamos el valor de auth.ok(true o false), aunque siempre si es false se manda al login
}

export function getUserStatus() {
    return auth.user?.status;
}
export function getUserAuthorities(authority) {
    ///Devuelve las authorities del usuario
    return Array.isArray(auth.user?.authorities) ? auth.user.authorities.includes(authority) : false
}


export const role = {
    hasStatus0: () => getUserStatus() === 0 || getUserAuthorities("ROLE_0"),
    hasStatus1: () => getUserStatus() === 1 || getUserAuthorities("ROLE_1"),
    hasStatus2: () => getUserStatus() === 2 || getUserAuthorities("ROLE_2")
}

// ///El evento pageshow se dispara siempre que se cargue la pagina, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE, SIEMPRE
window.addEventListener("pageshow", async () => {
  await renderKarbonZeroData();
});
