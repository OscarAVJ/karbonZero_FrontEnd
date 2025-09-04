import * as Alerts from "../../../utils/alerts.js";
import * as ConversionUnitsService from "../../services/conversionUnitsService.js";

///Funcion de init
export async function initConversionUnits(container) {
  renderConversionUnits(container);
}

let currentPage = 0;
let currentSize = 10;

export async function setCurrentPage(page) {
  currentPage = page;
}

export async function reload(container) {
  if (!container) return;
  try {
    const conversionSearch = document.querySelector("#conversionUnitSearch");
    const searchName = conversionSearch.value.trim();

    let conversions;
    if (!searchName) {
      conversions = await ConversionUnitsService.getAllConversionUnits(
        currentPage,
        currentSize
      );
    } else {
      conversions = await ConversionUnitsService.getAllConversionUnitsByName(
        searchName,
        currentPage,
        currentSize
      );
    }
    const conversionContainer = container.querySelector("#conversionUnitTable");
    loadConversionUnits(conversions.content, conversionContainer);
    renderPagination(conversions.number, conversions.totalPages, container);
  } catch (e) {
    console.error(e);
  }
}

export function renderPagination(current, totalPages, container) {
  const pagination = document.querySelector("#conversionUnitPagination");
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

export async function renderConversionUnits(container) {
  let conversionUnits = [];

  try {
    conversionUnits = await ConversionUnitsService.getAllConversionUnits(
      currentPage,
      currentSize
    );
  } catch (err) {
    console.error(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar las conversiones.</p>`);
  }

  const conversionContainer = document.querySelector("#conversionUnitTable");
  loadConversionUnits(conversionUnits.content, conversionContainer);

  // Selector de la paginación
  const sizeSelector = document.querySelector("#conversionUnitItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-conversionUnit");
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await ConversionUnitsService.deleteConversionUnit(id);
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-conversionUnit");
    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const conversion = await ConversionUnitsService.getConversionUnitById(
          id
        );

        if (conversion.idResource) {
          document.querySelector("#resourceMUSelect").value =
            conversion.idResource;
        } else {
          document.querySelector("#resourceMUSelect").value = "";
        }

        document.querySelector("#initialUnitSelect").value =
          conversion.idInitialUnit;
        document.querySelector("#finalUnitSelect").value =
          conversion.idFinalUnit;
        document.querySelector("#operationSelect").value = conversion.operation;
        document.querySelector("#constantxt").value = conversion.constant;
        document.getElementById("conversionIdHidden").value =
          conversion.idConversionUnit;
      } catch (err) {
        Alerts.showToastCloseError(
          "No se pudo cargar la conversion de unidades"
        );
        console.error(err);
      }
      return;
    }
    console.log();
  });
}
///Metodo para cargar tabla
function loadConversionUnits(conversion, tab) {
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Unidad inicial</th>
                <th>Unidad final</th>
                <th>Operación</th>
                <th>Constante</th>
                <th>Recurso</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${conversion
              .map(
                (r, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${r.nameInitialUnit}</td>
                <td>${r.nameFinalUnit}</td>
                <td>${r.operation}</td>
                <td>${r.constant}</td>
                <td>${r.nameResource}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-conversionUnit" data-id="${
                      r.idConversionUnit
                    }" data-bs-toggle="modal" data-bs-target="#conversionModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-conversionUnit" data-id="${
                      r.idConversionUnit
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
    </div>`;
}
export function loadResources(resources, resourceSelect) {
  resources.forEach((element) => {
    resourceSelect.innerHTML += `
        <option value="${element.idResource}">${element.name}</option>
      `;
  });
}
export function loadInitialUnit(initialUnit, initialUnitSelect) {
  initialUnit.forEach((element) => {
    initialUnitSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `;
  });
}
export function loadFinalUnits(finalUnits, finalUnitsSelect) {
  finalUnits.forEach((element) => {
    finalUnitsSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `;
  });
}

export async function insertConversionUnit(
  selectInitial,
  selectFinal,
  selectResource,
  constantxt,
  operationtxt,
  form
) {
  const payload = {
    idInitialUnit: selectInitial.value,
    idFinalUnit: selectFinal.value,
    idResource: selectResource.value,
    constant: constantxt.value.trim(),
    operation: operationtxt.value,
  };

  try {
    const res = await ConversionUnitsService.insertConversionUnit(payload);
    form.reset();
    return res;
  } catch {
    Alerts.showToastCloseError(
      `No se pudo agregar la conversion de unidades ${err}`
    );
    return { ok: false };
  }
}
export async function updateConversionUnit(
  idConversionUnitxt,
  selectInitial,
  selectFinal,
  selectResource,
  constantxt,
  operationtxt,
  form
) {
  const payload = {
    idConversionUnit: idConversionUnitxt.value,
    idInitialUnit: selectInitial.value,
    idFinalUnit: selectFinal.value,
    idResource: selectResource.value,
    constant: constantxt.value.trim(),
    operation: operationtxt.value,
  };

  try {
    const res = await ConversionUnitsService.updateConversionUnit(
      payload,
      idConversionUnitxt
    );
    form.reset();
    return res;
  } catch {
    Alerts.showToastCloseError(
      `No se pudo actualizar la conversion de unidades ${err}`
    );
    return { ok: false };
  }
}
