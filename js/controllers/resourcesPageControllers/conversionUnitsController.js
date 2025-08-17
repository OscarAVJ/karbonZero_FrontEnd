import * as Alerts from '../../../utils/alerts.js';
import * as ConversionUnitsService from '../../services/conversionUnitsService.js';

///Funcion de init
export async function initConversionUnits(container) {
    renderConversionUnits(container);
}

export async function renderConversionUnits(container) {

    let conversionUnits = [];

    try {
        conversionUnits = await ConversionUnitsService.getAllConversionUnits();
    } catch (err) {
        console.log(err);
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar las conversiones.</p>`;
    }
    const conversionTab = document.getElementById('conversionUnits');

    loadConversionUnits(conversionUnits, conversionTab);

    ///Aca definimos que hace nuestro boton de eliminar
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-conversionUnit');
        if (!btn) return;
        const id = btn.dataset.id;
        await ConversionUnitsService.deleteConversionUnit(id);
    });
    ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-conversionUnit');
        if (editBtn) {
            const id = editBtn.dataset.id;
            try {
                const conversion = await ConversionUnitsService.getConversionUnitById(id);

                if (conversion.idResource) {
                    document.querySelector('#resourceMUSelect').value = conversion.idResource;
                } else {
                    document.querySelector("#resourceMUSelect").value = "";
                }

                document.querySelector('#initialUnitSelect').value = conversion.idInitialUnit;
                document.querySelector('#finalUnitSelect').value = conversion.idFinalUnit;
                document.querySelector('#operationSelect').value = conversion.operation;
                document.querySelector('#constantxt').value = conversion.constant;
                document.getElementById('conversionIdHidden').value = conversion.idConversionUnit;
            } catch (err) {
                Alerts.showToastCloseError('No se pudo cargar la conversion de unidades');
                console.error(err);
            }
            return;
        }
        console.log()
    });
}
///Metodo para cargar tabla 
function loadConversionUnits(conversion, tab) {
    tab.innerHTML ="";
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
              <button class="kz-button-create" id="addConversionUnit-kz" data-bs-toggle="modal"
            data-bs-target="#conversionModal">
                  Crear conversión
              </button>
          </div>
    </div>
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
                <td>${i + 1}</td>
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
    resources.forEach(element => {
        resourceSelect.innerHTML += `
        <option value="${element.idResource}">${element.name}</option>
      `
    });
}
export function loadInitialUnit(initialUnit, initialUnitSelect) {
    initialUnit.forEach(element => {
        initialUnitSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `
    });
}
export function loadFinalUnits(finalUnits, finalUnitsSelect) {
    finalUnits.forEach(element => {
        finalUnitsSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `
    });
}

export async function insertConversionUnit(selectInitial, selectFinal, selectResource, constantxt, operationtxt, form) {
    const payload = {
        idInitialUnit: selectInitial.value,
        idFinalUnit: selectFinal.value,
        idResource: selectResource.value,
        constant: constantxt.value.trim(),
        operation: operationtxt.value
    }
   
    try {
        await ConversionUnitsService.insertConversionUnit(payload);
    } catch {
        Alerts.showToastCloseError(`No se pudo agregar la conversion de unidades ${err}`)
    }
    form.reset();
}
export async function updateConversionUnit(idConversionUnitxt,selectInitial, selectFinal, selectResource, constantxt, operationtxt, form) {
    const payload = {
        idConversionUnit: idConversionUnitxt.value,
        idInitialUnit: selectInitial.value,
        idFinalUnit: selectFinal.value,
        idResource: selectResource.value,
        constant: constantxt.value.trim(),
        operation: operationtxt.value
    }
   
    try {
        await ConversionUnitsService.updateConversionUnit(payload, idConversionUnitxt);
    } catch {
        Alerts.showToastCloseError(`No se pudo actualizar la conversion de unidades ${err}`)
    }
    form.reset();
}
