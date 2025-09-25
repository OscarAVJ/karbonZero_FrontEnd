import * as Alerts from "../../utils/alerts.js";
import { APIURL as API_URL } from "../../utils/api_url.js";

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getAllConversionUnits(currentPage = 0, currentSize = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiMeasure/getAllConversionUnits?page=${currentPage}&size=${currentSize}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching conversion units");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching conversion units: ${error}`);
    throw error;
  }
}

export async function getAllConversionUnitsByName(searchName, currentPage = 0, currentSize = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}apiMeasure/getConversionUnitsByName/${searchName}?page=${currentPage}&size=${currentSize}`, {
      credentials: "include"
    }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching conversion units");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching conversion units: ${error}`);
    throw error;
  }
}

///Aca pues este es Muy Importante para el put, asi que si su CRUD no lo tiene, haganlo.
export async function getConversionUnitById(id) {
  ///Try para intentar
  try {
    ///Hacemos la peticion a la api
    const response = await fetch(
      `${API_URL}apiMeasure/getConversionUnitById/${id}`, {
      credentials: "include"
    }
    );
    ///Guardamos la respuesta en una variable, por que pues solo es uno va, u hace referencia usuario
    const u = await response.json();
    ///lo mismo de arriba
    if (!response.ok) {
      console.error("Error fetching conversion unit");
    }
    return u;
    ///Ya lo saben
  } catch (error) {
    console.error(`Error fetching conversion unit: ${error}`);
    throw error;
  }
}

///Funcion para insertar usuarios, (Peticion)
export async function insertConversionUnit(payload) {
  ///Try
  try {
    ///Peticion para el insert y como lo queremos asi como su metodo
    const response = await fetch(`${API_URL}apiMeasure/insertConversionUnit`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ///Convertimos la respuesta a json
      body: JSON.stringify(payload),
    });
    ///Si esta bueno mandamos una alerta buena
    if (response.ok) {
      Alerts.showToastCloseSuccess(
        "Conversion de unidades creada exitosamente"
      );
    }
    ///Si no pues una mala
    else {
      console.error(`Error creating conversion unit: ${response.status}`);
    }
    ///Retornamos nuestra respuesta
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error creating conversion unit: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

///Peticion para actualizar Recurso
///IMPORTANTE: QUE EN LA PETICION EL ID.VALUE
export async function updateConversionUnit(payload, id) {
  ///Try
  try {
    ///Peticion para actualizar recurso
    const response = await fetch(
      `${API_URL}apiMeasure/updateConversionUnit/${id.value}`,
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
      Alerts.showToastCloseSuccess(
        "Conversion de unidad actualizada exitosamente"
      );
    } else {
      console.error(`Error updating conversion unit: ${response.status}`);
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating conversion unit: ${err}`);
    return { ok: false, data: null, error: err };
  }
}
///Aca esta el delete
export async function deleteConversionUnit(id) {
  ///Le pedimos una confirmacion al usuario
  const result = await Swal.fire({
    title: "¿Estas seguro de que quieres eliminar a esta conversión?",
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
    const response = await fetch(
      `${API_URL}apiMeasure/deleteConversionUnit/${id}`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error(`Error deleting conversion unit: ${response.status}`);
      return false;
    }
    Alerts.showToastCloseSuccess("Conversion eliminada exitosamente");
    return true;
  } catch (err) {
    console.error(`Error deleting conversion unit: ${err}`);
    return false;
  }
}
