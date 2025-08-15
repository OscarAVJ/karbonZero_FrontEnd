import { APIURL as API_URL } from "../../utils/api_url";
import * as Alerts from "../../utils/alerts.js";

export async function convertMeasureUnit(idMeasureUni1, idMeasureUnit2, idResource, value) {
    try {
      const response = await fetch(
        `${API_URL}apiMeasure/convertMeasureUnit?idMeasureUnit1=${idMeasureUni1}&idMeasureUnit2=${idMeasureUnit2}&idResource=${idResource}&value=${value}`
      );

      console.log(response);
      if (!response.ok) {
        throw new Error(`Error converting measure unit: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error converting measure unit:", error);
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
    console.error("Error fetching consumptions:", error);
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
            Alerts.showToastCloseError(`Error creando consumo ${response.status}`)
        }
        return response.json();
    } catch (err) {
        Alerts.showToastCloseError(`Error creando consumo ${err}`)
    }
}
