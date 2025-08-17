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
    await ConsumptionService.deleteConsumption(id);
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

        document.querySelector("#idConsumptionHidden").value = consumption.idConsumption;
        
        resourceSelect.disabled = true;
        resourceSelect.value = consumption.idResourcePurity;
        updateConsumptionEntries(resourceSelect, unitySelect, puritytxt);

        document.querySelector("#cantidadtxt").value = consumption.quantity;
        document.querySelector("#costotxt").value = consumption.cost;
        document.querySelector("#fecha").value = consumption.consumptionDate.substring(0, 10);
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

export function updateConsumptionEntries(resourceSelect, unitySelect, puritytxt) {
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
export async function insertConsumption(resourceS, quantityT, dateT, costT, user, form) {
    const date = dateT.value.split("-");
    
    const payload = {
      idResourcePurity: resourceS.value.trim(),
      idUser: user,
      quantity: quantityT.value.trim(),
      consumptionDate: `${date[2]}/${date[1]}/${date[0]}`,
      cost: costT.value.trim(),
    };

    try {
        ConsumptionService.insertConsumption(payload);
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar el consumo`)
    }
    form.reset();
}

///Metodo para actualizar recursos
export async function updateConsumption(id, resourceS, quantityT, dateT, costT, user, form) {
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
        ConsumptionService.updateConsumption(id, payload);
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo actualizar el recurso`)
    }
    form.reset();
}