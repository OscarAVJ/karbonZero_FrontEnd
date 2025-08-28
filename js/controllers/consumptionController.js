import * as Alerts from "../../utils/alerts.js";
import * as ConsumptionService from "../services/consumptionService.js";

export async function initConsumption(container) {
  renderConsumptionData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function setCurrentPage(page) {
  currentPage = page;
}

export async function reload(container) {
  if (!container) return;
  try {
    const consumptionSearch = document.querySelector("#consumptionSearch");
    const yearSelect = document.querySelector("#yearSelect")
    const monthSelect = document.querySelector("#monthSelect");
    
    let consumptions = await ConsumptionService.getAllConsumptionsByFilters(
      consumptionSearch.value.trim(),
      yearSelect.value.trim(),
      monthSelect.value,
      currentPage,
      currentSize
    );

    const consumptionsTab = container.querySelector("#tabContent");
    loadConsumptionsTable(consumptions.content, consumptionsTab);
    renderPagination(consumptions.number, consumptions.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderPagination(current, totalPages, container) {
  const pagination = document.getElementById("consumptionPagination");
  if (!pagination) return;
  pagination.innerHTML = ""; ///Limpiamos la paginacion previa

  // Retroceso
  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = ` <a class="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                     </a>`;
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage = current - 1;
      reload(container);
    }
  });
  pagination.appendChild(prev);

  // Número de páginas
  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
        currentPage = i; ///Saltamos a la pagina seleccionada
        reload(container);
      }
    });
    pagination.appendChild(li);
  }

  // Siguiente
  const next = document.createElement("li");
  next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < totalPages - 1) {
      currentPage = current + 1;
      reload(container);
    }
  });
  pagination.appendChild(next);
}

export async function renderConsumptionData(container) {
  let consumptions;
  try {
    consumptions = await ConsumptionService.getAllConsumptions(
      currentPage,
      currentSize
    );
  } catch (err) {
    console.log(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los consumos.</p>`);
  }

  const consumptionsTab = document.getElementById("tabContent");
  loadConsumptionsTable(consumptions.content, consumptionsTab);
  renderPagination(consumptions.number, consumptions.totalPages, container);

  const sizeSelector = document.getElementById("itemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Delete method
  container.addEventListener("click", async (e) => {
    const deleteBtnConsumptions = e.target.closest(".btn-delete-consumption");
    if (!deleteBtnConsumptions) return;
    const id = deleteBtnConsumptions.dataset.id;
    const ok = await ConsumptionService.deleteConsumption(id);
    if (ok) await reload(container);
  });

  ///Update method
  container.addEventListener("click", async (e) => {
    const editBtnConsumptions = e.target.closest(".btn-edit-consumption");
    if (!editBtnConsumptions) return;

    const id = editBtnConsumptions.dataset.id;
    try {
      const consumption = await ConsumptionService.getConsumptionById(id);

      const resourceSelect = document.querySelector("#recursoSelect");
      const unitySelect = document.querySelector("#unidadSelect");
      const puritytxt = document.querySelector("#purezatxt");

      document.querySelector("#idConsumptionHidden").value =
        consumption.idConsumption;

      resourceSelect.disabled = true;
      resourceSelect.value = consumption.idResourcePurity;
      updateConsumptionEntries(resourceSelect, unitySelect, puritytxt);

      document.querySelector("#cantidadtxt").value = consumption.quantity;
      document.querySelector("#costotxt").value = consumption.cost;
      document.querySelector("#fecha").value =
        consumption.consumptionDate.substring(0, 10);
    } catch (err) {
      Alerts.showToastCloseError("No se puso cargar el consumo");
      console.log(err);
    }
  });
}

///Metodo para cargar tabla
function loadConsumptionsTable(consumptions, tab) {
  tab.innerHTML = `
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Recurso</th>
                <th>Usuario</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Coste</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${consumptions
              .map(
                (c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${c.resourcePurityName}</td>
                <td>${c.userName}</td>
                <td>${c.quantity}</td>
                <td>${c.consumptionDate.split(" ")[0]}</td>
                <td>$${c.cost}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-consumption" data-id="${
                      c.idConsumption
                    }" data-bs-toggle="modal" data-bs-target="#consumptionsModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-consumption" data-id="${
                      c.idConsumption
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`;
}

export function updateConsumptionEntries(
  resourceSelect,
  unitySelect,
  puritytxt
) {
  puritytxt.value =
    resourceSelect.options[resourceSelect.selectedIndex].dataset.purity;
  unitySelect.value =
    resourceSelect.options[resourceSelect.selectedIndex].dataset.measure;
}

export function loadResourcePurities(resourcesPurities, resourceSelect) {
  resourcesPurities.forEach((element) => {
    resourceSelect.innerHTML += `
        <option value="${element.idResourcePurity}" data-resource="${element.idResource}" data-purity="${element.purity}" data-measure="${element.idMeasureUnit}">${element.resourceName} (${element.purity}) (${element.measureUnitName}):</option>
      `;
  });
}

export function loadMeasureUnits(measureUnits, unitySelect) {
  measureUnits.forEach((element) => {
    unitySelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `;
  });
}

///Metodo para insertar recursos
export async function insertConsumption(
  resourceS,
  quantityT,
  dateT,
  costT,
  user,
  form
) {
  const date = dateT.value.split("-");

  const payload = {
    idResourcePurity: resourceS.value.trim(),
    idUser: user,
    quantity: quantityT.value.trim(),
    consumptionDate: `${date[2]}/${date[1]}/${date[0]}`,
    cost: costT.value.trim(),
  };

  try {
    const res = await ConsumptionService.insertConsumption(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar el consumo`);
    return { ok: false };
  }
}

///Metodo para actualizar recursos
export async function updateConsumption(
  id,
  resourceS,
  quantityT,
  dateT,
  costT,
  user,
  form
) {
  const date = dateT.value.split("-");

  const payload = {
    idConsumption: id,
    idResourcePurity: resourceS.value.trim(),
    idUser: user,
    quantity: quantityT.value.trim(),
    consumptionDate: `${date[2]}/${date[1]}/${date[0]}`,
    cost: costT.value.trim(),
  };

  try {
    const res = await ConsumptionService.updateConsumption(id, payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo actualizar el recurso`);
    return { ok: false };
  }
}
