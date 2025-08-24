import * as Alerts from "../../../utils/alerts.js";
import * as PuritiesService from "../../services/puritiesServices.js";

///Funcion de init
export async function initPurity(container) {
  renderPuritiesData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
  if (!container) return;
  try {
    const purities = await PuritiesService.getAllResourcePurities(
      currentPage,
      currentSize
    );
    const puritiesTab = container.querySelector("#purityTable");
    loadResourcesPurityTable(purities.content, puritiesTab);
    renderPagination(purities.number, purities.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderPagination(current, totalPages, container) {
  const pagination = document.querySelector("#purityPagination");
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

export async function renderPuritiesData(container) {
  let resourcePurities = [];

  try {
    resourcePurities = await PuritiesService.getAllResourcePurities(
      currentPage,
      currentSize
    );
  } catch (err) {
    console.error(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`);
  }

  const puritiesTab = document.querySelector("#purityTable");
  loadResourcesPurityTable(resourcePurities.content, puritiesTab);

  // Selector de la paginación
  const sizeSelector = document.querySelector("#purityItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-purity");
    if (!btn) return;
    const id = btn.dataset.id;
    await PuritiesService.deleResourcePurity(id);
  });
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-purity");
    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const purity = await PuritiesService.getResourcePurityById(id);
        document.getElementById("idPurityHidden").value =
          purity.idResourcePurity;
        document.getElementById("puritytxt").value = purity.purity;
        document.querySelector("#resourceSelect").value = purity.idResource;
      } catch (err) {
        Alerts.showToastCloseError("No se pudo cargar la medida");
        console.error(err);
      }
      return;
    }
  });
}
///Metodo para cargar tabla
function loadResourcesPurityTable(puritites, tab) {
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
              <button class="kz-button-create" id="addPurity-kz" data-bs-toggle="modal"
            data-bs-target="#purezaModal">
                  Crear pureza
              </button>
          </div>
    </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Unidad de medida</th>
                <th>Pureza</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${puritites
              .map(
                (r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.resourceName}</td>
                <td>${r.measureUnitName}</td>
                <td>${r.purity}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-purity" data-id="${
                      r.idResourcePurity
                    }" data-bs-toggle="modal" data-bs-target="#purezaModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-purity" data-id="${
                      r.idResourcePurity
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>
   `;
}

export function loadResources(resources, resourceSelect) {
  resources.forEach((element) => {
    resourceSelect.innerHTML += `
        <option value="${element.idResource}">${element.name} tC0₂: ${element.carbonFootprint}</option>
      `;
  });
}

export async function insertPurity(resourceSelect, puritytxt, form) {
  const payload = {
    idResource: resourceSelect.value,
    purity: puritytxt.value.trim(),
  };
  try {
    PuritiesService.insertResourcePurity(payload);
  } catch {
    Alerts.showToastCloseError(`No se pudo agregar la pureza ${err}`);
  }
  form.reset();
}
export async function updatePurity(resourceSelect, puritytxt, id, form) {
  const payload = {
    idResourcePurity: id.value,
    idResource: resourceSelect.value,
    purity: puritytxt.value.trim(),
  };
  try {
    PuritiesService.updateResourcePurity(payload, id);
  } catch {
    Alerts.showToastCloseError(`No se pudo actualizar la pureza ${err}`);
  }
  form.reset();
}
