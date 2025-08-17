import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from "../../utils/alerts.js";

export async function convertMeasureUnit(idMeasureUni1, idMeasureUnit2, idResource, value) {
    try {
      const response = await fetch(
        `${API_URL}apiMeasure/convertMeasureUnit?idMeasureUnit1=${idMeasureUni1}&idMeasureUnit2=${idMeasureUnit2}&idResource=${idResource}&value=${value}`
      );

      if (!response.ok) {
        throw new Error(`Error converting measure unit: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error converting measure unit:", error);
      throw error;
    }
}

export async function getConsumptionById(id) {
    try {
        const response = await fetch(`${API_URL}apiConsumption/getConsumptionById/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching consumption: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching consumption: ", error);
        throw error;
    }
}

export async function getAllConsumptions() {
  try {
    const response = await fetch(`${API_URL}apiConsumption/getAllConsumptions`);
    if (!response.ok) {
      throw new Error(`Error fetching consumptions: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching consumptions: ", error);
    throw error;
  }
}

export async function insertConsumption (payload) {
    try {
        const response = await fetch(
          `${API_URL}apiConsumption/insertConsumption`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
                
        if (response.ok) {
            Alerts.showToastCloseSuccess("Consumo creado exitosamente")
        }
        else {
            console.error(`Error creating consumption ${response.status}`)
        }
        return response.json();
    } catch (err) {
        console.error(`Error creating consumption ${err}`);
    }
}

export async function updateConsumption(id, payload) {
  try {
    const response = await fetch(`${API_URL}apiConsumption/updateConsumption/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Alerts.showToastCloseSuccess("Consumo actualizado exitosamente");
    } else {
      console.error(`Error updating consumption ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error(`Error updating consumption ${err}`);
  }
}

export async function deleteConsumption(id) {
    Swal.fire({
        title: "¿Estas seguro de que quieres eliminar a este consumo?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: `Cancelar`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetch(`${API_URL}apiConsumption/deleteConsumption/${id}`, {
                    method: 'DELETE'
                });
                Alerts.showToastCloseSuccess("Consumo eliminado exitosamente")
            } catch (error) {
                console.error(`Error deleting consumption ${error}`)
            }
        } else if (result.isDenied) {
            Alerts.showToastCloseError("Proceso cancelado")
            return;
        }
    });
}
