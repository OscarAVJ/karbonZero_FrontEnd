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
import * as Alerts from "../../utils/alerts.js";
import { role } from '../controllers/sessionController.js';

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
                            <input maxlength="200" id="nameResource" type="text" class="form-control" placeholder="Nombre" required>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="resourceCF" class="form-label">Huella de carbono</label>
                            <input id="resourceCF" type="number" min="0.01" step="0.00001"class="form-control" placeholder="Huella de carbono" required>
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
                            min="0.01" step="0.01"
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
                            <input maxlength="200" id="nameMetxt" type="text" class="form-control" placeholder="Nombre" required>
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
                            <select id="medidasUtxt" class="form-select required">

                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nombreUtxt" class="form-label">Unidad</label>
                            <input maxlength="200" id="nombreUtxt" type="text" class="form-control" placeholder="Nombre" required>
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
                                <input min="0" id="constantxt" type="number" step="0.01" class="form-control" placeholder="Constante" required>
                            </div>
                             <div class="col-6 d-none">
                                <label for="conversionIdHidden" class="form-label">Constante</label>
                                <input id="conversionIdHidden" type="text" class="form-control">
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
            <!-- búsqueda de recursos -->
            <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
                <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="resourceSearch">
                </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                    <button class="kz-button-create" id="addResource-kz" data-bs-toggle="modal" data-bs-target="#resourcesModal">
                        Crear recursos
                    </button>
                </div>
            </div>        
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
            <!-- búsqueda de purezas -->
            <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
                <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="resourcePuritySearch">
                </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                    <button class="kz-button-create" id="addPurity-kz" data-bs-toggle="modal" data-bs-target="#purezaModal">
                        Crear pureza
                    </button>
                </div>
            </div>       
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
            <!-- búsqueda de medidas -->
            <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
                <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="measureSearch">
                </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                    <button class="kz-button-create" id="addMeasure-kz" data-bs-toggle="modal"
            data-bs-target="#medidasModal">
                        Crear medida
                    </button>
                </div>
            </div>
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
            <!-- búsqueda de unidades de medida -->
            <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
                <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="measureUnitSearch">
                </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                    <button class="kz-button-create" id="addMeasureUnit-kz" data-bs-toggle="modal"
            data-bs-target="#unidadesModal">
                        Crear medida
                    </button>
                </div>
            </div>
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
            <!-- búsqueda de unidades de conversion-->
            <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
                <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="conversionUnitSearch">
                </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                    <button class="kz-button-create" id="addConversionUnit-kz" data-bs-toggle="modal"
            data-bs-target="#conversionModal">
                        Crear conversión
                    </button>
                </div>
            </div>
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
  role.applyPermissions();
  const container = document.getElementById("resources-root");
  await initAllResourcesTabs(container);

  await resourceProcess();
  await purityProcess();
  await conversionUnitProcess();
  await measureUnitsProcess();
  await measureProcess();
}

///En este tipo de paginas donde hay diversos tabs para que sea mas facil leer todo cada tab tendra su proces
async function resourceProcess() {
  let measureUnits = await getAllMeasureUnitsList();

  const container = document.getElementById("resources-root");

  ///Obtencion de modales recursos
  const addResourceBtn = document.querySelector("#addResource-kz");
  const nametxt = document.querySelector("#nameResource");
  const measureUnitSelect = document.querySelector("#resourceMU");
  const resourceCarbonFootprint = document.querySelector("#resourceCF");
  const idResource = document.querySelector("#idResource");
  const modalResource = document.querySelector("#resourcesModal");
  const bdModalResource = bootstrap.Modal.getOrCreateInstance(modalResource);
  const resourceForm = document.querySelector("#resourceForm");

  const resourceSearch = document.querySelector("#resourceSearch");
  resourceSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      ResourceController.setCurrentPage(0);
      ResourceController.reload(container);
    }
  });

  ///Llenamos el select de unidades de medida
  ResourceController.loadMeasureUnits(measureUnits, measureUnitSelect);

  if (addResourceBtn) {
    addResourceBtn.addEventListener("click", () => {
      measureUnitSelect.selectedIndex = 0;
      nametxt.value = "";
      resourceCarbonFootprint.value = "";
    });
  }

  ///Aca y hacemos el proceso de submit
  let isLoading = false;
  resourceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nametxt.value.trim()) {
      Alerts.showToastCloseError("El nombre del recurso es obligatorio");
      return;
    }

    if (!resourceCarbonFootprint.value.trim()) {
      Alerts.showToastCloseError(
        "El factor de conversión a huella de carbono es obligatorio"
      );
      return;
    }

    if (resourceCarbonFootprint.value.trim() <= 0) {
      Alerts.showToastCloseError(
        "El factor de conversión a huella de carbono debe ser positivo"
      );
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idResource.value) {
      res = await ResourceController.updateResource(
        idResource,
        nametxt,
        measureUnitSelect,
        resourceCarbonFootprint,
        resourceForm
      );
    } else {
      res = await ResourceController.insertResource(
        nametxt,
        measureUnitSelect,
        resourceCarbonFootprint,
        resourceForm
      );
    }
    bdModalResource.hide();
    isLoading = false;

    if (res?.ok) {
      await ResourceController.reload(container);
    }
  });
}

async function purityProcess() {
  let resources = await getAllResourcesList();

  const container = document.getElementById("resources-root");

  const addPuritBtn = document.getElementById("addPurity-kz");

  const resourceSelect = document.querySelector("#resourceSelect");
  const puritytxt = document.querySelector("#puritytxt");
  const idPurity = document.querySelector("#idPurityHidden");
  const modalPurity = document.querySelector("#purezaModal");
  const purityBsModal = bootstrap.Modal.getOrCreateInstance(modalPurity);
  const purityForm = document.querySelector("#purityForm");

  const puritySearch = document.querySelector("#resourcePuritySearch");
  puritySearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      PurityController.setCurrentPage(0);
      PurityController.reload(container);
    }
  });

  PurityController.loadResources(resources, resourceSelect);

  if (addPuritBtn) {
    addPuritBtn.addEventListener("click", () => {
      resourceSelect.selectedIndex = 0;
      puritytxt.value = "";
    });
  }

  let isLoading = false;
  purityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (puritytxt.value.trim() > 1 || puritytxt.value.trim() <= 0) {
      showToastCloseInfo(
        "El valor de la pureza no puede ser mayor a 1 ni menor o igual a 0"
      );
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idPurity.value) {
      res = await PurityController.updatePurity(
        resourceSelect,
        puritytxt,
        idPurity,
        purityForm
      );
    } else {
      res = await PurityController.insertPurity(
        resourceSelect,
        puritytxt,
        purityForm
      );
    }
    purityBsModal.hide();
    isLoading = false;

    if (res?.ok) {
      await PurityController.reload(container);
    }
  });
}

async function measureProcess() {
  const container = document.getElementById("resources-root");

  const addMeasure = document.getElementById("addMeasure-kz");

  const idHidden = document.querySelector("#idMeasureHidden");
  const nametxt = document.querySelector("#nameMetxt");
  const measureModal = document.querySelector("#medidasModal");
  const measureBsModal = bootstrap.Modal.getOrCreateInstance(measureModal);
  const measureForm = document.querySelector("#measureForm");

  const measureSearch = document.querySelector("#measureSearch");
  measureSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      MeasureController.setCurrentPage(0);
      MeasureController.reload(container);
    }
  });

  if (addMeasure) {
    addMeasure.addEventListener("click", () => {
      nametxt.value = "";
    });
  }

  let isLoading = false;
  measureForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nametxt.value.trim()) {
      Alerts.showToastCloseError("El nombre de la medida es obligatorio");
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idHidden.value) {
      res = await MeasureController.updateMeasure(
        idHidden,
        nametxt,
        measureForm
      );
    } else {
      res = await MeasureController.insertMeasure(nametxt, measureForm);
    }
    measureBsModal.hide();
    isLoading = false;

    if (res?.ok) {
      await MeasureController.reload(container);
    }
  });
}

async function measureUnitsProcess() {
  let measureUnits = await getAllMeasuresList();

  const container = document.getElementById("resources-root");

  const addMu = document.getElementById("addMeasureUnit-kz");

  const idHiddenMU = document.querySelector("#idhiddenMeasureU");
  const measureSelect = document.querySelector("#medidasUtxt");
  const nameMUtxt = document.querySelector("#nombreUtxt");
  const measureUnitsModal = document.querySelector("#unidadesModal");
  const measureBsModal = bootstrap.Modal.getOrCreateInstance(measureUnitsModal);
  const measureUnitsForm = document.querySelector("#measureUnitsForm");

  const measureUnitSearch = document.querySelector("#measureUnitSearch");
  measureUnitSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      MeasureUnitsController.setCurrentPage(0);
      MeasureUnitsController.reload(container);
    }
  });

  MeasureUnitsController.loadMeasures(measureUnits, measureSelect);

  if (addMu) {
    addMu.addEventListener("click", () => {
      measureSelect.selectedIndex = 0;
      nameMUtxt.value = "";
    });
  }

  let isLoading = false;
  measureUnitsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nameMUtxt.value.trim()) {
      Alerts.showToastCloseError(
        "El nombre de la unidad de medida es obligatorio"
      );
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idHiddenMU.value) {
      res = await MeasureUnitsController.updateMeasureUnit(
        idHiddenMU,
        measureSelect,
        nameMUtxt,
        measureUnitsForm
      );
    } else {
      res = await MeasureUnitsController.insertMeasureUnit(
        nameMUtxt,
        measureSelect,
        measureUnitsForm
      );
    }

    measureBsModal.hide();
    isLoading = false;

    if (res?.ok) {
      await MeasureUnitsController.reload(container);
    }
  });
}
async function conversionUnitProcess() {
  let measureUnitsC = await getAllMeasureUnitsList();
  let resources = await getAllResourcesList();
  const container = document.getElementById("resources-root");

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

  const conversionSearch = document.querySelector("#conversionUnitSearch");
  conversionSearch.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      ConversionUnitController.setCurrentPage(0);
      ConversionUnitController.reload(container);
    }
  });

  ConversionUnitController.loadInitialUnit(measureUnitsC, initialSelect);
  ConversionUnitController.loadFinalUnits(measureUnitsC, finalSelect);

  resourceSelect.innerHTML += `<option value="">Universal</option>`;
  ConversionUnitController.loadResources(resources, resourceSelect);

  if (addConversionUnit) {
    addConversionUnit.addEventListener("click", () => {
      initialSelect.selectedIndex = 0;
      finalSelect.selectedIndex = 0;
      resourceSelect.selectedIndex = 0;

      constant.value = "";
      idHidden.value = "";
      operation.value = "SUM";
    });
  }

  let isLoading = false;
  conversionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (initialSelect.value.trim() == finalSelect.value.trim()) {
      Alerts.showToastCloseInfo(
        "La unidad inicial y final deben ser diferentes"
      );
      return;
    }

    if (!constant.value.trim()) {
      Alerts.showToastCloseInfo("La constante es obligatoria");
      return;
    }

    if (constant.value.trim() == 0) {
      Alerts.showToastCloseError("La constante no puede ser cero");
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idHidden.value) {
      res = await ConversionUnitController.updateConversionUnit(
        idHidden,
        initialSelect,
        finalSelect,
        resourceSelect,
        constant,
        operation,
        conversionForm
      );
    } else {
      res = await ConversionUnitController.insertConversionUnit(
        initialSelect,
        finalSelect,
        resourceSelect,
        constant,
        operation,
        conversionForm
      );
    }
    conversionBsModal.hide();
    isLoading = false;

    if (res?.ok) {
      await ConversionUnitController.reload(container);
    }
  });
}
