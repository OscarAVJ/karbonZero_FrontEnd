import * as Alerts from "../../utils/alerts.js";
import { APIURL as API_URL } from "../../utils/api_url";

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllRolesList() {
  try {
    const response = await fetch(`${API_URL}apiUser/getAllRolesList`, {
      credentials: "include"
    });
    if (!response.ok) {
      console.error("Error fetching roles");
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching roles ${error}`);
    throw error;
  }
}

export async function getAllRoles(currentPage = 0, currentSize = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiUser/getAllRoles?page=${currentPage}&size=${currentSize}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching roles");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching roles: ${error}`);
    throw error;
  }
}

export async function getRolById(id) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiUser/getRolById/${id}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching rol");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching rol: ${error}`);
    throw error;
  }
}

export async function getAllRolesByName(
  searchName,
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiUser/getRolesByName/${searchName}?page=${currentPage}&size=${currentSize}`, {
      credentials: "include",
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching roles");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching roles: ${error}`);
    throw error;
  }
}

///Metodo para insertar roles, le pasamos payload como parametro
export async function insertRol(payload) {
  try {
    const response = await fetch(`${API_URL}apiUser/insertRol`, {
      credentials: "include",

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    ///Transformamos la data a json 

    if (response.ok) {
      Alerts.showToastCloseSuccess("Rol creado exitosamente");
    } else {
      console.error(`Error creating rol: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error creating rol: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

// Método para actualizar un rol, necesita el payload y el id
export async function updateRol(payload, id) {
  try {
    const response = await fetch(`${API_URL}apiUser/updateRol/${id}`, {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Alerts.showToastCloseSuccess("Rol actualizado exitosamente");
    } else {
      console.error(`Error updating rol: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating rol: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

// Método para eliminar un rol
export async function deleteRol(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar este rol?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return false;
  }

  ///Y ya el delete, ya se la saben
  try {
    ///Peticion
    const response = await fetch(`${API_URL}apiUser/deleteRol/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    ///Ahi un return en caso de error
    if (!response.ok) {
      console.error(`Error deleting rol: ${response.status}`);
      return false;
    }
    ///Si todo bien mandamos el success
    Alerts.showToastCloseSuccess("Rol eliminado exitosamente");
    return true;
  } catch (err) {
    ///En caso de error
    Alerts.showToastCloseError(`Error deleting rol: ${err}`);
    return false;
  }
}
