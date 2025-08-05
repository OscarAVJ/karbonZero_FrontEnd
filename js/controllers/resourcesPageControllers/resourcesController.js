import * as Alerts from '../../../utils/alerts.js';
import * as ResourceService from '../../services/resourcesService.js';

///Funcion de init
export async function initResource(container) {
    renderResourceData(container);
}

///Renderizado de elementos
async function renderResourceData(container) {



    let resources = [];
    ///Obtener usuarios
    try {
        resources = await ResourceService.getResources();
    } catch (err) {
        console.log(err);
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    ///Los mandamos en 
    const resourcesTab = document.getElementById('resources');
    loadResourcesTable(resources, resourcesTab );


    ///Delete method
    container.addEventListener('click', async e => {
        const deleteBtnResources = e.target.closest('.btn-delete-resource');
        if (!deleteBtnResources) return;
        const id = deleteBtnResources.dataset.id;
        await ResourceService.deleteResource(id);
    });

    ///Cargar los datos al editar
    container.addEventListener('click', async e => {
        const editResourceBtn = e.target.closest('.btn-edit-resource');
        if (editResourceBtn) {
            const id = editResourceBtn.dataset.id;
            try {
                const resource = await ResourceService.getResourcesById(id);
                document.getElementById('idResource').value = resource.idResource;
                document.getElementById('resourceMU').value = resource.idMeasureUnit;
                document.getElementById('nameResource').value = resource.name;
                document.getElementById('resourceCF').value = resource.carbonFootprint;
            } catch (err) {
                Alerts.showToastCloseError('No se puso cargar el recurso');
                console.log(err);
            }
            return;
        }
    });
}

///Metodo para cargar tabla 
function loadResourcesTable(resources, tab) {
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
            ${resources.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.name}</td>
                <td>${r.measureName}</td>
                <td>${r.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-resource" data-id="${r.idResource}" data-bs-toggle="modal" data-bs-target="#resourcesModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-resource" data-id="${r.idResource}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
    </div>`;
}
///Metodo para cargar tabla 
function loadResourcesPTable(resources, tab) {
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
                <th>Huella de carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${resources.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.name}</td>
                <td>${r.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-resource" data-id="${r.idResource}" data-bs-toggle="modal" data-bs-target="#resourcesModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-resource" data-id="${r.idResource}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
    </div>`;
}
export function loadMeasureUnits(measureUnits, measureSelect) {
    measureUnits.forEach(element => {
        measureSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.name}</option>
      `
    });
}

///Metodo para insertar recursos
export async function insertResource(nameT, measureUnitS, carbonFootprintT, form) {
    const payload = {
        idMeasureUnit: measureUnitS.value,
        name: nameT.value.trim(),
        carbonFootprint: carbonFootprintT.value.trim()
    }
    try {
        ResourceService.insertResource(payload);
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar el recurso`)
    }
    form.reset();
}

///Metodo para actualizar recursos
export async function updateResource(id, nameT, measureUnitS, carbonFootprintT, form) {
    const payload = {
        idResource: id.value,
        idMeasureUnit: measureUnitS.value,
        name: nameT.value.trim(),
        carbonFootprint: carbonFootprintT.value.trim()
    }
    try {
        ResourceService.updateResource(payload, id);
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo actualizar el recurso`)
    }
    form.reset();
}