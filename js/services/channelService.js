import { APIURL as API_URL } from "../../utils/api_url.js";

export async function companyLogin() {
  try {
    const response = await fetch(`${API_URL}apiAuth/loginCompany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`Error en la autenticación del canal: ${response.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Error en la autenticación del canal: ${err}`);
    return { ok: false };
  }
}

export async function getCompany() {
  const info = await fetch(`${API_URL}apiAuth/company`, {
    credentials: "include",
  });

  return info.ok ? info.json() : { authenticated: false };
}

export async function getPostApproved() {
  try {
    const res = await fetch(`${API_URL}apiChannel/getChannelPostApproved`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error(`Error getting the posts: ${res.status}`);
      return { ok: false, data: null };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the posts: ${err}`);
    return { ok: false, data: null };
  }
}

export async function getPostNoApproved() {
  try {
    const res = await fetch(`${API_URL}apiChannel/getChannelPostNoApproved`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error(`Error getting the posts: ${res.status}`);
      return { ok: false, data: null };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the posts: ${err}`);
    return { ok: false, data: null };
  }
}

export async function getChannelData() {
  try {
    const res = await fetch(`${API_URL}apiChannel/getChannel`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error(`Error getting the channel: ${res.status}`);
      return { ok: false, data: null };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the channel: ${err}`);
    return { ok: false, data: null };
  }
}

export async function updateChannelData(payload) {
  try {
    const res = await fetch(`${API_URL}apiChannel/updateChannel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`Error updating the channel: ${res.status}`);
      return { ok: false, data: null };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating the channel: ${err}`);
    return { ok: false, data: null };
  }
}

export async function approvePost(id) {
  try {
    const res = await fetch(`${API_URL}apiChannel/approvePost/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      console.error(`Error updating the post: ${res.status}`);
      return { ok: false, data: null };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating the post: ${err}`);
    return { ok: false, data: null };
  }
}

export async function deletePost(id) {
  try {
    const res = await fetch(`${API_URL}apiChannel/deletePost/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      console.error(`Error deleting the post: ${res.status}`);
      return { ok: false };
    }
    return { ok: true };

  } catch (err) {
    console.error(`Error deleting the post: ${err}`);
    return { ok: false};
  }
}

// export async function logout() {
//   try {
//     const response = await fetch(`${API_URL}apiAuth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     if (!response.ok) {
//       console.error(
//         `Error cerrando la sesión del usuario actual: ${response.status}`
//       );
//       return { ok: false };
//     }
//     return { ok: true };
//   } catch (err) {
//     console.error(
//       `Error cerrando la sesión del usuario actual: ${response.status}`
//     );
//     return { ok: false };
//   }
// }
