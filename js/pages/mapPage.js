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
                        <option value="Honduras">Honduras</option>
                    </select>
                </div>
                <button id="searchButton" class="kz-button-create">Buscar</button>
        </form>

        <div id="mapContainer" class="advanced-filters-container map-container mx-auto flex-grow-1 d-flex align-items-center justify-content-center">
            <svg class="w-100 h-100">
              <g id="map"></g>
            </svg>
        </div>
        <form class="container-fluid p-4 d-flex justify-content-center"> 
          <div class="col-6">
            <label for="scaleRange" class="form-label">Escala</label>
            <input type="range" class="form-range" min="500" max="20000" value="1000" id="scaleRange">
            <output for="scaleRange" id="rangeValue" aria-hidden="true">1000</output>
          </div>
        </form>
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
    
    const scaleRange = document.querySelector("#scaleRange") 
    const rangeValue = document.querySelector("#rangeValue")

    scaleRange.addEventListener("input", () => {
      rangeValue.textContent = scaleRange.value;
    })

    searchButton.addEventListener("click", async (e) => {
      MapController.reloadMap(mapContainer, countriesS.value);
    });
}
