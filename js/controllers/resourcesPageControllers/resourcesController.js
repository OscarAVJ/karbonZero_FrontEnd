import * as Alerts from "../../../utils/alerts.js";
import * as ResourceService from "../../services/resourcesService.js";

///Funcion de init
export async function initResource(container) {
  renderResourceData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
  if (!container) return;
  try {
    const resources = await ResourceService.getAllResources(
      currentPage,
      currentSize
    );
    const resourcesContainer = container.querySelector("#resourceTable");
    loadResourcesTable(resources.content, resourcesContainer);
    renderResourcePagination(resources.number, resources.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderResourcePagination(current, totalPages, container) {
  const pagination = document.querySelector("#resourcePagination");
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

///Renderizado de elementos
async function renderResourceData(container) {
  let resources = [];
  ///Obtener usuarios
  try {
    resources = await ResourceService.getAllResources(currentPage, currentSize);
  } catch (err) {
    console.error(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`);
  }

  ///Los mandamos en
  const resourcesContainer = document.querySelector("#resourceTable");
  loadResourcesTable(resources.content, resourcesContainer);

  // Selector de la paginación
  const sizeSelector = document.querySelector("#resourceItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Delete method
  container.addEventListener("click", async (e) => {
    const deleteBtnResources = e.target.closest(".btn-delete-resource");
    if (!deleteBtnResources) return;
    const id = deleteBtnResources.dataset.id;
    const ok = await ResourceService.deleteResource(id);
    if (ok) reload(container);
  });

  ///Cargar los datos al editar
  container.addEventListener("click", async (e) => {
    const editResourceBtn = e.target.closest(".btn-edit-resource");
    if (editResourceBtn) {
      const id = editResourceBtn.dataset.id;
      try {
        const resource = await ResourceService.getResourcesById(id);
        document.getElementById("idResource").value = resource.idResource;
        document.getElementById("resourceMU").value = resource.idMeasureUnit;
        document.getElementById("nameResource").value = resource.name;
        document.getElementById("resourceCF").value = resource.carbonFootprint;
      } catch (err) {
        Alerts.showToastCloseError("No se puso cargar el recurso");
        console.log(err);
      }
      return;
    }
  });
}

///Metodo para cargar tabla
function loadResourcesTable(resources, tab) {
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
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
              <button class="kz-button-create" id="addResource-kz" data-bs-toggle="modal"
            data-bs-target="#resourcesModal">
                  Crear recursos
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
                <th>Huella de carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${resources
              .map(
                (r, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${r.name}</td>
                <td>${r.measureName}</td>
                <td>${r.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-resource" data-id="${
                      r.idResource
                    }" data-bs-toggle="modal" data-bs-target="#resourcesModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-resource" data-id="${
                      r.idResource
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`
}

export function loadMeasureUnits(measureUnits, measureSelect) {
  measureUnits.forEach((element) => {
    measureSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `;
  });
}

///Metodo para insertar recursos
export async function insertResource(
  nameT,
  measureUnitS,
  carbonFootprintT,
  form
) {
  const payload = {
    idMeasureUnit: measureUnitS.value,
    name: nameT.value.trim(),
    carbonFootprint: carbonFootprintT.value.trim(),
  };
  try {
    const res = await ResourceService.insertResource(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar el recurso`);
    return {ok: false};
  }
}

///Metodo para actualizar recursos
export async function updateResource(
  id,
  nameT,
  measureUnitS,
  carbonFootprintT,
  form
) {
  const payload = {
    idResource: id.value,
    idMeasureUnit: measureUnitS.value,
    name: nameT.value.trim(),
    carbonFootprint: carbonFootprintT.value.trim(),
  };
  try {
    const res = await ResourceService.updateResource(payload, id);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo actualizar el recurso`);
    return {ok: false};
  }
}
