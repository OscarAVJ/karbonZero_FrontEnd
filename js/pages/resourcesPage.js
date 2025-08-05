import { initAllResourcesTabs } from '../controllers/resourcesPageControllers/resourceInitController.js';
import * as ResourceController from '../controllers/resourcesPageControllers/resourcesController.js';
import * as PurityController from '../controllers/resourcesPageControllers/puritiesController.js';
import * as MeasureController from '../controllers/resourcesPageControllers/measuresController.js'
import { getMeasureUnits } from '../services/measureUnitsService.js';
import { getResources } from '../services/resourcesService.js';

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
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <label for="medidasUtxt" class="form-label">Medida</label>
                            <select id="medidasUtxt" class="form-select">
                                <option>Energia</option>
                                <option>Masa</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <label for="nombreUtxt" class="form-label">Unidad</label>
                            <input id="nombreUtxt" type="text" class="form-control" placeholder="Nombre">
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
                <form id="userForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-2">
                            <label for="medidasCtxt" class="form-label">Medidas</label>
                            <select id="medidasCtxt" class="form-select">
                                <option>Masa</option>
                                <option>Volumen</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <label for="recursoCtxt" class="form-label">Recurso</label>
                            <select id="recursoCtxt" class="form-select">
                                <option>Agua</option>
                                <option>Luz</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="unidadItxt" class="form-label">Unidad inicial</label>
                                <select id="unidadItxt" class="form-select">
                                    <option>Litros</option>
                                    <option>Gramos</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="unidadFtxt" class="form-label">Unidad final</label>
                                <select id="unidadFtxt" class="form-select">
                                    <option>Mililitros</option>
                                    <option>Miligramos</option>
                                </select>
                            </div>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label for="operacionCtxt" class="form-label">Operación</label>
                                <select id="operacionCtxt" class="form-select">
                                    <option>Suma</option>
                                    <option>Multiplicación</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="constanteCtxt" class="form-label">Constante</label>
                                <input id="constanteCtxt" type="number" class="form-control" placeholder="Constante">
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
        </div>
        <div id="purity" class="tab-pane fade">
            <!-- contenido de pureza -->
        </div>
        <div id="measures" class="tab-pane fade">
            <!-- contenido de medidas -->
        </div>
    </div>

</div>      

  `;
}

export async function afterRender() {
    resourceProces();
    purityProces();
    measureProcess();
}

///En este tipo de paginas donde hay diversos tabs para que sea mas facil leer todo cada tab tendra su proces
async function resourceProces() {
    let measureUnits = await getMeasureUnits();

    const container = document.getElementById('resources-root');

    ///Llenamos los datos con nuestro archivo de barril
    initAllResourcesTabs(container);

    ///Obtencion de modales recursos
    const addResourceBtn = document.querySelector('#addResource-kz');
    const nametxt = document.querySelector('#nameResource');
    const measureUnitSelect = document.querySelector('#resourceMU');
    const resourceCarbonFootprint = document.querySelector('#resourceCF');
    const idResource = document.querySelector('#idResource');
    const modalResource = document.querySelector('#resourcesModal');
    const bdModalResource = bootstrap.Modal.getOrCreateInstance(modalResource);
    const resourceForm = document.querySelector('#resourceForm')

    ///Llenamos el select de unidades de medida
    ResourceController.loadMeasureUnits(measureUnits, measureUnitSelect);

    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', () => {
            nametxt.value = "";
            resourceCarbonFootprint.value = "";
        });
    }

    ///Aca y hacemos el proceso de submit
    resourceForm.addEventListener('submit', () => {
        if ((idResource.value)) {
            ResourceController.updateResource(idResource, nametxt, measureUnitSelect, resourceCarbonFootprint, resourceForm);
            bdModalResource.hide()
        } else {
            ResourceController.insertResource(nametxt, measureUnitSelect, resourceCarbonFootprint, resourceForm);
            bdModalResource.hide();
        }
    })
}

async function purityProces() {
    let resources = await getResources();

    const container = document.getElementById('resources-root');

    initAllResourcesTabs(container);

    const addPuritBtn = document.getElementById('addPurity-kz');

    const resourceSelect = document.querySelector('#resourceSelect');
    const puritytxt = document.querySelector('#puritytxt');
    const idPurity = document.querySelector('#idPurityHidden');
    const modalPurity = document.querySelector('#purezaModal')
    const purityBsModal = bootstrap.Modal.getOrCreateInstance(modalPurity);
    const purityForm = document.querySelector('#purityForm')

    PurityController.loadResources(resources, resourceSelect)

    if (addPuritBtn) {
        addPuritBtn.addEventListener('click', () => {
            puritytxt.value = ""
        })
    }
    purityForm.addEventListener('submit', () => {
        if (idPurity.value) {
            PurityController.updatePurity(resourceSelect, puritytxt, idPurity, purityForm);
            purityBsModal.hide()
        } else {
            PurityController.insertPurity(resourceSelect, puritytxt, purityForm);
            purityBsModal.hide();
        }
    })
}

async function measureProcess() {

    const container = document.getElementById('resources-root');

    initAllResourcesTabs(container);

    const addPuritBtn = document.getElementById('addMeasure-kz');

    const idHidden = document.querySelector('#idMeasureHidden');
    const nametxt = document.querySelector('#nameMetxt');
    const measureModal = document.querySelector('#medidasModal')
    const measureBsModal = bootstrap.Modal.getOrCreateInstance(measureModal);
    const measureForm = document.querySelector('#measureForm')

    if (addPuritBtn) {
        addPuritBtn.addEventListener('click', () => {
            nametxt.value = ""
        })
    }
    measureForm.addEventListener('submit', () => {
        if (idHidden.value) {
            MeasureController.updateMeasure(idHidden, nametxt, measureForm);
            measureBsModal.hide()
        } else {
            MeasureController.insertMeasure(nametxt, measureForm);
            measureBsModal.hide();
        }
    })
}


