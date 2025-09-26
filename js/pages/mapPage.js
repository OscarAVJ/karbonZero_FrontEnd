import * as MapController from "../controllers/mapController.js"

export async function render() {
  loadCSS();
  return `
    <div class="container-fluid p-4 full-height-map d-flex flex-column justify-content-start">
        <h2 class="general-title">Mapa de CO₂</h2>

        <form class="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
                <div class="col-6">
                    <select class="form-select" aria-label="Países" id="countriesSelect">
                        <option value="El_Salvador">El Salvador</option>
                    </select>
                </div>
                <button id="searchButton" class="kz-button-create">Buscar</button>
        </form>

        <div id="mapContainer" class="advanced-filters-container map-container mx-auto flex-grow-1 d-flex align-items-center justify-content-center">
            <svg id="map" class="w-100 h-100">
            </svg>
        </div>
    </div>

  `;
}

function loadCSS() {
  const id = "reports-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../css/map.css";
    link.id = id;
    document.head.appendChild(link);
  }
}

export function afterRender() {
  renderMap();
}

async function renderMap() {
    const mapContainer = document.querySelector("#mapContainer");
    const countriesS = document.querySelector("#countriesSelect");
    const searchButton = document.querySelector("#searchButton");

    searchButton.addEventListener("click", async (e) => {
        MapController.reloadMap(mapContainer, countriesS.value);
    });
}
