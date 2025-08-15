import * as consumptionController from "../controllers/consumptionController";
import { getAllResourcePurities } from "../services/puritiesServices"
import { getAllMeasureUnits } from "../services/measureUnitsService"
import { showToastCloseError } from "../../utils/alerts";

export async function render() {
    return `
    <!-- Consumptions Section -->
    <div class="py-4" id="consumptions-root">
      <h2 class="general-title">Consumos</h2>

      <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
          <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3" type="button"
              id="dropdownMes" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-calendar"></i> Mes
              <i class="bi bi-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMes">
              <li><a class="dropdown-item" href="#">Enero</a></li>
              <li><a class="dropdown-item" href="#">Febrero</a></li>
              <li><a class="dropdown-item" href="#">Marzo</a></li>
            </ul>
          </div>
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center gap-2 border rounded-3 px-3" type="button"
              id="dropdownTrimestre" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-calendar"></i> Trimestre
              <i class="bi bi-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownTrimestre">
              <li><a class="dropdown-item" href="#">Q1</a></li>
              <li><a class="dropdown-item" href="#">Q2</a></li>
              <li><a class="dropdown-item" href="#">Q3</a></li>
            </ul>
          </div>
          <button type="button" class="kz-button-create" id="addConsumption-kz" data-bs-toggle="modal" data-bs-target="#consumptionsModal">
            <i class="bi bi-plus-circle"></i> Crear consumo
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="consumptionsModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content kz-modal-mongo border-0">
            <div class="modal-header" style="justify-content: center; position: relative;">
              <h4 class="kz-modal-title" id="exampleModalLongTitle">Consumos</h4>
              <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="consumptionsForm">
              <div class="modal-body mx-3">
                <div class="row g-2 mb-2">
                  <label for="recursoSelect" class="form-label">Recurso</label>
                  <select id="recursoSelect" class="form-select">
                  </select>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-sm-3">
                    <label for="purezatxt" class="form-label">Pureza</label>
                    <input id="purezatxt" type="number" class="form-control" placeholder="Pureza" readonly>
                  </div>
                  <div class="col-sm-6">
                    <label for="unidadSelect" class="form-label">Unidad de medida</label>
                    <select id="unidadSelect" class="form-select">
                    </select>
                  </div>
                  <div class="col-sm-3">
                    <label for="cantidadtxt" class="form-label">Cantidad</label>
                    <input id="cantidadtxt" type="number" class="form-control" placeholder="Cantidad">
                  </div>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-sm-6">
                    <label for="costotxt" class="form-label">Costo</label>
                    <input type="number" id="costotxt" class="form-control" placeholder="Costo">
                  </div>
                  <div class="col-sm-6">
                    <label for="fecha" class="form-label">Fecha</label>
                    <input type="date" id="fecha" class="form-control">
                  </div>
                  <div class="col-sm-6 d-none">
                    <label for="idConsumptionHidden">idConsumption</label>
                    <input type="text" id="idConsumptionHidden">
                  </div>
                </div>
              </div>
              <div class="modal-footer d-flex justify-content-center">
                <button type="submit" class="btn kz-button-create">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs mb-3" id="tabList"></ul>
      <div class="tab-content" id="tabContent">
        <div id="consumptions" class="tab-pane fade show active">
            <!-- contenido de consumos -->
         </div>
      </div>
    </div>
  `;
}

export function afterRender() {
    consumptionsProces(); 
}

async function consumptionsProces() {
  const container = document.getElementById("consumptions-root");
  consumptionController.initConsumption(container);

  const addConsumptionBtn = document.getElementById("addConsumption-kz");

  const idConsumption = document.querySelector("#idConsumptionHidden");
  const resourceSelect = document.querySelector("#recursoSelect");
  const puritytxt = document.querySelector("#purezatxt");
  const unitySelect = document.querySelector("#unidadSelect");
  const quantitytxt = document.querySelector("#cantidadtxt");
  const costtxt = document.querySelector("#costotxt");
  const date = document.querySelector("#fecha");

  const modalConsumption = document.querySelector("#consumptionsModal");
  const consumptionBsModal = bootstrap.Modal.getOrCreateInstance(modalConsumption);
  const consumptionForm = document.querySelector("#consumptionsForm");

  const resourcesPurities = await getAllResourcePurities();
  consumptionController.loadResourcePurities(resourcesPurities, resourceSelect);
  const measureUnits = await getAllMeasureUnits();
  consumptionController.loadMeasureUnits(measureUnits, unitySelect);

  if (addConsumptionBtn) {
    addConsumptionBtn.addEventListener("click", () => {
      quantitytxt.value = "";
      costtxt.value = "";
      date.value = "";
    });
  }

  if (resourceSelect && puritytxt) {
    puritytxt.value =
        resourceSelect.options[
        resourceSelect.selectedIndex
    ].dataset.purity;
    unitySelect.value = 
        resourceSelect.options[
        resourceSelect.selectedIndex
    ].dataset.measure;

    resourceSelect.addEventListener("change", () => {
        puritytxt.value = resourceSelect.options[resourceSelect.selectedIndex].dataset.purity;
        unitySelect.value = resourceSelect.options[resourceSelect.selectedIndex].dataset.measure;
    })
  }

  consumptionForm.addEventListener("submit", () => {
    if (quantitytxt.value <= 0) {
        showToastCloseError("La cantidad debe de ser positiva")
        return;
    }

    if (costtxt.value < 0) {
      showToastCloseError("El coste no puede ser negativo");
      return;
    }

    if (!date.value) {
        showToastCloseError("La fecha es obligatoria");
        return;
    }

    if (idConsumption.value) {
      PurityController.updatePurity(
        resourceSelect,
        puritytxt,
        idPurity,
        purityForm
      );
      consumptionBsModal.hide();
    } else {
      consumptionController.insertConsumption(
        resourceSelect,
        quantitytxt,
        unitySelect,
        date,
        costtxt,
        "D9086EE4AFFF477C91E20DA876AA1AF5",
        consumptionForm
      );
      consumptionBsModal.hide();
    }
  });
}