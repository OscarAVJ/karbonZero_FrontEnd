import * as Alerts from "../../../utils/alerts.js";
import * as MeasureService from "../../services/measuresService.js";

///Funcion de init
export async function initMeasure(container) {
  renderMeasure(container);
}

let currentPage = 0;
let currentSize = 10;

export async function setCurrentPage(page) {
  currentPage = page;
}

export async function reload(container) {
  if (!container) return;
  try {
    const measureSearch = document.querySelector("#measureSearch");
    const searchName = measureSearch.value.trim();

    let measures;
    if (!searchName) {
      measures = await MeasureService.getAllMeasures(currentPage, currentSize);
    } else {
      measures = await MeasureService.getAllMeasuresByName(
        searchName,
        currentPage,
        currentSize
      );
    }

    const measuresContainer = container.querySelector("#measureTable");
    loadMeasuresTable(measures.content, measuresContainer);
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

  const measuresContainer = document.querySelector("#measureTable");
  loadMeasuresTable(measures.content, measuresContainer);
  renderPagination(measures.number, measures.totalPages, container);

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
    const ok = await MeasureService.deleteMeasure(id);
    if (ok) reload(container);
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
function loadMeasuresTable(measures, tab) {
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
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
                <td>${baseIndex + i + 1}</td>
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
    const res = await MeasureService.insertMeasure(payload);
    form.reset();
    return res;
  } catch {
    Alerts.showToastCloseError(`No se pudo agregar la medida ${err}`);
    return { ok: false };
  }
}
export async function updateMeasure(idMeasure, nametxt, form) {
  const payload = {
    idMeasure: idMeasure.value,
    name: nametxt.value.trim(),
  };
  try {
    const res = await MeasureService.updateMeasure(payload, idMeasure);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo actualizar la medida ${err}`);
    return { ok: false };
  }
}
