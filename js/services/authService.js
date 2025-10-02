import { APIURL as API_URL } from '../../utils/api_url.js'

///Funciones de logIn (Devuelven cookies de diferente duración)

export async function shortLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}apiAuth/shortLogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email, userPassword: password }),
    });

    if (!response.ok) {
      console.error(`Error en la autenticación: ${response.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Error en la autenticación: ${err}`);
    return { ok: false };
  }
}

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}apiAuth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email, userPassword: password }),
    });

    if (!response.ok) {
      console.error(`Error en la autenticación: ${response.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Error en la autenticación: ${err}`);
    return { ok: false };
  }
}

export async function getLoggedUser() {
  const info = await fetch(`${API_URL}apiAuth/me`, {
    credentials: "include"
  });
  return info.ok ? info.json() : { authenticated: false }; 
}


export async function logout() {
  try {
    const response = await fetch(`${API_URL}apiAuth/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
      console.error(`Error cerrando la sesión del usuario actual: ${response.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Error cerrando la sesión del usuario actual: ${response.status}`);
    return { ok: false };
  }
}
