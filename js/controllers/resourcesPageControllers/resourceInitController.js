import { renderPuritiesData } from "./puritiesController";
import { initResource } from "./resourcesController";
import { initMeasure } from "./measuresController";
import { initMeasureUnits } from "./measureUnitsController";
import { initConversionUnits } from './conversionUnitsController'

export async function initAllResourcesTabs(container) {
    const $tabListR = container.querySelector('#tabList-resource');
    //! En el href nosotros ponemos el id del tab al cual vamos a llenar con load xxxx
    $tabListR.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#resources">Recursos</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#purity">Pureza de recursos</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#conversionUnits">Conversion de unidades</a>
        </li>
        </li>
            <a class="nav-link" data-bs-toggle="tab" href="#measureUnits">Unidades de medida</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#measures">Medidas</a>
        </li>
    `;
    initResource(container);
    renderPuritiesData(container);
    initMeasure(container);
    initMeasureUnits(container);
    initConversionUnits(container);
}