import { APIGLOBAL as GLOBAL_URL } from "../../utils/api_url";

export async function getGeoData(country) {
  try {
    const response = await fetch(
      `${GLOBAL_URL}apiMap/getCountryGeo/${country}`
    );

    if (!response.ok) {
      console.error(`Error getting the country map data`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error("Error getting the country map data");
    return { ok: false, data: null };
  }
}

export async function getTransportLocations(minX, maxX, minY, maxY) {
  try {
    const response = await fetch(
      `${GLOBAL_URL}apiTransport/getTransportConsumptionsCO2WithLocation?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`
    );

    if (!response.ok) {
      console.error(
        `Error getting the consumptions of transports in that area`
      );
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the consumptions of transports in that area`);
    return { ok: false, data: null}
  }
}

export async function getServiceLocations(minX, maxX, minY, maxY) {
  try {
    const response = await fetch(
      `${GLOBAL_URL}apiService/getServiceConsumptionsCO2WithLocation?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`
    );

    if (!response.ok) {
      console.error(
        `Error getting the consumptions of services in that area`
      );
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the consumptions of services in that area`);
    return { ok: false, data: null };
  }
}

export async function getFuelLocations(minX, maxX, minY, maxY) {
  try {
    const response = await fetch(
      `${GLOBAL_URL}apiCar/getFuelConsumptionsCO2WithLocation?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`
    );

    if (!response.ok) {
      console.error(`Error getting the consumptions of fuels in that area`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the consumptions of fuels in that area`);
    return { ok: false, data: null };
  }
}

export async function getFoodLocations(minX, maxX, minY, maxY) {
  try {
    const response = await fetch(
      `${GLOBAL_URL}apiFood/getFoodConsumptionsCO2WithLocation?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`
    );

    if (!response.ok) {
      console.error(`Error getting the consumptions of foods in that area`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error(`Error getting the consumptions of foods in that area`);
    return { ok: false, data: null };
  }
}