import { APIGLOBAL as GLOBAL_URL } from "../../utils/api_url";

export async function getGeoData (country) {
    try {
        const response = await fetch(
          `${GLOBAL_URL}apiMap/getCountryGeo/${country}`
        );

        if (!response.ok) {
            console.error(`Error getting the country map data`)
        }

        const data = await response.json();
        return {ok: true, data}
    } catch (err) {
        console.error("Error getting the country map data");
        return {ok: false, data: null};
    }
}