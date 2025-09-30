import * as MapService from "../services/mapService.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export const maps = {
  geoJson: null,
  axisX: {
    min: 0,
    max: 0,
  },
  axisY: {
    min: 0,
    max: 0,
  },
  center: [0, 0],
  originalScale: 0,
  scale: 0,
  consumptions: [],
};

export async function loadMap(mapContainer, text) {
  const res = await MapService.getGeoData(text);
  const geoJson = res.data;

  maps.geoJson = geoJson;
  maps.center = geoJson.properties.center;
  maps.originalScale = geoJson.properties.scale;
  maps.scale = geoJson.properties.scale;

  maps.axisX.min = geoJson.properties.axis.x.min;
  maps.axisX.max = geoJson.properties.axis.x.max;
  maps.axisY.min = geoJson.properties.axis.y.min;
  maps.axisY.max = geoJson.properties.axis.y.max;

  const transports = await MapService.getTransportLocations(
    maps.axisX.min,
    maps.axisX.max,
    maps.axisY.min,
    maps.axisY.max
  );
  const services = await MapService.getServiceLocations(
    maps.axisX.min,
    maps.axisX.max,
    maps.axisY.min,
    maps.axisY.max
  );
  const fuels = await MapService.getFuelLocations(
    maps.axisX.min,
    maps.axisX.max,
    maps.axisY.min,
    maps.axisY.max
  );
  const foods = await MapService.getFoodLocations(
    maps.axisX.min,
    maps.axisX.max,
    maps.axisY.min,
    maps.axisY.max
  );

  // Todos los consumos serán evaluados igual, así que vale la pena unirlos
  maps.consumptions = [
    ...transports.data,
    ...services.data,
    ...fuels.data,
    ...foods.data,
  ];

  console.log(maps);
  updateMap(mapContainer);
}

async function loadPoints(pathGenerator, map) {
  for (let consumption of maps.consumptions) {
    let circle = d3
      .geoCircle()
      .center([consumption.longitude, consumption.latitude])
      .radius(50 / maps.originalScale)();

    const color = getColor(consumption.total);

    map.innerHTML += `<path style="fill: rgba(${color[0]}, ${color[1]}, ${
      color[2]
    }, 100); stroke: rgba(255, 255, 255, 0)" d="${pathGenerator(
      circle
    )}"></path>`;
  }
}

function getColor(n) {
  // TODO: Crear un gradiente de color "más cientifico"

  if (n > 10) {
    n = 10;
  }

  const r = (255 * n) / 10;
  const g = (255 * (10 - n)) / 10;
  const b = 0;
  return [r, g, b];
}

function updateMap(mapContainer) {
  if (!maps.geoJson) {
    return;
  }

  const map = document.querySelector("#map");
  map.innerHTML = "";

  const projection = getProjection(mapContainer);

  const geoGenerator = d3.geoPath().projection(projection);

  const u = d3.select("#map").selectAll("path").data(maps.geoJson.features);
  u.enter().append("path").attr("d", geoGenerator);

  loadPoints(geoGenerator, map);
}

function getProjection(mapContainer) {
  const width = mapContainer.offsetWidth;
  const height = mapContainer.offsetHeight;

  const projection = d3.geoEquirectangular();
  projection.center(maps.center);
  projection.translate([width / 2, height / 2]);
  projection.scale(maps.scale);
  return projection;
}

export function updateScale(mapContainer, zoomInBtn, ZoomOutBtn) {
  let isHolding = false;

  async function zoomInLoop() {
    if (!isHolding) return;
    maps.scale += 1000;
    updateMap(mapContainer);
    requestAnimationFrame(zoomInLoop); // volver a llamar en el siguiente frame
  }
  async function zoomOutLoop() {
    if (!isHolding) return;
    if (maps.scale > 1000) {
      maps.scale -= 1000;
    }
    updateMap(mapContainer);
    requestAnimationFrame(zoomOutLoop); // volver a llamar en el siguiente frame
  }

  // Boton de acercarse
  zoomInBtn.addEventListener("click", () => {
    maps.scale += 1000;
    updateMap(mapContainer);
  });

  // iniciar el bucle
  zoomInBtn.addEventListener("mousedown", () => {
    isHolding = true;
    zoomInLoop();
  });

  // Detener el bucle
  zoomInBtn.addEventListener("mouseup", () => {
    isHolding = false;
  });
  zoomInBtn.addEventListener("mouseleave", () => {
    isHolding = false;
  });

  // Botón de Alejarse
  ZoomOutBtn.addEventListener("click", () => {
    if (maps.scale > 1000) {
      maps.scale -= 1000;
    }
    updateMap(mapContainer);
  });

  // Iniciar el bucle
  ZoomOutBtn.addEventListener("mousedown", () => {
    isHolding = true;
    zoomOutLoop();
  });

  // Detener el bucle
  ZoomOutBtn.addEventListener("mouseup", () => {
    isHolding = false;
  });
  ZoomOutBtn.addEventListener("mouseleave", () => {
    isHolding = false;
  });
}

export function updateCenter(e, mapContainer) {
  const g = document.querySelector("#map");
  let pos = d3.pointer(e, g);

  const projection = getProjection(mapContainer);
  const newCenter = projection.invert(pos);

  if (isNaN(newCenter[0]) || !isFinite(newCenter[0])) {
    return;
  }

  maps.center = newCenter;
  updateMap(mapContainer);
}
