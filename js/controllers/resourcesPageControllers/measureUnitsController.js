import * as Alerts from "../../../utils/alerts.js";
import * as MeasureUnitsService from "../../services/measureUnitsService.js";
import * as MeasuresController from "../../services/measuresService.js";

///Funcion de init
export async function initMeasureUnits(container) {
  renderMeasureUnits(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
  if (!container) return;
  try {
    const measureUnits = await MeasureUnitsService.getAllMeasureUnits(
      currentPage,
      currentSize
    );
    const measureUnitsTab = container.querySelector("#measureUnitTable");
    loadMeasureUnits(measureUnits.content, measureUnitsTab);
    renderPagination(measureUnits.number, measureUnits.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderPagination(current, totalPages, container) {
  const pagination = document.querySelector("#measureUnitPagination");
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

export async function renderMeasureUnits(container) {
  let measures = [];

  try {
    measures = await MeasureUnitsService.getAllMeasureUnits(
      currentPage,
      currentSize
    );
  } catch (err) {
    console.error(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar las unidades de medida.</p>`);
  }

  const measureTab = document.querySelector("#measureUnitTable");
  loadMeasureUnits(measures.content, measureTab);

  // Selector de la paginación
  const sizeSelector = document.querySelector("#measureUnitItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-measureUnit");
    if (!btn) return;
    const id = btn.dataset.id;
    await MeasureUnitsService.deleteMeasureUnit(id);
  });
  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-measureUnit");
    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const measure = await MeasureUnitsService.getMeasureUnitById(id);
        document.querySelector("#medidasUtxt").value = measure.idMeasure;
        document.getElementById("idhiddenMeasureU").value =
          measure.idMeasureUnit;
        document.getElementById("nombreUtxt").value = measure.name;
      } catch (err) {
        Alerts.showToastCloseError("No se pudo cargar la medida");
        console.error(err);
      }
      return;
    }
  });
}
///Metodo para cargar tabla
function loadMeasureUnits(measures, tab) {
  tab.innerHTML = `
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
              <button class="kz-button-create" id="addMeasureUnit-kz" data-bs-toggle="modal"
            data-bs-target="#unidadesModal">
                  Crear medida
              </button>
          </div>
    </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Medida</th>
                <th>Unidad de medida</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${measures
              .map(
                (r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.measureName}</td>
                <td>${r.name}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-measureUnit" data-id="${
                      r.idMeasureUnit
                    }" data-bs-toggle="modal" data-bs-target="#unidadesModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-measureUnit" data-id="${
                      r.idMeasureUnit
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`;
}
export function loadMeasures(measures, measureSelect) {
  measures.forEach((element) => {
    measureSelect.innerHTML += `
        <option value="${element.idMeasure}">${element.name}</option>
      `;
  });
}

export async function insertMeasureUnit(nametxt, measureSelect, form) {
  const payload = {
    idMeasure: measureSelect.value,
    name: nametxt.value.trim(),
  };
  try {
    MeasureUnitsService.insertMeasureUnit(payload);
  } catch {
    Alerts.showToastCloseError(`No se pudo agregar la unidad de medida ${err}`);
  }
  form.reset();
}
export async function updateMeasureUnit(
  idMeasureUnit,
  measureSelect,
  nametxt,
  form
) {
  const payload = {
    idMeasureUnit: idMeasureUnit.value,
    idMeasure: measureSelect.value,
    name: nametxt.value.trim(),
  };
  try {
    MeasureUnitsService.updateMeasureUnit(payload, idMeasureUnit);
  } catch (err) {
    Alerts.showToastCloseError(
      `No se pudo actualizar la unidad de medida ${err}`
    );
  }
  form.reset();
}
