import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from "../../utils/alerts.js";

export async function getAllResourcesList() {
  try {
    const response = await fetch(`${API_URL}apiResource/getAllResourcesList`);
    if (!response.ok) {
      console.error("Error fetching resources");
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching resources: ${error}`);
    throw error;
  }
}

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getAllResources(currentPage = 0, currentSize = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiResource/getAllResources?page=${currentPage}&size=${currentSize}`
    );
    ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
    if (!response.ok) {
      console.error(`Error fetching resources`);
    }
    ///Finalmente retornamos nuestra respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching resources: ${error}`);
    throw error;
  }
}

export async function getAllResourcesByName(searchName, currentPage = 0, currentSize = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiResource/getResourcesByName/${searchName}?page=${currentPage}&size=${currentSize}`
    );
    ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
    if (!response.ok) {
      console.error(`Error fetching resources`);
    }
    ///Finalmente retornamos nuestra respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching resources: ${error}`);
    throw error;
  }
}

///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getResourcesById(id) {
  ///Try para intentar
  try {
    ///Hacemos la peticion a la api
    const response = await fetch(`${API_URL}apiResource/getResourceById/${id}`);
    ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
    const u = await response.json();
    ///lo mismo de arriba
    if (!response.ok) {
      console.error(`Error fetching resource`);
    }
    return u;
    ///Ya lo saben
  } catch (err) {
    console.error(`Error fetching resource: ${err}`);
    throw err;
  }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertResource(payload) {
  ///Try
  try {
    ///Peticion para el insert y como lo queremos asi como su metodo
    const response = await fetch(`${API_URL}apiResource/insertResource`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ///Convertimos la respuesta a json
      body: JSON.stringify(payload),
    });
    ///Si esta bueno mandamos una alerta buena
    if (response.ok) {
      Alerts.showToastCloseSuccess("Recurso creado exitosamente");
    }
    ///Si no pues una mala
    else {
      console.error(`Error creating resource: ${response.status}`);
    }
    ///Retornamos nuestra respuesta
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error creating resource: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

///Peticion para actualizar Recurso
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE
export async function updateResource(payload, id) {
  ///Try
  try {
    ///Peticion para actualizar recurso
    const response = await fetch(
      `${API_URL}apiResource/updateResource/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        ///lo hacemos json
        body: JSON.stringify(payload),
      }
    );
    ///Lo mismo que esta en insertResource, suban
    if (response.ok) {
      Alerts.showToastCloseSuccess("Recurso actualizado exitosamente");
    } else {
      console.error(`Error updating resource: ${response.status}`);
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating resource: ${err}`);
    return { ok: false, data: null, error: err };
  }
}
///Aca esta el delete
export async function deleteResource(id) {
  ///Le pedimos una confirmacion al usuario
  const result = await Swal.fire({
    title: "¿Estas seguro de que quieres eliminar a este recurso?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: `Cancelar`,
  });

  if (!result.isConfirmed) {
    Alerts.showToastCloseError("Proceso cancelado");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}apiResource/deleteResource/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
        console.error(`Error deleting resource: ${response.status}`);
        return false;
    }

    Alerts.showToastCloseSuccess("Recurso eliminado exitosamente");
    return true
  } catch (err) {
    console.error(`Error deleting resource: ${err}`);
    return false;;
  }
}
