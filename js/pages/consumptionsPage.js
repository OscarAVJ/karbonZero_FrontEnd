import * as consumptionController from "../controllers/consumptionController";
import * as ConsumptionService from "../services/consumptionService";
import * as Alerts from "../../utils/alerts";
import { getAllResourcePuritiesList } from "../services/puritiesServices";
import { getAllMeasureUnitsList } from "../services/measureUnitsService";
import { getLoggedUser } from "../services/authService";
import { role } from '../controllers/sessionController';

export async function render() {
  role.applyPermissions();
  return `
    <!-- Consumptions Section -->
    <div class="py-4" id="consumptions-root">
      <h2 class="general-title">Consumos</h2>

      <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
          <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="consumptionSearch">
        </div>
        <div class="d-flex align-items-center gap-3 flex-nowrap ms-auto">
            <div class="input-group">
                <span id="yearSelectlbl" class="input-group-text"">Año: </span>
                <input type="number" class="form-control" min="1900" max="2200" value="" id="yearSelect">
            </div>
            <div class="input-group">
                <span class="input-group-text"id="monthSelectlbl">Mes: </span>
                <select class="form-select" maxlength="50" id="monthSelect" style="max-height: 250px; overflow-y: scroll;">
                    <option value=""></option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </select>
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
                    <input id="cantidadtxt" type="number" class="form-control" placeholder="Cantidad" step=0.001 min="0">
                  </div>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-sm-6">
                    <label for="costotxt" class="form-label">Costo</label>
                    <input type="number" id="costotxt" class="form-control" placeholder="Costo" min="0">
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
      </div>
       <!-- Paginación -->
      <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
        <div class="col-auto d-flex justify-content-start">
          <select class="form-select" aria-label="Items por pagina" id="itemsSelect">
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="col d-flex justify-content-end">
          <nav aria-label="Page navigation example" class="d-flex justify-content-center">
            <ul class="pagination mb-0" id="consumptionPagination">

            </ul>
          </nav>
        </div>
      </div>
    </div>
  `;
}

export function afterRender() {
  consumptionsProcess();
}

function searchConsumptions(container) {
  consumptionController.setCurrentPage(0);
  consumptionController.reload(container);
}

async function consumptionsProcess() {
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
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  date.max = `${añoActual}-12-31`;
  const modalConsumption = document.querySelector("#consumptionsModal");
  const consumptionBsModal =
    bootstrap.Modal.getOrCreateInstance(modalConsumption);
  const consumptionForm = document.querySelector("#consumptionsForm");

  const consumptionSearch = document.querySelector("#consumptionSearch");
  consumptionSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      searchConsumptions(container);
    };
  });

  const yearSelect = document.querySelector("#yearSelect");
  yearSelect.max = añoActual

  yearSelect.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      if (yearSelect.value > añoActual) {
        Alerts.showToastCloseInfo(`El valor del año no puede ser mayor al año actual ${añoActual}`)
        return;
      }
      if (yearSelect.value < 0) {
        Alerts.showToastCloseInfo("El año no puede ser negativo");
        return;
      };
      searchConsumptions(container);
    };
  });

  const monthSelect = document.querySelector("#monthSelect");
  monthSelect.addEventListener("change", (e) => {
    searchConsumptions(container);
  })

  const resourcesPurities = await getAllResourcePuritiesList();
  consumptionController.loadResourcePurities(resourcesPurities, resourceSelect);
  const measureUnits = await getAllMeasureUnitsList();
  consumptionController.loadMeasureUnits(measureUnits, unitySelect);

  if (addConsumptionBtn) {
    addConsumptionBtn.addEventListener("click", () => {
      resourceSelect.disabled = false;
      resourceSelect.selectedIndex = 0;

      consumptionController.updateConsumptionEntries(
        resourceSelect,
        unitySelect,
        puritytxt
      );

      quantitytxt.value = "";
      costtxt.value = "";
      date.value = new Date().toISOString().substring(0, 10);
    });
  }

  if (resourceSelect && puritytxt) {
    resourceSelect.addEventListener("change", () => {
      consumptionController.updateConsumptionEntries(
        resourceSelect,
        unitySelect,
        puritytxt
      );
    });
  }

  let isLoading = false;
  consumptionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (quantitytxt.value <= 0) {
      Alerts.showToastCloseError("La cantidad debe de ser positiva");
      return;
    }

    if (!costtxt.value) {
      costtxt.value = 0;
    }

    if (costtxt.value < 0) {
      Alerts.showToastCloseError("El coste no puede ser negativo");
      return;
    }

    if (!date.value) {
      Alerts.showToastCloseError("La fecha es obligatoria");
      return;
    }

    const resourceMeasureUnit =
      resourceSelect.options[resourceSelect.selectedIndex].dataset.measure;
    const resourceId =
      resourceSelect.options[resourceSelect.selectedIndex].dataset.resource;
    if (resourceMeasureUnit != unitySelect.value) {
      const new_quantity = await ConsumptionService.convertMeasureUnit(
        unitySelect.value,
        resourceMeasureUnit,
        resourceId,
        quantitytxt.value
      );

      if (!new_quantity.value) {
        Alerts.showToastCloseError("Seleccionó una unidad de medida no válida");
        return;
      }
      Alerts.showToastCloseInfo("Unidad de medida convertida automáticamente");
      quantitytxt.value = new_quantity.value;
      unitySelect.value = resourceMeasureUnit;
      return;
    }

    if (isLoading) return;
    isLoading = true;
    const authUser = await getLoggedUser();
    console.log(authUser)
    console.log(authUser.user.id);
    let res;
    if (idConsumption.value) {
      res = await consumptionController.updateConsumption(
        idConsumption.value,
        resourceSelect,
        quantitytxt,
        date,
        costtxt,
        authUser.user.id,
        consumptionForm
      );
    } else {
      res = await consumptionController.insertConsumption(
        resourceSelect,
        quantitytxt,
        date,
        costtxt,
        authUser.user.id,
        consumptionForm
      );
    }
    consumptionBsModal.hide();
    isLoading = false;

    consumptionController.updateConsumptionEntries(
      resourceSelect,
      unitySelect,
      puritytxt
    );

    if (res?.ok) {
      await consumptionController.reload(container);
    }
  });
}
