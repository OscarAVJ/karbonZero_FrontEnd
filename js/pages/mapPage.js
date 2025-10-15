import * as MapController from "../controllers/mapController.js";

export async function render() {
  return `
    <div class="py-4">
        <h2 class="general-title">Mapa de CO₂</h2>

        <form class="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
                <div> 
                    <button id="zoomInButton" class="kz-button p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in-icon lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg></button>
                    <button id="zoomOutButton" class="kz-button p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out-icon lucide-zoom-out"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg></button>
                </div>
                <div class="col-6">
                    <select class="form-select" aria-label="Países" id="countriesSelect">
                        <option value="El_Salvador">El Salvador</option>
                        <option value="Honduras">Honduras</option>
                    </select>
                </div>
                <button id="searchButton" class="kz-button">Buscar</button>
        </form>

        <div id="mapContainer" class="map-container mx-auto d-flex align-items-center justify-content-center">
            <svg class="w-100 h-100">
              <g id="map"></g>
            </svg>
        </div>
        <div class="overflow-x-scroll"> 
            <div id="barContainer" class="p-3" style="min-width: 400px;" >
                <svg id="barChart" style="height: 400px;">
                    <g></g>
                </svg>
            </div>
        </div>
    </div>

  `;
}


export function afterRender() {
  renderMap();
}

async function renderMap() {
  const mapContainer = document.querySelector("#mapContainer");
  const barContainer = document.querySelector("#barContainer")
  const countriesS = document.querySelector("#countriesSelect");
  const searchButton = document.querySelector("#searchButton");

  const zoomIn = document.querySelector("#zoomInButton");
  const zoomOut = document.querySelector("#zoomOutButton");

  MapController.updateScale(mapContainer, zoomIn, zoomOut);

  searchButton.addEventListener("click", async (e) => {
    MapController.loadMap(mapContainer, barContainer, countriesS.value);
  });

  mapContainer.addEventListener("click", async (e) => {
    MapController.updateCenter(e, mapContainer);
  });

  window.addEventListener("resize", (e) => {
    MapController.loadBarChart(barContainer);
  });
}
