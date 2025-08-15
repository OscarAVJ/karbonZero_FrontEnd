import * as Alerts from '../../utils/alerts.js';
import * as ConsumptionService from '../services/consumptionService.js';

export async function initConsumption(container) {
    renderConsumptionData(container);
}

async function renderConsumptionData(container) {
  let consumptions = [];

  try {
    consumptions = await ConsumptionService.getAllConsumptions();
  } catch (err) {
    console.log(err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los consumos.</p>`);
  }

  const consumptionsTab = document.getElementById("consumptions");
  loadConsumptionsTable(consumptions, consumptionsTab);

  ///Delete method
  container.addEventListener("click", async (e) => {
    const deleteBtnConsumptions = e.target.closest(".btn-delete-consumption");
    if (!deleteBtnConsumptions) return;
    const id = deleteBtnConsumptions.dataset.id;
    await ResourceService.deleteResource(id);
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
export async function insertConsumption(resourceS, quantityT, measureUnitS, dateT, costT, user, form) {
    const date = dateT.value.split("-");
    
    const resourceMeasureUnit = resourceS.options[resourceS.selectedIndex].dataset.measure;
    const resourceId = resourceS.options[resourceS.selectedIndex].dataset.resource;

    if (resourceMeasureUnit != measureUnitS.value) {
      const new_quantity = await ConsumptionService.convertMeasureUnit(
        measureUnitS.value,
        resourceMeasureUnit,
        resourceId,
        quantityT.value
      );
      
      if (!new_quantity.value) {
        Alerts.showToastCloseError("Seleccionó una unidad de medida no válida")
        return;
      }

      Alerts.showToastCloseInfo("Unidad de medida convertida automáticamente")
      quantityT.value = new_quantity.value;
      measureUnitS.value = resourceMeasureUnit;
    }
    
    const payload = {
      idResourcePurity: resourceS.value.trim(),
      idUser: user,
      quantity: quantityT.value.trim(),
      consumptionDate: `${date[2]}/${date[1]}/${date[0]}`,
      cost: costT.value.trim(),
    };

    try {
        ConsumptionService.insertConsumption(payload);
        console.log(payload);
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar el consumo`)
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