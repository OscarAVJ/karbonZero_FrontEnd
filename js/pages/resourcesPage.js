import { initAllResourcesTabs } from "../controllers/resourcesPageControllers/resourceInitController.js";
import * as ResourceController from "../controllers/resourcesPageControllers/resourcesController.js";
import * as PurityController from "../controllers/resourcesPageControllers/puritiesController.js";
import * as MeasureController from "../controllers/resourcesPageControllers/measuresController.js";
import * as MeasureUnitsController from "../controllers/resourcesPageControllers/measureUnitsController.js";
import * as ConversionUnitController from "../controllers/resourcesPageControllers/conversionUnitsController.js";
import { getAllMeasureUnitsList } from "../services/measureUnitsService.js";
import { getAllResourcesList } from "../services/resourcesService.js";
import { showToastCloseInfo } from "../../utils/alerts.js";
import { getAllMeasuresList } from "../services/measuresService.js";
import * as Alerts from "../../utils/alerts.js"

export async function render() {
  return `
<!-- Consumptions Section -->
<div class=" py-4"  id="resources-root">
    <!--!MODAL RECURSOS -->
    <div class="modal fade" id="resourcesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Recursos</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="resourceForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3 ">
                            <label for="resourceMU" class="form-label">Unidad de medida</label>
                            <select id="resourceMU" class="form-select">
                                
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nameResource" class="form-label">Nombre</label>
                            <input id="nameResource" type="text" class="form-control" placeholder="Nombre">
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="resourceCF" class="form-label">Huella de carbono</label>
                            <input id="resourceCF" type="number" min="0" step="0.1"class="form-control" placeholder="Huella de carbono">
                        </div>
                        <div class="row g-2 mb-3 d-none">
                            <label for="idResource" class="form-label">idResource</label>
                            <input id="idResource" type="text" class="form-control" placeholder="id">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!--! MODAL PUREZA -->
    <div class="modal fade" id="purezaModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Pureza</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="purityForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3 ">
                            <label for="resourceSelect" class="form-label">Recurso</label>
                            <select id="resourceSelect" class="form-select">
                              
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="puritytxt" class="form-label">Pureza</label>
                            <input id="puritytxt" type="number"
                            min="0" step="0.1"
                            class="form-control" placeholder="Pureza">
                        </div>
                        <div class="row g-2 mb-3 d-none">
                            <label for="idPurityHidden" class="form-label">idResource</label>
                            <input id="idPurityHidden" type="text" class="form-control" placeholder="id">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!--! MODAL MEDIDAS -->
    <div class="modal fade" id="medidasModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Medidas</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="measureForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <label for="nameMetxt" class="form-label">Medida</label>
                            <input id="nameMetxt" type="text" class="form-control" placeholder="Nombre">
                        </div>
                    </div>
                    <div class="modal-body mx-3 d-none">
                        <div class="row g-2 mb-3">
                            <label for="idMeasureHidden" class="form-label">Medida</label>
                            <input id="idMeasureHidden" type="text" class="form-control" placeholder="Nombre">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="unidadesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Unidad de medida</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="measureUnitsForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <label for="medidasUtxt" class="form-label">Medida</label>
                            <select id="medidasUtxt" class="form-select">

                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nombreUtxt" class="form-label">Unidad</label>
                            <input id="nombreUtxt" type="text" class="form-control" placeholder="Nombre">
                        </div>
                        <div class="row g-2 mb-3 d-none">
                            <label for="idhiddenMeasureU" class="form-label">Unidad</label>
                            <input id="idhiddenMeasureU" type="text" class="form-control" placeholder="Nombre">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="conversionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Conversión de unidades</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="conversionForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-2">
                            <label for="resourceMUSelect" class="form-label">Recurso</label>
                            <select id="resourceMUSelect" class="form-select">
                               
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="initialUnitSelect" class="form-label">Unidad inicial</label>
                                <select id="initialUnitSelect" class="form-select">

                                </select>
                            </div>
                            <div class="col-6">
                                <label for="finalUnitSelect" class="form-label">Unidad final</label>
                                <select id="finalUnitSelect" class="form-select">
                                  
                                </select>
                            </div>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="operationSelect" class="form-label">Operación</label>
                                <select id="operationSelect" class="form-select">
                                    <option value="SUM">Suma</option>
                                    <option value="RES">Resta</option>
                                    <option value="PROD">Multiplicación</option>
                                    <option value="DIV">División</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="constantxt" class="form-label">Constante</label>
                                <input id="constantxt" type="number" min="0" step="0.01" class="form-control" placeholder="Constante">
                            </div>
                             <div class="col-6 d-none">
                                <label for="conversionIdHidden" class="form-label">Constante</label>
                                <input id="conversionIdHidden" type="text" class="form-control" placeholder="Constante">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <h2 class="general-title">
        Recursos
    </h2>
    <ul class="nav nav-tabs mb-3" id="tabList-resource"></ul>
    <div class="tab-content" id="tabContent-resource">
        <div id="resources" class="tab-pane fade show active">
            <!-- contenido de recursos -->           
            <div id="resourceTable">
            </div>
            <!-- paginación de recursos -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="resourceItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="resourcePagination" class="tab-pane fade show active pagination mb-0">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div id="purity" class="tab-pane fade">
            <!-- contenido de purezas -->           
            <div id="purityTable">
            </div>
            <!-- paginación de purezas -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="purityItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="purityPagination" class="tab-pane fade show active pagination mb-0">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div id="measures" class="tab-pane fade">
            <!-- contenido de medidas -->
            <div id="measureTable">
            </div>
            <!-- paginación de medidas -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="measureItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="measurePagination" class="tab-pane fade show active pagination mb-0">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div id="measureUnits" class="tab-pane fade">
            <!-- contenido de unidades de medida -->
            <div id="measureUnitTable">
            </div>
            <!-- paginación de unidades de medida -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="measureUnitItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="measureUnitPagination" class="tab-pane fade show active pagination mb-0">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div id="conversionUnits" class="tab-pane fade">
            <!-- contenido de unidades de conversion-->
            <div id="conversionUnitTable">
            </div>
            <!-- paginación de unidades de conversion -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="conversionUnitItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="conversionUnitPagination" class="tab-pane fade show active pagination mb-0">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

export async function afterRender() {
  resourceProces();
  purityProces();
  conversionUnitProces();
  measureUnitsProcess();
  measureProcess();
}

///En este tipo de paginas donde hay diversos tabs para que sea mas facil leer todo cada tab tendra su proces
async function resourceProces() {
  let measureUnits = await getAllMeasureUnitsList();

  const container = document.getElementById("resources-root");

  ///Llenamos los datos con nuestro archivo de barril
  initAllResourcesTabs(container);

  ///Obtencion de modales recursos
  const addResourceBtn = document.querySelector("#addResource-kz");
  const nametxt = document.querySelector("#nameResource");
  const measureUnitSelect = document.querySelector("#resourceMU");
  const resourceCarbonFootprint = document.querySelector("#resourceCF");
  const idResource = document.querySelector("#idResource");
  const modalResource = document.querySelector("#resourcesModal");
  const bdModalResource = bootstrap.Modal.getOrCreateInstance(modalResource);
  const resourceForm = document.querySelector("#resourceForm");

  ///Llenamos el select de unidades de medida
  ResourceController.loadMeasureUnits(measureUnits, measureUnitSelect);

  if (addResourceBtn) {
    addResourceBtn.addEventListener("click", () => {
      nametxt.value = "";
      resourceCarbonFootprint.value = "";
    });
  }

  ///Aca y hacemos el proceso de submit
  resourceForm.addEventListener("submit", () => {
    if (idResource.value) {
      ResourceController.updateResource(
        idResource,
        nametxt,
        measureUnitSelect,
        resourceCarbonFootprint,
        resourceForm
      );
      bdModalResource.hide();
    } else {
      ResourceController.insertResource(
        nametxt,
        measureUnitSelect,
        resourceCarbonFootprint,
        resourceForm
      );
      bdModalResource.hide();
    }
  });
}

async function purityProces() {
  let resources = await getAllResourcesList();

  const container = document.getElementById("resources-root");

  initAllResourcesTabs(container);

  const addPuritBtn = document.getElementById("addPurity-kz");

  const resourceSelect = document.querySelector("#resourceSelect");
  const puritytxt = document.querySelector("#puritytxt");
  const idPurity = document.querySelector("#idPurityHidden");
  const modalPurity = document.querySelector("#purezaModal");
  const purityBsModal = bootstrap.Modal.getOrCreateInstance(modalPurity);
  const purityForm = document.querySelector("#purityForm");

  PurityController.loadResources(resources, resourceSelect);

  if (addPuritBtn) {
    addPuritBtn.addEventListener("click", () => {
      puritytxt.value = "";
    });
  }
  purityForm.addEventListener("submit", () => {
    if (puritytxt.value.trim() > 1 || puritytxt.value.trim() < 0) {
      showToastCloseInfo(
        "El valor de la pureza no puede ser mayor a 1 ni menor a 0"
      );
      return;
    }
    if (idPurity.value) {
      PurityController.updatePurity(
        resourceSelect,
        puritytxt,
        idPurity,
        purityForm
      );
      purityBsModal.hide();
    } else {
      PurityController.insertPurity(resourceSelect, puritytxt, purityForm);
      purityBsModal.hide();
    }
  });
}

async function measureProcess() {
  const container = document.getElementById("resources-root");

  initAllResourcesTabs(container);

  const addMeasure = document.getElementById("addMeasure-kz");

  const idHidden = document.querySelector("#idMeasureHidden");
  const nametxt = document.querySelector("#nameMetxt");
  const measureModal = document.querySelector("#medidasModal");
  const measureBsModal = bootstrap.Modal.getOrCreateInstance(measureModal);
  const measureForm = document.querySelector("#measureForm");

  if (addMeasure) {
    addMeasure.addEventListener("click", () => {
      nametxt.value = "";
    });
  }
  measureForm.addEventListener("submit", () => {
    if (idHidden.value) {
      MeasureController.updateMeasure(idHidden, nametxt, measureForm);
      measureBsModal.hide();
    } else {
      MeasureController.insertMeasure(nametxt, measureForm);
      measureBsModal.hide();
    }
  });
}

async function measureUnitsProcess() {
  let measureUnits = await getAllMeasuresList();

  const container = document.getElementById("resources-root");

  initAllResourcesTabs(container);

  const addMu = document.getElementById("addMeasureUnit-kz");

  const idHiddenMU = document.querySelector("#idhiddenMeasureU");
  const measureSelect = document.querySelector("#medidasUtxt");
  const nameMUtxt = document.querySelector("#nombreUtxt");
  const measureUnitsModal = document.querySelector("#unidadesModal");
  const measureBsModal = bootstrap.Modal.getOrCreateInstance(measureUnitsModal);
  const measureUnitsForm = document.querySelector("#measureUnitsForm");

  MeasureUnitsController.loadMeasures(measureUnits, measureSelect);

  if (addMu) {
    addMu.addEventListener("click", () => {
      nameMUtxt.value = "";
    });
  }
  measureUnitsForm.addEventListener("submit", () => {
    if (idHiddenMU.value) {
      MeasureUnitsController.updateMeasureUnit(
        idHiddenMU,
        measureSelect,
        nameMUtxt,
        measureUnitsForm
      );
      measureBsModal.hide();
    } else {
      MeasureUnitsController.insertMeasureUnit(
        nameMUtxt,
        measureSelect,
        measureUnitsForm
      );
      measureBsModal.hide();
    }
  });
}
async function conversionUnitProces() {
  let measureUnitsC = await getAllMeasureUnitsList();
  let resources = await getAllResourcesList();
  const container = document.getElementById("resources-root");

  initAllResourcesTabs(container);

  const addConversionUnit = document.getElementById("addConversionUnit-kz");

  const idHidden = document.querySelector("#conversionIdHidden");
  const initialSelect = document.querySelector("#initialUnitSelect");
  const finalSelect = document.querySelector("#finalUnitSelect");
  const resourceSelect = document.querySelector("#resourceMUSelect");
  const operation = document.querySelector("#operationSelect");
  const constant = document.querySelector("#constantxt");
  const conversionModa = document.querySelector("#conversionModal");
  const conversionBsModal = bootstrap.Modal.getOrCreateInstance(conversionModa);
  const conversionForm = document.querySelector("#conversionForm");

  ConversionUnitController.loadInitialUnit(measureUnitsC, initialSelect);
  ConversionUnitController.loadFinalUnits(measureUnitsC, finalSelect);

  ConversionUnitController.loadResources(resources, resourceSelect);
  resourceSelect.innerHTML += `<option value="">Universal</option>`;

  if (addConversionUnit) {
    addConversionUnit.addEventListener("click", () => {
      ConversionUnitController.loadResources(resources, resourceSelect);
      constant.value = "";
      idHidden.value = "";
      operation.value = "SUM";
    });
  }
  conversionForm.addEventListener("submit", () => {
    if (initialSelect.value == finalSelect.value) {
      Alerts.showToastCloseInfo(
        "La unidad inicial y final deben ser diferentes"
      );
      return;
    }

    if (!constant.value) {
      Alerts.showToastCloseInfo("La constante es obligatoria");
      return;
    }

    if (idHidden.value) {
      ConversionUnitController.updateConversionUnit(
        idHidden,
        initialSelect,
        finalSelect,
        resourceSelect,
        constant,
        operation,
        conversionForm
      );
      conversionBsModal.hide();
    } else {
      ConversionUnitController.insertConversionUnit(
        initialSelect,
        finalSelect,
        resourceSelect,
        constant,
        operation,
        conversionForm
      );
      conversionBsModal.hide();
    }
  });
}
