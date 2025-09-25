import * as Alerts from "../../utils/alerts.js";
import { APIURL as API_URL } from "../../utils/api_url.js";

export async function getAllResourcePuritiesList() {
  try {
    const response = await fetch(
      `${API_URL}apiResource/getAllResourcePuritiesList`, {
      credentials: "include"
    }
    );
    if (!response.ok) {
      console.error("Error fetching resource purities");
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching resource purities: ${error}`);
    throw error;
  }
}

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllResourcePurities(
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiResource/getAllResourcePurities?page=${currentPage}&size=${currentSize}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching purities");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching purities: ${error}`);
    throw error;
  }
}

export async function getAllResourcePuritiesByName(
  searchName,
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiResource/getResourcePuritiesByName/${searchName}?page=${currentPage}&size=${currentSize}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching purities");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching purities: ${error}`);
    throw error;
  }
}

///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getResourcePurityById(id) {
  ///Try para intentar
  try {
    ///Hacemos la peticion a la api
    const response = await fetch(
      `${API_URL}apiResource/getResourcePurityById/${id}`, {
      credentials: "include"
    }
    );
    ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
    const u = await response.json();
    ///lo mismo de arriba
    if (!response.ok) {
      console.error(`Error fetching purity`);
    }
    return u;
    ///Ya lo saben
  } catch (error) {
    console.error(`Error fetching purity: ${error}`);
    throw error;
  }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertResourcePurity(payload) {
  ///Try
  try {
    ///Peticion para el insert y como lo queremos asi como su metodo
    const response = await fetch(`${API_URL}apiResource/insertResourcePurity`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ///Convertimos la respuesta a json
      body: JSON.stringify(payload),
    });
    ///Si esta bueno mandamos una alerta buena
    if (response.ok) {
      Alerts.showToastCloseSuccess("Pureza creado exitosamente");
    }
    ///Si no pues una mala
    else {
      console.error(`Error creating purity: ${response.status}`);
    }
    ///Retornamos nuestra respuesta
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error creating purity: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

///Peticion para actualizar Recurso
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE
export async function updateResourcePurity(payload, id) {
  ///Try
  try {
    ///Peticion para actualizar recurso
    const response = await fetch(
      `${API_URL}apiResource/updateResourcePurity/${id.value}`,
      {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        ///lo hacemos json
        body: JSON.stringify(payload),
      }
    );
    ///Lo mismo que esta en insertResource, suban
    if (response.ok) {
      Alerts.showToastCloseSuccess("Pureza actualizado exitosamente");
    } else {
      console.error(`Error updating purity: ${response.status}`);
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating purity: ${err}`);
    return { ok: false, data: null, error: err };
  }
}
///Aca esta el delete
export async function deleResourcePurity(id) {
  ///Le pedimos una confirmacion al usuario
  const result = await Swal.fire({
    title: "¿Estas seguro de que quieres eliminar a esta pureza?",
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

  ///Si el usuario acepta hacemos la peticion
  try {
    const response = await fetch(
      `${API_URL}apiResource/deleteResourcePurity/${id}`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error(`Error deleting purity: ${response.status}`);
      return false;
    }

    Alerts.showToastCloseSuccess("Pureza eliminada exitosamente");
    return true;
  } catch (err) {
    console.error(`Error deleting purity: ${err}`);
    return false;
  }
}
