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
  consumptionsTotal: 0,
  states: [],
};

export async function loadMap(mapContainer, barContainer, text) {
  mapContainer.innerHTML = `
    <section class="d-flex align-items-center py-5">
          <div class="container py-5">
            <div class="row align-items-center">
              <div class="col-md-6 text-center text-md-start">
                <p class="display-3 fw-bold text-success">Espere mientras cargamos el mapa!</p>
              </div>
            </div>
          </div>
  </section>`;
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
  const consumptions = [
    ...transports.data,
    ...services.data,
    ...fuels.data,
    ...foods.data,
  ];
  maps.consumptions = [];
  maps.consumptionsTotal = 0;
  maps.states = {};

  for (let consumption of consumptions) {
    // Obtenemos más consumos de los necesarios, unos no son del país y despúes debemos eliminarlos
    let findState = false;
    maps.consumptionsTotal += consumption.total;

    for (let state of geoJson.features) {
      // Si el estado no existe en el JSON, lo agregamos
      if (!(state.properties.shapeName in maps.states)) {
        maps.states[state.properties.shapeName] = {
          name: state.properties.shapeName,
          coordinates: state.geometry.coordinates[0],
          total: 0,
        };
      }

      // Comprobamos si el consumo esta en ese estado
      if (
        d3.polygonContains(state.geometry.coordinates[0], [
          consumption.longitude,
          consumption.latitude,
        ])
      ) {
        // Si lo esta, lo agregamos al total del estado
        maps.states[state.properties.shapeName].total += consumption.total;
        findState = true;
        break;
      }
    }

    if (findState) {
      // Eliminamos los consumos que no corresponden a ningun estado (y por lo tanto al país)
      maps.consumptions.push(consumption);
      continue;
    }

    maps.consumptionsTotal -= consumption.total;
  }
  updateMap(mapContainer);
  loadBarChart(barContainer);
}

function updateMap(mapContainer) {
  if (!maps.geoJson) {
    return;
  }

  mapContainer.innerHTML = `
  <svg class="w-100 h-100">
    <g class="w-100 h-100" id="map"></g>
  </svg>`;
  const map = document.querySelector("#map");
  const projection = getProjection(mapContainer);
  const geoGenerator = d3.geoPath().projection(projection);

  map.innerHTML = "";
  // Cargamos los departamentos en el DOM
  for (let polygon of maps.geoJson.features) {
    map.innerHTML += `<path d="${geoGenerator(polygon)}"></path>`;
  }

  loadPoints(geoGenerator, map);
}

async function loadPoints(pathGenerator, map) {
  const mean = maps.consumptionsTotal / maps.consumptions.length;
  for (let consumption of maps.consumptions) {
    let circle = d3
      .geoCircle()
      .center([consumption.longitude, consumption.latitude])
      .radius(50 / maps.originalScale)();

    const color = getColor(consumption.total, mean * 2);

    map.innerHTML += `<path style="fill: rgba(${color[0]}, ${color[1]}, ${
      color[2]
    }, 100); stroke: rgba(255, 255, 255, 0)" d="${pathGenerator(
      circle
    )}"></path>`;
  }
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

export async function loadBarChart(barContainer) {
  if (!maps.geoJson) return;

  // Debemos limpiar el antiguo gráfico para evitar sobreescribirlo
  document.querySelector("#barChart").innerHTML = "";

  const width = barContainer.clientWidth;
  const height = barContainer.clientHeight;
  const margin = { top: 30, right: 30, bottom: 90, left: 50 };

  // Tenemos que seleccionar el svg con los métodos de d3
  const svg = d3.select("#barChart").attr("width", width - 32);
  const xScale = d3
    .scaleBand()
    .domain(Object.values(maps.states).map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(Object.values(maps.states), (d) => d.total)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Add X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr("class", "axis")
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
    .attr("class", "axis");

  // Add Y-axis-label
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "start")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", `translate(${margin.left},0)`)
    .text("Toneladas de CO2");

  // Draw bars

  const sum = Object.values(maps.states).reduce((p, a) => p + a.total, 0);
  const length = Object.keys(maps.states).length;
  const mean = sum / length;
  svg
    .selectAll(".bar")
    .data(Object.values(maps.states))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.name))
    .attr("y", (d) => yScale(d.total))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d.total))
    .attr("style", (d) => {
      const colors = getColor(d.total, mean * 2);
      return `fill: rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 100)`;
    });

  // Add labels
  svg
    .selectAll(".label")
    .data(Object.values(maps.states))
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.total) - 5)
    .attr("text-anchor", "middle")
    .text((d) => Math.round(d.total));
}

function getColor(n, base = 10) {
  if (n > base) {
    n = base;
  }

  const r = (255 * n) / base;
  const g = (255 * (base - n)) / base;
  const b = 0;
  return [r, g, b];
}
