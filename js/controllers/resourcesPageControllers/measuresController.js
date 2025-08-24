import * as Alerts from "../../../utils/alerts.js";
import * as MeasureService from "../../services/measuresService.js";

///Funcion de init
export async function initMeasure(container) {
  renderMeasure(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
  if (!container) return;
  try {
    const measures = await MeasureService.getAllMeasures(
      currentPage,
      currentSize
    );
    const measuresTab = container.querySelector("#measureTable");
    loadMeasures(measures.content, measuresTab);
    renderPagination(measures.number, measures.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderPagination(current, totalPages, container) {
  const pagination = document.querySelector("#measurePagination");
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

export async function renderMeasure(container) {
  let measures = [];

  try {
    measures = await MeasureService.getAllMeasures(currentPage, currentSize);
  } catch (err) {
    console.error(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar las medidas.</p>`);
  }

  const measureTab = document.querySelector("#measureTable");
  loadMeasures(measures.content, measureTab);

  // Selector de la paginación
  const sizeSelector = document.querySelector("#measureItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-measure");
    if (!btn) return;
    const id = btn.dataset.id;
    await MeasureService.deleteMeasure(id);
  });
  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-measure");
    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const measure = await MeasureService.getMeasureById(id);
        document.getElementById("idMeasureHidden").value = measure.idMeasure;
        document.getElementById("nameMetxt").value = measure.name;
      } catch (err) {
        Alerts.showToastCloseError("No se pudo cargar la medida");
        console.error(err);
      }
      return;
    }
  });
}
///Metodo para cargar tabla
function loadMeasures(measures, tab) {
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
              <button class="kz-button-create" id="addMeasure-kz" data-bs-toggle="modal"
            data-bs-target="#medidasModal">
                  Crear medida
              </button>
          </div>
    </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${measures
              .map(
                (r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.name}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-measure" data-id="${
                      r.idMeasure
                    }" data-bs-toggle="modal" data-bs-target="#medidasModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-measure" data-id="${
                      r.idMeasure
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`;
}

export async function insertMeasure(nametxt, form) {
  const payload = {
    name: nametxt.value.trim(),
  };
  try {
    MeasureService.insertMeasure(payload);
  } catch {
    Alerts.showToastCloseError(`No se pudo agregar la medida ${err}`);
  }
  form.reset();
}
export async function updateMeasure(idMeasure, nametxt, form) {
  const payload = {
    idMeasure: idMeasure.value,
    name: nametxt.value.trim(),
  };
  try {
    MeasureService.updateMeasure(payload, idMeasure);
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo actualizar la medida ${err}`);
  }
  form.reset();
}
