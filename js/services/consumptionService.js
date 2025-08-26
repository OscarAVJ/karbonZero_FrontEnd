import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from "../../utils/alerts.js";

export async function convertMeasureUnit(
  idMeasureUni1,
  idMeasureUnit2,
  idResource,
  value
) {
  try {
    const response = await fetch(
      `${API_URL}apiMeasure/convertMeasureUnit?idMeasureUnit1=${idMeasureUni1}&idMeasureUnit2=${idMeasureUnit2}&idResource=${idResource}&value=${value}`
    );

    if (!response.ok) {
      console.error(`Error converting measure unit: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error converting measure unit:", error);
    throw error;
  }
}

export async function getConsumptionById(id) {
  try {
    const response = await fetch(
      `${API_URL}apiConsumption/getConsumptionById/${id}`
    );
    if (!response.ok) {
      console.error(`Error fetching consumption: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching consumption: ", error);
    throw error;
  }
}

export async function getAllConsumptions(currentPage = 0, currentSize = 10) {
  try {
    const response = await fetch(
      `${API_URL}apiConsumption/getAllConsumptions?page=${currentPage}&size=${currentSize}`
    );
    if (!response.ok) {
      console.error(`Error fetching consumptions: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching consumptions: ", error);
    throw error;
  }
}

export async function insertConsumption(payload) {
  try {
    const response = await fetch(`${API_URL}apiConsumption/insertConsumption`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Alerts.showToastCloseSuccess("Consumo creado exitosamente");
    } else {
      console.error(`Error creating consumption: ${response.status}`);
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error creating consumption: ${err}`);
    return { ok: true, data: null, error: err };
  }
}

export async function updateConsumption(id, payload) {
  try {
    const response = await fetch(
      `${API_URL}apiConsumption/updateConsumption/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      Alerts.showToastCloseSuccess("Consumo actualizado exitosamente");
    } else {
      console.error(`Error updating consumption: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error updating consumption: ${err}`);
    return { ok: true, data: null, error: err };
  }
}

export async function deleteConsumption(id) {
  const result = await Swal.fire({
    title: "¿Estas seguro de que quieres eliminar a este consumo?",
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
      `${API_URL}apiConsumption/deleteConsumption/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error(`Error deleting consumption: ${error}`);
      return false;
    }

    Alerts.showToastCloseSuccess("Consumo eliminado exitosamente");
    return true;
  } catch (error) {
    console.error(`Error deleting consumption: ${error}`);
    return false;
  }
}
