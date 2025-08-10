import { APIURL as API_URL } from "../../utils/api_url.js";

export async function getAllResourcesConsumptionsCO2() {
  try {
    const response = await fetch(
      `${API_URL}apiResource/getAllResourcesConsumptionsCO2`
    );

    if (!response.ok) {
      throw new Error(`Error getting chart data: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error getting chart data:", error);
    throw error;
  }
}
