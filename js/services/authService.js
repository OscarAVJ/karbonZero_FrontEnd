import { APIURL as API_URL } from '../../utils/api_url.js'

///Funcion de logIn
export async function login({email, userPassword}) {
    try {
        const response = await fetch(`${API_URL}apiAuth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: "include",///Esto nos permite acceder a la cookie
            body: JSON.stringify({ email, userPassword })
        })
        if (!response.ok) throw new Error(await response.text().catch(() => ""));
        return response.ok ? true : false
    } catch (e) {
        console.log(e)
        return false
    }
}

export async function getLoggedUser() {
    const response = await fetch(`${API_URL}apiAuth/me`, {
        credentials: "include"
    })
    return response.ok ? response.json() : { authenticated: false }

}

export async function logout() {
    try {
        const response = await fetch(`${API_URL}apiAuth/logout`, {
            credentials: "include",
            method: "POST"
        })
        return response.ok
    } catch (e) {
        return false
    }
}
